"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { updateUserPhoneNumber } from "@/actions/auth-actions";
import Link from "next/link";

export default function VerifyPhonePage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, update } = useSession();
  const router = useRouter();

  console.log("session", session);
  //   if (status === "authenticated" && session.user?.isOAuthNewUser){
  //     try {
  //         await update({
  //             requiresPhoneNumberVerification: false
  //         });
  //         // update 完成後，session 物件會自動更新
  //         // 頁面上顯示 session.user.phoneVerified 的地方也會重新渲染
  //         console.log('Session updated successfully!');
  //       } catch (error) {
  //         console.error('Failed to update session:', error);
  //       }
  //   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (!session?.user?.id) {
      setError("用戶資訊不完整，請重新登入");
      setIsLoading(false);
      return;
    }

    // 簡單的手機號碼格式驗證（台灣手機號碼）
    const phoneRegex = /^09\d{8}$/;
    if (!phoneRegex.test(phoneNumber)) {
      setError("請輸入正確的台灣手機號碼格式（09xxxxxxxx）");
      setIsLoading(false);
      return;
    }

    try {
      const result = await updateUserPhoneNumber(session.user.id, phoneNumber);

      if (result.error) {
        setError(result.error);
      } else {
        // 更新 session 以反映新的手機號碼狀態
        await update();

        // 跳轉到個人資料頁面
        router.push("/profile");
      }
    } catch (_error) {
      setError("綁定手機號碼時發生錯誤");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          綁定手機號碼
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          為了提供更好的服務，請綁定您的手機號碼
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                手機號碼
              </label>
              <div className="mt-1">
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={phoneNumber}
                  onChange={e => setPhoneNumber(e.target.value)}
                  placeholder="請輸入手機號碼（例：0912345678）"
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            {error && <div className="text-red-600 text-sm">{error}</div>}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "處理中..." : "綁定手機號碼"}
              </button>
            </div>
          </form>
        </div>

        <Link href="/profile">跳過</Link>
      </div>
    </div>
  );
}
