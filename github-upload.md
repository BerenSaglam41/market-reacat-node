# GitHub'a Yükleme Adımları

## Terminal açın ve proje klasörüne gidin:
cd "C:\Users\hp\Desktop\market-reacat-node"

## Git başlatın (eğer başlatılmamışsa):
git init

## Dosyaları ekleyin:
git add .

## Commit yapın:
git commit -m "Initial commit for deployment"

## GitHub'da yeni bir repo oluşturun:
# 1. github.com'a gidin
# 2. "New repository" tıklayın  
# 3. Repository name: "market-react-node"
# 4. Public/Private seçin
# 5. "Create repository" tıklayın

## Remote ekleyin (GitHub'dan kopyalanan link):
git remote add origin https://github.com/KULLANICI_ADINIZ/market-react-node.git

## Ana branch adını main yapın:
git branch -M main

## GitHub'a yükleyin:
git push -u origin main