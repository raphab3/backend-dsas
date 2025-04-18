# Statistics API Documentation

This document provides detailed information about the statistics API endpoints available in the backend.

## Base URL

All API endpoints are relative to the base URL of the backend service.

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

However, the stats endpoints are marked with `@Public()` and do not require authentication.

## Endpoints

### 1. Get General Statistics

Retrieves general statistics about appointments, schedules, professionals, patients, and employees.

**Endpoint:** `GET /stats`

**Version:** v1

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | ISO Date String | No | Start date for filtering (format: YYYY-MM-DD) |
| endDate | ISO Date String | No | End date for filtering (format: YYYY-MM-DD) |
| locationId | String | No | Filter by specific location ID |

**Response:**

```json
{
  "schedules": {
    "total": 150,
    "monthly": {
      "2023-01": {
        "totalSchedules": 15,
        "totalVacanciesFilled": 12,
        "totalVacanciesAvailable": 3,
        "schedulesByLocation": {
          "Location A": 8,
          "Location B": 7
        }
      },
      // More months...
    },
    "total_vacancies": 450,
    "total_vacancies_filled": 380,
    "total_vacancies_available": 70,
    "schedulesByLocation": {
      "Location A": 80,
      "Location B": 70
    }
  },
  "appointments": {
    "total": 380,
    "monthly": {
      "2023-01": 40,
      "2023-02": 45
      // More months...
    },
    "totalHolders": 300,
    "totalDependents": 80,
    "total_canceled": 20,
    "total_attended": 340,
    "total_scheduled": 15,
    "total_missed": 5,
    "totalByStatusByMonth": {
      "2023-01": {
        "attended": 38,
        "canceled": 1,
        "scheduled": 1,
        "missed": 0
      },
      // More months...
    },
    "byLocation": {
      "Location A - City X": {
        "attended": 180,
        "canceled": 10,
        "scheduled": 8,
        "missed": 2,
        "total": 200
      },
      // More locations...
    },
    "bySpecialty": {
      "Cardiology": {
        "attended": 90,
        "canceled": 5,
        "scheduled": 4,
        "missed": 1,
        "total": 100
      },
      // More specialties...
    }
  },
  "professionals": {
    "total": 25,
    "byLocation": {
      "Location A": {
        "professionals": [
          { "id": "prof-id-1", "name": "Dr. Smith" },
          // More professionals...
        ],
        "total": 15
      },
      // More locations...
    }
  },
  "patients": {
    "total": 450
  },
  "employees": {
    "total": 50,
    "byType": {
      "DOCTOR": 20,
      "NURSE": 15,
      "ADMIN": 10,
      "OTHER": 5
    }
  }
}
```

### 2. Get Attendance Statistics

Retrieves statistics specifically about attendances, including status distribution, duration, and related professionals and patients.

**Endpoint:** `GET /stats/attendances`

**Version:** v1

**Query Parameters:**

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | ISO Date String | No | Start date for filtering (format: YYYY-MM-DD) |
| endDate | ISO Date String | No | End date for filtering (format: YYYY-MM-DD) |
| locationId | String | No | Filter by specific location ID |
| professionalId | String | No | Filter by specific professional ID |
| specialtyId | String | No | Filter by specific specialty ID |

**Response:**

```json
{
  "attendances": {
    "total": 420,
    "monthly": {
      "2023-01": 45,
      "2023-02": 50
      // More months...
    },
    "byStatus": {
      "in_progress": 15,
      "completed": 380,
      "canceled": 20,
      "paused": 5
    },
    "byStatusByMonth": {
      "2023-01": {
        "in_progress": 2,
        "completed": 40,
        "canceled": 2,
        "paused": 1
      },
      // More months...
    },
    "byLocation": {
      "Location A - City X": {
        "inProgress": 8,
        "completed": 180,
        "canceled": 10,
        "paused": 2,
        "total": 200
      },
      // More locations...
    },
    "bySpecialty": {
      "Cardiology": {
        "inProgress": 5,
        "completed": 90,
        "canceled": 4,
        "paused": 1,
        "total": 100
      },
      // More specialties...
    },
    "averageDuration": 25 // in minutes
  },
  "professionals": {
    "total": 25,
    "byAttendanceCount": {
      "Dr. Smith": 85,
      "Dr. Johnson": 65,
      // More professionals (limited to top 10)...
    },
    "byLocation": {
      "Location A": {
        "professionals": [
          { "id": "prof-id-1", "name": "Dr. Smith" },
          // More professionals...
        ],
        "total": 15
      },
      // More locations...
    }
  },
  "patients": {
    "total": 350,
    "byAttendanceCount": {
      "John Doe": 8,
      "Jane Smith": 6,
      // More patients (limited to top 10)...
    }
  }
}
```

## Error Responses

In case of errors, the API will return appropriate HTTP status codes along with error messages:

**400 Bad Request:**
```json
{
  "statusCode": 400,
  "message": "Invalid date range",
  "error": "Bad Request"
}
```

**500 Internal Server Error:**
```json
{
  "statusCode": 500,
  "message": "Internal server error",
  "error": "Internal Server Error"
}
```

## Caching

The statistics endpoints implement caching to improve performance. The cache TTL (Time To Live) is set to 3600 seconds (1 hour) in production environments. In development environments, caching is disabled.

## Rate Limiting

There are no specific rate limits for these endpoints, but general API rate limiting may apply.

## Best Practices

1. Use date ranges to limit the amount of data processed
2. Consider using location, professional, or specialty filters for more targeted statistics
3. Cache responses on the client side when appropriate
4. Implement error handling for failed API calls
