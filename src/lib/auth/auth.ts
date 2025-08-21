import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Line from "next-auth/providers/line";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/db/prisma";
import { compare, hash } from "bcryptjs";
import { getUserByPhoneWithPassword } from "@/lib/db/user";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // --- Google 快速登入 ---
    Google,
    // --- Line 快速登入 ---
    Line,
    // --- 傳統手機號碼/密碼登入 ---
    Credentials({
      credentials: {
        phoneNumber: { label: "手機號碼", type: "text" },
        password: { label: "密碼", type: "password" },
      },
      async authorize(credentials) {
        // 1. 基本檢查：確保識別符和密碼都已提供
        if (!credentials?.phoneNumber || !credentials?.password) {
          // 如果沒有提供必要的憑證，返回 null 表示驗證失敗
          return null;
        }

        const phoneNumber = credentials.phoneNumber as string;
        const password = credentials.password as string;

        // 查找使用者
        const result = await getUserByPhoneWithPassword(phoneNumber);

        if (!result.success) {
          // 這個判斷同時涵蓋了 "資料庫查詢出錯" 和 "找不到使用者" 兩種情況
          return null;
        }

        // 只有成功了，才安全地從 result 中取出 user 物件
        const { user } = result;

        if (!user) {
          // 找不到使用者 (作為一個備用的安全檢查)
          return null;
        }

        // ✨ 關鍵情境：使用者存在，但沒有設定密碼（通常是 OAuth 用戶）
        if (!user.password) {
          throw new Error(
            "此帳號為OAuth快速註冊，請改用 Google/LINE 登入，或透過「忘記密碼」來設定您的密碼。"
          );
        }

        // 比較密碼
        const isValidPassword = await compare(password, user.password);

        if (!isValidPassword) {
          return null;
        }

        // 檢查手機號碼驗證狀態
        if (!user.phoneNumberVerified) {
          console.warn(
            `Attempt to login with unverified phone number: ${phoneNumber}`
          );
          return null;
        }

        // 更新最後登入時間
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() },
        });

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    // JWT callback
    async jwt({ token, user, account, trigger, session }) {
      if (trigger === "signUp") {
        console.log("New user signing up via OAuth.");
        token.isNewSignUp = true; // 在 token 中設置一個臨時標記
      }

      if (user) {
        // ✨ 對於 OAuth 登入，在此更新最後登入時間
        // (Credentials 登入已在 authorize 回呼中處理)
        if (account?.provider !== "credentials") {
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });
        }

        // 登入或註冊時，從資料庫獲取核心用戶資訊
        // 注意：我們不再查詢 isOAuthNewUser
        const dbUser = await prisma.user.findUnique({
          where: { id: user.id },
          select: {
            id: true,
            phoneNumber: true,
            phoneNumberVerified: true,
            avatarId: true,
          },
        });

        if (dbUser) {
          token.id = dbUser.id;
          token.phoneNumber = dbUser.phoneNumber;
          token.phoneNumberVerified = dbUser.phoneNumberVerified;
          token.avatarId = dbUser.avatarId;
        }
      }

      if (account) {
        token.provider = account.provider;
        token.accessToken = account.access_token;
      }

      // 處理 session 更新
      if (trigger === "update" && session) {
        if (session.user) {
          token.phoneNumber = session.user.phoneNumber;
          token.phoneNumberVerified = session.user.phoneNumberVerified;
          token.avatarId = session.user.avatarId;
        }
      }

      return token;
    },

    // Session callback(會話可通過 `useSession` 獲取)
    async session({ session, token }) {
      if (token.id && session.user) {
        session.user.id = token.id as string;
        session.user.phoneNumber = token.phoneNumber as string | null;
        session.user.phoneNumberVerified =
          token.phoneNumberVerified as Date | null;
        session.user.avatarId = token.avatarId as string | null;
        session.provider = token.provider as string;

        // 基於 token 中的臨時標記來決定 isOAuthNewUser 的值
        // 這個標記只會在 signUp 後的第一次會話中存在
        session.user.isOAuthNewUser = token.isNewSignUp === true;
      }

      console.log("Session Debug:", {
        isOAuthNewUser: session.user.isOAuthNewUser,
        phoneNumber: token.phoneNumber,
      });

      return session;
    },

    // Sign in callback - 處理 OAuth 註冊
    async signIn({ user, account, profile }) {
      // 如果是 OAuth 登入，檢查用戶狀態
      // if (account?.provider === "google" || account?.provider === "line") {
      //   console.log("OAuth SignIn Callback:", {
      //     provider: account.provider,
      //     userEmail: user.email,
      //     userId: user.id,
      //   });

      //   // 查詢用戶的完整資訊
      //   const fullUser = await prisma.user.findUnique({
      //     where: { id: user.id },
      //     select: {
      //       id: true,
      //       phoneNumber: true,
      //       phoneNumberVerified: true,
      //       isOAuthNewUser: true,
      //     },
      //   });

      //   console.log("Full user data:", fullUser);
      //   console.log("user data:", user);
      //   console.log("account data:", account);
      //   console.log("profile data:", profile);

      //   if (!fullUser) {
      //     console.log(
      //       "OAuth new user without phone, redirecting to verify-phone"
      //     );
      //     return "/profile/verify-phone";
      //   }
      // }

      // 其他情況，使用預設行為
      return true;
    },
  },
  pages: {
    // signIn: "/login",
    // signOut: "/",
    // error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
});
