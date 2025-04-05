require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const connectDB = require('./db');
const Profile = require('./models/Profile');

const app = express();
const PORT = process.env.PORT || 8000;

// Connect to MongoDB or use in-memory data
let useDB = false;
let profiles = [
  {
    id: '1',
    name: "Demo User",
    email: "demo@example.com",
    bio: "This is a demo profile using in-memory data",
    skills: ["JavaScript", "HTML", "CSS"],
    domains: ["tech"],
    profilePic: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    createdAt: new Date()
  }
];

// Attempt MongoDB connection in background
(async () => {
  try {
    const dbConnected = await connectDB();
    if (dbConnected) {
      useDB = true;
      console.log('Switched to MongoDB database');
      // Optionally load initial data from DB
      const dbProfiles = await Profile.find().sort({ createdAt: -1 });
      if (dbProfiles.length > 0) {
        profiles = dbProfiles;
      }
    }
  } catch (err) {
    console.log('Using in-memory data (MongoDB connection failed)');
  }
})();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '.')));

// API Endpoints
app.get('/api/profiles', async (req, res) => {
    try {
        if (useDB) {
            const data = await Profile.find().sort({ createdAt: -1 });
            return res.json(data);
        }
        return res.json(profiles);
    } catch (err) {
        console.error('Error fetching profiles:', err);
        res.status(500).json({ message: 'Error fetching profiles' });
    }
});

app.post('/api/profiles', async (req, res) => {
    try {
        const { name, email, bio, skills, domains } = req.body;
        
        // Input validation
        if (!name || !email || !bio || !skills || !domains) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        if (useDB) {
            // Check for duplicate email
            const existingProfile = await Profile.findOne({ email });
            if (existingProfile) {
                return res.status(400).json({ message: 'Email already exists' });
            }

            const newProfile = new Profile({
                name,
                email,
                bio,
                skills: skills.filter(skill => skill.trim() !== ''),
                domains,
                profilePic: req.body.profilePic || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
            });

            const savedProfile = await newProfile.save();
            return res.status(201).json(savedProfile);
        } else {
            // In-memory mode
            const newProfile = {
                id: Date.now().toString(),
                name,
                email,
                bio,
                skills: skills.filter(skill => skill.trim() !== ''),
                domains,
                profilePic: req.body.profilePic || 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg',
                createdAt: new Date()
            };
            profiles.push(newProfile);
            return res.status(201).json(newProfile);
        }
    } catch (err) {
        console.error('Error creating profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

app.get('/api/profiles/search', async (req, res) => {
    try {
        const { q, domain } = req.query;
        
        if (useDB) {
            let query = {};
            if (domain) query.domains = domain;
            if (q) {
                query.$or = [
                    { name: { $regex: q, $options: 'i' } },
                    { bio: { $regex: q, $options: 'i' } },
                    { skills: { $regex: q, $options: 'i' } }
                ];
            }
            const results = await Profile.find(query);
            return res.json(results);
        } else {
            // In-memory search
            let results = [...profiles];
            if (domain) {
                results = results.filter(p => p.domains.includes(domain));
            }
            if (q) {
                const searchTerm = q.toLowerCase();
                results = results.filter(p => 
                    p.name.toLowerCase().includes(searchTerm) ||
                    p.bio.toLowerCase().includes(searchTerm) ||
                    p.skills.some(skill => skill.toLowerCase().includes(searchTerm))
                );
            }
            return res.json(results);
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Serve frontend
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});