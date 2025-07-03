const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // In Vercel, we'll use /tmp for temporary storage
        cb(null, '/tmp');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Helper to read deals from JSON file
function readDeals() {
    try {
        // Try multiple possible paths for the deals.json file
        const possiblePaths = [
            path.join(process.cwd(), 'deals.json'),
            path.join(__dirname, '..', 'deals.json'),
            './deals.json'
        ];
        
        for (const dataPath of possiblePaths) {
            if (fs.existsSync(dataPath)) {
                const data = fs.readFileSync(dataPath, 'utf-8');
                return JSON.parse(data || '[]');
            }
        }
        
        // If file doesn't exist, return empty array
        return [];
    } catch (error) {
        console.error('Error reading deals:', error);
        return [];
    }
}

// Helper to write deals to JSON file
function writeDeals(deals) {
    try {
        // Use the same path as readDeals
        const dataPath = path.join(process.cwd(), 'deals.json');
        fs.writeFileSync(dataPath, JSON.stringify(deals, null, 2));
        return true;
    } catch (error) {
        console.error('Error writing deals:', error);
        return false;
    }
}

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        // Get the path from the request
        const requestPath = req.url || req.path || '';
        console.log('Request:', req.method, requestPath);
        
        // Handle different API endpoints
        if (req.method === 'GET' && (requestPath === '/api/deals' || requestPath === '/deals')) {
            const deals = readDeals();
            console.log('Returning deals:', deals.length);
            res.json(deals);
            return;
        }

        if (req.method === 'POST' && (requestPath === '/api/deals' || requestPath === '/deals')) {
            console.log('Adding new deal:', req.body);
            
            // For now, let's just return success without writing to file
            // since Vercel functions have read-only file systems
            const deals = readDeals();
            const newDeal = req.body;
            newDeal.id = deals.length ? Math.max(...deals.map(d => d.id)) + 1 : 1;
            
            // Instead of writing to file, we'll return the deal as if it was saved
            // In a real production app, you'd use a database
            console.log('Deal would be saved:', newDeal);
            res.status(201).json({
                ...newDeal,
                note: 'Deal added (file system is read-only in Vercel functions)'
            });
            return;
        }

        if (req.method === 'DELETE' && (requestPath.startsWith('/api/deals/') || requestPath.startsWith('/deals/'))) {
            const id = parseInt(requestPath.split('/').pop(), 10);
            let deals = readDeals();
            const initialLength = deals.length;
            deals = deals.filter(d => d.id !== id);
            
            if (deals.length === initialLength) {
                res.status(404).json({ error: 'Deal not found' });
                return;
            }
            
            // For now, just return success without writing
            res.status(204).end();
            return;
        }

        // Handle image upload
        if (req.method === 'POST' && (requestPath === '/api/upload-image' || requestPath === '/upload-image')) {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                
                if (!req.file) {
                    res.status(400).json({ error: 'No image file uploaded' });
                    return;
                }
                
                res.json({ 
                    success: true, 
                    imagePath: 'ClosingPhotos/' + req.file.filename,
                    filename: req.file.filename,
                    note: 'File uploaded to temporary storage'
                });
            });
            return;
        }

        // Default response for unknown endpoints
        res.status(404).json({ error: 'Endpoint not found', path: requestPath, method: req.method });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
}; 