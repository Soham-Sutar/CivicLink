# CivicLink 🏛️

**CivicLink** is a comprehensive digital platform designed to bridge the gap between citizens and municipal authorities. It empowers residents to report local infrastructure and service issues directly to the concerned departments, while providing government officials with robust tools to track, manage, and resolve these problems efficiently.

## 🚀 Features

### For Citizens (Users)
- **Problem Reporting:** Easily file reports for issues like potholes, broken streetlights, garbage overflow, and more.
- **AI Category Suggestion:** Integrated simulation of Google Gemini AI to automatically suggest the most relevant department based on issue descriptions and images.
- **Interactive Map:** View and tag the exact location of issues using an interactive map interface.
- **Personal Dashboard:** Track the status of your reported issues in real-time.

### For Department Administrators
- **Focused Workflows:** Dashboards filtered specifically for their department (e.g., Water, Electricity, Sanitation).
- **Status Management:** Update report statuses from "Pending" to "In Progress", "Resolved", or "Rejected".
- **Visual Tracking:** Use map views to identify clusters of issues and optimize field visits.

### For Municipal Leadership (Main Admins)
- **High-Level Analytics:** Comprehensive charts and data visualizations using **Recharts** to monitor city-wide performance.
- **Department Performance Tracking:** Compare resolution times and volumes across different municipal sectors.
- **System Oversight:** Full visibility into all reports across the city.

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS
- **Data Visualization:** Recharts
- **Icons:** Lucide React
- **Animations:** Custom CSS & Tailwind transitions
- **Database (Recommended):** PostgreSQL (Schema provided in `DATABASE_SCHEMA.md`)

## 📂 Project Structure

```text
├── components/          # Reusable UI components (Dashboards, Forms, UI elements)
├── context/             # Auth and State management
├── services/            # API and AI service integrations
├── types.ts             # TypeScript definitions
├── constants.ts         # Application constants
├── DATABASE_SCHEMA.md   # SQL schema and Docker setup for the backend
└── App.tsx              # Main application entry point
```

## ⚙️ Installation & Setup

### Prerequisites
- Node.js (v18+)
- npm or yarn

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/civiclink.git
   cd civiclink
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Database Setup (Optional):**
   Refer to `DATABASE_SCHEMA.md` for the PostgreSQL table definitions and a `docker-compose.yml` to spin up a local instance.

## 🧠 AI Integration (Gemini)
The project includes a `geminiService.ts` which simulates the use of the **Google Gemini API**. In a production environment, this service can be extended to use the `@google/genai` SDK to provide real image analysis and natural language processing for automated ticket classification.
