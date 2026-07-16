import React from 'react';

export default function Loading() {
  return (
    <div className="w-full bg-[#f8fafc] animate-pulse">
      {/* Skeleton for Hero Banner */}
      <section className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 mt-2">
        <div className="bg-gray-200 rounded-[2rem] w-full h-[400px] lg:h-[500px]"></div>
      </section>

      {/* Skeleton for Category List */}
      <section className="mx-auto max-w-[1600px] px-4 py-8 sm:px-6 lg:px-8 overflow-hidden">
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 min-w-[80px]">
              <div className="w-16 h-16 rounded-full bg-gray-200"></div>
              <div className="w-12 h-3 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Skeleton for Flash Sale */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8 mt-6">
        <div className="flex justify-between items-center mb-6">
          <div className="w-48 h-8 bg-gray-200 rounded"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 flex flex-col h-72">
              <div className="w-full h-40 bg-gray-100 rounded-xl mb-4"></div>
              <div className="w-full h-4 bg-gray-200 rounded mb-2"></div>
              <div className="w-2/3 h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Skeleton for Banner Section */}
      <section className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-[220px] bg-gray-200 rounded-2xl"></div>
          <div className="h-[220px] bg-gray-200 rounded-2xl"></div>
        </div>
      </section>
    </div>
  );
}
