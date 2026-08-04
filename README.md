# PulseTech Frontend

> Giao diện người dùng cho nền tảng thương mại điện tử **PulseTech** — xây dựng với **Next.js 16**, **React 19** và **TypeScript**.

🌐 **Live:** https://pulse-tech-beryl.vercel.app

---

## Mục lục

- [Tổng quan](#tổng-quan)
- [Tech Stack](#tech-stack)
- [Cấu trúc project](#cấu-trúc-project)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy local](#cài-đặt-và-chạy-local)
- [Biến môi trường](#biến-môi-trường)
- [Các trang (Routes)](#các-trang-routes)
- [Deploy lên Vercel](#deploy-lên-vercel)

---

## Tổng quan

PulseTech Frontend là một ứng dụng **Next.js App Router** với đầy đủ tính năng của một trang thương mại điện tử hiện đại:

- 🛍️ Duyệt và tìm kiếm sản phẩm công nghệ
- 🛒 Giỏ hàng và thanh toán trực tuyến
- 🔐 Đăng ký / đăng nhập với xác thực email
- ❤️ Danh sách yêu thích (Wishlist)
- 📦 Tra cứu và theo dõi đơn hàng
- 👤 Quản lý hồ sơ và sổ địa chỉ
- 📱 Giao diện responsive, hỗ trợ mobile đầy đủ

Mọi request API đều được proxy qua đường dẫn `/backend-api/*` đến **API Gateway** của backend, giúp ẩn hoàn toàn địa chỉ service thực sự khỏi client.

---

## Tech Stack

| Thành phần       | Công nghệ                                     |
|------------------|-----------------------------------------------|
| Framework        | Next.js 16 (App Router)                       |
| UI Library       | React 19                                      |
| Ngôn ngữ         | TypeScript 5                                  |
| Styling          | Tailwind CSS v4                               |
| Components       | shadcn/ui + Radix UI                          |
| Animations       | Framer Motion                                 |
| Icons            | Lucide React + React Icons                    |
| Notifications    | Sonner (toast)                                |
| QR Code          | react-qr-code                                 |
| Linting          | ESLint (eslint-config-next)                   |
| Cloud Deploy     | Vercel                                        |

---

## Cấu trúc project

```
frontend/
├── src/
│   ├── app/                  # App Router — các trang (route segments)
│   │   ├── page.tsx          # Trang chủ
│   │   ├── layout.tsx        # Root layout
│   │   ├── login/            # Trang đăng nhập
│   │   ├── register/         # Trang đăng ký
│   │   ├── verify-email/     # Xác thực email qua link
│   │   ├── products/         # Danh sách & chi tiết sản phẩm
│   │   ├── cart/             # Giỏ hàng
│   │   ├── checkout/         # Thanh toán
│   │   ├── orders/           # Lịch sử đơn hàng
│   │   ├── order-tracking/   # Tra cứu đơn hàng
│   │   ├── wishlist/         # Danh sách yêu thích
│   │   ├── profile/          # Hồ sơ người dùng
│   │   ├── blog/             # Bài viết / tin tức
│   │   ├── stores/           # Hệ thống cửa hàng
│   │   ├── trade-in/         # Thu cũ đổi mới
│   │   └── policies/         # Chính sách
│   ├── components/           # Reusable UI components
│   ├── context/              # React Context (Auth, Cart, v.v.)
│   ├── hooks/                # Custom hooks
│   ├── lib/                  # API client, utilities
│   ├── types/                # TypeScript type definitions
│   └── config/               # Cấu hình ứng dụng
├── public/                   # Static assets (images, fonts)
├── next.config.ts            # Next.js config + API proxy rewrites
├── package.json
├── tsconfig.json
├── Dockerfile
└── .env.example
```

---

## Yêu cầu hệ thống

- **Node.js** ≥ 20
- **npm** ≥ 10 *(hoặc yarn, pnpm, bun)*
- Backend PulseTech đang chạy (local hoặc trên Render)

---

## Cài đặt và chạy local

### 1. Clone project

```bash
git clone https://github.com/VuIceTea/PulseTech.git
cd PulseTech
```

### 2. Cài đặt dependencies

```bash
npm install
```

### 3. Cấu hình biến môi trường

```bash
cp .env.example .env
```

Nội dung `.env`:

```env
# URL của API Gateway backend (local hoặc Render)
API_URL=http://localhost:8080
```

> Khi chạy local với Docker Compose từ thư mục `backend/`, biến `API_URL` sẽ được truyền tự động — không cần cấu hình thêm.

### 4. Khởi động development server

```bash
npm run dev
```

Truy cập tại: **http://localhost:3000**

### Các lệnh khác

| Lệnh              | Mô tả                              |
|-------------------|------------------------------------|
| `npm run dev`     | Chạy development server            |
| `npm run build`   | Build production                   |
| `npm run start`   | Chạy production build              |
| `npm run lint`    | Kiểm tra linting                   |

---

## Biến môi trường

| Biến      | Bắt buộc | Mặc định               | Mô tả                                             |
|-----------|----------|------------------------|---------------------------------------------------|
| `API_URL` | ✅        | `http://localhost:8080` | URL của API Gateway backend                       |

> **Cách hoạt động:** `next.config.ts` tự động tạo proxy rule:
> `GET /backend-api/<path>` → `${API_URL}/api/<path>`
>
> Nhờ đó, mọi request từ frontend chỉ cần gọi `/backend-api/...` mà không cần biết địa chỉ thực của backend.

---

## Các trang (Routes)

| Route               | Mô tả                              | Auth cần thiết |
|---------------------|------------------------------------|----------------|
| `/`                 | Trang chủ                          | ❌              |
| `/products`         | Danh sách sản phẩm                 | ❌              |
| `/products/[id]`    | Chi tiết sản phẩm                  | ❌              |
| `/login`            | Đăng nhập                          | ❌              |
| `/register`         | Đăng ký tài khoản                  | ❌              |
| `/verify-email`     | Xác thực email qua link            | ❌              |
| `/cart`             | Giỏ hàng                           | ❌              |
| `/checkout`         | Thanh toán                         | ❌              |
| `/order-tracking`   | Tra cứu đơn hàng                   | ❌              |
| `/orders`           | Lịch sử đơn hàng                   | ✅              |
| `/wishlist`         | Danh sách yêu thích                | ✅              |
| `/profile`          | Hồ sơ người dùng                   | ✅              |
| `/blog`             | Bài viết / tin tức                 | ❌              |
| `/stores`           | Hệ thống cửa hàng                  | ❌              |
| `/trade-in`         | Thu cũ đổi mới                     | ❌              |
| `/policies`         | Chính sách mua hàng                | ❌              |

---

## Deploy lên Vercel

### Cách 1: Vercel Dashboard (khuyến nghị)

1. Push code lên GitHub.
2. Vào [vercel.com](https://vercel.com) → **Add New Project** → chọn repository.
3. Vercel tự nhận Next.js — không cần cấu hình build.
4. Thêm **Environment Variable:**
   ```
   API_URL = https://<your-api-gateway>.onrender.com
   ```
5. Nhấn **Deploy**.

### Cách 2: Vercel CLI

```bash
npm install -g vercel
vercel --prod
```

### Sau khi deploy

- Mỗi khi push code lên nhánh `main`, Vercel tự động **rebuild và deploy** phiên bản mới.
- Kiểm tra trạng thái deploy tại tab **Deployments** trên Vercel Dashboard.
- Nếu thay đổi biến môi trường, cần bấm **Redeploy** (bỏ chọn "Use existing Build Cache") để áp dụng.

---

## Lưu ý phát triển

- **Nhánh chính:** `main` (deploy tự động lên Vercel)
- **Nhánh phát triển:** `VuDev` (merge vào `main` sau khi hoàn thành)
- Không commit thông tin nhạy cảm — file `.env` đã có trong `.gitignore`.
