const Database = require('../database');

async function initDatabase() {
    const db = new Database();

    try {
        console.log('Initializing database...');
        await db.initialize();
        console.log('Database initialized successfully!');
        await db.close();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        process.exit(1);
    }
}

initDatabase();
