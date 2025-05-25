# MongoDB Atlas bağlantı sorunu çözümü

## Railway Environment Variables'ı güncelleyin:

**Eski:**
MONGODB_URL = mongodb+srv://mustafa:IG8Q1gxjAiywvTyW@marketbackend.e4xp7io.mongodb.net/

**Yeni (SSL parametreli):**
MONGODB_URL = mongodb+srv://mustafa:IG8Q1gxjAiywvTyW@marketbackend.e4xp7io.mongodb.net/?retryWrites=true&w=majority&ssl=true

## Veya:
MONGODB_URL = mongodb+srv://mustafa:IG8Q1gxjAiywvTyW@marketbackend.e4xp7io.mongodb.net/market?retryWrites=true&w=majority