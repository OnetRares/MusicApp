const express = require('express');
const cors = require('cors');
const Database = require('./database');

const app = express();
const db = new Database();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize database
db.initialize().catch(console.error);

// ==================== SONGS ENDPOINTS ====================

// Get all songs
app.get('/api/songs', async (req, res) => {
    try {
        const { mood, search } = req.query;
        let sql = `
      SELECT 
        s.*, 
        a.name as artist_name, 
        al.title as album_title,
        COALESCE(ul.song_id IS NOT NULL, 0) as is_liked
      FROM songs s
      JOIN artists a ON s.artist_id = a.id
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN user_likes ul ON s.id = ul.song_id AND ul.user_id = 1
      WHERE 1=1
    `;
        const params = [];

        if (mood && mood !== 'All') {
            sql += ' AND s.mood = ?';
            params.push(mood);
        }

        if (search) {
            sql += ' AND (s.title LIKE ? OR a.name LIKE ? OR al.title LIKE ?)';
            const searchParam = `%${search}%`;
            params.push(searchParam, searchParam, searchParam);
        }

        sql += ' ORDER BY s.created_at DESC';

        const songs = await db.query(sql, params);
        res.json(songs);
    } catch (error) {
        console.error('Error fetching songs:', error);
        res.status(500).json({ error: 'Failed to fetch songs' });
    }
});

// Get song by ID
app.get('/api/songs/:id', async (req, res) => {
    try {
        const sql = `
      SELECT 
        s.*, 
        a.name as artist_name, 
        al.title as album_title,
        COALESCE(ul.song_id IS NOT NULL, 0) as is_liked
      FROM songs s
      JOIN artists a ON s.artist_id = a.id
      LEFT JOIN albums al ON s.album_id = al.id
      LEFT JOIN user_likes ul ON s.id = ul.song_id AND ul.user_id = 1
      WHERE s.id = ?
    `;
        const song = await db.get(sql, [req.params.id]);

        if (!song) {
            return res.status(404).json({ error: 'Song not found' });
        }

        res.json(song);
    } catch (error) {
        console.error('Error fetching song:', error);
        res.status(500).json({ error: 'Failed to fetch song' });
    }
});

// Add a new song
app.post('/api/songs', async (req, res) => {
    try {
        const { title, artist_id, album_id, youtube_url, youtube_id, duration, mood, genre } = req.body;

        const sql = `
      INSERT INTO songs (title, artist_id, album_id, youtube_url, youtube_id, duration, mood, genre)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

        const result = await db.run(sql, [title, artist_id, album_id, youtube_url, youtube_id, duration, mood, genre]);
        res.status(201).json({ id: result.id, message: 'Song created successfully' });
    } catch (error) {
        console.error('Error creating song:', error);
        res.status(500).json({ error: 'Failed to create song' });
    }
});

// ==================== ARTISTS ENDPOINTS ====================

// Get all artists
app.get('/api/artists', async (req, res) => {
    try {
        const artists = await db.query('SELECT * FROM artists ORDER BY name');
        res.json(artists);
    } catch (error) {
        console.error('Error fetching artists:', error);
        res.status(500).json({ error: 'Failed to fetch artists' });
    }
});

// Get artist by ID with their songs
app.get('/api/artists/:id', async (req, res) => {
    try {
        const artist = await db.get('SELECT * FROM artists WHERE id = ?', [req.params.id]);

        if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
        }

        const songs = await db.query('SELECT * FROM songs WHERE artist_id = ?', [req.params.id]);
        artist.songs = songs;

        res.json(artist);
    } catch (error) {
        console.error('Error fetching artist:', error);
        res.status(500).json({ error: 'Failed to fetch artist' });
    }
});

// ==================== PLAYLISTS ENDPOINTS ====================

// Get all playlists
app.get('/api/playlists', async (req, res) => {
    try {
        const playlists = await db.query(`
      SELECT p.*, u.username as owner_username
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.is_public = 1 OR p.user_id = 1
      ORDER BY p.created_at DESC
    `);
        res.json(playlists);
    } catch (error) {
        console.error('Error fetching playlists:', error);
        res.status(500).json({ error: 'Failed to fetch playlists' });
    }
});

// Get playlist by ID with songs
app.get('/api/playlists/:id', async (req, res) => {
    try {
        const playlist = await db.get(`
      SELECT p.*, u.username as owner_username
      FROM playlists p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `, [req.params.id]);

        if (!playlist) {
            return res.status(404).json({ error: 'Playlist not found' });
        }

        const songs = await db.query(`
      SELECT s.*, a.name as artist_name, al.title as album_title, ps.position
      FROM playlist_songs ps
      JOIN songs s ON ps.song_id = s.id
      JOIN artists a ON s.artist_id = a.id
      LEFT JOIN albums al ON s.album_id = al.id
      WHERE ps.playlist_id = ?
      ORDER BY ps.position
    `, [req.params.id]);

        playlist.songs = songs;
        res.json(playlist);
    } catch (error) {
        console.error('Error fetching playlist:', error);
        res.status(500).json({ error: 'Failed to fetch playlist' });
    }
});

// ==================== USER LIKES ENDPOINTS ====================

// Toggle like on a song
app.post('/api/likes/:songId', async (req, res) => {
    try {
        const userId = 1; // Default user for demo
        const songId = req.params.songId;

        // Check if already liked
        const existing = await db.get(
            'SELECT id FROM user_likes WHERE user_id = ? AND song_id = ?',
            [userId, songId]
        );

        if (existing) {
            // Unlike
            await db.run('DELETE FROM user_likes WHERE user_id = ? AND song_id = ?', [userId, songId]);
            res.json({ liked: false, message: 'Song unliked' });
        } else {
            // Like
            await db.run('INSERT INTO user_likes (user_id, song_id) VALUES (?, ?)', [userId, songId]);
            res.json({ liked: true, message: 'Song liked' });
        }
    } catch (error) {
        console.error('Error toggling like:', error);
        res.status(500).json({ error: 'Failed to toggle like' });
    }
});

// Get user's liked songs
app.get('/api/likes', async (req, res) => {
    try {
        const userId = 1; // Default user for demo
        const songs = await db.query(`
      SELECT s.*, a.name as artist_name, al.title as album_title
      FROM user_likes ul
      JOIN songs s ON ul.song_id = s.id
      JOIN artists a ON s.artist_id = a.id
      LEFT JOIN albums al ON s.album_id = al.id
      WHERE ul.user_id = ?
      ORDER BY ul.liked_at DESC
    `, [userId]);

        res.json(songs);
    } catch (error) {
        console.error('Error fetching liked songs:', error);
        res.status(500).json({ error: 'Failed to fetch liked songs' });
    }
});

// ==================== PLAY HISTORY ENDPOINTS ====================

// Record a play
app.post('/api/play/:songId', async (req, res) => {
    try {
        const userId = 1; // Default user for demo
        const songId = req.params.songId;

        await db.run('INSERT INTO play_history (user_id, song_id) VALUES (?, ?)', [userId, songId]);
        res.json({ message: 'Play recorded' });
    } catch (error) {
        console.error('Error recording play:', error);
        res.status(500).json({ error: 'Failed to record play' });
    }
});

// Get play history
app.get('/api/history', async (req, res) => {
    try {
        const userId = 1; // Default user for demo
        const limit = req.query.limit || 50;

        const history = await db.query(`
      SELECT ph.*, s.title, s.youtube_id, a.name as artist_name
      FROM play_history ph
      JOIN songs s ON ph.song_id = s.id
      JOIN artists a ON s.artist_id = a.id
      WHERE ph.user_id = ?
      ORDER BY ph.played_at DESC
      LIMIT ?
    `, [userId, limit]);

        res.json(history);
    } catch (error) {
        console.error('Error fetching history:', error);
        res.status(500).json({ error: 'Failed to fetch history' });
    }
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'MusicApp API is running' });
});

// Start server
app.listen(PORT, () => {
    console.log(`MusicApp API server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/api/health`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...');
    await db.close();
    process.exit(0);
});
