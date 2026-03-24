# 📚 Assignment 8 — Books API

> **Built with:** Node.js · Express.js · MongoDB Native Driver  
> **Architecture:** Layered (Routes → Controllers → Services → DB)



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
npm run start:dev

# Production
npm run start:pro 
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


*Made with ❤️ — Assignment 8 | Node.js + Express.js + MongoDB*
