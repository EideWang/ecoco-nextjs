"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
      <p className="mt-4 text-gray-600">載入中...</p>
    </div>
  </div>
);

const ResetPasswordContent = () => {
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get("phone");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    // 驗證密碼
    if (newPassword !== confirmPassword) {
      setError("密碼確認不一致");
      setIsLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("密碼至少需要6個字元");
      setIsLoading(false);
      return;
    }

    try {
      // TODO: 實作驗證碼驗證和密碼重置功能
      // 這裡需要整合後端 API
      setMessage("密碼重置成功！正在跳轉到登入頁面...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (_error) {
      setError("密碼重置失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  if (!phoneNumber) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
        <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              無效的連結
            </h2>
            <p className="text-gray-600 mb-6">請從忘記密碼頁面重新開始</p>
            <Link
              href="/forgot-password"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700"
            >
              返回忘記密碼
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">重置密碼</h2>
          <p className="text-gray-600">請輸入驗證碼和新密碼</p>
          <p className="text-sm text-gray-500 mt-2">手機號碼：{phoneNumber}</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="verificationCode"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              驗證碼
            </label>
            <input
              id="verificationCode"
              name="verificationCode"
              type="text"
              required
              maxLength={6}
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 text-center text-lg tracking-widest"
              placeholder="000000"
              value={verificationCode}
              onChange={e =>
                setVerificationCode(e.target.value.replace(/\D/g, ""))
              }
            />
          </div>

          <div>
            <label
              htmlFor="newPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              新密碼
            </label>
            <input
              id="newPassword"
              name="newPassword"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="請輸入新密碼（至少6個字元）"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
            />
          </div>

          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              確認新密碼
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="請再次輸入新密碼"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}

          {message && (
            <div className="text-emerald-600 text-sm text-center bg-emerald-50 p-3 rounded-lg">
              {message}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "重置中..." : "重置密碼"}
            </button>
          </div>
        </form>

        <div className="text-center">
          <Link
            href="/login"
            className="text-sm text-emerald-600 hover:text-emerald-500"
          >
            返回登入
          </Link>
        </div>

        {/* 注意事項 */}
        <div className="text-xs text-gray-500 bg-gray-50 p-4 rounded-lg">
          <p className="font-medium mb-2">注意事項：</p>
          <ul className="space-y-1">
            <li>• 驗證碼為 6 位數字</li>
            <li>• 新密碼至少需要 6 個字元</li>
            <li>• 密碼重置成功後，請使用新密碼登入</li>
            <li>• 如驗證碼過期，請重新申請</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ResetPasswordContent />
    </Suspense>
  );
}
