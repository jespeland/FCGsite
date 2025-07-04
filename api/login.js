const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Get hashed password and JWT secret from environment variables
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || '$2a$10$XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'; // Replace with real hash
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwtkey';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    try {
        const { username, password } = req.body || {};
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password required' });
            return;
        }

        if (username !== ADMIN_USERNAME) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Compare password with hash
        const valid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
        if (!valid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate JWT
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '2h' });
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}; 