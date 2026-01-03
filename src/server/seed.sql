-- Sample data for MusicApp
-- Seed the database with initial artists, albums, and songs

-- Insert sample user
INSERT INTO users (username, email, display_name) VALUES 
('demo_user', 'demo@musicapp.com', 'Demo User');

-- Insert artists
INSERT INTO artists (name, bio) VALUES 
('Luna Rivers', 'Electronic music producer known for atmospheric sounds'),
('Atlas Grey', 'Indie rock artist with a coastal vibe'),
('Mara Vale', 'Singer-songwriter creating mellow acoustic tracks'),
('Echo Arcade', 'Synthwave and retrowave producer'),
('Novah', 'Experimental electronic artist'),
('Indigo Frame', 'High-energy EDM and dance music'),
('Cora Mae', 'Folk and indie pop artist'),
('Velvet Pilot', 'Alternative rock with upbeat energy'),
('Northbound', 'Ambient and focus music producer'),
('Sienna Coast', 'Chill and lo-fi hip hop artist');

-- Insert albums
INSERT INTO albums (title, artist_id, release_date) VALUES 
('City Glow', 1, '2023-03-15'),
('Blue Horizon', 2, '2023-05-20'),
('Sunset Stories', 3, '2023-07-10'),
('Late Drive', 4, '2023-09-05'),
('Signal', 5, '2023-11-12'),
('Terminal', 6, '2024-01-08'),
('Fine Lines', 7, '2024-03-22'),
('Gravity', 8, '2024-05-30'),
('Static', 9, '2024-07-18'),
('Open Sky', 10, '2024-09-25');

-- Insert songs with YouTube links
-- Note: These are placeholder YouTube IDs. Replace with actual music video IDs
INSERT INTO songs (title, artist_id, album_id, youtube_url, youtube_id, duration, mood) VALUES 
('Neon Streets', 1, 1, 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 212, 'Energy'),
('Coastline', 2, 2, 'https://youtube.com/watch?v=jNQXAC9IVRw', 'jNQXAC9IVRw', 248, 'Chill'),
('Golden Hour', 3, 3, 'https://youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 177, 'Chill'),
('Night Shift', 4, 4, 'https://youtube.com/watch?v=y6120QOlsfU', 'y6120QOlsfU', 224, 'Focus'),
('Static Bloom', 5, 5, 'https://youtube.com/watch?v=kJQP7kiw5Fk', 'kJQP7kiw5Fk', 195, 'Focus'),
('Runway Lights', 6, 6, 'https://youtube.com/watch?v=lXMskKTw3Bc', 'lXMskKTw3Bc', 238, 'Energy'),
('Paper Planes', 7, 7, 'https://youtube.com/watch?v=rYEDA3JcQqw', 'rYEDA3JcQqw', 201, 'Classic'),
('Falling Up', 8, 8, 'https://youtube.com/watch?v=fJ9rUzIMcZQ', 'fJ9rUzIMcZQ', 242, 'Energy'),
('Quiet Signal', 9, 9, 'https://youtube.com/watch?v=QH2-TGUlwu4', 'QH2-TGUlwu4', 185, 'Focus'),
('Horizon Line', 10, 10, 'https://youtube.com/watch?v=nfWlot6h_JM', 'nfWlot6h_JM', 227, 'Chill');

-- Create a sample playlist
INSERT INTO playlists (user_id, name, description, is_public) VALUES 
(1, 'Daily Mix', 'Your personalized mix of favorites', 1),
(1, 'Focus Sessions', 'Concentration music for work and study', 1),
(1, 'Energy Boost', 'High-energy tracks to pump you up', 1);

-- Add songs to playlists
INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES 
(1, 1, 1), (1, 2, 2), (1, 3, 3), (1, 7, 4),
(2, 4, 1), (2, 5, 2), (2, 9, 3),
(3, 1, 1), (3, 6, 2), (3, 8, 3);

-- Add some likes
INSERT INTO user_likes (user_id, song_id) VALUES 
(1, 1), (1, 3), (1, 9);

-- Add play history
INSERT INTO play_history (user_id, song_id) VALUES 
(1, 1), (1, 2), (1, 3), (1, 1);
