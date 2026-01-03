const Database = require('../database');

async function seedDatabase() {
    const db = new Database();

    try {
        console.log('Connecting to database...');
        await db.connect();

        console.log('Seeding database with sample data...');
        await db.seed();

        console.log('Database seeded successfully!');
        await db.close();
    } catch (error) {
        console.error('Failed to seed database:', error);
        process.exit(1);
    }
}

seedDatabase();
