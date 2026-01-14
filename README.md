# Social Media Application

A full-stack social media application built with a React frontend and a Django backend. This project features real-time chat, user authentication, and profile management.

## Tech Stack

### Frontend
- **React**: Library for building user interfaces.
- **Chakra UI**: Component library for styling.
- **React Router**: For navigation and routing.
- **Axios**: For making HTTP requests to the backend.

### Backend
- **Django**: High-level Python web framework.
- **Django REST Framework**: For building Web APIs.
- **Django Channels**: For handling WebSockets and real-time features (Chat).
- **SimpleJWT**: For JSON Web Token authentication.
- **SQLite**: Default database for development.

## Features

- **User Authentication**: Secure Login and Registration.
- **Create Post**: Users can create text and image posts.
- **Real-time Chat**: Chat with other users instantly using WebSockets.
- **User Profile**: View and edit user profiles.
- **Search**: Search for other users on the platform.

## Setup Instructions

### Prerequisites
- Node.js and npm installed.
- Python installed.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend-main
   ```

2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend-main
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the application:
   ```bash
   npm start
   ```

The application should now be running. The frontend typically runs on `http://localhost:3000` and the backend on `http://localhost:8000`.
