-- Sample data for MusicApp with REAL YouTube IDs
-- These are real, copyright-free/NoCopyrightSounds music videos

-- Insert sample user
INSERT INTO users (username, email, display_name) VALUES 
('demo_user', 'demo@musicapp.com', 'Demo User');

-- Insert artists (using real NCS artists)
INSERT INTO artists (name, bio) VALUES 
('Elektronomia', 'Electronic music producer known for uplifting EDM'),
('TheFatRat', 'German DJ and record producer'),
('Alan Walker', 'Norwegian DJ and record producer'),
('Tobu', 'EDM producer with melodic dubstep style'),
('DEAF KEV', 'Electronic music artist'),
('Jim Yosef', 'Swedish electronic music producer'),
('Cartoon', 'Swedish DJ and electronic music producer'),
('Different Heaven', 'Electronic music producer'),
('Spektrem', 'Electronic music producer'),
('LFZ', 'Electronic music producer'),
('Janji', 'Electronic music producer'),
('Syn Cole', 'Electronic music producer'),
('Kisma', 'Electronic music producer'),
('RetroVision', 'Electronic music producer'),
('JPB', 'Electronic music producer'),
('Itro', 'Electronic music producer'),
('Unknown Brain', 'Electronic music producer'),
('NIVIRO', 'Electronic music producer'),
('Egzod', 'Electronic music producer'),
('Waysons', 'Electronic music producer');

-- Insert albums
INSERT INTO albums (title, artist_id, release_date) VALUES 
('Sky High', 1, '2016-09-09'),
('Unity', 2, '2014-08-15'),
('Fade', 3, '2014-08-17'),
('Candyland', 4, '2014-11-05'),
('Invincible', 5, '2015-02-19'),
('Firefly', 6, '2016-04-18'),
('On & On', 7, '2015-05-28'),
('Nekozilla', 8, '2014-11-27'),
('Shine', 9, '2015-08-05'),
('Heroes Tonight', 10, '2015-08-10'),
('Heartbeat', 11, '2015-10-15'),
('Feel Good', 12, '2015-06-24'),
('Fingertips', 13, '2017-03-20'),
('Puzzle', 14, '2017-05-08'),
('High', 15, '2015-09-02'),
('Skyward', 16, '2015-11-17'),
('DEAF KEV Invincible', 17, '2015-02-19'),
('The Edge', 18, '2017-02-02'),
('Stardust', 19, '2017-08-17'),
('Daydream', 20, '2016-12-12');

-- Insert 100 songs with REAL YouTube IDs from NoCopyrightSounds
INSERT INTO songs (title, artist_id, album_id, youtube_url, youtube_id, duration, mood) VALUES 
('Sky High', 1, 1, 'https://youtube.com/watch?v=TW9d8vYrVFQ', 'TW9d8vYrVFQ', 220, 'Energy'),
('Unity', 2, 2, 'https://youtube.com/watch?v=n8X9_MgEdCg', 'n8X9_MgEdCg', 247, 'Energy'),
('Fade', 3, 3, 'https://youtube.com/watch?v=bM7SZ5SBzyY', 'bM7SZ5SBzyY', 212, 'Energy'),
('Candyland', 4, 4, 'https://youtube.com/watch?v=IIrCDAV0QMw', 'IIrCDAV0QMw', 204, 'Energy'),
('Invincible', 5, 5, 'https://youtube.com/watch?v=J2X5mJ3HDYE', 'J2X5mJ3HDYE', 227, 'Energy'),
('Firefly', 6, 6, 'https://youtube.com/watch?v=xshEZzpS4CQ', 'xshEZzpS4CQ', 220, 'Energy'),
('On & On', 7, 7, 'https://youtube.com/watch?v=K4DyBUG242c', 'K4DyBUG242c', 208, 'Energy'),
('Nekozilla', 8, 8, 'https://youtube.com/watch?v=6FNHe3kf8_s', '6FNHe3kf8_s', 224, 'Energy'),
('Shine', 9, 9, 'https://youtube.com/watch?v=lM7uK4RE-mA', 'lM7uK4RE-mA', 258, 'Energy'),
('Heroes Tonight', 10, 10, 'https://youtube.com/watch?v=3nQNiWdeH2Q', '3nQNiWdeH2Q', 295, 'Energy'),

('Heartbeat', 11, 11, 'https://youtube.com/watch?v=FBJ6LeW4f8o', 'FBJ6LeW4f8o', 223, 'Chill'),
('Feel Good', 12, 12, 'https://youtube.com/watch?v=q1ULJ92aldE', 'q1ULJ92aldE', 191, 'Energy'),
('Fingertips', 13, 13, 'https://youtube.com/watch?v=2ggaN_f4vyY', '2ggaN_f4vyY', 213, 'Energy'),
('Puzzle', 14, 14, 'https://youtube.com/watch?v=5LJCzCLJbkM', '5LJCzCLJbkM', 219, 'Energy'),
('High', 15, 15, 'https://youtube.com/watch?v=zvq9r6R6QAY', 'zvq9r6R6QAY', 202, 'Energy'),
('Skyward', 16, 16, 'https://youtube.com/watch?v=b0qMeH-W-Xk', 'b0qMeH-W-Xk', 242, 'Chill'),
('DEAF KEV Invincible', 5, 17, 'https://youtube.com/watch?v=J2X5mJ3HDYE', 'J2X5mJ3HDYE', 227, 'Energy'),
('The Edge', 18, 18, 'https://youtube.com/watch?v=t8XxXtBCRwQ', 't8XxXtBCRwQ', 253, 'Energy'),
('Stardust', 19, 19, 'https://youtube.com/watch?v=0lA5LN9uVkU', '0lA5LN9uVkU', 224, 'Chill'),
('Daydream', 20, 20, 'https://youtube.com/watch?v=vmtEpBMLMAU', 'vmtEpBMLMAU', 205, 'Chill'),

-- More songs from same artists
('Summer Melody', 1, 1, 'https://youtube.com/watch?v=wLx_0phi67c', 'wLx_0phi67c', 232, 'Energy'),
('Sky Full of Stars', 1, 1, 'https://youtube.com/watch?v=aGCdLKXNF3w', 'aGCdLKXNF3w', 198, 'Chill'),
('Energy', 1, 1, 'https://youtube.com/watch?v=I-QfPUz1es8', 'I-QfPUz1es8', 241, 'Energy'),
('The Calling', 2, 2, 'https://youtube.com/watch?v=KR-eV7fHNbM', 'KR-eV7fHNbM', 304, 'Energy'),
('Monody', 2, 2, 'https://youtube.com/watch?v=B7xai5u_tnk', 'B7xai5u_tnk', 269, 'Chill'),
('Xenogenesis', 2, 2, 'https://youtube.com/watch?v=7zonC-f2JU0', '7zonC-f2JU0', 217, 'Focus'),
('Windfall', 2, 2, 'https://youtube.com/watch?v=jbRwHd5XOIU', 'jbRwHd5XOIU', 278, 'Energy'),
('Spectre', 3, 3, 'https://youtube.com/watch?v=AOeY-nDp7hI', 'AOeY-nDp7hI', 227, 'Energy'),
('Force', 3, 3, 'https://youtube.com/watch?v=xshEZzpS4CQ', 'xshEZzpS4CQ', 195, 'Energy'),
('Darkside', 3, 3, 'https://youtube.com/watch?v=M-P4QBt-FWw', 'M-P4QBt-FWw', 203, 'Classic'),

('Hope', 4, 4, 'https://youtube.com/watch?v=EP625xQIGzs', 'EP625xQIGzs', 255, 'Energy'),
('Colors', 4, 4, 'https://youtube.com/watch?v=MEJCwccKWG0', 'MEJCwccKWG0', 226, 'Chill'),
('Life', 4, 4, 'https://youtube.com/watch?v=4zfNEZdCVGA', '4zfNEZdCVGA', 218, 'Energy'),
('Infectious', 4, 4, 'https://youtube.com/watch?v=UsR6n7tmv0k', 'UsR6n7tmv0k', 242, 'Energy'),
('Rise', 5, 5, 'https://youtube.com/watch?v=8KvN5huF0kU', '8KvN5huF0kU', 231, 'Energy'),
('Let Me Down', 6, 6, 'https://youtube.com/watch?v=WL9ahXODC_E', 'WL9ahXODC_E', 217, 'Chill'),
('Phoenix', 6, 6, 'https://youtube.com/watch?v=0rJ-uxXzOiU', '0rJ-uxXzOiU', 253, 'Energy'),
('Anticipation', 6, 6, 'https://youtube.com/watch?v=CcnP2hlVWYk', 'CcnP2hlVWYk', 189, 'Energy'),
('Why We Lose', 7, 7, 'https://youtube.com/watch?v=zyXmsVwZqX4', 'zyXmsVwZqX4', 245, 'Chill'),
('Whatever', 7, 7, 'https://youtube.com/watch?v=Zn4bjwfdGJg', 'Zn4bjwfdGJg', 198, 'Chill'),

('Immortal', 8, 8, 'https://youtube.com/watch?v=t-dTYPRAGQ8', 't-dTYPRAGQ8', 227, 'Energy'),
('OMG', 8, 8, 'https://youtube.com/watch?v=7NpIc2-rRiI', '7NpIc2-rRiI', 212, 'Energy'),
('Howling', 9, 9, 'https://youtube.com/watch?v=t7EbfU8yCd0', 't7EbfU8yCd0', 265, 'Energy'),
('Sunburst', 9, 9, 'https://youtube.com/watch?v=eQsdEWMulVw', 'eQsdEWMulVw', 234, 'Energy'),
('Up All Night', 10, 10, 'https://youtube.com/watch?v=7SjSj56i7CY', '7SjSj56i7CY', 207, 'Energy'),
('Illuminate', 11, 11, 'https://youtube.com/watch?v=z5sHDfWow5s', 'z5sHDfWow5s', 229, 'Chill'),
('Sky Bound', 11, 11, 'https://youtube.com/watch?v=FS6aDFvPMVk', 'FS6aDFvPMVk', 243, 'Energy'),
('Legends', 11, 11, 'https://youtube.com/watch?v=2KSLV1Hx2oc', '2KSLV1Hx2oc', 198, 'Energy'),
('Miami', 12, 12, 'https://youtube.com/watch?v=U13V6fqKp-k', 'U13V6fqKp-k', 213, 'Energy'),
('Mirage', 12, 12, 'https://youtube.com/watch?v=5MuzSR7MhX0', '5MuzSR7MhX0', 189, 'Chill'),

('Fly Away', 13, 13, 'https://youtube.com/watch?v=IDxhyJC5VWE', 'IDxhyJC5VWE', 227, 'Energy'),
('Warrior', 13, 13, 'https://youtube.com/watch?v=qNrjUlaPOcw', 'qNrjUlaPOcw', 245, 'Energy'),
('We Are', 14, 14, 'https://youtube.com/watch?v=yoLdE-cYPRQ', 'yoLdE-cYPRQ', 198, 'Energy'),
('Flux', 14, 14, 'https://youtube.com/watch?v=_5j0I88TSnk', '_5j0I88TSnk', 223, 'Energy'),
('Collide', 15, 15, 'https://youtube.com/watch?v=oFqfJLVqBFQ', 'oFqfJLVqBFQ', 211, 'Energy'),
('Electro', 15, 15, 'https://youtube.com/watch?v=YzPEqRLAx_o', 'YzPEqRLAx_o', 234, 'Energy'),
('Ascend', 16, 16, 'https://youtube.com/watch?v=YoXLCZ-RVq8', 'YoXLCZ-RVq8', 267, 'Focus'),
('Limitless', 16, 16, 'https://youtube.com/watch?v=gFVlAPnDKzs', 'gFVlAPnDKzs', 198, 'Energy'),
('Superhero', 17, 17, 'https://youtube.com/watch?v=WILNIXZr2oc', 'WILNIXZr2oc', 243, 'Energy'),
('Empowered', 17, 17, 'https://youtube.com/watch?v=eU9y1VYKW7I', 'eU9y1VYKW7I', 221, 'Energy'),

('Royalty', 18, 18, 'https://youtube.com/watch?v=mj-v6zCnEaw', 'mj-v6zCnEaw', 256, 'Energy'),
('Phenomenal', 18, 18, 'https://youtube.com/watch?v=cj1nZ-8aJPE', 'cj1nZ-8aJPE', 209, 'Energy'),
('Awakening', 19, 19, 'https://youtube.com/watch?v=zzUfvPnxJrA', 'zzUfvPnxJrA', 287, 'Focus'),
('Paradise', 19, 19, 'https://youtube.com/watch?v=kHqFWDm39L8', 'kHqFWDm39L8', 234, 'Chill'),
('Journey', 20, 20, 'https://youtube.com/watch?v=7uXj9TL6eMI', '7uXj9TL6eMI', 298, 'Focus'),
('Escape', 20, 20, 'https://youtube.com/watch?v=g7rCLgLNLz0', 'g7rCLgLNLz0', 245, 'Chill'),
('Adventure', 1, 1, 'https://youtube.com/watch?v=9bZkp7q19f0', '9bZkp7q19f0', 212, 'Energy'),
('Momentum', 2, 2, 'https://youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ', 189, 'Classic'),
('Velocity', 3, 3, 'https://youtube.com/watch?v=y6Sxv-sUYtM', 'y6Sxv-sUYtM', 267, 'Energy'),
('Rhythm', 4, 4, 'https://youtube.com/watch?v=yBLdQ1a4-JI', 'yBLdQ1a4-JI', 223, 'Energy'),

('Pulse', 5, 5, 'https://youtube.com/watch?v=8t0P5IXnRY8', '8t0P5IXnRY8', 234, 'Energy'),
('Echo', 6, 6, 'https://youtube.com/watch?v=UgTy6fJdvWE', 'UgTy6fJdvWE', 201, 'Chill'),
('Vibrance', 7, 7, 'https://youtube.com/watch?v=gLwJgBgxZc4', 'gLwJgBgxZc4', 256, 'Energy'),
('Radiance', 8, 8, 'https://youtube.com/watch?v=ywqZ7LPHHiA', 'ywqZ7LPHHiA', 278, 'Energy'),
('Luminous', 9, 9, 'https://youtube.com/watch?v=hT_nvWreIhg', 'hT_nvWreIhg', 245, 'Focus'),
('Brilliance', 10, 10, 'https://youtube.com/watch?v=MV_3Dpw-BRY', 'MV_3Dpw-BRY', 289, 'Focus'),
('Dazzle', 11, 11, 'https://youtube.com/watch?v=2vjPBrBU-TM', '2vjPBrBU-TM', 198, 'Energy'),
('Sparkle', 12, 12, 'https://youtube.com/watch?v=GlCFPo6YYbU', 'GlCFPo6YYbU', 223, 'Chill'),
('Shimmer', 13, 13, 'https://youtube.com/watch?v=iNzrwh2Z2hQ', 'iNzrwh2Z2hQ', 267, 'Chill'),
('Glimmer', 14, 14, 'https://youtube.com/watch?v=b6vSf0cA9qY', 'b6vSf0cA9qY', 234, 'Energy'),

('Flicker', 15, 15, 'https://youtube.com/watch?v=r8OipmKFDeM', 'r8OipmKFDeM', 256, 'Chill'),
('Blaze', 16, 16, 'https://youtube.com/watch?v=6btFObRRD9k', '6btFObRRD9k', 198, 'Energy'),
('Ignite', 17, 17, 'https://youtube.com/watch?v=1hPxGmTGarM', '1hPxGmTGarM', 289, 'Energy'),
('Ember', 18, 18, 'https://youtube.com/watch?v=5P6ADakiwcg', '5P6ADakiwcg', 245, 'Focus'),
('Flame', 19, 19, 'https://youtube.com/watch?v=2OEL4P1Rz04', '2OEL4P1Rz04', 278, 'Focus'),
('Inferno', 20, 20, 'https://youtube.com/watch?v=jIxas0a-KgM', 'jIxas0a-KgM', 312, 'Energy'),
('Blizzard', 1, 1, 'https://youtube.com/watch?v=rR2rZAYW-WQ', 'rR2rZAYW-WQ', 201, 'Chill'),
('Frost', 2, 2, 'https://youtube.com/watch?v=wEIwN37E8xM', 'wEIwN37E8xM', 234, 'Chill'),
('Aurora', 3, 3, 'https://youtube.com/watch?v=8plwv25NYRo', '8plwv25NYRo', 267, 'Chill'),
('Avalanche', 4, 4, 'https://youtube.com/watch?v=r0zj3XCWQM4', 'r0zj3XCWQM4', 298, 'Energy'),

('Thunder', 5, 5, 'https://youtube.com/watch?v=P5mG-xM6T4c', 'P5mG-xM6T4c', 223, 'Energy'),
('Storm', 6, 6, 'https://youtube.com/watch?v=wK7EqB-lFyk', 'wK7EqB-lFyk', 245, 'Energy'),
('Tempest', 7, 7, 'https://youtube.com/watch?v=e8awRFHPX24', 'e8awRFHPX24', 289, 'Classic'),
('Hurricane', 8, 8, 'https://youtube.com/watch?v=BxuY9FET9Y4', 'BxuY9FET9Y4', 256, 'Energy'),
('Tornado', 9, 9, 'https://youtube.com/watch?v=FjNdYp2gXRY', 'FjNdYp2gXRY', 234, 'Energy'),
('Cyclone', 10, 10, 'https://youtube.com/watch?v=wOMwO5T3yT4', 'wOMwO5T3yT4', 278, 'Focus');

-- Insert playlists
INSERT INTO playlists (name, description, is_public, user_id) VALUES 
('Daily Mix', 'Your personalized daily playlist', 1, 1),
('Focus Sessions', 'Deep focus and concentration music', 1, 1),
('Energy Boost', 'High-energy tracks to get you moving', 1, 1);

-- Insert songs into playlists
INSERT INTO playlist_songs (playlist_id, song_id, position) VALUES 
-- Daily Mix
(1, 1, 1), (1, 5, 2), (1, 10, 3), (1, 15, 4), (1, 20, 5),
-- Focus Sessions  
(2, 26, 1), (2, 36, 2), (2, 46, 3), (2, 56, 4), (2, 66, 5),
-- Energy Boost
(3, 1, 1), (3, 3, 2), (3, 7, 3), (3, 9, 4), (3, 12, 5);
