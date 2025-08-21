"use client";

import React, { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// import PhoneVerificationForm from "@/components/PhoneVerificationForm";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">載入中...</p>
    </div>
  </div>
);

const OAuthRegisterContent = () => {
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const router = useRouter();

  const provider = searchParams.get("provider");

  // 使用 useEffect 來處理路由跳轉，避免在渲染過程中調用
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      console.log("unauthenticated so login");
      return;
    }

    // 只有在用戶明確有手機號碼且已驗證時才跳轉
    if (
      status === "authenticated" &&
      session?.user?.phoneNumber &&
      session?.user?.phoneNumberVerified
    ) {
      router.push("/profile");
      return;
    }
  }, [status, session, router]);

  // 如果正在載入，顯示載入狀態
  if (status === "loading") {
    return <LoadingSpinner />;
  }

  // 如果未登入，顯示載入狀態（useEffect 會處理跳轉）
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">跳轉中...</p>
        </div>
      </div>
    );
  }

  // 如果用戶已經有手機號碼且已驗證，顯示載入狀態（useEffect 會處理跳轉）
  if (
    status === "authenticated" &&
    session?.user?.phoneNumber &&
    session?.user?.phoneNumberVerified
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">跳轉中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">完成註冊</h1>
          <p className="text-gray-600">
            請驗證您的手機號碼以完成{" "}
            {provider === "google"
              ? "Google"
              : provider === "line"
                ? "Line"
                : "OAuth"}{" "}
            帳號註冊
          </p>
        </div>

        {/* <PhoneVerificationForm provider={provider || undefined} /> */}
      </div>
    </div>
  );
};

const OAuthRegisterPage = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <OAuthRegisterContent />
    </Suspense>
  );
};

export default OAuthRegisterPage;
