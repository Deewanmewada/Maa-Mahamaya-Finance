# Maa Mahamaya Finance

# Project Overview

Maa Mahamaya Finance is a full-stack web application designed to manage financial services including loan applications, approvals, payments, and financial reporting. The platform supports multiple user roles such as customers, businesses, employees, and administrators, each with tailored dashboards and functionalities.

# Features

- User Authentication: Secure registration and login with role-based access control.
- Loan Management: Customers and businesses can apply for loans; employees and admins can approve or reject loan applications.
- Payment Management: Users can manage their payments and view transaction history.
- Financial Reports:Generate and view financial reports for better insights.
- Query Management:Customers and businesses can submit queries; employees and admins can respond.
- Admin Panel:Comprehensive dashboard for administrators to manage users, loans, transactions, and system settings.
- Role-Based Dashboards: Customized views and functionalities based on user roles (customer, business, employee, admin).

# Technology Stack

- Frontend: React.js with Tailwind CSS for styling.
- Backend: Node.js with Express.js framework.
- Database: MongoDB for data storage.
- Authentication: JSON Web Tokens (JWT) for secure authentication.
- Other: Chart.js for data visualization.

## Project Structure

- `client/` - React frontend source code.
- `server/` - Node.js backend source code.
- `client/public/` - Static assets like images and icons.
- `client/src/components/` - React components for various features and pages.
- `server/server.js` - Express server setup and API routes.
- `server/userSchema.js` - Mongoose schemas for database models.

## Running the Project Locally

# Prerequisites

- Node.js and npm installed.
- MongoDB instance running and accessible.
- Environment variables configured in `.env` file (e.g., `MONGODB_URI`, `JWT_SECRET`).

# Backend

1. Navigate to the `server` directory.
2. Install dependencies: `npm install`
3. Start the server: `node server.js`
4. The backend server runs on port `5000`.

# Frontend

1. Navigate to the `client` directory.
2. Install dependencies: `npm install`
3. Start the development server: `npm start`
4. The frontend runs on port `3000`.


# Notes

- The project uses role-based authorization to secure API endpoints.
- Data fetching and state management are handled using React hooks.
- The UI is responsive and styled with Tailwind CSS.
- Error handling and logging are implemented on both frontend and backend.
