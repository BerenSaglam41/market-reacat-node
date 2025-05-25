# Railway deployment için gerekli dosyalar

## 1. Railway CLI kurulumu (Terminal'de çalıştır):
npm install -g @railway/cli

## 2. Backend klasörüne git:
cd market-backend

## 3. Railway'e login ol:
railway login

## 4. Proje oluştur:
railway init

## 5. Environment variables ekle:
railway variables set MONGODB_URL="mongodb+srv://mustafa:IG8Q1gxjAiywvTyW@marketbackend.e4xp7io.mongodb.net/"
railway variables set JSON_KEY="cokgizli123"
railway variables set NODE_ENV="production"

## 6. Deploy et:
railway up