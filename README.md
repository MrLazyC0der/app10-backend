# 📚 Assignment 8 — Books API

> **Built with:** Node.js · Express.js · MongoDB Native Driver  
> **Architecture:** Layered (Routes → Controllers → Services → DB)

---

## 🌐 Language / اللغة
- [🇬🇧 English](#english)
- [🇪🇬 العربية](#arabic)

---

<a name="english"></a>
# 🇬🇧 English Documentation

## 📋 Table of Contents
- [Project Overview](#overview)
- [Project Structure](#structure)
- [Getting Started](#getting-started)
- [Environment Variables](#env)
- [API Endpoints](#endpoints)
- [Error Handling](#errors)
- [Response Format](#response)

---

## 📖 Project Overview <a name="overview"></a>

A RESTful API for managing a **Books Library System** built using:
- **Express.js** — Web framework
- **MongoDB** — Database (using native driver, NOT mongoose)
- **Layered Architecture** — Routes / Controllers / Services / DB Models
- **Custom Error Handling** — Centralized error middleware

---

## 🗂️ Project Structure <a name="structure"></a>

```
assignment8/
├── config/
│   ├── .env.development       # Development environment variables
│   ├── .env.production        # Production environment variables
│   └── config.service.js      # Config loader
├── src/
│   ├── common/res/
│   │   ├── error.res.js       # Global error handler + AppError helpers
│   │   ├── success.res.js     # Unified success response
│   │   └── index.js           # Exports
│   ├── DB/
│   │   ├── Models/
│   │   │   ├── book.model.js  # Books collection reference
│   │   │   ├── log.model.js   # Logs collection reference
│   │   │   └── index.js       # Models exports
│   │   └── connection.db.js   # MongoDB connection
│   ├── Modules/
│   │   ├── collection/        # Collection management (create, index)
│   │   │   ├── collection.service.js
│   │   │   ├── collection.controller.js
│   │   │   └── index.js
│   │   ├── book/              # Books CRUD + queries + aggregations
│   │   │   ├── book.service.js
│   │   │   ├── book.controller.js
│   │   │   └── index.js
│   │   └── log/               # Logs insertion
│   │       ├── log.service.js
│   │       ├── log.controller.js
│   │       └── index.js
│   ├── app.bootstrap.js       # App setup + route registration
│   └── main.js                # Entry point
├── mongosh-solutions.txt      # MongoDB Shell solutions
├── bonus.js                   # Bonus: Roman to Integer
└── README.md
```

---

## 🚀 Getting Started <a name="getting-started"></a>

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Environment Variables
Create `config/.env.development`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
DB_NAME=assignment8
NODE_ENV=development
```

### 3. Run the Server
```bash
# Development
npm run dev

# Production
npm start
```

---

## ⚙️ Environment Variables <a name="env"></a>

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017` |
| `DB_NAME` | Database name | `assignment8` |
| `NODE_ENV` | Environment | `development` |

---

## 📡 API Endpoints <a name="endpoints"></a>

> **Base URL:** `http://localhost:5000`

---

### 📁 Collection Management

#### 1. Create Books Collection (Explicit + Validation)
```
POST /collection/books
```
- Creates a `books` collection with JSON schema validation
- Ensures `title` field is **required and non-empty**
- **Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Books collection created with validation",
  "data": { "ok": 1 }
}
```

---

#### 2. Create Authors Collection (Implicit)
```
POST /collection/authors
```
- Creates the `authors` collection **implicitly** by inserting a document
- **Body:**
```json
{
  "name": "Author1",
  "nationality": "British"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Author inserted — authors collection created implicitly",
  "data": { "acknowledged": true, "insertedId": "64b5c0b2f82c4a765ef0" }
}
```

---

#### 3. Create Capped Logs Collection
```
POST /collection/logs/capped
```
- Creates a **capped collection** named `logs` with **1MB size limit**
- **Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Capped logs collection created (1MB)",
  "data": { "ok": 1 }
}
```

---

#### 4. Create Index on Books Title
```
POST /collection/books/index
```
- Creates an **ascending index** on `books.title`
- **Body:** None

**Response:**
```json
{
  "success": true,
  "message": "Index created on books.title",
  "data": "title_1"
}
```

---

### 📚 Books — Write Operations

#### 5. Insert One Book
```
POST /books
```
- **Body:**
```json
{
  "title": "Book1",
  "author": "Ali",
  "year": 1937,
  "genres": ["Fantasy", "Adventure"]
}
```

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| title | String | ✅ | Non-empty |
| author | String | ✅ | |
| year | Integer | ✅ | Stored as BSON Int32 |
| genres | Array | ✅ | Array of strings |

**Response:**
```json
{
  "success": true,
  "message": "Book inserted successfully",
  "data": { "acknowledged": true, "insertedId": "64b5c2d8a123456ef8901" }
}
```

---

#### 6. Insert Multiple Books (min 3)
```
POST /books/batch
```
- **Body:**
```json
{
  "books": [
    { "title": "Future", "author": "George Orwell", "year": 2028, "genres": ["Science Fiction"] },
    { "title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960, "genres": ["Classic", "Fiction"] },
    { "title": "Brave New World", "author": "Aldous Huxley", "year": 2006, "genres": ["Dystopian", "Science Fiction"] },
    { "title": "The Road", "author": "Cormac McCarthy", "year": 2006, "genres": ["Drama"] },
    { "title": "The Kite Runner", "author": "Khaled Hosseini", "year": 2003, "genres": ["Drama"] }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "message": "Books inserted successfully",
  "data": { "acknowledged": true, "insertedCount": 5, "insertedIds": { "0": "...", "1": "..." } }
}
```

---

#### 7. Update Book by Title
```
PATCH /books/:title
```
- Example: `PATCH /books/Future`
- **Body:**
```json
{
  "year": 2022
}
```

**Response:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { "acknowledged": true, "matchedCount": 1, "modifiedCount": 1 }
}
```

---

### 📖 Books — Read Operations

#### 8. Find Book by Title
```
GET /books/title?title=Brave New World
```

| Query Param | Required | Example |
|-------------|----------|---------|
| `title` | ✅ | `Brave New World` |

**Response:**
```json
{
  "success": true,
  "message": "Book found",
  "data": {
    "_id": "...",
    "title": "Brave New World",
    "author": "Aldous Huxley",
    "year": 2006,
    "genres": ["Dystopian", "Science Fiction"]
  }
}
```

---

#### 9. Find Books Between Years
```
GET /books/year?from=1990&to=2010
```

| Query Param | Required | Example |
|-------------|----------|---------|
| `from` | ✅ | `1990` |
| `to` | ✅ | `2010` |

---

#### 10. Find Books by Genre
```
GET /books/genre?genre=Science Fiction
```

| Query Param | Required | Example |
|-------------|----------|---------|
| `genre` | ✅ | `Science Fiction` |

---

#### 11. Skip, Limit, Sort
```
GET /books/skip-limit
```
- Skips first **2** books
- Returns next **3** books
- Sorted by **year descending**

---

#### 12. Find Books Where Year is Integer
```
GET /books/year-integer
```
- Uses MongoDB `$type: "int"` filter
- Returns only books where `year` is stored as BSON Int32

---

#### 13. Exclude Genres
```
GET /books/exclude-genres
```
- Returns books where `genres` does **NOT** include `"Horror"` or `"Science Fiction"`

---

### 🗑️ Books — Delete Operations

#### 14. Delete Books Before Year
```
DELETE /books/before-year?year=2000
```

| Query Param | Required | Example |
|-------------|----------|---------|
| `year` | ✅ | `2000` |

**Response:**
```json
{
  "success": true,
  "message": "Books deleted successfully",
  "data": { "acknowledged": true, "deletedCount": 2 }
}
```

---

### 📋 Logs

#### 15. Insert Log
```
POST /logs
```
- Validates that `book_id` exists in the `books` collection before inserting
- **Body:**
```json
{
  "book_id": "64b5c2d8a123456ef8901",
  "action": "borrowed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Log inserted successfully",
  "data": { "acknowledged": true, "insertedId": "..." }
}
```

---

### 📊 Aggregations

#### 16. Aggregate 1 — Match + Sort
```
GET /books/aggregate1
```
- Filter books published **after 2000**
- Sort by **year descending**

---

#### 17. Aggregate 2 — Match + Project
```
GET /books/aggregate2
```
- Filter books published **after 2000**
- Show **only** `title`, `author`, `year`

---

#### 18. Aggregate 3 — Unwind Genres
```
GET /books/aggregate3
```
- Breaks `genres` array into **separate documents** per genre

**Response:**
```json
{
  "data": [
    { "title": "Brave New World", "genres": "Dystopian" },
    { "title": "Brave New World", "genres": "Science Fiction" }
  ]
}
```

---

#### 19. Aggregate 4 — Lookup (Join Books ← Logs)
```
GET /books/aggregate4
```
- Joins `logs` collection with `books` using `book_id → _id`

**Response:**
```json
{
  "data": [
    {
      "action": "borrowed",
      "book_details": [{ "title": "Book1", "author": "Ali", "year": 1937 }]
    }
  ]
}
```

---

## ❌ Error Handling <a name="errors"></a>

All errors follow this format:

```json
{
  "success": false,
  "message": "Error description",
  "statusCode": 400
}
```

| Status Code | Meaning |
|-------------|---------|
| `400` | Bad Request — missing or invalid fields |
| `404` | Not Found — resource doesn't exist |
| `409` | Conflict — resource already exists |
| `500` | Internal Server Error |

---

## ✅ Response Format <a name="response"></a>

**Success:**
```json
{
  "success": true,
  "message": "Done",
  "data": { },
  "statusCode": 200
}
```

**Error:**
```json
{
  "success": false,
  "message": "Something went wrong",
  "statusCode": 500
}
```

---
---

<a name="arabic"></a>
# 🇪🇬 التوثيق بالعربية

## 📋 الفهرس
- [نظرة عامة](#نظرة-عامة)
- [هيكل المشروع](#هيكل-المشروع)
- [طريقة التشغيل](#طريقة-التشغيل)
- [متغيرات البيئة](#متغيرات-البيئة)
- [الـ Endpoints](#الendpoints)
- [التعامل مع الأخطاء](#الأخطاء)

---

## 📖 نظرة عامة

API لإدارة مكتبة كتب مبنية باستخدام:
- **Express.js** — فريمووك الـ web
- **MongoDB** — قاعدة البيانات (Native Driver بدون Mongoose)
- **Layered Architecture** — Routes / Controllers / Services / DB
- **Custom Error Handling** — معالجة أخطاء مركزية

---

## 🗂️ هيكل المشروع

```
assignment8/
├── config/
│   ├── .env.development       # متغيرات بيئة التطوير
│   ├── .env.production        # متغيرات بيئة الإنتاج
│   └── config.service.js      # تحميل الإعدادات
├── src/
│   ├── common/res/
│   │   ├── error.res.js       # معالج الأخطاء العام
│   │   ├── success.res.js     # تنسيق الاستجابة الناجحة
│   │   └── index.js
│   ├── DB/
│   │   ├── Models/
│   │   │   ├── book.model.js  # مرجع collection الكتب
│   │   │   ├── log.model.js   # مرجع collection اللوجز
│   │   │   └── index.js
│   │   └── connection.db.js   # الاتصال بـ MongoDB
│   ├── Modules/
│   │   ├── collection/        # إنشاء الـ collections والـ indexes
│   │   ├── book/              # عمليات الكتب
│   │   └── log/               # إدراج اللوجز
│   ├── app.bootstrap.js       # إعداد التطبيق
│   └── main.js                # نقطة البداية
├── mongosh-solutions.txt      # حلول MongoDB Shell
├── bonus.js                   # البونص: Roman to Integer
└── README.md
```

---

## 🚀 طريقة التشغيل

### 1. تثبيت الـ Dependencies
```bash
npm install
```

### 2. إعداد متغيرات البيئة
أنشئ ملف `config/.env.development`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017
DB_NAME=assignment8
NODE_ENV=development
```

### 3. تشغيل السيرفر
```bash
# وضع التطوير
npm run dev

# وضع الإنتاج
npm start
```

---

## ⚙️ متغيرات البيئة

| المتغير | الوصف | مثال |
|---------|-------|-------|
| `PORT` | بورت السيرفر | `3000` |
| `MONGO_URI` | رابط الاتصال بـ MongoDB | `mongodb://localhost:27017` |
| `DB_NAME` | اسم قاعدة البيانات | `assignment8` |
| `NODE_ENV` | بيئة التشغيل | `development` |

---

## 📡 الـ Endpoints

> **Base URL:** `http://localhost:5000`

---

### 📁 إدارة الـ Collections

#### 1. إنشاء collection الكتب (مع validation)
```
POST /collection/books
```
- بينشئ collection اسمها `books` مع قاعدة التحقق
- الـ `title` مطلوب وغير فارغ
- **Body:** لا يوجد

**الاستجابة:**
```json
{
  "success": true,
  "message": "Books collection created with validation",
  "data": { "ok": 1 }
}
```

---

#### 2. إنشاء collection المؤلفين (بشكل ضمني)
```
POST /collection/authors
```
- بينشئ الـ collection **تلقائياً** بإدراج document فيها
- **Body:**
```json
{
  "name": "Author1",
  "nationality": "British"
}
```

---

#### 3. إنشاء Capped Collection للـ Logs
```
POST /collection/logs/capped
```
- بينشئ **capped collection** اسمها `logs` بحجم **1MB**
- **Body:** لا يوجد

---

#### 4. إنشاء Index على عنوان الكتاب
```
POST /collection/books/index
```
- بينشئ **ascending index** على حقل `title`
- **Body:** لا يوجد

**الاستجابة:**
```json
{
  "success": true,
  "message": "Index created on books.title",
  "data": "title_1"
}
```

---

### 📚 الكتب — عمليات الكتابة

#### 5. إدراج كتاب واحد
```
POST /books
```
- **Body:**
```json
{
  "title": "Book1",
  "author": "Ali",
  "year": 1937,
  "genres": ["Fantasy", "Adventure"]
}
```

| الحقل | النوع | مطلوب | ملاحظات |
|-------|-------|--------|---------|
| title | String | ✅ | غير فارغ |
| author | String | ✅ | |
| year | Integer | ✅ | يُخزَّن كـ BSON Int32 |
| genres | Array | ✅ | مصفوفة strings |

---

#### 6. إدراج أكثر من كتاب (3 على الأقل)
```
POST /books/batch
```
- **Body:**
```json
{
  "books": [
    { "title": "Future", "author": "George Orwell", "year": 2028, "genres": ["Science Fiction"] },
    { "title": "To Kill a Mockingbird", "author": "Harper Lee", "year": 1960, "genres": ["Classic", "Fiction"] },
    { "title": "Brave New World", "author": "Aldous Huxley", "year": 2006, "genres": ["Dystopian", "Science Fiction"] },
    { "title": "The Road", "author": "Cormac McCarthy", "year": 2006, "genres": ["Drama"] },
    { "title": "The Kite Runner", "author": "Khaled Hosseini", "year": 2003, "genres": ["Drama"] }
  ]
}
```

---

#### 7. تحديث كتاب عن طريق العنوان
```
PATCH /books/:title
```
- مثال: `PATCH /books/Future`
- **Body:**
```json
{
  "year": 2022
}
```

**الاستجابة:**
```json
{
  "success": true,
  "message": "Book updated successfully",
  "data": { "acknowledged": true, "matchedCount": 1, "modifiedCount": 1 }
}
```

---

### 📖 الكتب — عمليات القراءة

#### 8. البحث عن كتاب بالعنوان
```
GET /books/title?title=Brave New World
```

| Query Param | مطلوب | مثال |
|-------------|--------|-------|
| `title` | ✅ | `Brave New World` |

---

#### 9. البحث عن كتب بين سنتين
```
GET /books/year?from=1990&to=2010
```

| Query Param | مطلوب | مثال |
|-------------|--------|-------|
| `from` | ✅ | `1990` |
| `to` | ✅ | `2010` |

---

#### 10. البحث عن كتب بالنوع الأدبي
```
GET /books/genre?genre=Science Fiction
```

| Query Param | مطلوب | مثال |
|-------------|--------|-------|
| `genre` | ✅ | `Science Fiction` |

---

#### 11. Skip و Limit و Sort
```
GET /books/skip-limit
```
- يتخطى أول **2** كتب
- يرجع **3** كتب بعدهم
- مرتبين حسب **السنة تنازلياً**

---

#### 12. الكتب اللي السنة فيها integer
```
GET /books/year-integer
```
- بيستخدم `$type: "int"` من MongoDB
- بيرجع بس الكتب اللي `year` فيها مخزنة كـ BSON Int32

---

#### 13. استبعاد أنواع معينة
```
GET /books/exclude-genres
```
- بيرجع الكتب اللي **مش فيها** `"Horror"` أو `"Science Fiction"`

---

### 🗑️ الكتب — عمليات الحذف

#### 14. حذف الكتب قبل سنة معينة
```
DELETE /books/before-year?year=2000
```

| Query Param | مطلوب | مثال |
|-------------|--------|-------|
| `year` | ✅ | `2000` |

**الاستجابة:**
```json
{
  "success": true,
  "message": "Books deleted successfully",
  "data": { "acknowledged": true, "deletedCount": 2 }
}
```

---

### 📋 الـ Logs

#### 15. إدراج Log جديد
```
POST /logs
```
- بيتحقق إن الـ `book_id` موجود فعلاً في الـ `books` collection قبل الإدراج
- **Body:**
```json
{
  "book_id": "64b5c2d8a123456ef8901",
  "action": "borrowed"
}
```

**الاستجابة لو الكتاب مش موجود:**
```json
{
  "success": false,
  "message": "Book not found — cannot insert log for non-existing book",
  "statusCode": 404
}
```

---

### 📊 الـ Aggregations

#### 16. Aggregate 1 — Match + Sort
```
GET /books/aggregate1
```
- بيفلتر الكتب المنشورة **بعد 2000**
- بيرتبهم حسب **السنة تنازلياً**

---

#### 17. Aggregate 2 — Match + Project
```
GET /books/aggregate2
```
- بيفلتر الكتب المنشورة **بعد 2000**
- بيرجع **بس** `title` و `author` و `year`

---

#### 18. Aggregate 3 — Unwind
```
GET /books/aggregate3
```
- بيفكك مصفوفة الـ `genres` لـ **documents منفصلة**

**الاستجابة:**
```json
{
  "data": [
    { "title": "Brave New World", "genres": "Dystopian" },
    { "title": "Brave New World", "genres": "Science Fiction" }
  ]
}
```

---

#### 19. Aggregate 4 — Lookup (Join)
```
GET /books/aggregate4
```
- بيعمل join بين `logs` و `books` عن طريق `book_id → _id`

**الاستجابة:**
```json
{
  "data": [
    {
      "action": "borrowed",
      "book_details": [{ "title": "Book1", "author": "Ali", "year": 1937 }]
    }
  ]
}
```

---

## ❌ التعامل مع الأخطاء

كل الأخطاء بترجع بالشكل ده:

```json
{
  "success": false,
  "message": "وصف الخطأ",
  "statusCode": 400
}
```

| كود الحالة | المعنى |
|-----------|--------|
| `400` | Bad Request — حقل ناقص أو قيمة غلط |
| `404` | Not Found — العنصر مش موجود |
| `409` | Conflict — العنصر موجود قبل كده |
| `500` | Internal Server Error — خطأ داخلي |

---

## ✅ شكل الاستجابة

**نجاح:**
```json
{
  "success": true,
  "message": "Done",
  "data": { },
  "statusCode": 200
}
```

**خطأ:**
```json
{
  "success": false,
  "message": "حصل خطأ",
  "statusCode": 500
}
```

---

## 📮 ترتيب تشغيل الـ Requests في Postman

> ⚠️ مهم جداً — شغّل بالترتيب ده عشان البيانات تكون موجودة

| الترتيب | الاسم | Method | URL |
|---------|-------|--------|-----|
| 1 | Create Books Collection | POST | `/collection/books` |
| 2 | Create Authors Collection | POST | `/collection/authors` |
| 3 | Create Capped Logs Collection | POST | `/collection/logs/capped` |
| 4 | Create Books Title Index | POST | `/collection/books/index` |
| 5 | Insert One Book | POST | `/books` |
| 6 | Insert Many Books | POST | `/books/batch` |
| 7 | Insert Log | POST | `/logs` |
| 8 | Update Book Future | PATCH | `/books/Future` |
| 9 | Find Book By Title | GET | `/books/title?title=Brave New World` |
| 10 | Find Books By Year Range | GET | `/books/year?from=1990&to=2010` |
| 11 | Find Books By Genre | GET | `/books/genre?genre=Science Fiction` |
| 12 | Skip Limit Sort Books | GET | `/books/skip-limit` |
| 13 | Find Books Year Integer | GET | `/books/year-integer` |
| 14 | Find Books Exclude Genres | GET | `/books/exclude-genres` |
| 15 | Delete Books Before Year | DELETE | `/books/before-year?year=2000` |
| 16 | Aggregate Match Sort | GET | `/books/aggregate1` |
| 17 | Aggregate Match Project | GET | `/books/aggregate2` |
| 18 | Aggregate Unwind Genres | GET | `/books/aggregate3` |
| 19 | Aggregate Lookup Logs | GET | `/books/aggregate4` |

---

*Made with ❤️ — Assignment 8 | Node.js + Express.js + MongoDB*
