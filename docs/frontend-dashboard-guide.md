# Frontend Dashboard Guide

This document provides guidance for the frontend team on building dashboards using the statistics APIs available in the backend.

## Available Endpoints

The backend provides two main statistics endpoints:

1. **General Stats**: `GET /stats`
2. **Attendance Stats**: `GET /stats/attendances`

Both endpoints support filtering by date range and location, with the attendance stats endpoint offering additional filtering options.

## General Stats Endpoint

### Endpoint: `GET /stats`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | ISO Date String | No | Start date for filtering (default: current year start) |
| endDate | ISO Date String | No | End date for filtering (default: current year end) |
| locationId | String | No | Filter by specific location |

### Response Structure

The response includes statistics for:

- **Schedules**: Total schedules, monthly distribution, vacancy information
- **Appointments**: Total appointments, status breakdown, specialty and location distribution
- **Professionals**: Total count and distribution by location
- **Patients**: Total count
- **Employees**: Total count and distribution by type

## Attendance Stats Endpoint

### Endpoint: `GET /stats/attendances`

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| startDate | ISO Date String | No | Start date for filtering (default: current year start) |
| endDate | ISO Date String | No | End date for filtering (default: current year end) |
| locationId | String | No | Filter by specific location |
| professionalId | String | No | Filter by specific professional |
| specialtyId | String | No | Filter by specific specialty |

### Response Structure

The response includes:

- **Attendances**:
  - Total count
  - Monthly distribution
  - Status breakdown (in_progress, completed, canceled, paused)
  - Distribution by location and specialty
  - Average duration in minutes

- **Professionals**:
  - Total count
  - Top professionals by attendance count
  - Distribution by location

- **Patients**:
  - Total count
  - Top patients by attendance count

## Dashboard Design Recommendations

### Main Dashboard

The main dashboard should provide a high-level overview with:

1. **Key Performance Indicators (KPIs)**:
   - Total appointments
   - Total attendances
   - Attendance completion rate
   - Average attendance duration

2. **Time Series Charts**:
   - Monthly appointments and attendances
   - Status distribution over time

3. **Distribution Charts**:
   - Appointments and attendances by location (bar chart)
   - Appointments and attendances by specialty (pie chart)
   - Status distribution (donut chart)

### Appointments Dashboard

A dedicated appointments dashboard should include:

1. **Appointment Status Metrics**:
   - Scheduled vs. attended vs. missed vs. canceled
   - Conversion rate from schedule to attendance

2. **Schedule Utilization**:
   - Vacancy fill rate
   - Available slots by location and specialty

3. **Patient Demographics**:
   - Holders vs. dependents
   - Top appointment requesters

### Attendance Dashboard

A dedicated attendance dashboard should include:

1. **Attendance Metrics**:
   - Completion rate
   - Average duration
   - Status distribution

2. **Professional Performance**:
   - Top professionals by attendance count
   - Average attendance duration by professional

3. **Specialty Analysis**:
   - Attendances by specialty
   - Status distribution by specialty

4. **Location Analysis**:
   - Attendances by location
   - Status distribution by location

## Implementation Guidelines

### Data Fetching

1. Use a state management solution (Redux, Zustand, etc.) to store and cache API responses
2. Implement date range selectors that update all dashboard components
3. Add location/professional/specialty filters where applicable

### Visualization Components

Recommended chart types for different data:

- **Time Series**: Line charts for monthly data
- **Categorical Comparisons**: Bar charts for location/specialty distribution
- **Part-to-Whole Relationships**: Pie/donut charts for status distribution
- **KPIs**: Number cards with trend indicators

### Responsive Design

Ensure the dashboard is responsive:

1. On large screens: Display all charts in a grid layout
2. On medium screens: Stack charts in a logical order
3. On small screens: Show KPIs first, followed by the most important charts

### Interactivity

Add interactive features:

1. Date range selectors
2. Location/professional/specialty filters
3. Drill-down capabilities (e.g., click on a location to see details)
4. Export options for charts and data

## Example Dashboard Layout

```
+---------------------+---------------------+---------------------+
|                     |                     |                     |
|  Total Appointments |  Total Attendances  |  Completion Rate    |
|                     |                     |                     |
+---------------------+---------------------+---------------------+
|                                                                 |
|  Monthly Appointments and Attendances (Line Chart)              |
|                                                                 |
+-----------------------------------------------------------------+
|                                           |                     |
|  Status Distribution (Donut Chart)        |  Top Professionals  |
|                                           |                     |
+-------------------------------------------+---------------------+
|                                           |                     |
|  Location Distribution (Bar Chart)        |  Top Specialties    |
|                                           |                     |
+-------------------------------------------+---------------------+
```

## Data Refresh Strategy

1. **Initial Load**: Fetch data for the current year on dashboard load
2. **User-Triggered**: Refresh data when filters are changed
3. **Automatic**: Consider implementing a refresh every 5-10 minutes for real-time dashboards

## Error Handling

1. Display loading states during API calls
2. Show appropriate error messages if API calls fail
3. Provide fallback UI when data is unavailable
4. Implement retry mechanisms for failed API calls

## Performance Considerations

1. Use pagination or data aggregation for large datasets
2. Implement lazy loading for charts below the fold
3. Consider using web workers for complex data processing
4. Optimize re-renders using memoization techniques

## Accessibility Guidelines

1. Ensure all charts have proper ARIA labels
2. Provide text alternatives for visual data
3. Use color schemes that are accessible to color-blind users
4. Ensure keyboard navigation works for all interactive elements

By following these guidelines, the frontend team can build comprehensive, interactive, and user-friendly dashboards that effectively visualize the statistics provided by the backend APIs.
