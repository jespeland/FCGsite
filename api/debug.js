module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    const mongoUri = process.env.MONGODB_URI;
    
    if (!mongoUri) {
        return res.json({
            status: 'error',
            message: 'MONGODB_URI environment variable is not set',
            timestamp: new Date().toISOString()
        });
    }

    // Hide the password for security
    const maskedUri = mongoUri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
    
    res.json({
        status: 'info',
        message: 'MongoDB URI configuration check',
        hasMongoUri: !!mongoUri,
        uriLength: mongoUri.length,
        maskedUri: maskedUri,
        timestamp: new Date().toISOString(),
        checks: {
            startsWithMongoDb: mongoUri.startsWith('mongodb+srv://'),
            containsFcgAdmin: mongoUri.includes('fcg-admin'),
            containsPassword: mongoUri.includes('<password>') ? 'NEEDS_PASSWORD_REPLACEMENT' : 'PASSWORD_SET',
            containsCluster: mongoUri.includes('cluster'),
            containsRetryWrites: mongoUri.includes('retryWrites=true'),
            containsWMajority: mongoUri.includes('w=majority')
        }
    });
}; 