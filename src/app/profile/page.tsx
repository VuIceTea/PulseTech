'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import QRCode from 'react-qr-code';
import { BackgroundGradient } from '@/components/ui/background-gradient';
import { api, type Order } from '@/lib/api';
import { Package, Truck, CheckCircle2, ClipboardList, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import { HiChevronRight } from 'react-icons/hi2';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    if (isLoaded && !user) router.replace('/login');
  }, [isLoaded, router, user]);

  if (!isLoaded || !user) {
    return <main className="flex flex-1 items-center justify-center bg-[#f4f6f8] py-20"><div className="h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-primary" /></main>;
  }

  const initials = user.name.split(/\s+/).filter(Boolean).slice(-2).map((part) => part[0]?.toUpperCase()).join('') || 'U';

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  const menuItems = [
    { id: 'home', icon: 'https://img.icons8.com/fluency/48/home.png', label: 'Trang chủ Pulse Member' },
    { id: 'history', icon: 'https://img.icons8.com/fluency/48/order-history.png', label: 'Lịch sử mua hàng' },
    { id: 'account', icon: 'https://img.icons8.com/fluency/48/user-male-circle.png', label: 'Thông tin tài khoản' },
    { id: 'offers', icon: 'https://img.icons8.com/fluency/48/gift.png', label: 'Ưu đãi của bạn' },
    { id: 'address', icon: 'https://img.icons8.com/fluency/48/map-marker.png', label: 'Sổ địa chỉ' },
  ];

  return (
    <main className="flex flex-1 justify-center bg-[#f4f6f8] px-4 py-8">
      <div className="w-full max-w-[1600px] grid grid-cols-1 gap-6 lg:grid-cols-12">

        {/* Sidebar */}
        <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-24 lg:self-start lg:h-[calc(100vh-120px)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-lg font-bold text-primary">{initials}</div>
              <div>
                <p className="text-sm text-gray-500">Tài khoản của</p>
                <h3 className="font-bold text-brand-black line-clamp-1">{user.name}</h3>
              </div>
            </div>
          </div>

          <div className="rounded-2xl bg-white p-3 shadow-sm">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center justify-between rounded-xl p-3 text-sm font-semibold transition-colors ${activeTab === item.id ? 'bg-red-50 text-primary' : 'text-gray-600 hover:bg-gray-50 hover:text-brand-black'}`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.icon} alt={item.label} className="h-full w-full object-contain" />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  <HiChevronRight className={`text-base ${activeTab === item.id ? 'text-primary' : 'text-gray-400'}`} />
                </button>
              ))}
              <button onClick={handleLogout} className="mt-2 flex w-full items-center justify-between rounded-xl p-3 text-sm font-semibold text-gray-600 transition-colors hover:bg-gray-50 hover:text-red-500">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="https://img.icons8.com/fluency/48/exit.png" alt="Logout" className="h-full w-full object-contain" />
                  </div>
                  <span>Đăng xuất</span>
                </div>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <section className="lg:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeTab === 'home' && <TabHome user={user} />}
              {activeTab === 'history' && <TabHistory user={user} />}
              {activeTab === 'account' && <TabAccount user={user} />}
              {activeTab === 'offers' && <TabOffers />}
              {activeTab === 'address' && <TabAddress user={user} />}
            </motion.div>
          </AnimatePresence>
        </section>

      </div>
    </main>
  );
}

function MemberCard({ user }: { user: any }) {
  return (
    <BackgroundGradient className="p-6 sm:p-8 text-white shadow-xl">
      {/* Background Pattern */}
      <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/10 blur-3xl z-0 pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-black/20 blur-3xl z-0 pointer-events-none"></div>

      <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex-1 space-y-6">
          <div className="flex items-center gap-3">
            <span className="font-display text-2xl font-extrabold uppercase tracking-wider">Pulse<span className="text-white/80">Tech</span></span>
            <span className="rounded-full border border-white/30 bg-white/20 px-3 py-1 text-xs font-bold backdrop-blur-md shadow-sm">P-MEMBER</span>
          </div>
          <div>
            <p className="text-sm font-medium text-white/80 uppercase tracking-widest">Tên thành viên</p>
            <p className="mt-1 text-2xl sm:text-3xl font-extrabold">{user.name}</p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="text-xs font-medium text-white/80 uppercase tracking-widest">Điểm tích lũy</p>
              <p className="mt-1 text-xl font-bold text-yellow-300">1,250</p>
            </div>
            <div>
              <p className="text-xs font-medium text-white/80 uppercase tracking-widest">Chi tiêu năm nay</p>
              <p className="mt-1 text-xl font-bold">12.500.000đ</p>
            </div>
          </div>
        </div>

        {/* Real QR Code */}
        <div className="flex shrink-0 flex-col items-center gap-3">
          <div className="rounded-2xl bg-white p-3 shadow-lg">
            <QRCode value={user.email} size={110} level="H" fgColor="#000" bgColor="#fff" />
          </div>
          <p className="text-[11px] font-semibold text-white/80">Quét để nhận diện</p>
        </div>
      </div>
    </BackgroundGradient>
  );
}

function TabHome({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Trang chủ Pulse Member</h2>
      <MemberCard user={user} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/fluency/48/order-history.png" alt="Order" className="h-full w-full object-contain" />
          </div>
          <div><p className="text-xs font-semibold text-gray-500">Đơn hàng hiện tại</p><p className="text-lg font-bold text-brand-black">0 đơn</p></div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/fluency/48/gift.png" alt="Offers" className="h-full w-full object-contain" />
          </div>
          <div><p className="text-xs font-semibold text-gray-500">Ưu đãi của bạn</p><p className="text-lg font-bold text-brand-black">3 voucher</p></div>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/fluency/48/warranty-card.png" alt="Card" className="h-full w-full object-contain" />
          </div>
          <div><p className="text-xs font-semibold text-gray-500">Hạng thẻ tiếp theo</p><p className="text-lg font-bold text-brand-black">P-VIP</p></div>
        </div>
      </div>
    </div>
  );
}

function TabAccount({ user }: { user: any }) {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Thông tin tài khoản</h2>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-12">
        <div className="xl:col-span-6 rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
          <h3 className="mb-5 text-lg font-semibold text-brand-black">Chi tiết cá nhân</h3>
          <div className="space-y-4 flex-1 flex flex-col">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Họ và tên</label>
              <input type="text" readOnly value={user.name} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-black outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Số điện thoại</label>
              <input type="text" readOnly value="0987654321" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-black outline-none" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Email</label>
              <input type="text" readOnly value={user.email} className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-black outline-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Ngày sinh</label>
                <input type="text" readOnly value="01/01/2000" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-black outline-none" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-gray-500">Giới tính</label>
                <input type="text" readOnly value="Nam" className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-brand-black outline-none" />
              </div>
            </div>
            <div className="pt-4 mt-auto">
              <button className="w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Lưu thay đổi</button>
            </div>
          </div>
        </div>
        <div className="xl:col-span-6 self-center">
          <MemberCard user={user} />
        </div>
      </div>
    </div>
  );
}

function TabHistory({ user }: { user: any }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const fetchOrders = async () => {
      try {
        const data = await api.getOrderHistory(user.email);
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  const handleCancelOrder = (orderId: string) => {
    setCancelTarget(orderId);
  };

  const confirmCancelOrder = async (orderId: string) => {
    try {
      await api.cancelOrder(orderId);
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: 4 } : o));
      toast.success('Hủy đơn hàng thành công!');
      setCancelTarget(null);
    } catch (err: any) {
      toast.error(err.message || 'Có lỗi xảy ra khi hủy đơn hàng');
      setCancelTarget(null);
    }
  };

  const timelineSteps = [
    { title: 'Đã đặt', icon: <ClipboardList className="w-4 h-4" /> },
    { title: 'Xác nhận', icon: <Package className="w-4 h-4" /> },
    { title: 'Đang giao', icon: <Truck className="w-4 h-4" /> },
    { title: 'Thành công', icon: <CheckCircle2 className="w-4 h-4" /> }
  ];

  if (isLoading) return <div className="flex justify-center py-10"><RefreshCw className="h-8 w-8 animate-spin text-primary" /></div>;

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Lịch sử mua hàng</h2>
        <div className="rounded-2xl bg-white p-8 text-center shadow-sm border border-gray-100">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="https://img.icons8.com/fluency/96/purchase-order.png" alt="Empty Order" className="h-full w-full object-contain grayscale opacity-50" />
          </div>
          <h3 className="text-lg font-bold text-brand-black">Chưa có đơn hàng nào</h3>
          <p className="mt-2 text-sm text-gray-500">Bạn chưa thực hiện giao dịch nào tại PulseTech.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Mua sắm ngay</Link>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => price.toLocaleString('vi-VN') + '₫';

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Lịch sử mua hàng</h2>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 pb-4 mb-4 gap-4">
              <div>
                <h2 className="text-2xl font-display font-bold text-brand-black uppercase">Đơn hàng #{order.id}</h2>
                <p className="text-sm text-gray-500 mt-1">Đặt ngày: {order.createdAt}</p>
              </div>
              <div className="text-right">
                <span className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${
                  order.status === 4 ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {['Đã đặt hàng', 'Đã xác nhận', 'Đang giao hàng', 'Đã giao hàng'][order.status] ?? (order.status === 4 ? 'Đã hủy' : 'Đang xử lý')}
                </span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 space-y-6">
                {order.items.map((item, i) => (
                  <div key={i} className="flex gap-4 items-center">
                    <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-brand-black text-base truncate">{item.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">{item.color} | {item.storage}</p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-sm font-medium">x{item.qty}</span>
                        <span className="font-bold text-brand-black text-lg">{formatPrice(item.price)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:w-[420px] bg-gray-50 rounded-2xl p-6 flex flex-col justify-between shrink-0">
                <div className="space-y-4 text-sm font-medium text-gray-600 mb-6">
                  <div className="flex justify-between gap-4">
                    <span className="shrink-0">Người nhận:</span>
                    <span className="text-brand-black text-base font-semibold text-right">{order.customerName}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="shrink-0">Thanh toán:</span>
                    <span className="text-brand-black text-base font-semibold text-right">{order.paymentMethod}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-4 mt-4 items-center gap-4">
                    <span className="font-bold text-brand-black text-base shrink-0">Tổng tiền:</span>
                    <span className="font-extrabold text-primary text-2xl text-right">{formatPrice(order.totalPrice)}</span>
                  </div>
                </div>
                
                <div className="relative pt-6 border-t border-gray-200 mt-2">
                   {/* Background Line */}
                   <div className="absolute top-[40px] left-[16px] right-[16px] h-1 bg-gray-200 z-0 rounded-full overflow-hidden">
                     <motion.div
                       initial={{ width: 0 }}
                       animate={{ width: `${(Math.min(order.status === 4 ? 0 : order.status, 3) / 3) * 100}%` }}
                       transition={{ duration: 1, ease: 'easeOut' }}
                       className={`h-full progress-stripes ${order.status === 4 ? 'bg-red-500' : 'bg-green-500'}`}
                     />
                   </div>
                   
                   <div className="flex justify-between relative z-10">
                      {timelineSteps.map((step, sIdx) => {
                        const isCanceled = order.status === 4;
                        const isCompleted = sIdx <= (isCanceled ? 0 : order.status);
                        const isCanceledStep = isCanceled && sIdx === 0;
                        
                        let circleClass = 'bg-white text-gray-300 border-gray-200';
                        if (isCanceledStep) {
                          circleClass = 'bg-red-500 text-white border-red-100 shadow-[0_0_10px_rgba(239,68,68,0.4)]';
                        } else if (isCompleted) {
                          circleClass = 'bg-green-500 text-white border-green-100 shadow-[0_0_10px_rgba(34,197,94,0.4)]';
                        }

                        return (
                          <div key={sIdx} className="flex flex-col items-center text-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors duration-500 relative ${circleClass}`}>
                              {step.icon}
                            </div>
                            <span className={`text-xs font-bold max-w-[60px] leading-tight ${isCanceledStep ? 'text-red-500' : isCompleted ? 'text-brand-black' : 'text-gray-400'}`}>
                              {isCanceledStep ? 'Đã hủy' : step.title}
                            </span>
                          </div>
                        );
                      })}
                   </div>
                </div>

                {order.status <= 1 && (
                  <div className="mt-6">
                    <button onClick={() => handleCancelOrder(order.id)} className="w-full text-white bg-red-500 hover:bg-red-600 font-bold py-3 rounded-xl transition-colors shadow-sm">
                      Hủy đơn hàng
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {cancelTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative"
            >
              <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-yellow-50 border-[6px] border-yellow-100/50 mb-6">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="https://img.icons8.com/color/96/error--v1.png" alt="Warning" className="h-14 w-14 object-contain" />
              </div>
              <h3 className="text-xl font-bold text-brand-black mb-2 text-center">Xác nhận hủy đơn</h3>
              <p className="text-gray-600 mb-8 text-center text-sm">
                Bạn có chắc chắn muốn hủy đơn hàng #{cancelTarget} không? Thao tác này không thể hoàn tác.
                {orders.find(o => o.id === cancelTarget)?.status === 1 && (
                  <span className="block mt-2 font-semibold text-red-500">
                    Đơn hàng này đã thanh toán. Tiền sẽ được hoàn lại vào tài khoản của bạn ngay lập tức.
                  </span>
                )}
              </p>
              <div className="flex gap-4">
                <button 
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 py-3 font-bold rounded-xl bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors text-sm"
                >
                  Đóng
                </button>
                <button 
                  onClick={() => confirmCancelOrder(cancelTarget)}
                  className="flex-1 py-3 font-bold rounded-xl bg-red-500 text-white hover:bg-red-600 transition-colors shadow-lg shadow-red-500/30 text-sm"
                >
                  Xác nhận hủy
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabOffers() {
  const [selectedVoucher, setSelectedVoucher] = useState<any>(null);

  const vouchers = [
    { code: 'PULSEWELCOME', discount: 'Giảm 50K', desc: 'Cho đơn hàng đầu tiên từ 500K', details: 'Áp dụng cho tất cả sản phẩm. Hạn sử dụng: 30/12/2026. Mỗi tài khoản chỉ được sử dụng 1 lần.' },
    { code: 'FREESHIP100', discount: 'Freeship', desc: 'Miễn phí vận chuyển toàn quốc', details: 'Áp dụng cho đơn hàng từ 1.000.000đ trở lên. Không áp dụng cùng ưu đãi nội bộ.' },
    { code: 'SMEMBERVIP', discount: 'Giảm 5%', desc: 'Đặc quyền cho khách hàng P-MEMBER', details: 'Giảm 5% tối đa 500K cho khách hàng hạng P-MEMBER. Áp dụng cho các dòng điện thoại, laptop.' },
  ];
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Ưu đãi của bạn</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {vouchers.map((v, i) => (
          <div key={i} className="h-full cursor-pointer" onClick={() => setSelectedVoucher(v)}>
            <BackgroundGradient className="p-5 flex flex-col justify-between relative overflow-hidden h-full text-white shadow-md">
              <div className="absolute top-0 right-0 h-24 w-24 bg-white/10 rounded-bl-full z-0 blur-xl"></div>
              <div className="relative z-10 flex flex-col h-full">
                <div>
                  <span className="inline-block rounded bg-white/20 backdrop-blur-md px-2 py-1 text-xs font-bold text-white shadow-sm">{v.discount}</span>
                  <h3 className="mt-3 font-bold text-white text-lg">{v.code}</h3>
                  <p className="mt-2 text-xs text-white/90 flex-1">{v.desc}</p>
                </div>
                <button className="mt-5 w-full rounded-xl border border-white/40 bg-white/10 backdrop-blur-md py-2.5 text-xs font-bold text-white transition-colors hover:bg-white hover:text-primary">Xem chi tiết</button>
              </div>
            </BackgroundGradient>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedVoucher && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl relative"
            >
              <button onClick={() => setSelectedVoucher(null)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-xl">&times;</button>
              <div className="text-center">
                <span className="inline-block rounded-full bg-red-100 px-4 py-2 text-sm font-bold text-primary mb-3">{selectedVoucher.discount}</span>
                <h3 className="text-2xl font-extrabold text-brand-black">{selectedVoucher.code}</h3>
                <p className="mt-2 text-sm font-medium text-gray-600">{selectedVoucher.desc}</p>
              </div>
              <div className="mt-6 rounded-2xl bg-gray-50 p-4 border border-gray-100">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Điều kiện áp dụng</h4>
                <p className="text-sm text-brand-black leading-relaxed">{selectedVoucher.details}</p>
              </div>
              <button onClick={() => setSelectedVoucher(null)} className="mt-6 w-full rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Đóng</button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function TabAddress({ user }: { user: any }) {
  const [modalType, setModalType] = useState<'add' | 'edit' | null>(null);

  const AddressModal = () => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl relative"
      >
        <button onClick={() => setModalType(null)} className="absolute top-5 right-6 text-gray-400 hover:text-red-500 font-bold text-2xl">&times;</button>
        <h3 className="text-xl font-bold text-brand-black mb-6">{modalType === 'add' ? 'Thêm địa chỉ mới' : 'Sửa địa chỉ'}</h3>

        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalType(null); }}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Họ và tên</label>
              <input type="text" defaultValue={modalType === 'edit' ? user.name : ''} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-brand-black outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-500">Số điện thoại</label>
              <input type="text" defaultValue={modalType === 'edit' ? '0987654321' : ''} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-brand-black outline-none focus:border-primary focus:bg-white transition-colors" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-gray-500">Địa chỉ cụ thể</label>
            <input type="text" defaultValue={modalType === 'edit' ? '123 Đường Công Nghệ, Phường Phần Mềm, Quận Web, TP.HCM' : ''} required className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm text-brand-black outline-none focus:border-primary focus:bg-white transition-colors" />
          </div>
          <div className="pt-4 flex gap-3">
            <button type="button" onClick={() => setModalType(null)} className="flex-1 rounded-xl bg-gray-100 py-3.5 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-200">Hủy bỏ</button>
            <button type="submit" className="flex-1 rounded-xl bg-primary py-3.5 text-sm font-bold text-white transition-colors hover:bg-primary-dark">Lưu địa chỉ</button>
          </div>
        </form>
      </motion.div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-brand-black uppercase tracking-wide">Sổ địa chỉ</h2>
        <button onClick={() => setModalType('add')} className="rounded-xl bg-gray-100 px-4 py-2.5 text-xs font-bold text-brand-black transition-colors hover:bg-gray-200">Thêm địa chỉ mới</button>
      </div>
      <div className="rounded-2xl border border-primary bg-red-50/30 p-5 shadow-sm relative overflow-hidden">
        <div className="absolute right-0 top-0 h-16 w-16 bg-red-100 rounded-bl-full z-0"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-brand-black">{user.name}</h3>
              <span className="rounded bg-primary px-2 py-0.5 text-[10px] font-bold text-white uppercase tracking-wider">Mặc định</span>
            </div>
            <button onClick={() => setModalType('edit')} className="text-sm font-semibold text-primary hover:underline">Sửa</button>
          </div>
          <p className="mt-2 text-sm text-gray-600">0987654321</p>
          <p className="mt-1 text-sm text-gray-600">123 Đường Công Nghệ, Phường Phần Mềm, Quận Web, TP.HCM</p>
        </div>
      </div>

      <AnimatePresence>
        {modalType && <AddressModal />}
      </AnimatePresence>
    </div>
  );
}