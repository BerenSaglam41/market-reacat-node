#!/bin/bash

# MongoDB şifresini hemen değiştir!
# 1. MongoDB Atlas'a git
# 2. Database Access -> Users -> mustafa kullanıcısının şifresini değiştir
# 3. Yeni şifreyi env dosyasına yaz

# Git history'den hassas dosyaları temizle
echo "🧹 Git history'den .env dosyalarını temizliyoruz..."

# .env dosyasını git history'den tamamen kaldır
git filter-branch --force --index-filter \
  'git rm --cached --ignore-unmatch market-backend/.env' \
  --prune-empty --tag-name-filter cat -- --all

# Tüm remote tracking bilgilerini zorla güncelle
git push origin --force --all
git push origin --force --tags

# Local cache'i temizle
git for-each-ref --format='delete %(refname)' refs/original | git update-ref --stdin
git reflog expire --expire=now --all
git gc --prune=now

echo "✅ Git history temizlendi!"
echo "⚠️ MongoDB şifresini MongoDB Atlas'tan değiştirmeyi unutma!"