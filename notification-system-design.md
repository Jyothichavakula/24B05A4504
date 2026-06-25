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








# Stage 2

## Database Selection

For the Notification Management System, I would use **PostgreSQL** as the primary database because the notification data is highly structured and requires reliable storage. PostgreSQL provides ACID transactions, supports indexing, and performs well when filtering, sorting, and retrieving notifications. It is also scalable enough to handle a growing number of users and notifications.

## Database Schema

The system will have a `notifications` table where each notification contains the following fields:

* `id` – Unique identifier (UUID)
* `recipientId` – ID of the student receiving the notification
* `title` – Notification title
* `message` – Notification content
* `type` – Notification category (Placement, Event, or Result)
* `priority` – Priority level (High, Medium, Low)
* `isRead` – Indicates whether the notification has been read
* `createdAt` – Timestamp when the notification was created
* `updatedAt` – Timestamp when the notification was last modified

Indexes should be created on `recipientId`, `type`, `isRead`, and `createdAt` to improve search and retrieval performance.

## Challenges as Data Grows

As the number of notifications increases, fetching unread notifications or filtering by type may become slower. A large notifications table also increases storage usage and database load.

To improve performance, I would:

* Create indexes on frequently searched columns.
* Use pagination instead of loading all notifications at once.
* Archive or remove old notifications after a retention period.
* Use Redis caching for frequently accessed notification data.
* Process bulk notification creation asynchronously using background jobs or queues.
* Use database partitioning if the notification table becomes very large.

## SQL Queries

### Create a Notification

```sql
INSERT INTO notifications
(recipientId, title, message, type, priority)
VALUES
('24B05A4504',
'Microsoft Hiring',
'Applications are now open.',
'Placement',
'High');
```

### Get All Notifications

```sql
SELECT *
FROM notifications
ORDER BY createdAt DESC;
```

### Get Notification by ID

```sql
SELECT *
FROM notifications
WHERE id = 'notification_id';
```

### Get Unread Notifications

```sql
SELECT *
FROM notifications
WHERE recipientId = '24B05A4504'
AND isRead = FALSE
ORDER BY createdAt DESC;
```

### Mark Notification as Read

```sql
UPDATE notifications
SET isRead = TRUE,
updatedAt = CURRENT_TIMESTAMP
WHERE id = 'notification_id';
```

### Delete a Notification

```sql
DELETE FROM notifications
WHERE id = 'notification_id';
```

### Filter Notifications by Type

```sql
SELECT *
FROM notifications
WHERE type = 'Placement'
ORDER BY createdAt DESC;
```

### Pagination

```sql
SELECT *
FROM notifications
WHERE recipientId = '24B05A4504'
ORDER BY createdAt DESC
LIMIT 20 OFFSET 0;
```

## Conclusion

PostgreSQL is a suitable choice for this application because it provides strong consistency, efficient indexing, and reliable transaction support. Using indexes, pagination, caching, and asynchronous processing ensures that the notification system continues to perform efficiently even as the number of users and notifications grows.





# Stage 3

## Query Analysis

The existing query is:

```sql
SELECT *
FROM notifications
WHERE studentId = 1042
AND isRead = false
ORDER BY createdAt ASC;
```

### Is this query correct?

Yes. The query correctly retrieves all unread notifications for a particular student and displays them in ascending order based on the creation time.

### Why is it slow?

Initially, this query may have worked well because the database contained only a small amount of data. However, as the application grows to around **50,000 students** and **5 million notifications**, the performance starts degrading.

The main reasons are:

* The database has to search through a very large notifications table.
* If there is no suitable index, it performs a full table scan.
* After finding the matching records, it sorts them using `createdAt`, which adds extra processing time.

As the amount of data increases, the response time also increases.

### How can this be improved?

Instead of scanning the entire table, I would create a **composite index** on the columns that are frequently used together in this query.

```sql
CREATE INDEX idx_notifications_student_read_created
ON notifications(studentId, isRead, createdAt);
```

This allows the database to quickly locate unread notifications of a specific student while also returning them in the required order.

### Computational Cost

* **Without an index:** approximately **O(N)** because the database may scan all notification records.
* **With the composite index:** approximately **O(log N)** for searching, making the query much faster.

### Should indexes be added on every column?

No.

Adding indexes on every column is not a good practice because:

* Every index consumes additional storage.
* Insert, Update and Delete operations become slower since all indexes must also be updated.
* Many indexes may never be used by queries.

Instead, indexes should only be created on columns that are frequently used in filtering, sorting, or joining.

### Query to Find Students Who Received Placement Notifications in the Last 7 Days

```sql
SELECT DISTINCT studentId
FROM notifications
WHERE notificationType = 'Placement'
AND createdAt >= CURRENT_DATE - INTERVAL '7 days';
```

This query returns the unique student IDs of all students who received placement notifications during the last seven days.

### Conclusion

The existing query is functionally correct but is not optimized for a large dataset. Creating a composite index on `studentId`, `isRead`, and `createdAt` significantly improves performance. Using indexes only where necessary helps maintain a balance between faster query execution and efficient database maintenance.






# Stage 4

## Performance Improvement

Currently, the application fetches all notifications from the database every time a student opens or refreshes a page. As the number of users increases, this creates a large number of repeated database requests, which increases response time and puts unnecessary load on the database server.

To improve the overall performance, I would use the following approaches.

### 1. Pagination

Instead of loading every notification at once, the application should load a limited number of notifications (for example, 20 notifications per request).

**Advantages**

* Reduces the amount of data transferred.
* Faster page loading.
* Lower database load.

**Trade-off**

* Additional API calls are required when the user scrolls or changes pages.

---

### 2. Cache Frequently Accessed Data

Unread notification count and recently viewed notifications can be stored in a cache such as Redis. Instead of querying the database repeatedly, the application can retrieve this information directly from the cache.

**Advantages**

* Faster response time.
* Reduces database queries.
* Improves user experience.

**Trade-off**

* Cache needs to be updated whenever notifications are created or marked as read.
* Adds an extra component to maintain.

---

### 3. Fetch Only Required Data

Instead of using:

```sql
SELECT *
```

retrieve only the required columns.

Example:

```sql
SELECT id, title, type, isRead, createdAt
FROM notifications
WHERE studentId = ?
ORDER BY createdAt DESC;
```

**Advantages**

* Less data is transferred.
* Lower memory usage.
* Faster query execution.

**Trade-off**

* If additional fields are required later, the query must be updated.

---

### 4. Real-Time Notifications

Instead of requesting notifications every few seconds, establish a WebSocket connection after the user logs in. The server can send new notifications instantly whenever they are available.

**Advantages**

* No unnecessary polling.
* Real-time updates.
* Better user experience.

**Trade-off**

* WebSocket connections require additional server resources and connection management.

---

### 5. Database Indexing

Create indexes on columns that are frequently used in filtering and sorting, such as `studentId`, `isRead`, and `createdAt`.

**Advantages**

* Faster query execution.
* Reduced search time.

**Trade-off**

* Indexes consume extra storage.
* Insert and update operations become slightly slower because indexes also need to be updated.

---

## Recommended Solution

Instead of depending on a single optimization technique, I would combine multiple approaches:

* Use pagination to load notifications in smaller batches.
* Create proper database indexes.
* Cache frequently accessed data.
* Use WebSockets to deliver new notifications instantly.

This combination reduces database load, improves response time, and provides a smoother experience for users while keeping the system scalable as the number of notifications grows.

## Conclusion

Fetching all notifications on every page load is not efficient for a large-scale application. By using pagination, caching, indexing, optimized queries, and real-time communication, the Notification Management System can handle a large number of users while maintaining good performance and a responsive user experience.
