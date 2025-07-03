const { MongoClient } = require('mongodb');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;

// MongoDB connection string - you'll need to replace this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fcg-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = 'fcg-website';
const COLLECTION_NAME = 'deals';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Configure multer for file uploads (memory storage since we can't write to disk in Vercel)
const upload = multer({ 
    storage: multer.memoryStorage(),
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

// MongoDB connection function
async function connectToDatabase() {
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        return client.db(DATABASE_NAME);
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

// Helper to read deals from MongoDB
async function readDeals() {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(COLLECTION_NAME);
        const deals = await collection.find({}).toArray();
        return deals;
    } catch (error) {
        console.error('Error reading deals:', error);
        return [];
    }
}

// Helper to write deals to MongoDB
async function writeDeals(deals) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(COLLECTION_NAME);
        
        // Clear existing deals and insert new ones
        await collection.deleteMany({});
        if (deals.length > 0) {
            await collection.insertMany(deals);
        }
        return true;
    } catch (error) {
        console.error('Error writing deals:', error);
        return false;
    }
}

// Helper to add a single deal to MongoDB
async function addDeal(deal) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(COLLECTION_NAME);
        
        // Get the next ID
        const maxIdResult = await collection.find().sort({ id: -1 }).limit(1).toArray();
        const nextId = maxIdResult.length > 0 ? maxIdResult[0].id + 1 : 1;
        
        deal.id = nextId;
        const result = await collection.insertOne(deal);
        return deal;
    } catch (error) {
        console.error('Error adding deal:', error);
        throw error;
    }
}

// Helper to delete a deal from MongoDB
async function deleteDeal(id) {
    try {
        const db = await connectToDatabase();
        const collection = db.collection(COLLECTION_NAME);
        
        const result = await collection.deleteOne({ id: parseInt(id) });
        return result.deletedCount > 0;
    } catch (error) {
        console.error('Error deleting deal:', error);
        return false;
    }
}

// Helper to upload image to Cloudinary
async function uploadToCloudinary(file) {
    const b64 = Buffer.from(file.buffer).toString('base64');
    const dataURI = `data:${file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
        folder: 'fcg-closings',
        public_id: file.originalname.split('.')[0] + '_' + Date.now(),
        overwrite: false,
    });
    return result.secure_url;
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
            const deals = await readDeals();
            console.log('Returning deals:', deals.length);
            res.json(deals);
            return;
        }

        if (req.method === 'POST' && (requestPath === '/api/deals' || requestPath === '/deals')) {
            console.log('Adding new deal:', req.body);
            
            try {
                const newDeal = await addDeal(req.body);
                console.log('Deal saved successfully:', newDeal);
                res.status(201).json(newDeal);
            } catch (error) {
                console.error('Failed to save deal:', error);
                res.status(500).json({ error: 'Failed to save deal', details: error.message });
            }
            return;
        }

        if (req.method === 'DELETE' && (requestPath.startsWith('/api/deals/') || requestPath.startsWith('/deals/'))) {
            const id = parseInt(requestPath.split('/').pop(), 10);
            
            try {
                const deleted = await deleteDeal(id);
                if (deleted) {
                    res.status(204).end();
                } else {
                    res.status(404).json({ error: 'Deal not found' });
                }
            } catch (error) {
                console.error('Failed to delete deal:', error);
                res.status(500).json({ error: 'Failed to delete deal' });
            }
            return;
        }

        // Handle image upload
        if (req.method === 'POST' && (requestPath === '/api/upload-image' || requestPath === '/upload-image')) {
            upload.single('image')(req, res, async (err) => {
                if (err) {
                    res.status(400).json({ error: err.message });
                    return;
                }
                if (!req.file) {
                    res.status(400).json({ error: 'No image file uploaded' });
                    return;
                }
                try {
                    // Upload to Cloudinary
                    const imageUrl = await uploadToCloudinary(req.file);
                    res.json({ 
                        success: true, 
                        imagePath: imageUrl,
                        filename: req.file.originalname,
                        originalName: req.file.originalname,
                        note: 'Image uploaded to Cloudinary'
                    });
                } catch (uploadError) {
                    res.status(500).json({ 
                        error: 'Failed to upload image',
                        details: uploadError.message 
                    });
                }
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