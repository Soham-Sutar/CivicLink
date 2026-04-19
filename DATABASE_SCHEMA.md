# CivicLink Database Schema and Docker Setup

As requested, here is a recommended PostgreSQL database schema and a sample `docker-compose.yml` file to run it.

---

## PostgreSQL Docker Compose

This `docker-compose.yml` file will set up a PostgreSQL service, a persistent volume for its data, and an Adminer service for database management.

```yaml
# docker-compose.yml
version: '3.8'
services:
  db:
    image: postgres:15
    container_name: civiclink_db
    restart: always
    environment:
      POSTGRES_USER: civiclink_user
      POSTGRES_PASSWORD: your_strong_password # Change this in production
      POSTGRES_DB: civiclink
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  adminer:
    image: adminer
    restart: always
    ports:
      - 8080:8080

volumes:
  postgres_data:
```

To run this, save it as `docker-compose.yml` and execute `docker-compose up -d` in your terminal. You can then access Adminer at `http://localhost:8080`.

---

## SQL Table Schema

Here are the suggested SQL statements to create the necessary tables in your `civiclink` database.

### 1. `users` Table
Stores information about all users, including citizens and admins.

```sql
CREATE TYPE user_role AS ENUM ('USER', 'DEPT_ADMIN', 'MAIN_ADMIN');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    department VARCHAR(100), -- e.g., 'Potholes', 'Streetlights'. NULL for non-dept admins.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add an index for faster email lookups
CREATE INDEX idx_users_email ON users(email);
```

### 2. `reports` Table
Stores all the civic issue reports submitted by users.

```sql
CREATE TYPE report_status AS ENUM ('Pending', 'In Progress', 'Resolved', 'Rejected');

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    status report_status NOT NULL DEFAULT 'Pending',
    image_url VARCHAR(255),
    latitude DECIMAL(9, 6) NOT NULL,
    longitude DECIMAL(9, 6) NOT NULL,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for common query patterns
CREATE INDEX idx_reports_user_id ON reports(user_id);
CREATE INDEX idx_reports_category ON reports(category);
CREATE INDEX idx_reports_status ON reports(status);
```

### 3. `report_updates` Table
Stores a history of status changes and comments for each report. This is useful for auditing and providing users with a timeline of actions.

```sql
CREATE TABLE report_updates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
    updated_by_user_id UUID NOT NULL REFERENCES users(id),
    previous_status report_status,
    new_status report_status,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add index for efficient retrieval of updates for a specific report
CREATE INDEX idx_report_updates_report_id ON report_updates(report_id);
```