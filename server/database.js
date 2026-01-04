const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'musicapp.db');

class DatabaseWrapper {
    constructor() {
        this.db = null;
    }

    connect() {
        try {
            this.db = new Database(DB_PATH);
            this.db.pragma('journal_mode = WAL');
            console.log('Connected to SQLite database');
        } catch (error) {
            console.error('Error opening database:', error);
            throw error;
        }
    }

    initialize() {
        try {
            this.connect();
            this.runSchema();
            console.log('Database initialized successfully');
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    runSchema() {
        const schemaPath = path.join(__dirname, 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');

        try {
            this.db.exec(schema);
            console.log('Schema created successfully');
        } catch (error) {
            console.error('Error running schema:', error);
            throw error;
        }
    }

    seed() {
        const seedPath = path.join(__dirname, 'seed.sql');
        const seedData = fs.readFileSync(seedPath, 'utf8');

        try {
            this.db.exec(seedData);
            console.log('Database seeded successfully');
        } catch (error) {
            console.error('Error seeding database:', error);
            throw error;
        }
    }

    query(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.all(...params);
        } catch (error) {
            console.error('Query error:', error);
            throw error;
        }
    }

    run(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            const info = stmt.run(...params);
            return { id: info.lastInsertRowid, changes: info.changes };
        } catch (error) {
            console.error('Run error:', error);
            throw error;
        }
    }

    get(sql, params = []) {
        try {
            const stmt = this.db.prepare(sql);
            return stmt.get(...params);
        } catch (error) {
            console.error('Get error:', error);
            throw error;
        }
    }

    close() {
        try {
            this.db.close();
            console.log('Database connection closed');
        } catch (error) {
            console.error('Error closing database:', error);
            throw error;
        }
    }
}

module.exports = DatabaseWrapper;
