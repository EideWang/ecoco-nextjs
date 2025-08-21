"use client";

import { useState } from "react";
import { StarIcon } from "@heroicons/react/24/solid";

export default function PartnersPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const categories = [
    { id: "all", name: "全部" },
    { id: "food", name: "美食" },
    { id: "retail", name: "零售" },
    { id: "service", name: "服務" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">商家兌換</h1>
        <div className="bg-emerald-100 px-4 py-2 rounded-full">
          <span className="text-emerald-700 font-medium">積分：1,250</span>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
        {categories.map(category => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-4 py-2 rounded-full whitespace-nowrap ${
              selectedCategory === category.id
                ? "bg-emerald-500 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">星巴克</h3>
              <p className="text-sm text-gray-600 mt-1">
                使用 500 點兌換中杯美式咖啡
              </p>
              <div className="flex items-center mt-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600 ml-1">4.8 (2.5k+)</span>
              </div>
            </div>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm">
              兌換
            </button>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">全家便利商店</h3>
              <p className="text-sm text-gray-600 mt-1">
                使用 300 點兌換現金抵用券
              </p>
              <div className="flex items-center mt-2">
                <StarIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm text-gray-600 ml-1">4.6 (5k+)</span>
              </div>
            </div>
            <button className="bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm">
              兌換
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
