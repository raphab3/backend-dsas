# Attendance Attachments API Documentation

This document describes how to manage attachments in attendances through the API.

## Upload Attachment

Upload a file attachment to a specific attendance.

### Endpoint
```http
POST /api/v1/attendances/:id/attachments
```

### Headers
- `Authorization: Bearer {jwt_token}`
- `Content-Type: multipart/form-data`

### Path Parameters
- `id` (string, required) - The attendance UUID

### Request Body
Must be sent as `multipart/form-data` with:
- `file` (binary, required) - The file to be uploaded

### Example Request
```javascript
const formData = new FormData();
formData.append('file', fileObject);

await fetch('api/v1/attendances/123e4567-e89b-12d3-a456-426614174000/attachments', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
  },
  body: formData
});
```

### Response
```json
{
  "id": "uuid",
  "filename": "example.pdf",
  "originalname": "original_name.pdf",
  "mimetype": "application/pdf",
  "size": 12345,
  "file_url": "https://example.com/path/to/file.pdf",
  "created_at": "2023-01-01T00:00:00.000Z"
}
```

## List Attachments

Get all attachments for a specific attendance.

### Endpoint
```http
GET /api/v1/attendances/:id/attachments
```

### Headers
- `Authorization: Bearer {jwt_token}`

### Path Parameters
- `id` (string, required) - The attendance UUID

### Response
```json
[
  {
    "id": "uuid",
    "filename": "example.pdf",
    "originalname": "original_name.pdf",
    "mimetype": "application/pdf",
    "size": 12345,
    "file_url": "https://example.com/path/to/file.pdf",
    "created_at": "2023-01-01T00:00:00.000Z"
  }
]
```

## Delete Attachment

Remove an attachment from an attendance.

### Endpoint
```http
DELETE /api/v1/attendances/:attendanceId/attachments/:attachmentId
```

### Headers
- `Authorization: Bearer {jwt_token}`

### Path Parameters
- `attendanceId` (string, required) - The attendance UUID
- `attachmentId` (string, required) - The attachment UUID

### Response
```json
{
  "message": "Attachment deleted successfully"
}
```

## File Requirements

- Supported file types: All common file types (PDF, DOC, DOCX, JPG, PNG, etc.)
- Maximum file size: Determined by server configuration

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Attendance not found"
}
```

### 413 Payload Too Large
```json
{
  "statusCode": 413,
  "message": "File too large"
}
```

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Invalid file type"
}
```