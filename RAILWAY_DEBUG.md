# Railway Backend Deployment Kontrol

## 1. Railway Dashboard Kontrol:
- https://railway.app/dashboard
- market-reacat-node-production projesini açın
- Logs sekmesinde error var mı kontrol edin
- Deploy edilmiş mi kontrol edin

## 2. Backend URL Test:
```bash
# Manual test
curl https://market-reacat-node-production.up.railway.app
curl https://market-reacat-node-production.up.railway.app/health
```

## 3. Eğer Railway Backend Down İse:
```bash
# Backend'i yeniden deploy edin
cd market-backend
git add .
git commit -m "Fix backend deployment"
git push origin main
```

## 4. Backend Environment Variables:
Railway'de şu environment variables'ların tanımlı olduğundan emin olun:
- NODE_ENV=production
- MONGODB_URI=mongodb://...
- PORT=5000

## 5. Frontend Environment Update:
Eğer Railway backend URL'si değiştiyse:
```bash
# .env dosyasını güncelleyin
VITE_API_BASE_URL=https://your-new-backend-url.railway.app
```

## 6. CORS Problemi Olabilir:
Backend'te CORS allowed origins'a yeni domain ekleyin