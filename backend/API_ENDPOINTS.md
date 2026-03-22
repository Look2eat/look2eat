# Look2Eat - API Endpoints Documentation

This document outlines the API endpoints that are *currently implemented and working* in the backend.

---

## 1. General

### `GET /health`
- **Use case:** Health check endpoint to verify the server is running.
- **Output:**
  ```json
  {
    "status": "ok"
  }
  ```

### `GET /debug`
- **Use case:** Debug check to verify if the `.env` variables `DATABASE_URL` and `JWT_SECRET` are correctly loaded.
- **Output:**
  ```json
  {
    "databaseUrl": "SET",
    "databaseUrlValue": "postgresql://...",
    "jwtSecret": "SET"
  }
  ```

---

## 2. Auth

### `POST /api/v1/auth/register-owner`
- **Use case:** Brand creation and owner registration.
- **Input:**
  ```json
  {
    "brandName": "Awesome Cafe",
    "slug": "awesome-cafe",
    "name": "John Owner",
    "email": "owner@awesomecafe.com",
    "password": "SecurePass123!",
    "phone": "9876543210"
  }
  ```
- **Output:**
  ```json
  {
    "message": "Owner registered successfully",
    "token": "jwt_token_here",
    "user": { 
      "id": "abc-123", 
      "email": "owner@awesomecafe.com", 
      "role": "OWNER" 
    }
  }
  ```

### `POST /api/v1/auth/login`
- **Use case:** Login for existing users.
- **Input:**
  ```json
  {
    "email": "owner@awesomecafe.com",
    "password": "SecurePass123!"
  }
  ```
- **Output:**
  ```json
  {
    "message": "Login successful",
    "token": "jwt_token_here",
    "user": { 
      "id": "abc-123", 
      "email": "owner@awesomecafe.com",
      "role": "OWNER" 
    }
  }
  ```

### `GET /api/v1/auth/me`
- **Use case:** Fetch the currently authenticated user based on the JWT token.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Output:**
  ```json
  {
    "user": {
      "id": "abc-123",
      "email": "owner@awesomecafe.com",
      "role": "OWNER",
      "brandId": "xyz-789"
    }
  }
  ```

---

## 3. Outlets

### `POST /api/v1/outlets`
- **Use case:** Create a physical outlet for the brand. Requires an authenticated user.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Input:**
  ```json
  {
    "name": "Downtown Branch",
    "address": "123 Main St",
    "phoneNumber": "1234567890"
  }
  ```
- **Output:**
  ```json
  {
    "message": "Outlet created successfully",
    "outlet": {
      "id": "outlet-123",
      "brandId": "xyz-789",
      "name": "Downtown Branch",
      "address": "123 Main St",
      "phoneNumber": "1234567890",
      "createdAt": "2026-03-22T00:00:00.000Z",
      "updatedAt": "2026-03-22T00:00:00.000Z"
    }
  }
  ```

### `GET /api/v1/outlets`
- **Use case:** Get a list of all outlets belonging to the authenticated user's brand.
- **Headers:** `Authorization: Bearer <jwt_token>`
- **Output:**
  ```json
  {
    "outlets": [
      {
        "id": "outlet-123",
        "brandId": "xyz-789",
        "name": "Downtown Branch",
        "address": "123 Main St",
        "phoneNumber": "1234567890",
        "createdAt": "2026-03-22T00:00:00.000Z",
        "updatedAt": "2026-03-22T00:00:00.000Z"
      }
    ]
  }
  ```
