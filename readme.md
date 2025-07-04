# Fortune Capital Group (FCG) Website

**Author:** Jakob Espeland

---

## Overview
This is the official website and admin dashboard for Fortune Capital Group (FCG). It features a public-facing site and a secure admin system for managing closed deals, including image uploads and persistent storage.

---

## Tech Stack

### Frontend
- **HTML5 & CSS3**: Core structure and styling for all pages.
- **Vanilla JavaScript**: Handles dynamic content loading, admin dashboard logic, and API communication.
- **Responsive Design**: Custom CSS ensures the site is mobile-friendly and looks great on all devices.

### Backend (API)
- **Node.js**: JavaScript runtime for server-side logic.
- **Vercel Serverless Functions**: All backend logic is implemented as serverless functions for easy deployment and scalability.
- **Express-style API**: RESTful endpoints for deals management, image upload, and authentication.

### Database
- **MongoDB Atlas**: Cloud-hosted NoSQL database for persistent storage of deals. Used for all CRUD operations on deals.
- **MongoDB Node.js Driver**: Connects the backend to MongoDB Atlas.

### Authentication & Security
- **bcryptjs**: Securely hashes and verifies admin passwords.
- **jsonwebtoken (JWT)**: Issues and verifies tokens for admin authentication. All admin actions require a valid JWT.
- **Environment Variables (Vercel)**: All secrets (DB URI, JWT secret, Cloudinary keys, admin password hash) are stored securely in Vercel environment variables.

### Image Storage
- **Cloudinary**: Cloud-based image hosting. All deal images are uploaded to Cloudinary and served via public URLs.
- **multer**: Handles file uploads in serverless functions (in-memory, then sent to Cloudinary).

### Deployment & Hosting
- **Vercel**: Hosts the static frontend and all serverless backend functions. Handles routing, environment variables, and continuous deployment from Git.
- **vercel.json**: Custom routing for API endpoints.

---

## Key Features
- **Public Website**: About, Team, Closings, and Contact pages.
- **Admin Dashboard**: Secure login, add/edit/delete deals, image upload, and export functionality.
- **Persistent Data**: All deals and images are stored in the cloud and persist across deployments.
- **Modern Security**: Passwords are never stored in plaintext; all admin actions require JWT authentication.
- **Cloud Image Hosting**: Images are uploaded to Cloudinary and accessible from anywhere.
- **Mobile Friendly**: Fully responsive design.

---

## Environment Variables (Required)
- `MONGODB_URI`: MongoDB Atlas connection string
- `CLOUDINARY_CLOUD_NAME`: Cloudinary cloud name
- `CLOUDINARY_API_KEY`: Cloudinary API key
- `CLOUDINARY_API_SECRET`: Cloudinary API secret
- `ADMIN_USERNAME`: Admin username (default: admin)
- `ADMIN_PASSWORD_HASH`: bcrypt hash of admin password
- `JWT_SECRET`: Secret key for signing JWTs

---

## Author
**Jakob Espeland**

---

## License
This project is proprietary and for Fortune Capital Group use only.
