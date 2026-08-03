'use client';

import React, { useEffect, useState } from 'react';
import { api, Article } from '@/lib/api';
import Link from 'next/link';

export default function BlogPage() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    api.getArticles().then(data => {
      setArticles(data);
    }).catch(console.error);
  }, []);

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-12">
      <h1 className="text-3xl font-display font-black text-brand-black mb-8">Tin tức công nghệ</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map(article => (
          <div key={article.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group cursor-pointer">
            <div className="h-48 overflow-hidden bg-gray-100 relative">
              <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
              <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
                {article.category}
              </div>
            </div>
            <div className="p-6 flex flex-col flex-grow">
              <div className="text-xs text-gray-500 mb-3 flex items-center justify-between">
                <span>{new Date(article.publishedAt).toLocaleDateString('vi-VN')}</span>
                <span>{article.viewCount} lượt xem</span>
              </div>
              <h2 className="text-lg font-bold text-brand-black mb-2 group-hover:text-primary transition line-clamp-2">
                {article.title}
              </h2>
              <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                {article.summary}
              </p>
              <div className="mt-auto">
                <Link href={`/blog/${article.slug}`} className="text-primary font-bold text-sm hover:underline">
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
