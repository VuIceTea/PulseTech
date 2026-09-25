"use client";

import React, { useState } from "react";
import { ShieldCheck, Search, CheckCircle2, Clock, AlertCircle, FileText, Smartphone } from "lucide-react";

interface Warranty {
  id: string;
  imei: string;
  orderId: string;
  productName: string;
  storageVariant: string;
  customerName: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  status: string;
  notes?: string;
}

export default function WarrantyLookupPage() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Warranty[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:8080/api/warranties/search?query=${encodeURIComponent(query.trim())}`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400"><CheckCircle2 className="w-4 h-4" /> Còn Hạn Bảo Hành</span>;
      case "IN_REPAIR":
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-400"><Clock className="w-4 h-4" /> Đang Sửa Chữa Tại Trung Tâm</span>;
      case "EXPIRED":
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400"><AlertCircle className="w-4 h-4" /> Hết Hạn Bảo Hành</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400">Từ Chối Bảo Hành</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0B1437] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-blue-600/10 text-blue-600 mb-2">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Tra Cứu Bảo Hành & IMEI Máy
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
            Nhập số IMEI điện thoại/laptop, số điện thoại mua hàng hoặc mã đơn hàng của bạn để kiểm tra chính hãng.
          </p>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              required
              placeholder="Nhập IMEI (VD: 35678...), Số điện thoại hoặc Mã đơn hàng..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-white/10 rounded-2xl text-sm font-medium shadow-sm outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl shadow-md transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "Đang tra..." : "Tra Cứu"}
          </button>
        </form>

        {results !== null && (
          <div className="space-y-4 max-w-2xl mx-auto">
            {results.length === 0 ? (
              <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 text-center text-gray-500 border border-gray-100 dark:border-white/10">
                Không tìm thấy thông tin bảo hành cho thông tin "{query}". Vui lòng kiểm tra lại IMEI hoặc SĐT.
              </div>
            ) : (
              results.map((item) => (
                <div key={item.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-lg space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
                    <div>
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wider block mb-1">Dịch Vụ Bảo Hành PulseTech</span>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">{item.productName}</h3>
                      <div className="text-sm text-gray-500 font-medium">{item.storageVariant}</div>
                    </div>
                    <div>{getStatusBadge(item.status)}</div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                      <Smartphone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase">Mã IMEI</div>
                        <div className="font-mono font-bold text-gray-900 dark:text-white">{item.imei || "Chưa gắn"}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 bg-gray-50 dark:bg-white/5 p-3 rounded-2xl">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-400 font-bold uppercase">Mã Đơn Hàng</div>
                        <div className="font-mono font-bold text-gray-900 dark:text-white">#{item.orderId}</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs font-medium border-t border-gray-100 dark:border-white/10 pt-4">
                    <div>
                      <span className="text-gray-400 block">Ngày bắt đầu:</span>
                      <strong className="text-gray-800 dark:text-gray-200 text-sm">{new Date(item.startDate).toLocaleDateString("vi-VN")}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block">Ngày hết hạn:</span>
                      <strong className="text-gray-800 dark:text-gray-200 text-sm">{new Date(item.endDate).toLocaleDateString("vi-VN")}</strong>
                    </div>
                  </div>

                  {item.notes && (
                    <div className="bg-amber-50 dark:bg-amber-500/10 p-4 rounded-2xl text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      <strong className="font-bold block">Ghi chú sửa chữa / lịch sử trung tâm:</strong>
                      <p>{item.notes}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
