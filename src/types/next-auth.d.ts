import { DefaultSession, DefaultUser } from "next-auth";
import "next-auth";

declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    name?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    phoneNumberVerified?: Date | null;
    avatarId?: string | null;
    image?: string | null;
    isOAuthNewUser?: boolean;
  }

  interface Session extends DefaultSession {
    user?: {
      id: string;
      name?: string | null;
      email?: string | null;
      phoneNumber?: string | null;
      phoneNumberVerified?: Date | null;
      avatarId?: string | null;
      isOAuthNewUser?: boolean;
    };
    provider?: string; // 記錄登入方式
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    phoneNumber?: string | null;
    phoneNumberVerified?: Date | null;
    avatarId?: string | null;
    provider?: string; // JWT 中也記錄 provider
    accessToken?: string | null;
    isNewSignUp?: boolean;
  }
}
