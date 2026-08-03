'use client';

import React, { useEffect, useState } from 'react';
import { api, Store } from '@/lib/api';
import { MapPin, Phone, Clock } from 'lucide-react';

export default function StoresPage() {
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    api.getStores().then(data => {
      setStores(data);
    }).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="text-3xl font-display font-black text-brand-black mb-8">Hệ thống Cửa hàng</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stores.map(store => (
          <div key={store.id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-brand-black">{store.name}</h2>
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <p className="text-gray-600">{store.address}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-primary shrink-0" />
              <a href={`tel:${store.phone}`} className="text-primary font-bold hover:underline">{store.phone}</a>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-primary shrink-0" />
              <p className="text-gray-600">{store.openingHours}</p>
            </div>
            {store.mapUrl && (
              <a href={store.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-4 px-4 py-2 bg-gray-50 text-gray-700 rounded-full font-bold text-sm text-center border border-gray-200 hover:bg-gray-100 transition">
                Xem bản đồ
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
