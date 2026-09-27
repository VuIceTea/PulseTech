"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Check, X, Smartphone, Cpu, HardDrive, Battery, Camera, Monitor } from "lucide-react";

interface Product {
  id: string;
  name: string;
  brand: string;
  basePrice: number;
  originalPrice: number;
  image: string;
  specs?: {
    screen?: string;
    cpu?: string;
    ram?: string;
    storage?: string;
    battery?: string;
    camera?: string;
    os?: string;
  };
}

export default function ComparePage() {
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/products")
      .then((res) => (res.ok ? res.json() : []))
      .then((data) => {
        setAllProducts(data);
        if (data.length >= 2) {
          setSelectedIds([data[0].id, data[1].id]);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const selectedProducts = allProducts.filter((p) => selectedIds.includes(p.id));

  const handleSelectProduct = (index: number, id: string) => {
    const next = [...selectedIds];
    next[index] = id;
    setSelectedIds(next);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1437] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Quay lại danh sách sản phẩm
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            So Sánh Cấu Hình & Giá Sản Phẩm
          </h1>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Đang tải sản phẩm để so sánh...</div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="w-1/4 p-4 text-xs font-bold uppercase text-gray-400">Chọn sản phẩm so sánh</th>
                  {[0, 1, 2].map((idx) => (
                    <th key={idx} className="w-1/4 p-4">
                      <select
                        value={selectedIds[idx] || ""}
                        onChange={(e) => handleSelectProduct(idx, e.target.value)}
                        className="w-full p-2.5 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-xs font-bold text-gray-900 dark:text-white outline-none"
                      >
                        <option value="">-- Chọn sản phẩm {idx + 1} --</option>
                        {allProducts.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5 text-sm">
                {/* Header Product Cards */}
                <tr>
                  <td className="p-4 font-bold text-gray-400 text-xs">HÌNH ẢNH & GIÁ</td>
                  {[0, 1, 2].map((idx) => {
                    const prod = selectedProducts[idx];
                    return (
                      <td key={idx} className="p-4 text-center">
                        {prod ? (
                          <div className="space-y-3">
                            <img src={prod.image} alt={prod.name} className="w-28 h-28 object-contain mx-auto" />
                            <div className="font-bold text-gray-900 dark:text-white text-base">{prod.name}</div>
                            <div className="text-blue-600 font-extrabold text-lg">
                              {prod.basePrice ? prod.basePrice.toLocaleString("vi-VN") : 0} đ
                            </div>
                            <Link href={`/products/${prod.id}`} className="inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors">
                              Xem Chi Tiết
                            </Link>
                          </div>
                        ) : (
                          <div className="text-xs text-gray-400 italic py-8">Chưa chọn sản phẩm</div>
                        )}
                      </td>
                    );
                  })}
                </tr>

                {/* Specs Rows */}
                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" /> Màn Hình
                  </td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="p-4 text-center font-medium">
                      {selectedProducts[idx]?.specs?.screen || "—"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-600" /> Vi Xử Lý (CPU)
                  </td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="p-4 text-center font-medium">
                      {selectedProducts[idx]?.specs?.cpu || "—"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-blue-600" /> RAM / Bộ Nhớ
                  </td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="p-4 text-center font-medium">
                      {selectedProducts[idx]?.specs?.ram ? `${selectedProducts[idx]?.specs?.ram} / ${selectedProducts[idx]?.specs?.storage || ""}` : "—"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Camera className="w-4 h-4 text-blue-600" /> Camera
                  </td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="p-4 text-center font-medium">
                      {selectedProducts[idx]?.specs?.camera || "—"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-4 font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Battery className="w-4 h-4 text-blue-600" /> Pin & Sạc
                  </td>
                  {[0, 1, 2].map((idx) => (
                    <td key={idx} className="p-4 text-center font-medium">
                      {selectedProducts[idx]?.specs?.battery || "—"}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
