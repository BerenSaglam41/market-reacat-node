#!/bin/bash

# 🔒 Market App Hızlı Güvenlik Düzeltmeleri
echo "🔒 Market App Güvenlik Düzeltmeleri Başlatılıyor..."

PROJECT_DIR="C:\Users\hp\Desktop\market-reacat-node"
cd "$PROJECT_DIR"

echo "1️⃣ Backend güvenlik paketlerini yüklüyoruz..."
cd market-backend
npm install helmet express-rate-limit express-mongo-sanitize validator compression --save
echo "✅ Güvenlik paketleri yüklendi"

echo "2️⃣ Git cache temizleniyor..."
cd ..
git rm -r --cached . 2>/dev/null || true
git add .
git commit -m "🔒 Security: Remove sensitive files, add security middleware, fix login toasts"
echo "✅ Git cache temizlendi"

echo "3️⃣ Dosya yedekleri oluşturuluyor..."
cp market-backend/.env market-backend/.env.backup-$(date +%Y%m%d-%H%M%S)
echo "✅ .env dosyası yedeklendi"

echo ""
echo "🎉 Otomatik düzeltmeler tamamlandı!"
echo ""
echo "📋 MANUEL OLARAK YAPILMASI GEREKENLER:"
echo ""
echo "1. 🔑 MongoDB Şifresi Değiştir:"
echo "   - https://cloud.mongodb.com/ → Database Access"
echo "   - 'mustafa' kullanıcısının şifresini değiştir"
echo "   - market-backend/.env dosyasını güncelle"
echo ""
echo "2. 🚀 Railway Environment Variables:"
echo "   - Railway dashboard → Variables"
echo "   - MONGODB_URL (yeni şifre ile)"
echo "   - JSON_KEY (yeni güçlü secret)"
echo ""
echo "3. ☁️ Vercel Environment Variables:"
echo "   - Vercel dashboard → Settings → Environment Variables"
echo "   - VITE_API_BASE_URL kontrolü"
echo ""
echo "4. 🧪 Test Et:"
echo "   - Login/Register fonksiyonları"
echo "   - Toast mesajları"
echo "   - API bağlantıları"
echo ""
echo "📖 Detaylı rehber: security-updates/GUVENLİK-TALİMATLARI.md"

# Son kontrol
echo ""
echo "🔍 SON KONTROL:"
if [ -f "market-backend/.env" ]; then
    if grep -q "IG8Q1gxjAiywvTyW" market-backend/.env; then
        echo "❌ UYARI: Eski MongoDB şifresi hala .env'de!"
    else
        echo "✅ .env dosyası güncellendi"
    fi
fi

if [ -f ".gitignore" ]; then
    if grep -q ".env" .gitignore; then
        echo "✅ .gitignore .env dosyasını koruyor"
    else
        echo "❌ UYARI: .gitignore .env'i korumuyor!"
    fi
fi

echo ""
echo "🔐 Güvenlik durumu kontrol edildi!"
echo "Şimdi MongoDB şifresini değiştir ve deploy et!"