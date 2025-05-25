# Market React Node - E-Commerce Platform

📱 **Live Demo**: https://market-reacat-node.vercel.app/  
🔧 **Backend API**: https://market-reacat-node-production.up.railway.app/

Modern full-stack e-commerce uygulaması. React + Node.js + MongoDB ile geliştirilmiştir.

## Son Güncellemeler ✨

### 🔐 Logout Güvenlik Sistemi - TAMAMEN DÜZELTİLDİ
- ✅ **Tüm localStorage temizleniyor** (user, cart, orders, addresses, payment vb.)
- ✅ **SessionStorage tamamen temizleniyor**
- ✅ **Cookies temizleniyor** (auth, session tokens)
- ✅ **Redux store sıfırlanıyor** (account, cart, orders)
- ✅ **Pattern-based cleanup** (user*, order*, cart* vb. tüm ilgili veriler)
- ✅ **OrderPage component cleanup** (logout'ta sipariş bilgileri otomatik temizleniyor)

### 🏠 HomePage Erişim Sorunu - ÇÖZÜLDİ
- ✅ **Guest kullanıcılar anasayfaya erişebilir**
- ✅ **Otomatik login yönlendirmesi kaldırıldı**
- ✅ **API hatalarından bağımsız çalışır**
- ✅ **Vercel SPA routing optimize edildi**

### 🛡️ Güvenlik ve UX İyileştirmeleri
- ✅ **Role-based access control** (Guest/User/Admin)
- ✅ **Smart error handling** (gereksiz toast'lar kaldırıldı)
- ✅ **ProductCard login kontrolü** (guest'ler "Giriş Yap" butonu görür)
- ✅ **Graceful API error recovery**
- ✅ **Complete data isolation** (kullanıcılar arası veri karışması yok)

## Özellikler 🛍️

- **👥 User Management**: Kayıt/Giriş, Profile, Addresses
- **🛒 Shopping**: Products, Cart, Checkout, Orders
- **🔧 Admin Panel**: Product/User/Order Management
- **📱 Responsive Design**: Mobile-first approach
- **🔐 Security**: JWT auth, data encryption, complete logout

## Teknoloji Stack 🛠️

**Frontend**: React 19, Vite, Redux Toolkit, Material-UI, React Router v7  
**Backend**: Node.js, Express, MongoDB, JWT, bcrypt  
**Deployment**: Vercel (Frontend) + Railway (Backend)

## Test Kullanıcıları 👤

Sistemi test etmek için:
- **Admin**: `admin/admin123`
- **User**: `user/user123`
- **Guest**: Kayıt olmadan da test edebilirsiniz

---

⭐ **Modern e-commerce solution with complete security!** ⭐