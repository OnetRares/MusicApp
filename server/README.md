# MusicApp Server

Backend API for MusicApp with SQLite database for storing songs, playlists, artists, and user data.

## Database Schema

The database includes the following tables:

- **users**: User accounts and profiles
- **artists**: Music artists
- **albums**: Music albums
- **songs**: Individual songs with YouTube links
- **playlists**: User-created playlists
- **playlist_songs**: Junction table for playlist-song relationships
- **user_likes**: User likes/favorites
- **play_history**: Track playback history
- **user_follows_artists**: Artist following relationships
- **user_follows_playlists**: Playlist following relationships

## Setup

1. Navigate to the server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Initialize the database:
```bash
npm run init
```

4. Seed with sample data:
```bash
npm run seed
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The API will be available at `http://localhost:3000`

## API Endpoints

### Songs
- `GET /api/songs` - Get all songs (supports `?mood=` and `?search=` query params)
- `GET /api/songs/:id` - Get a specific song
- `POST /api/songs` - Create a new song

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get artist with their songs

### Playlists
- `GET /api/playlists` - Get all playlists
- `GET /api/playlists/:id` - Get playlist with songs

### User Interactions
- `POST /api/likes/:songId` - Toggle like on a song
- `GET /api/likes` - Get user's liked songs
- `POST /api/play/:songId` - Record a song play
- `GET /api/history` - Get play history

### Health
- `GET /api/health` - Server health check

## Song YouTube Links

Songs are stored with YouTube URLs and IDs. The schema includes:
- `youtube_url`: Full YouTube URL
- `youtube_id`: YouTube video ID for embedding

Example:
```json
{
  "youtube_url": "https://youtube.com/watch?v=dQw4w9WgXcQ",
  "youtube_id": "dQw4w9WgXcQ"
}
```

## Database Location

The SQLite database file is created at `server/musicapp.db`

## Notes

- The seed data includes placeholder YouTube IDs. Replace them with actual music video IDs for your app.
- Default user ID is set to 1 for demo purposes.
- All timestamps are automatically managed by SQLite.
