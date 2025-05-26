#!/bin/bash

echo "🔒 Market App Güvenlik Güncellemeleri Başlatılıyor..."

# Proje ana dizinine git
cd "C:\Users\hp\Desktop\market-reacat-node"

echo "📁 Güvenlik dosyalarını kopyalıyoruz..."

# Backend güvenlik güncellemeleri
echo "🔧 Backend dosyaları güncelleniyor..."

# .env dosyasını yedekle ve güncelle
cp market-backend/.env market-backend/.env.backup
echo "✅ .env dosyası yedeklendi"

# .gitignore'u güncelle
cp security-updates/.gitignore-secure .gitignore
cp security-updates/.gitignore-secure market-backend/.gitignore
cp security-updates/.gitignore-secure market-front/.gitignore
echo "✅ .gitignore dosyaları güncellendi"

# accountSlice'ı güncelle
cp security-updates/accountSlice-fixed.js market-front/src/pages/account/accountSlice.js
echo "✅ Login toast'ı düzeltildi"

echo "📦 Güvenlik paketleri yükleniyor..."

# Backend'e güvenlik paketlerini ekle
cd market-backend
npm install helmet express-rate-limit express-mongo-sanitize validator compression
echo "✅ Backend güvenlik paketleri yüklendi"

# Frontend'e geri dön
cd ../market-front

echo "🧹 Git cache temizleniyor..."
cd ..
git rm -r --cached .
git add .
git commit -m "🔒 Security update: Remove sensitive files and add security features"

echo "🚀 Güvenlik güncellemeleri tamamlandı!"
echo ""
echo "📋 SONRAKI ADIMLAR:"
echo "1. MongoDB şifresini değiştir"
echo "2. JWT secret'ı güncelle" 
echo "3. Railway environment variables'ları güncelle"
echo "4. Vercel environment variables'ları güncelle"
echo "5. Yeni kodu deploy et"
echo ""
echo "📖 Detaylı talimatlar için: security-updates/GUVENLİK-TALİMATLARI.md"