'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, Truck, RefreshCcw, FileText, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const POLICIES = [
  {
    id: 'warranty',
    title: 'Quy định bảo hành',
    icon: <ShieldCheck className="h-5 w-5" />,
    content: (
      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-brand-black mb-6">Chính Sách & Quy Định Bảo Hành</h2>
        <p className="mb-4">PulseTech cam kết mang đến những sản phẩm công nghệ chính hãng với chất lượng tốt nhất cùng chính sách bảo hành minh bạch, bảo vệ tối đa quyền lợi của khách hàng.</p>
        
        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">1. Thời hạn bảo hành</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Điện thoại, Máy tính bảng, Laptop:</strong> Bảo hành chính hãng 12 tháng kể từ ngày mua hàng.</li>
          <li><strong>Phụ kiện (Cáp, Sạc, Tai nghe):</strong> Bảo hành 6 - 12 tháng tùy thuộc vào quy định của từng thương hiệu (Apple, Samsung, Anker, v.v.).</li>
          <li><strong>Hàng cũ/Like New:</strong> Bảo hành sửa chữa 6 tháng tại hệ thống PulseTech.</li>
        </ul>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">2. Điều kiện được bảo hành miễn phí</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Sản phẩm còn trong thời hạn bảo hành.</li>
          <li>Sản phẩm phát sinh lỗi kỹ thuật do nhà sản xuất (phần cứng, mainboard, màn hình bị sọc bẩm sinh, v.v.).</li>
          <li>Tem bảo hành (nếu có), số IMEI/Serial Number phải còn nguyên vẹn, không có dấu hiệu cạo sửa, chắp vá.</li>
        </ul>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">3. Các trường hợp từ chối bảo hành</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6 text-red-600/80">
          <li>Sản phẩm bị rơi vỡ, cấn móp, vào nước hoặc hóa chất (ngay cả với các thiết bị có chuẩn chống nước).</li>
          <li>Sử dụng sai điện áp quy định gây chập cháy.</li>
          <li>Sản phẩm đã bị can thiệp phần cứng hoặc phần mềm (Root, Jailbreak) bởi các bên không được ủy quyền.</li>
        </ul>
        
        <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 mt-8">
          <p className="text-blue-800 font-medium m-0">
            <strong>Lưu ý:</strong> Quý khách vui lòng sao lưu toàn bộ dữ liệu cá nhân trước khi mang máy đến trung tâm bảo hành. PulseTech không chịu trách nhiệm đối với bất kỳ mất mát dữ liệu nào trong quá trình xử lý.
          </p>
        </div>
      </div>
    )
  },
  {
    id: 'shipping',
    title: 'Giao hàng & thanh toán',
    icon: <Truck className="h-5 w-5" />,
    content: (
      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-brand-black mb-6">Chính Sách Giao Hàng & Thanh Toán</h2>
        <p className="mb-4">Nhằm mang lại trải nghiệm mua sắm tiện lợi nhất, PulseTech cung cấp dịch vụ giao hàng tận nơi trên toàn quốc với thời gian siêu tốc và đa dạng phương thức thanh toán.</p>
        
        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">1. Chính sách giao hàng</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-brand-black mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span> Giao Hỏa Tốc (Nội thành)
            </h4>
            <p className="text-sm">Giao hàng cực nhanh trong vòng <strong>1 - 2 giờ</strong> đối với các đơn hàng tại khu vực nội thành TP.HCM và Hà Nội. Miễn phí cho đơn từ 500.000đ.</p>
          </div>
          <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
            <h4 className="font-bold text-brand-black mb-2 flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full"></span> Giao Tiêu Chuẩn (Toàn quốc)
            </h4>
            <p className="text-sm">Thời gian nhận hàng từ <strong>2 - 4 ngày làm việc</strong>. Hỗ trợ giao hàng đến tận tuyến huyện/xã. Cam kết đóng gói chống sốc an toàn 100%.</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">2. Phương thức thanh toán</h3>
        <p className="mb-4">Chúng tôi chấp nhận nhiều hình thức thanh toán để đảm bảo sự linh hoạt cho khách hàng:</p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Thanh toán tiền mặt khi nhận hàng (COD):</strong> Khách hàng được kiểm tra ngoại quan sản phẩm (không bóc seal đối với hàng Apple) trước khi thanh toán.</li>
          <li><strong>Thanh toán qua thẻ:</strong> Thẻ tín dụng, thẻ ghi nợ (Visa, Mastercard, JCB). Hỗ trợ thanh toán trả góp 0% qua thẻ tín dụng.</li>
          <li><strong>Ví điện tử & QR Code:</strong> MoMo, ZaloPay, VNPay, ShopeePay, Apple Pay.</li>
          <li><strong>Chuyển khoản ngân hàng:</strong> Chuyển khoản trực tiếp vào tài khoản công ty với nội dung là Mã Đơn Hàng.</li>
        </ul>
      </div>
    )
  },
  {
    id: 'return',
    title: 'Đổi trả sản phẩm lỗi',
    icon: <RefreshCcw className="h-5 w-5" />,
    content: (
      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-brand-black mb-6">Chính Sách Đổi Trả Miễn Phí 30 Ngày</h2>
        <p className="mb-6">PulseTech tự hào áp dụng chính sách <strong>"Lỗi là đổi mới"</strong> trong 30 ngày đầu tiên, giúp khách hàng hoàn toàn an tâm khi mua sắm các thiết bị công nghệ đắt tiền.</p>
        
        <div className="bg-red-50 p-6 rounded-2xl border border-red-100 mb-8">
          <h3 className="text-lg font-bold text-red-700 mt-0 mb-3">Điều kiện áp dụng 1 ĐỔI 1</h3>
          <ul className="list-disc pl-5 space-y-2 text-red-900 m-0">
            <li>Sản phẩm phát sinh lỗi phần cứng do nhà sản xuất đã được trung tâm bảo hành hãng xác nhận.</li>
            <li>Sản phẩm được mua không quá 30 ngày tính từ ngày xuất hóa đơn.</li>
            <li>Ngoại hình máy phải còn nguyên vẹn, không trầy xước, móp méo, không vào nước.</li>
            <li>Phải giữ đầy đủ hộp máy (nguyên vẹn, không rách nát), phụ kiện đi kèm, sách hướng dẫn và hóa đơn mua hàng gốc.</li>
          </ul>
        </div>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">Trường hợp khách hàng muốn Trả hàng - Hoàn tiền</h3>
        <p className="mb-4">Nếu sản phẩm không bị lỗi nhưng quý khách thay đổi ý định và muốn trả lại hàng:</p>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li><strong>Sản phẩm còn nguyên seal (chưa bóc vỏ):</strong> Thu phí 10% giá trị hóa đơn.</li>
          <li><strong>Sản phẩm đã bóc seal, qua sử dụng:</strong> Công ty sẽ thẩm định lại tình trạng máy và thu mua lại theo giá thỏa thuận (Thường mất phí từ 20% - 30% tùy tình trạng).</li>
        </ul>
      </div>
    )
  },
  {
    id: 'terms',
    title: 'Điều khoản dịch vụ',
    icon: <FileText className="h-5 w-5" />,
    content: (
      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-brand-black mb-6">Điều Khoản & Điều Kiện Giao Dịch</h2>
        <p className="mb-4">Chào mừng quý khách đến với website thương mại điện tử PulseTech. Khi quý khách truy cập và mua sắm tại website của chúng tôi, đồng nghĩa với việc quý khách đã đồng ý với các điều khoản dưới đây.</p>
        
        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">1. Quyền lợi và trách nhiệm của khách hàng</h3>
        <ul className="list-disc pl-5 space-y-2 mb-6">
          <li>Cung cấp thông tin cá nhân (Tên, SĐT, Địa chỉ) chính xác để chúng tôi thực hiện giao hàng.</li>
          <li>Tuyệt đối không sử dụng bất kỳ công cụ, phương pháp nào để can thiệp, phá hoại hệ thống dữ liệu của website.</li>
          <li>Quý khách có quyền yêu cầu trích xuất hóa đơn VAT điện tử cho mọi giao dịch mua hàng.</li>
        </ul>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">2. Chính sách bảo mật thông tin</h3>
        <p className="mb-4">PulseTech cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng. Chúng tôi chỉ sử dụng thông tin để xử lý đơn hàng, thông báo các chương trình khuyến mãi (nếu được sự đồng ý) và không bao giờ mua bán, trao đổi dữ liệu cho bên thứ ba.</p>

        <h3 className="text-lg font-bold text-brand-black mt-8 mb-4">3. Giải quyết tranh chấp</h3>
        <p className="mb-4">Mọi tranh chấp phát sinh trong quá trình giao dịch sẽ được ưu tiên giải quyết thông qua thương lượng, hòa giải. Nếu không thể đạt được thỏa thuận, vụ việc sẽ được đưa ra cơ quan có thẩm quyền giải quyết theo quy định của pháp luật Việt Nam.</p>
      </div>
    )
  }
];

export default function PoliciesPage() {
  const searchParams = useSearchParams();
  const typeParam = searchParams.get('type');
  
  const [activeTab, setActiveTab] = useState('warranty');

  // Sync state with URL param on mount and when param changes
  useEffect(() => {
    if (typeParam && POLICIES.some(p => p.id === typeParam)) {
      setActiveTab(typeParam);
    }
  }, [typeParam]);

  const activeContent = POLICIES.find(p => p.id === activeTab)?.content;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      {/* Hero Banner Minimal */}
      <div className="bg-brand-black pt-20 pb-16">
        <div className="container mx-auto px-4 max-w-6xl text-center">
          <h1 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-wide uppercase mb-4">
            Trung Tâm Hỗ Trợ & Chính Sách
          </h1>
          <p className="text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
            Cam kết minh bạch trong mọi giao dịch. Tìm hiểu các quy định, chính sách bảo hành, đổi trả và giao hàng tại PulseTech.
          </p>
        </div>
      </div>

      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 max-w-6xl">
          
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
            <a href="/" className="hover:text-primary transition-colors">Trang chủ</a>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">Chính sách</span>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Sidebar Menu */}
            <div className="w-full md:w-1/3 lg:w-1/4 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden sticky top-24">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h3 className="font-display font-bold text-brand-black text-lg">Danh mục chính sách</h3>
              </div>
              <div className="p-3">
                {POLICIES.map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => setActiveTab(policy.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl font-semibold text-sm transition-all duration-300 text-left mb-1 ${
                      activeTab === policy.id 
                        ? 'bg-red-50 text-red-600' 
                        : 'text-gray-600 hover:bg-gray-50 hover:text-brand-black'
                    }`}
                  >
                    <span className={`${activeTab === policy.id ? 'text-red-500' : 'text-gray-400'}`}>
                      {policy.icon}
                    </span>
                    {policy.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Content Area */}
            <div className="w-full md:w-2/3 lg:w-3/4 bg-white rounded-3xl shadow-sm border border-gray-100 p-8 md:p-12 min-h-[500px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeContent}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
