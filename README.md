# Vibesnap _ SOCIAL MEDIA FEED APP

## Overview
This project is a social media feed web application designed with React.js. It features user authentication, infinite scrolling, and post creation with multimedia support, optimized for mobile and tablet devices. Users can register, log in, create and view posts with text, images, and videos, and interact with other users through personalized profiles.

---

## Features

### 1. **User Authentication**
- Email/Password registration and login using Firebase Authentication.
- Google Login support for easy access.

### 2. **Social Media Feed**
- Displays posts with text, images, and videos along with timestamps.
- Multi-image upload for posts.
- Users can create posts by selecting images from the gallery or capturing directly from the camera.

### 3. **Infinite Scrolling**
- Dynamically loads 20 posts at a time as users scroll down.
- Smooth and seamless data fetching using Firebase Firestore.

### 4. **User Profiles**
- View and edit profiles with options to update the bio, profile picture, and view user posts.

### 5. **Video Handling**
- Videos automatically play when they enter the viewport and pause when they exit.

### 6. **Share Option**
- Share posts with other applications using the Web Share API.

### 7. **Performance Optimization**
- Fast loading times and smooth interactions using efficient data fetching, optimized images, and lazy-loading techniques.

---

## Installation and Setup

### Prerequisites
Ensure that you have the following installed:
- Node.js and npm
- Git

### Steps
1. Clone the repository:
   ```bash
   git clone <repository-link>
   cd social-media-feed
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up Firebase:
   - Go to the [Firebase Console](https://console.firebase.google.com/).
   - Create a project and enable Authentication, Firestore, and Storage.
   - Copy the Firebase configuration and add it to a `.env` file:
     ```env
     VITE_API_KEY=<your-api-key>
     VITE_AUTH_DOMAIN=<your-auth-domain>
     VITE_PROJECT_ID=<your-project-id>
     VITE_STORAGE_BUCKET=<your-storage-bucket>
     VITE_MESSAGING_SENDER_ID=<your-messaging-sender-id>
     VITE_APP_ID=<your-app-id>
     ```
4. Start the development server:
   ```bash
   npm run dev
   ```
5. Open the application in your browser at `http://localhost:5173`.

---

## Deployment

### Deploy on Vercel
1. Connect the repository to [Vercel](https://vercel.com/).
2. Set up environment variables in Vercel with your Firebase configuration.
3. Deploy the application and retrieve the live URL.

---

## Technologies Used

### Frontend
- React.js
- Tailwind CSS
- React Router

### Backend
- Firebase Authentication
- Firebase Firestore
- Firebase Storage

### Tools
- Vite
- Git

---

## Demo
- **Hosted Application**: [Live Demo Link](#) (Replace with the actual link)
- **GitHub Repository**: [Repository Link](#) (Replace with the actual link)

---

## Screenshots

### Login Page
![Login Page](#) (Add screenshot link)

### Social Media Feed
![Feed](#) (Add screenshot link)

### User Profile
![Profile](#) (Add screenshot link)

---

## Future Improvements
- Add support for post comments and likes.
- Implement notifications for user interactions.
- Enhance post filtering and search functionality.
- Improve accessibility (WCAG compliance).

---

## Acknowledgments
Special thanks to [Figma Design Resource](https://www.figma.com/design/b60fWxRIqDqj0tZq3EU0rL/Build-an-Engaging-Social-Media-Feed-with-Interactive-Features?node-id=0-1&t=Sg1FoyVKP7L7QN4v-1).

---

## License
This project is licensed under the MIT License. See the `LICENSE` file for details.
