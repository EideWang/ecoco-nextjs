"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  UserCircleIcon,
  CogIcon,
  PhoneIcon,
  ShieldCheckIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  CheckIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import {
  updateUserPhoneNumber,
  updateUserProfile,
} from "@/actions/auth-actions";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [editForm, setEditForm] = useState({
    name: "",
    city: "",
    district: "",
    gender: "",
    dateOfBirth: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (session?.user) {
      setEditForm({
        name: session.user.name || "",
        city: "",
        district: "",
        gender: "",
        dateOfBirth: "",
      });
    }
  }, [session]);

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">請先登入</h2>
          <button
            onClick={() => signIn()}
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg"
          >
            登入
          </button>
        </div>
      </div>
    );
  }

  const handlePhoneUpdate = async () => {
    if (!session.user?.id) return;

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await updateUserPhoneNumber(
        session.user.id,
        newPhoneNumber
      );

      if (result.error) {
        setError(result.error);
      } else {
        setMessage("手機號碼更新成功！");
        setIsEditingPhone(false);
        setNewPhoneNumber("");
        // 更新 session
        await update();
      }
    } catch (_error) {
      setError("更新失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileUpdate = async () => {
    if (!session.user?.id) return;

    setIsLoading(true);
    setError("");
    setMessage("");

    try {
      const result = await updateUserProfile(session.user.id, {
        name: editForm.name,
        city: editForm.city,
        district: editForm.district,
        gender: editForm.gender,
        dateOfBirth: editForm.dateOfBirth
          ? new Date(editForm.dateOfBirth)
          : undefined,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setMessage("個人資料更新成功！");
        setIsEditingProfile(false);
        // 更新 session
        await update();
      }
    } catch (_error) {
      setError("更新失敗，請稍後再試");
    } finally {
      setIsLoading(false);
    }
  };

  const isPhoneVerified = session.user?.phoneNumberVerified;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* 個人資料卡片 */}
      <div className="bg-white rounded-lg shadow mb-6">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <UserCircleIcon className="h-12 w-12 text-emerald-600" />
              </div>
              <div>
                <h2 className="text-xl font-semibold">
                  {session.user?.name || "使用者"}
                </h2>
                <p className="text-gray-600">{session.user?.email}</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
          </div>

          {/* 手機號碼狀態 */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PhoneIcon className="h-5 w-5 text-gray-400" />
                <span className="text-gray-700">手機號碼</span>
                {isPhoneVerified ? (
                  <ShieldCheckIcon className="h-4 w-4 text-emerald-500" />
                ) : (
                  <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {session.user?.phoneNumber || "未設定"}
                </span>
                {!isPhoneVerified && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                    未驗證
                  </span>
                )}
                <button
                  onClick={() => setIsEditingPhone(!isEditingPhone)}
                  className="p-1 text-gray-400 hover:text-gray-600"
                >
                  <PencilIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* 手機號碼編輯 */}
            {isEditingPhone && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex space-x-2">
                  <input
                    type="tel"
                    placeholder="請輸入手機號碼"
                    value={newPhoneNumber}
                    onChange={e => setNewPhoneNumber(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                  <button
                    onClick={handlePhoneUpdate}
                    disabled={isLoading}
                    className="px-3 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  >
                    <CheckIcon className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditingPhone(false);
                      setNewPhoneNumber("");
                    }}
                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    <XMarkIcon className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* 個人資料編輯 */}
            {isEditingProfile && (
              <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    姓名
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={e =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      縣市
                    </label>
                    <input
                      type="text"
                      value={editForm.city}
                      onChange={e =>
                        setEditForm({ ...editForm, city: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      鄉鎮
                    </label>
                    <input
                      type="text"
                      value={editForm.district}
                      onChange={e =>
                        setEditForm({ ...editForm, district: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      性別
                    </label>
                    <select
                      value={editForm.gender}
                      onChange={e =>
                        setEditForm({ ...editForm, gender: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="">請選擇</option>
                      <option value="Male">男性</option>
                      <option value="Female">女性</option>
                      <option value="Other">其他</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      生日
                    </label>
                    <input
                      type="date"
                      value={editForm.dateOfBirth}
                      onChange={e =>
                        setEditForm({
                          ...editForm,
                          dateOfBirth: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleProfileUpdate}
                    disabled={isLoading}
                    className="flex-1 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 disabled:opacity-50"
                  >
                    {isLoading ? "更新中..." : "更新資料"}
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    取消
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 訊息顯示 */}
      {message && (
        <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-lg">
          {message}
        </div>
      )}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* 環保積分 */}
      {/* <div className="bg-white rounded-lg shadow mb-4">
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ChartBarIcon className="h-6 w-6 text-emerald-500" />
            <h3 className="text-lg font-medium">環保積分</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {session.user?.currentEcocoPoints || 0}
              </p>
              <p className="text-gray-600 text-sm">Ecoco 點數</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-600">
                {session.user?.currentEcocoCoins || 0}
              </p>
              <p className="text-gray-600 text-sm">Ecoco 幣</p>
            </div>
          </div>
        </div>
      </div> */}

      {/* IoT 設備狀態 */}
      {!isPhoneVerified && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2">
            <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />
            <div>
              <h4 className="font-medium text-yellow-800">IoT 設備功能受限</h4>
              <p className="text-sm text-yellow-700">
                您的手機號碼尚未驗證，無法使用 IoT 設備功能。請先驗證手機號碼。
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 登出按鈕 */}
      <button
        onClick={() => signOut({ redirect: true, callbackUrl: "/" })}
        className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg flex items-center justify-center space-x-2 hover:bg-gray-200"
      >
        <CogIcon className="h-5 w-5" />
        <span>登出</span>
      </button>
    </div>
  );
}
