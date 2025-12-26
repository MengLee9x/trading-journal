# Trade Journal App

Ứng dụng Trade Journal đơn giản để ghi lại và review các lệnh trade của bạn.

## Tính năng

- ✅ Ghi lại các lệnh trade (Mua/Bán)
- ✅ Lưu ngày thực hiện lệnh
- ✅ Upload và lưu ảnh market (lưu trữ local)
- ✅ Ghi chú lý do vào lệnh
- ✅ Xem lại danh sách tất cả trades
- ✅ Xóa trades
- ✅ Dữ liệu được lưu hoàn toàn trên máy local (localStorage)

## Cài đặt

```bash
npm install
```

## Chạy ứng dụng

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5173`

## Build cho production

```bash
npm run build
```

## Cấu trúc dự án

```
trade-journal/
├── src/
│   ├── components/
│   │   ├── TradeForm.jsx      # Form thêm trade mới
│   │   ├── TradeForm.css
│   │   ├── TradeList.jsx      # Danh sách trades
│   │   └── TradeList.css
│   ├── App.jsx                # Component chính
│   ├── App.css
│   ├── main.jsx               # Entry point
│   └── index.css              # Global styles
├── index.html
├── package.json
└── vite.config.js
```

## Lưu ý

- Tất cả dữ liệu (trades và ảnh) được lưu trong localStorage của trình duyệt
- Ảnh được lưu dưới dạng base64
- Kích thước ảnh tối đa: 5MB
- Dữ liệu sẽ bị xóa nếu bạn xóa cache trình duyệt

## Mở rộng trong tương lai

Có thể thêm các field sau:
- Giá vào lệnh
- Giá ra lệnh
- Số lượng
- Lợi nhuận/Thua lỗ
- Tags/Categories
- Tìm kiếm và lọc trades
- Export dữ liệu
