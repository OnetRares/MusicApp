# MusicApp - Spotify-inspired Music Streaming Application

A full-stack music streaming platform built with **Angular 21** and **Express.js**, featuring real-time audio playback via YouTube integration, playlist management, and user profiles.

## Demo MusicApp
https://youtu.be/GbRI5UQdaGw
## 🎵 Features

- **YouTube-Integrated Audio Playback**: Stream 50 verified songs directly from YouTube with play/pause and track navigation controls
- **Track Navigation**: Next/previous buttons with automatic looping at playlist boundaries
- **Browse & Search**: Discover songs by mood category, search functionality, and detailed metadata
- **Playlist Management**: Create custom playlists, add/remove songs, view playlist details
- **User Profiles**: Profile panel with display name, user statistics, and liked songs management
- **Responsive Design**: Spotify-inspired dark theme with modern UI components
- **Real-time State Management**: Signal-based reactivity with Angular 21 effects system
- **Persistent Data**: SQLite database with comprehensive schema for users, artists, albums, songs, and playlists

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup & Run

1. **Clone and install dependencies**:
```bash
# Root project
npm install

# Backend server
cd server
npm install
cd ..
```

2. **Initialize database** (one-time setup):
```bash
cd server
npm run init   # creates schema
npm run seed   # loads 50 songs
cd ..
```

3. **Start both services** (in separate terminals):

**Terminal 1 - Backend Server** (runs on http://localhost:3000):
```bash
cd server
npm start      # or npm run dev for auto-reload
```

**Terminal 2 - Frontend** (runs on http://localhost:4200):
```bash
npm start
```

4. **Open in browser**: http://localhost:4200

## 📁 Project Structure

```
MusicApp/
├── src/                          # Angular frontend source
│   ├── app/
│   │   ├── app.ts               # Root component with YouTube player logic
│   │   ├── app.html             # Main template with player bar & sidebar
│   │   ├── app.routes.ts        # Lazy-loaded route definitions
│   │   ├── app.config.ts        # App providers & configuration
│   │   ├── music.service.ts     # Signals, API calls, state management
│   │   ├── pages/
│   │   │   ├── home.component.ts
│   │   │   ├── browse.component.ts      # Song browsing & filtering
│   │   │   ├── library.component.ts     # User playlists & likes
│   │   │   └── playlist-detail.component.ts
│   │   └── pipes/                       # Custom pipes for formatting
│   │       ├── duration.pipe.ts
│   │       ├── highlight.pipe.ts
│   │       └── time-ago.pipe.ts
│   ├── main.ts                  # Application bootstrap
│   ├── index.html
│   ├── styles.scss              # Global styles
│
├── server/                       # Express backend
│   ├── api.js                   # Route handlers
│   ├── database.js              # SQLite connection & queries
│   ├── package.json
│   ├── schema.sql               # Database schema (tables)
│   ├── seed.sql                 # Sample data (50 songs)
│   └── scripts/
│       ├── init-db.js           # Initialize database
│       └── seed-db.js           # Load seed data
│
├── angular.json                 # Angular CLI config
├── package.json                 # Frontend dependencies
└── README.md                    # This file
```

## 🎮 How to Use

### Playing Music
1. Navigate to **Browse** to view all 50 songs
2. Click any song to start playback
3. Use **Play/Pause** button in the player bar to control playback
4. Use **Next/Previous** arrows to navigate tracks
5. Songs automatically loop at the beginning/end of the list

### Managing Playlists
1. Go to **Library** to view your playlists
2. Click **+ Add Playlist** to create a new one
3. In **Browse**, click the ❤️ to add songs to playlists
4. Click playlist name to view details and manage songs

### Browsing by Mood
- **Browse** page filters songs by mood: Energy, Chill, Focus, Classic
- Use search bar to find specific songs or artists

## 🛠️ Development

### Available Scripts

**Frontend (root directory)**:
```bash
npm start          # Dev server with hot reload
npm run build      # Production build → dist/music-app
npm test           # Run unit tests via Vitest
npm run lint       # Run ESLint
```

**Backend (server/ directory)**:
```bash
npm start          # Start server (port 3000)
npm run dev        # Start with Nodemon auto-reload
npm run init       # Create database schema
npm run seed       # Populate with sample data
```

## 💾 Database Schema

**Songs Table**:
- `id` (INTEGER, Primary Key)
- `title` (TEXT)
- `artist_id` (FOREIGN KEY)
- `album_id` (FOREIGN KEY)
- `youtube_id` (TEXT) - **Used for playback**
- `youtube_url` (TEXT)
- `duration` (INTEGER) - Length in seconds
- `mood` (TEXT) - Category: Energy, Chill, Focus, Classic

**Other Tables**:
- `users` - User accounts and profiles
- `artists` - Artist information
- `albums` - Album metadata
- `playlists` - User-created playlists
- `playlist_songs` - Playlist membership (many-to-many)
- `user_likes` - Liked/favorited songs
- `play_history` - Track listening history
- `user_follows_artists` - Artist subscriptions
- `user_follows_playlists` - Playlist subscriptions

## 🔊 YouTube Integration

The app uses YouTube's IFrame API to embed and control audio playback:

- **All 50 songs** have verified YouTube IDs that work without errors
- Player automatically **creates/destroys instances** when switching tracks (prevents conflicts)
- **State tracking**: Monitors playback state (PLAYING, PAUSED, BUFFERING, ENDED)
- **Error handling**: Gracefully handles video unavailability

## ⚙️ API Endpoints

**Base URL**: `http://localhost:3000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs` | Get all songs with filters |
| GET | `/songs/:id` | Get single song details |
| GET | `/playlists` | Get user's playlists |
| POST | `/playlists` | Create new playlist |
| GET | `/playlists/:id/songs` | Get playlist songs |
| POST | `/playlists/:id/songs` | Add song to playlist |
| DELETE | `/playlists/:id/songs/:songId` | Remove song from playlist |
| POST | `/songs/:id/like` | Mark song as liked |
| DELETE | `/songs/:id/like` | Remove like |
| POST | `/songs/:id/play` | Record play event |

## 🎨 UI Components

**Player Bar** (Bottom sticky bar):
- Current song title & artist
- Play/Pause button (syncs with YouTube API state)
- Previous/Next navigation buttons
- Song duration display

**Sidebar**:
- Navigation links (Home, Browse, Library)
- Profile panel toggle
- Currently playing indicator

**Profile Panel**:
- User display name
- Stats: Total songs, Playlists, Likes, Play count
- Quick access to liked songs and playlists

**Browse Page**:
- Song grid with mood filtering
- Search functionality
- Artist and duration display
- Play button on hover

## 🔄 Technology Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Angular 21, TypeScript, Signals, Effects, SCSS |
| **Backend** | Express.js, Node.js |
| **Database** | SQLite, better-sqlite3 |
| **Audio** | YouTube IFrame API |
| **Build** | Webpack (via Angular CLI), esbuild |

## ⚠️ Important Notes

- **YouTube API**: Requires internet connection for playback
- **Database**: SQLite file (`server/musicapp.db`) is auto-created on first run
- **Port conflicts**: If ports 3000 or 4200 are in use, the app will prompt to use alternative ports
- **First load**: May take 10-15 seconds while YouTube API initializes

## 🐛 Troubleshooting

**Songs not playing?**
- Ensure backend is running on localhost:3000
- Check browser console for errors
- Verify YouTube isn't blocked by network/firewall

**Database reset needed?**
```bash
cd server
rm musicapp.db              # Remove old database
npm run init && npm run seed # Recreate and repopulate
```

**Port already in use?**
- Change port in `angular.json` (frontend) or `server/api.js` (backend)
- Or kill process on that port

## 📝 License

MIT

## 🎯 Future Enhancements

- User authentication & persistence
- Advanced search & filtering
- Volume control & equalizer
- Shuffle & repeat modes
- Progress bar with seek functionality
- Keyboard shortcuts
- Offline playback caching
- Social features (share playlists, follow users)
