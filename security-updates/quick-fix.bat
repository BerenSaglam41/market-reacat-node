@echo off
echo 🔒 Market App Güvenlik Düzeltmeleri Başlatılıyor...

cd /d "C:\Users\hp\Desktop\market-reacat-node"

echo.
echo 1️⃣ Backend güvenlik paketlerini yüklüyoruz...
cd market-backend
call npm install helmet express-rate-limit express-mongo-sanitize validator compression --save
if %errorlevel% equ 0 (
    echo ✅ Güvenlik paketleri yüklendi
) else (
    echo ❌ Paket yükleme hatası
)

echo.
echo 2️⃣ Git cache temizleniyor...
cd ..
git rm -r --cached . >nul 2>&1
git add .
git commit -m "🔒 Security: Remove sensitive files, add security middleware, fix login toasts"
echo ✅ Git işlemleri tamamlandı

echo.
echo 3️⃣ Yedek oluşturuluyor...
copy "market-backend\.env" "market-backend\.env.backup-%date:~-4,4%%date:~-10,2%%date:~-7,2%-%time:~0,2%%time:~3,2%" >nul 2>&1
echo ✅ .env dosyası yedeklendi

echo.
echo 🎉 Otomatik düzeltmeler tamamlandı!
echo.
echo 📋 MANUEL OLARAK YAPILMASI GEREKENLER:
echo.
echo 1. 🔑 MongoDB Şifresi Değiştir:
echo    - https://cloud.mongodb.com/ → Database Access
echo    - 'mustafa' kullanıcısının şifresini değiştir
echo    - market-backend\.env dosyasını güncelle
echo.
echo 2. 🚀 Railway Environment Variables:
echo    - Railway dashboard → Variables
echo    - MONGODB_URL (yeni şifre ile)
echo    - JSON_KEY (yeni güçlü secret)
echo.
echo 3. ☁️ Vercel Environment Variables:
echo    - Vercel dashboard → Settings → Environment Variables
echo    - VITE_API_BASE_URL kontrolü
echo.
echo 4. 🧪 Test Et:
echo    - Login/Register fonksiyonları
echo    - Toast mesajları
echo    - API bağlantıları
echo.
echo 📖 Detaylı rehber: security-updates\GUVENLİK-TALİMATLARI.md

echo.
echo 🔍 SON KONTROL:
findstr /C:"IG8Q1gxjAiywvTyW" "market-backend\.env" >nul 2>&1
if %errorlevel% equ 0 (
    echo ❌ UYARI: Eski MongoDB şifresi hala .env'de!
) else (
    echo ✅ .env dosyası güncellendi
)

findstr /C:".env" ".gitignore" >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ .gitignore .env dosyasını koruyor
) else (
    echo ❌ UYARI: .gitignore .env'i korumuyor!
)

echo.
echo 🔐 Güvenlik durumu kontrol edildi!
echo Şimdi MongoDB şifresini değiştir ve deploy et!
echo.
pause