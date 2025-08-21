// app/auth-redirect-wrapper.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export function AuthRedirectWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // 確保 session 已載入且用戶已登入
    if (status !== "authenticated" || !session) {
      return;
    }

    const verificationPath = "/profile/verify-phone";
    const hasBeenRedirectedKey = "hasBeenRedirectedToPhoneVerification";

    // 檢查是否需要驗證手機
    if (session.user?.isOAuthNewUser && !session.user?.phoneNumber) {
      const hasBeenRedirected = sessionStorage.getItem(hasBeenRedirectedKey);

      // 如果當前不在驗證頁面，且本次會話尚未重導向過
      if (pathname !== verificationPath && !hasBeenRedirected) {
        // 標記為已重導向
        sessionStorage.setItem(hasBeenRedirectedKey, "true");
        // 執行重導向
        router.push(verificationPath);
      }
    }
  }, [session, status, router, pathname]);

  // 這個 Wrapper 不再需要處理載入狀態，因為重導向是非阻塞的。
  // 直接渲染 children 即可。
  return <>{children}</>;
}
