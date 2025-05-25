# Ayrı Backend Repo Oluşturma

## GitHub'da yeni repo oluştur:
1. GitHub → "New repository" 
2. Repo adı: "market-backend"
3. Public olarak oluştur

## Terminal'de:
cd market-backend

# Git init
git init
git add .
git commit -m "Initial backend commit"

# Remote ekle (GitHub'daki yeni repo URL'i)
git remote add origin https://github.com/KULLANICI_ADIN/market-backend.git
git branch -M main
git push -u origin main

## Railway'de:
1. Bu yeni "market-backend" reposunu seç
2. Root directory sorunsuz algılanacak