# FCG Website with Admin Backend

This is a website for Fortune Capital Group with an admin dashboard to manage closed deals.

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Backend Server
```bash
npm start
```
The server will run on `http://localhost:3001`

### 3. Access the Website
- Main website: Open any HTML file in your browser (e.g., `index.html`)
- Admin dashboard: Open `admin.html` in your browser

## Admin Dashboard

### Login Credentials
- **Username:** admin
- **Password:** password

### Features
- View all closed deals in a table format
- Add new deals with the "Add New Deal" button
- Delete existing deals
- Export deals to JSON file

### API Endpoints
- `GET /api/deals` - Get all deals
- `POST /api/deals` - Add a new deal
- `DELETE /api/deals/:id` - Delete a deal by ID

## How It Works

1. **Backend Server** (`server.js`): Express server that manages deals data in `deals.json`
2. **Admin Page** (`admin.html`): Dashboard to manage deals via API calls
3. **Closings Page** (`closings.html`): Displays deals fetched from the API
4. **Data Storage**: All deals are stored in `deals.json`

## File Structure
```
├── server.js          # Backend server
├── deals.json         # Data storage
├── package.json       # Dependencies
├── admin.html         # Admin dashboard
├── closings.html      # Public deals page
├── index.html         # Homepage
├── about.html         # About page
├── team.html          # Team page
├── contact.html       # Contact page
└── *.css              # Styling files
```

## Notes
- The backend server must be running for the admin dashboard and closings page to work properly
- If the server is not running, the closings page will show an error message
- The admin link in the footer is hidden on mobile devices for security 