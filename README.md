
Built by https://www.blackbox.ai

---

# CollabHub

## Project Overview

CollabHub is a platform designed to help students find their perfect teammates for various projects in technology, design, business, and more. Users can create profiles showcasing their skills and interests, and discover potential collaborators through a powerful search feature.

## Installation

To set up CollabHub on your local machine, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/collabhub.git
   cd collabhub
   ```

2. **Install the dependencies:**

   Navigate to the backend directory and install the necessary npm packages:

   ```bash
   cd backend
   npm install
   ```

3. **Set up the environment variables:**

   Create a `.env` file in the `backend` directory and provide the necessary MongoDB connection URI:

   ```bash
   MONGODB_URI=your_mongodb_connection_string
   ```

4. **Start the server:**

   You can start the application by running:

   ```bash
   npm run dev
   ```

   The backend will run on `http://localhost:8000` by default.

5. **Open the frontend:**

   Open the `index.html` file in your web browser to access the application.

## Usage

- **Create Profile:** Navigate to the Create Profile section where you can fill out your personal information, skills, and interests to set up your profile.
- **Find Teammates:** Use the search functionality to find other users based on name, skills, or interests.
- **Connect:** Explore profiles and connect with users that share your interests and skills.

## Features

- User-friendly interface with Tailwind CSS for styling.
- Profile picture upload feature for personalized experiences.
- Search functionality to filter profiles by skills, interests, or domains.
- Responsive design for accessibility on different devices.
- Featured profiles showcasing popular or interesting users.

## Dependencies

Here are the main dependencies used in this project:

- **Backend:**
  - `express`: Server framework for Node.js.
  - `mongoose`: MongoDB object modeling for Node.js.
  - `cors`: Middleware to allow Cross-Origin Resource Sharing.
  - `dotenv`: For loading environment variables from a `.env` file.
  - `body-parser`: Middleware to parse incoming request bodies.

## Project Structure

The project is organized into several files and directories as follows:

```
collabhub/
│
├── backend/
│   ├── db.js                # Database connection setup with Mongoose
│   ├── models/              # Mongoose models (e.g., Profile schema)
│   ├── server.js            # Main application server file
│   ├── .env                 # Environment variables for the backend
│   ├── package.json         # Project metadata and dependencies for the backend
│   └── package-lock.json    # Exact versioning of the dependencies
│
├── index.html               # Main entry point for the frontend
├── profile.html             # Profile creation page
├── search.html              # Page for searching profiles
├── script.js                # JavaScript for form submission and search functionality
└── style.css                # Custom styles that extend Tailwind CSS
```

## Conclusion

CollabHub is an expanding platform aimed at fostering collaboration among students by matching them based on their skills and interests. Contributions, suggestions, and enhancements are welcome! Happy collaborating!