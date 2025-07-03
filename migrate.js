const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// You'll need to replace this with your actual MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://fcg-admin:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority';
const DATABASE_NAME = 'fcg-website';
const COLLECTION_NAME = 'deals';

async function migrateData() {
    try {
        console.log('Starting data migration...');
        
        // Check if deals.json exists
        const dealsPath = path.join(__dirname, 'deals.json');
        if (!fs.existsSync(dealsPath)) {
            console.log('No deals.json file found. Nothing to migrate.');
            return;
        }
        
        // Read existing deals
        console.log('Reading existing deals from deals.json...');
        const dealsData = fs.readFileSync(dealsPath, 'utf-8');
        const deals = JSON.parse(dealsData);
        
        if (deals.length === 0) {
            console.log('No deals found in deals.json. Nothing to migrate.');
            return;
        }
        
        console.log(`Found ${deals.length} deals to migrate.`);
        
        // Connect to MongoDB
        console.log('Connecting to MongoDB Atlas...');
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        const db = client.db(DATABASE_NAME);
        const collection = db.collection(COLLECTION_NAME);
        
        // Check if collection already has data
        const existingCount = await collection.countDocuments();
        if (existingCount > 0) {
            console.log(`Warning: Collection already has ${existingCount} documents.`);
            console.log('Do you want to overwrite existing data? (y/n)');
            // For now, we'll just add the data without overwriting
            console.log('Adding new deals without overwriting existing ones...');
        }
        
        // Insert deals
        console.log('Inserting deals into MongoDB...');
        const result = await collection.insertMany(deals);
        console.log(`Successfully migrated ${result.insertedCount} deals to MongoDB Atlas!`);
        
        // Close connection
        await client.close();
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
        console.log('\nTroubleshooting tips:');
        console.log('1. Make sure you have the correct MongoDB connection string');
        console.log('2. Check that your MongoDB Atlas cluster is running');
        console.log('3. Verify your network access settings allow connections from anywhere');
        console.log('4. Ensure your database user has read/write permissions');
    }
}

// Run migration
migrateData(); 