"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      // TODO: 實作簡訊驗證碼發送功能
      // 這裡需要整合簡訊服務商的 API
      setMessage("驗證碼已發送到您的手機，請查收簡訊");
    } catch (_error) {
      setError("發送驗證碼失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">忘記密碼</h2>
          <p className="text-gray-600">請輸入手機號碼，我們將發送驗證碼給您</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              手機號碼
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
              placeholder="請輸入手機號碼"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
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
              {isLoading ? "發送中..." : "發送驗證碼"}
            </button>
          </div>
        </form>

        <div className="text-center space-y-2">
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
            <li>• 驗證碼將發送到您註冊時使用的手機號碼</li>
            <li>• 驗證碼有效期限為 10 分鐘</li>
            <li>• 如未收到簡訊，請檢查手機號碼是否正確</li>
            <li>• 如有問題，請聯繫客服人員</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
