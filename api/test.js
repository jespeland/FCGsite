const { MongoClient } = require('mongodb');

// MongoDB connection string - you'll need to replace this with your actual connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fcg-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = 'fcg-website';
const COLLECTION_NAME = 'deals';

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // First, let's test if the endpoint is working at all
    console.log('Test endpoint called');
    
    try {
        // Check if MongoDB URI is configured
        if (!process.env.MONGODB_URI) {
            return res.json({
                status: 'warning',
                message: 'API endpoint working, but MONGODB_URI not configured',
                timestamp: new Date().toISOString(),
                nextSteps: [
                    'Complete MongoDB Atlas setup',
                    'Add MONGODB_URI to Vercel environment variables',
                    'Redeploy the application'
                ]
            });
        }

        console.log('Testing MongoDB connection...');
        
        // Test MongoDB connection
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Get deal count
        const dealCount = await collection.countDocuments();
        
        // Get sample deals
        const sampleDeals = await collection.find({}).limit(3).toArray();
        
        await client.close();
        
        res.json({
            status: 'success',
            message: 'MongoDB Atlas connection successful!',
            database: DATABASE_NAME,
            collection: COLLECTION_NAME,
            dealCount: dealCount,
            sampleDeals: sampleDeals,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV || 'development'
        });
        
    } catch (error) {
        console.error('MongoDB connection test failed:', error);
        
        res.status(500).json({
            status: 'error',
            message: 'MongoDB connection failed',
            error: error.message,
            timestamp: new Date().toISOString(),
            troubleshooting: {
                checkConnectionString: 'Verify MONGODB_URI environment variable is set correctly',
                checkNetworkAccess: 'Ensure MongoDB Atlas allows connections from anywhere (0.0.0.0/0)',
                checkCredentials: 'Verify username and password in connection string',
                checkClusterStatus: 'Make sure your MongoDB Atlas cluster is running'
            }
        });
    }
}; 