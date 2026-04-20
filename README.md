# School Management API

A Node.js + Express.js + MySQL project to manage school data.

## Features

- Add a new school using API
- Retrieve schools sorted by proximity to user location
- Input validation for all required fields
- MySQL database integration
- Hosted backend and database support

## Tech Stack

- Node.js
- Express.js
- MySQL

## API Endpoints

### 1. Add School
**Method:** POST  
**Endpoint:** `/addSchool`

**Request Body:**
```json
{
  "name": "Green Valley School",
  "address": "Baner, Pune",
  "latitude": 18.559,
  "longitude": 73.7868
}
