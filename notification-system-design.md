# Stage 1

# Notification System REST API Design

## Overview

The Notification Management System is designed to allow students to receive important notifications related to placement drives, examination results, college events, and other announcements. The system provides RESTful APIs for creating, retrieving, updating, deleting, and filtering notifications. All APIs use JSON for request and response bodies and are secured using Bearer Token authentication.

---

# Authentication

All APIs are protected.

### Request Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
Accept: application/json
```

---

## Notification Object Schema

A notification object contains the following fields:

```json
{
  "id": "UUID",
  "recipientId": "24B05A4504",
  "title": "Microsoft Hiring",
  "message": "Microsoft has opened applications.",
  "type": "Placement",
  "priority": "High",
  "isRead": false,
  "createdAt": "2026-06-25T10:30:00Z",
  "updatedAt": "2026-06-25T10:30:00Z"
}
```

### Field Description

- **id** – Unique identifier for the notification.
- **recipientId** – Unique ID of the student/user receiving the notification.
- **title** – Short title of the notification.
- **message** – Detailed notification content.
- **type** – Category of the notification (Placement, Event, or Result).
- **priority** – Priority level (High, Medium, or Low).
- **isRead** – Indicates whether the notification has been read.
- **createdAt** – Timestamp when the notification was created.
- **updatedAt** – Timestamp when the notification was last updated.

# REST API Endpoints

## 1. Create Notification

### Endpoint

```
POST /notifications
```

### Request Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
Content-Type: application/json
```

### Request Body

```json
{
  "recipientId": "24B05A4504",
  "title": "Microsoft Hiring",
  "message": "Microsoft has opened applications.",
  "type": "Placement",
  "priority": "High"
}
```

### Success Response (201)

```json
{
  "success": true,
  "notificationId": "NTF001",
  "message": "Notification created successfully"
}
```

### Error Response (400)

```json
{
  "success": false,
  "message": "Invalid request body"
}
```

---

## 2. Get All Notifications

### Endpoint

```
GET /notifications
```

### Request Headers

```http
Authorization: Bearer <ACCESS_TOKEN>
```

### Success Response (200)

```json
[
  {
    "id": "NTF001",
    "recipientId": "24B05A4504",
    "title": "Microsoft Hiring",
    "message": "Microsoft has opened applications.",
    "type": "Placement",
    "priority": "High",
    "isRead": false,
    "createdAt": "2026-06-25T10:00:00Z"
  }
]
```

---

## 3. Get Notification By ID

### Endpoint

```
GET /notifications/{notificationId}
```

### Success Response (200)

```json
{
  "id": "NTF001",
  "recipientId": "24B05A4504",
  "title": "Microsoft Hiring",
  "message": "Microsoft has opened applications.",
  "type": "Placement",
  "priority": "High",
  "isRead": false,
  "createdAt": "2026-06-25T10:00:00Z"
}
```

### Error Response (404)

```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

## 4. Mark Notification as Read

### Endpoint

```
PATCH /notifications/{notificationId}/read
```

### Request Body

```json
{
  "isRead": true
}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 5. Delete Notification

### Endpoint

```
DELETE /notifications/{notificationId}
```

### Success Response (200)

```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

---

## 6. Get Unread Notifications

### Endpoint

```
GET /notifications/unread
```

### Success Response (200)

```json
[
  {
    "id": "NTF001",
    "title": "Microsoft Hiring",
    "type": "Placement",
    "isRead": false
  }
]
```

---

## 7. Filter Notifications

### Endpoint

```
GET /notifications?type=Placement
```

### Query Parameters

| Parameter | Description |
|------------|-------------|
| type | Placement / Event / Result |
| priority | High / Medium / Low |
| isRead | true / false |

### Success Response

```json
[
  {
    "id": "NTF001",
    "title": "Microsoft Hiring",
    "type": "Placement",
    "priority": "High"
  }
]
```

---

## HTTP Status Codes

| Status Code | Description |
|--------------|-------------|
| 200 | Success |
| 201 | Resource Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Resource Not Found |
| 500 | Internal Server Error |

---

# Error Response Format

```json
{
  "success": false,
  "message": "Description of the error"
}
```

Example

```json
{
  "success": false,
  "message": "Notification not found"
}
```

---

# Real-Time Notification Mechanism

To provide real-time notifications, the system will use **WebSockets**.

### Workflow

1. User logs into the application.
2. Frontend authenticates using JWT.
3. Frontend establishes a WebSocket connection with the server.
4. Backend stores the active socket connection for the user.
5. Whenever an administrator creates a notification:
   - Notification is saved to the database.
   - Backend immediately sends the notification through the WebSocket connection.
6. The React frontend receives the notification instantly and updates the UI without requiring a page refresh.
7. If the user is offline, the notification remains stored in the database and is fetched through the REST API when the user logs in again.

---

# API Flow

```
Frontend
     │
     ▼
REST API Request
     │
     ▼
Notification Controller
     │
     ▼
Notification Service
     │
     ▼
Database
     │
     ▼
Store Notification
     │
     ▼
WebSocket Server
     │
     ▼
Push Notification
     │
     ▼
React Frontend
     │
     ▼
Notification Displayed Instantly
```

---

# Assumptions

- Authentication is handled using JWT Bearer Tokens.
- Notification types supported are **Placement**, **Event**, and **Result**.
- Every notification belongs to a specific recipient.
- Soft deletion can be considered for future improvements.
- All timestamps are stored in UTC.
- JSON is used for all API communication.
