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
        const dataPath = path.join(process.cwd(), 'deals.json');
        if (!fs.existsSync(dataPath)) return [];
        const data = fs.readFileSync(dataPath, 'utf-8');
        return JSON.parse(data || '[]');
    } catch (error) {
        console.error('Error reading deals:', error);
        return [];
    }
}

// Helper to write deals to JSON file
function writeDeals(deals) {
    try {
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
        // Handle different API endpoints
        if (req.method === 'GET' && req.url === '/api/deals') {
            const deals = readDeals();
            res.json(deals);
            return;
        }

        if (req.method === 'POST' && req.url === '/api/deals') {
            const deals = readDeals();
            const newDeal = req.body;
            newDeal.id = deals.length ? Math.max(...deals.map(d => d.id)) + 1 : 1;
            deals.push(newDeal);
            
            if (writeDeals(deals)) {
                res.status(201).json(newDeal);
            } else {
                res.status(500).json({ error: 'Failed to save deal' });
            }
            return;
        }

        if (req.method === 'DELETE' && req.url.startsWith('/api/deals/')) {
            const id = parseInt(req.url.split('/').pop(), 10);
            let deals = readDeals();
            const initialLength = deals.length;
            deals = deals.filter(d => d.id !== id);
            
            if (deals.length === initialLength) {
                res.status(404).json({ error: 'Deal not found' });
                return;
            }
            
            if (writeDeals(deals)) {
                res.status(204).end();
            } else {
                res.status(500).json({ error: 'Failed to delete deal' });
            }
            return;
        }

        // Handle image upload
        if (req.method === 'POST' && req.url === '/api/upload-image') {
            upload.single('image')(req, res, (err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                
                if (!req.file) {
                    res.status(400).json({ error: 'No image file uploaded' });
                    return;
                }
                
                // For Vercel, we'll return the file info but note that files are temporary
                // In a real app, you'd upload to a cloud storage service like AWS S3
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
        res.status(404).json({ error: 'Endpoint not found' });

    } catch (error) {
        console.error('API Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 