const fs = require('fs');
const path = require('path');

module.exports = async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    try {
        if (req.method === 'GET') {
            // Test reading deals.json
            const deals = readDeals();
            res.json({ 
                success: true, 
                dealsCount: deals.length,
                deals: deals,
                message: 'Test endpoint working'
            });
            return;
        }

        if (req.method === 'POST') {
            // Test writing to deals.json
            const deals = readDeals();
            const testDeal = {
                id: deals.length + 1,
                title: 'Test Deal',
                value: '$100K',
                industry: 'Test',
                date: 'Q1 2024',
                description: 'This is a test deal'
            };
            
            deals.push(testDeal);
            const writeSuccess = writeDeals(deals);
            
            res.json({ 
                success: writeSuccess,
                message: writeSuccess ? 'Test deal added successfully' : 'Failed to write deal',
                dealsCount: deals.length
            });
            return;
        }

    } catch (error) {
        console.error('Test API Error:', error);
        res.status(500).json({ 
            error: 'Test API error', 
            details: error.message,
            stack: error.stack
        });
    }
};

// Helper to read deals from JSON file
function readDeals() {
    try {
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
        
        return [];
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