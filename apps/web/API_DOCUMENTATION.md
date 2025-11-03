# CodeXONX API Dokümantasyonu

Bu dokümantasyon, CodeXONX platformunun API'lerini detaylı olarak açıklar. Bu rehber, API'leri kendi uygulamalarınıza entegre etmek için ihtiyaç duyacağınız tüm bilgileri içerir.

## API Genel Bakış

CodeXONX API'si RESTful mimariye dayanır ve JSON formatında veri alışverişi yapar. Tüm API istekleri HTTPS üzerinden yapılmalıdır.

### Temel URL

```
https://api.codexonx.com/v1
```

### Kimlik Doğrulama

API, kimlik doğrulama için Bearer Token kullanır. Token, isteklerin `Authorization` başlığında belirtilmelidir:

```
Authorization: Bearer <API_TOKEN>
```

API token'ı, CodeXONX dashboard'unuzdaki "Ayarlar > API" bölümünden alabilirsiniz.

### Hata İşleme

API hataları standart HTTP durum kodları ve JSON formatında hata mesajlarıyla döner:

```json
{
  "error": {
    "code": "invalid_credentials",
    "message": "Geçersiz API anahtarı veya token"
  }
}
```

Yaygın HTTP durum kodları:

- **200 OK**: İstek başarılı
- **201 Created**: Kaynak başarıyla oluşturuldu
- **400 Bad Request**: Hatalı istek parametreleri
- **401 Unauthorized**: Geçersiz kimlik doğrulama
- **403 Forbidden**: Yetkisiz erişim
- **404 Not Found**: Kaynak bulunamadı
- **429 Too Many Requests**: Rate limit aşıldı
- **500 Internal Server Error**: Sunucu hatası

### Rate Limiting

API istekleri rate limiting'e tabidir. Limitler plan türünüze göre değişir:

| Plan     | Dakika Başına İstek | Günlük Limit |
|----------|---------------------|--------------|
| Ücretsiz | 60                  | 10,000       |
| Premium  | 300                 | 50,000       |
| Kurumsal | 1,000               | 200,000      |

Her yanıtta şu başlıklar bulunur:

```
X-Rate-Limit-Limit: 60
X-Rate-Limit-Remaining: 59
X-Rate-Limit-Reset: 1605583530
```

## API Kaynakları

### Kimlik Doğrulama

#### Giriş

```http
POST /auth/login
```

**Parametreler**

| Ad       | Tür    | Açıklama                  | Gerekli |
|----------|--------|----------------------------|---------|
| email    | string | Kullanıcı e-posta adresi  | Evet    |
| password | string | Kullanıcı şifresi         | Evet    |

**Yanıt**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "user_1234",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Kayıt Olma

```http
POST /auth/register
```

**Parametreler**

| Ad       | Tür    | Açıklama                  | Gerekli |
|----------|--------|----------------------------|---------|
| name     | string | Kullanıcı adı             | Evet    |
| email    | string | Kullanıcı e-posta adresi  | Evet    |
| password | string | Kullanıcı şifresi         | Evet    |

**Yanıt**

```json
{
  "user": {
    "id": "user_1234",
    "name": "John Doe",
    "email": "john@example.com"
  }
}
```

#### Mevcut Kullanıcı Bilgileri

```http
GET /auth/me
```

**Yanıt**

```json
{
  "user": {
    "id": "user_1234",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "created_at": "2023-01-15T14:30:00Z"
  }
}
```

### Projeler

#### Tüm Projeleri Listeleme

```http
GET /projects
```

**Sorgu Parametreleri**

| Ad     | Tür    | Açıklama                    | Varsayılan |
|--------|--------|-----------------------------|------------|
| page   | number | Sayfa numarası              | 1          |
| limit  | number | Sayfa başına öğe sayısı     | 20         |
| search | string | Arama terimi                | -          |
| sort   | string | Sıralama (name, created_at) | created_at |

**Yanıt**

```json
{
  "projects": [
    {
      "id": "proj_123",
      "name": "Web App Backend",
      "description": "Node.js API backend",
      "language": "javascript",
      "created_at": "2023-02-10T08:15:30Z",
      "updated_at": "2023-02-15T14:22:45Z"
    },
    {
      "id": "proj_124",
      "name": "Mobile App",
      "description": "React Native mobile application",
      "language": "typescript",
      "created_at": "2023-01-05T10:20:15Z",
      "updated_at": "2023-01-25T16:30:20Z"
    }
  ],
  "pagination": {
    "total": 45,
    "page": 1,
    "limit": 20,
    "pages": 3
  }
}
```

#### Belirli Bir Projeyi Getirme

```http
GET /projects/{id}
```

**Yanıt**

```json
{
  "id": "proj_123",
  "name": "Web App Backend",
  "description": "Node.js API backend",
  "language": "javascript",
  "created_at": "2023-02-10T08:15:30Z",
  "updated_at": "2023-02-15T14:22:45Z",
  "files": [
    {
      "id": "file_1",
      "name": "index.js",
      "path": "/index.js",
      "type": "file",
      "size": 2048
    },
    {
      "id": "file_2",
      "name": "src",
      "path": "/src",
      "type": "directory"
    }
  ]
}
```

#### Yeni Proje Oluşturma

```http
POST /projects
```

**Parametreler**

| Ad          | Tür    | Açıklama                          | Gerekli |
|-------------|--------|-----------------------------------|---------|
| name        | string | Proje adı                         | Evet    |
| description | string | Proje açıklaması                  | Hayır   |
| language    | string | Ana programlama dili              | Evet    |
| template_id | string | Başlangıç şablonu kimliği         | Hayır   |

**Yanıt**

```json
{
  "id": "proj_125",
  "name": "New Project",
  "description": "Project description",
  "language": "javascript",
  "created_at": "2023-03-20T09:45:12Z",
  "updated_at": "2023-03-20T09:45:12Z"
}
```

#### Projeyi Güncelleme

```http
PUT /projects/{id}
```

**Parametreler**

| Ad          | Tür    | Açıklama         | Gerekli |
|-------------|--------|------------------|---------|
| name        | string | Proje adı        | Hayır   |
| description | string | Proje açıklaması | Hayır   |

**Yanıt**

```json
{
  "id": "proj_123",
  "name": "Updated Project Name",
  "description": "Updated description",
  "language": "javascript",
  "created_at": "2023-02-10T08:15:30Z",
  "updated_at": "2023-03-22T11:30:45Z"
}
```

#### Projeyi Silme

```http
DELETE /projects/{id}
```

**Yanıt**

```json
{
  "success": true,
  "message": "Proje başarıyla silindi."
}
```

### Dosyalar

#### Dosya Listesi

```http
GET /projects/{id}/files
```

**Sorgu Parametreleri**

| Ad   | Tür    | Açıklama                     | Varsayılan |
|------|--------|-----------------------------|------------|
| path | string | Dosya yolu (örn. /src)      | /          |

**Yanıt**

```json
{
  "files": [
    {
      "id": "file_1",
      "name": "index.js",
      "path": "/index.js",
      "type": "file",
      "size": 2048,
      "updated_at": "2023-02-15T14:22:45Z"
    },
    {
      "id": "file_2",
      "name": "src",
      "path": "/src",
      "type": "directory"
    }
  ]
}
```

#### Dosya İçeriği Getirme

```http
GET /projects/{id}/files/content
```

**Sorgu Parametreleri**

| Ad   | Tür    | Açıklama                | Gerekli |
|------|--------|-------------------------|---------|
| path | string | Dosya yolu (örn. /src/index.js) | Evet    |

**Yanıt**

```json
{
  "content": "console.log('Hello World');",
  "encoding": "utf-8",
  "language": "javascript",
  "path": "/src/index.js",
  "updated_at": "2023-02-15T14:22:45Z"
}
```

#### Dosya İçeriği Güncelleme

```http
PUT /projects/{id}/files/content
```

**Parametreler**

| Ad      | Tür    | Açıklama                | Gerekli |
|---------|--------|-------------------------|---------|
| path    | string | Dosya yolu              | Evet    |
| content | string | Dosya içeriği           | Evet    |

**Yanıt**

```json
{
  "success": true,
  "path": "/src/index.js",
  "updated_at": "2023-03-22T15:45:30Z"
}
```

#### Dosya Oluşturma

```http
POST /projects/{id}/files
```

**Parametreler**

| Ad      | Tür    | Açıklama                | Gerekli |
|---------|--------|-------------------------|---------|
| path    | string | Dosya yolu              | Evet    |
| type    | string | "file" veya "directory" | Evet    |
| content | string | Dosya içeriği           | Hayır   |

**Yanıt**

```json
{
  "id": "file_10",
  "name": "newfile.js",
  "path": "/src/newfile.js",
  "type": "file",
  "created_at": "2023-03-25T10:20:15Z"
}
```

#### Dosya Silme

```http
DELETE /projects/{id}/files
```

**Parametreler**

| Ad   | Tür    | Açıklama                | Gerekli |
|------|--------|-------------------------|---------|
| path | string | Dosya yolu              | Evet    |

**Yanıt**

```json
{
  "success": true,
  "message": "Dosya başarıyla silindi."
}
```

### AI Servisler

#### Kod Tamamlama

```http
POST /ai/code/complete
```

**Parametreler**

| Ad       | Tür    | Açıklama                      | Gerekli |
|----------|--------|-------------------------------|---------|
| code     | string | Tamamlanacak kod              | Evet    |
| language | string | Programlama dili              | Evet    |
| max_tokens | number | Maksimum tamamlama uzunluğu | Hayır   |
| temperature | number | Üretkenlik (0.0-1.0)       | Hayır   |

**Yanıt**

```json
{
  "completion": "function helloWorld() {\n  return 'Hello World';\n}",
  "language": "javascript"
}
```

#### AI Chat

```http
POST /ai/chat
```

**Parametreler**

| Ad      | Tür    | Açıklama                      | Gerekli |
|---------|--------|-------------------------------|---------|
| message | string | Kullanıcı mesajı              | Evet    |
| context | object | İsteğe bağlı bağlam bilgisi   | Hayır   |

**Yanıt**

```json
{
  "reply": "Merhaba! Nasıl yardımcı olabilirim?",
  "conversationId": "conv_12345"
}
```

#### Kod Analizi

```http
POST /ai/code/analyze
```

**Parametreler**

| Ad       | Tür    | Açıklama                      | Gerekli |
|----------|--------|-------------------------------|---------|
| code     | string | Analiz edilecek kod           | Evet    |
| language | string | Programlama dili              | Evet    |

**Yanıt**

```json
{
  "analysis": {
    "summary": "Bu kod bir web sunucusu oluşturuyor ve API rotaları tanımlıyor.",
    "issues": [
      {
        "type": "security",
        "description": "SQL enjeksiyon riski tespit edildi.",
        "line": 24
      },
      {
        "type": "performance",
        "description": "Bu döngü optimize edilebilir.",
        "line": 42
      }
    ],
    "suggestions": [
      "Parametre doğrulaması ekleyin",
      "Async/await kullanımını düşünün"
    ]
  }
}
```

### Şablonlar

#### Şablonları Listeleme

```http
GET /templates
```

**Sorgu Parametreleri**

| Ad       | Tür    | Açıklama                    | Varsayılan |
|----------|--------|-----------------------------|------------|
| page     | number | Sayfa numarası              | 1          |
| limit    | number | Sayfa başına öğe sayısı     | 20         |
| category | string | Kategori filtresi           | -          |
| type     | string | Şablon türü (official, community) | -    |
| search   | string | Arama terimi                | -          |

**Yanıt**

```json
{
  "templates": [
    {
      "id": "tmpl_123",
      "name": "React Component Library",
      "description": "TypeScript ile modern React bileşen kitaplığı starter",
      "category": "frontend",
      "language": "typescript",
      "stars": 234,
      "forks": 78,
      "type": "community",
      "created_by": "user_456",
      "tags": ["react", "component-library", "typescript", "storybook"]
    },
    {
      "id": "tmpl_124",
      "name": "Express API Boilerplate",
      "description": "TypeScript ve Express ile REST API şablonu",
      "category": "backend",
      "language": "typescript",
      "stars": 189,
      "forks": 45,
      "type": "community",
      "created_by": "user_789",
      "tags": ["express", "rest-api", "typescript", "mongodb"]
    }
  ],
  "pagination": {
    "total": 38,
    "page": 1,
    "limit": 20,
    "pages": 2
  }
}
```

#### Belirli Bir Şablonu Getirme

```http
GET /templates/{id}
```

**Yanıt**

```json
{
  "id": "tmpl_123",
  "name": "React Component Library",
  "description": "TypeScript ile modern React bileşen kitaplığı starter",
  "category": "frontend",
  "language": "typescript",
  "stars": 234,
  "forks": 78,
  "type": "community",
  "created_by": {
    "id": "user_456",
    "name": "John Doe"
  },
  "tags": ["react", "component-library", "typescript", "storybook"],
  "files": [
    {
      "name": "package.json",
      "path": "/package.json"
    },
    {
      "name": "src",
      "path": "/src",
      "type": "directory"
    }
  ],
  "readme": "# React Component Library\n\nThis is a starter template for creating a modern React component library with TypeScript...",
  "created_at": "2023-01-10T15:30:45Z",
  "updated_at": "2023-02-20T09:15:30Z"
}
```

## Kod Örnekleri

### JavaScript (Node.js)

```javascript
const axios = require('axios');

const API_TOKEN = 'your_api_token';
const API_URL = 'https://api.codexonx.com/v1';

const codexonxApi = axios.create({
  baseURL: API_URL,
  headers: {
    'Authorization': `Bearer ${API_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

// Projeleri listele
async function getProjects() {
  try {
    const response = await codexonxApi.get('/projects');
    return response.data;
  } catch (error) {
    console.error('Error fetching projects:', error.response?.data || error.message);
    throw error;
  }
}

// Yeni proje oluştur
async function createProject(projectData) {
  try {
    const response = await codexonxApi.post('/projects', projectData);
    return response.data;
  } catch (error) {
    console.error('Error creating project:', error.response?.data || error.message);
    throw error;
  }
}

// Kod tamamlama
async function completeCode(code, language) {
  try {
    const response = await codexonxApi.post('/ai/code/complete', {
      code,
      language
    });
    return response.data;
  } catch (error) {
    console.error('Error completing code:', error.response?.data || error.message);
    throw error;
  }
}
```

### Python

```python
import requests

API_TOKEN = 'your_api_token'
API_URL = 'https://api.codexonx.com/v1'

headers = {
    'Authorization': f'Bearer {API_TOKEN}',
    'Content-Type': 'application/json'
}

# Projeleri listele
def get_projects():
    try:
        response = requests.get(f'{API_URL}/projects', headers=headers)
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error fetching projects: {e}')
        raise

# Yeni proje oluştur
def create_project(project_data):
    try:
        response = requests.post(
            f'{API_URL}/projects',
            json=project_data,
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error creating project: {e}')
        raise

# Kod tamamlama
def complete_code(code, language):
    try:
        response = requests.post(
            f'{API_URL}/ai/code/complete',
            json={
                'code': code,
                'language': language
            },
            headers=headers
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f'Error completing code: {e}')
        raise
```

## Webhooks

CodeXONX API'si, belirli olaylar gerçekleştiğinde belirttiğiniz URL'lere POST istekleri göndermek için webhook desteği sunar.

### Webhook Kaydı

```http
POST /webhooks
```

**Parametreler**

| Ad     | Tür    | Açıklama                      | Gerekli |
|--------|--------|-------------------------------|---------|
| url    | string | Webhook endpoint URL'si       | Evet    |
| events | array  | Dinlenecek olaylar dizisi     | Evet    |
| secret | string | Webhook imzası için gizli anahtar | Hayır |

**Yanıt**

```json
{
  "id": "wh_123",
  "url": "https://example.com/webhooks",
  "events": ["project.created", "file.updated"],
  "created_at": "2023-03-01T12:00:00Z"
}
```

### Webhook Olayları

| Olay Adı | Açıklama |
|----------|----------|
| project.created | Yeni proje oluşturulduğunda |
| project.updated | Proje güncellendiğinde |
| project.deleted | Proje silindiğinde |
| file.created | Dosya oluşturulduğunda |
| file.updated | Dosya güncellendiğinde |
| file.deleted | Dosya silindiğinde |

### Webhook Yükü Örneği

```json
{
  "event": "project.created",
  "timestamp": "2023-04-10T15:30:45Z",
  "data": {
    "id": "proj_123",
    "name": "New Project",
    "description": "Project description",
    "language": "javascript",
    "created_at": "2023-04-10T15:30:45Z"
  }
}
```

### Webhook İmzası

Güvenlik amacıyla, her webhook isteği bir `X-Codexonx-Signature` başlığı ile imzalanır. İmza, `HMAC-SHA256` algoritması kullanılarak webhook gizli anahtarı ile hesaplanır:

```
X-Codexonx-Signature: sha256=7682fe915e8cedab68e2c2eeac8b47f6c90c62865c1c1873346835be243ff4b5
```

İmza doğrulama örneği (Node.js):

```javascript
const crypto = require('crypto');

function verifyWebhookSignature(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return signature === `sha256=${expectedSignature}`;
}
```

## SDK'lar

CodeXONX API'sini daha kolay kullanmak için çeşitli programlama dilleri için resmi SDK'lar sunuyoruz:

- [Node.js SDK](https://github.com/codexonx/codexonx-node)
- [Python SDK](https://github.com/codexonx/codexonx-python)
- [PHP SDK](https://github.com/codexonx/codexonx-php)
- [Go SDK](https://github.com/codexonx/codexonx-go)
- [Ruby SDK](https://github.com/codexonx/codexonx-ruby)

## İletişim ve Destek

API ile ilgili sorularınız veya sorunlarınız için:

- API Durum Sayfası: [status.codexonx.com](https://status.codexonx.com)
- API Destek: [api-support@codexonx.com](mailto:api-support@codexonx.com)
- Geliştirici Forumu: [forum.codexonx.com](https://forum.codexonx.com)

---

© 2025 CodeXONX | [Terms of Service](https://codexonx.com/terms) | [Privacy Policy](https://codexonx.com/privacy)
