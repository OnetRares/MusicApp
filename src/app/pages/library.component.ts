import { Component, signal, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService, type Song } from '../music.service';
import { DurationPipe } from '../pipes/duration.pipe';

@Component({
    selector: 'app-library',
    standalone: true,
    imports: [FormsModule, DurationPipe],
    template: `
    <div class="library-page">
      <header class="page-header">
        <h1>Your Library</h1>
        <p class="subtitle">Your playlists and liked songs</p>
      </header>

      <section class="section">
        <div class="section-header">
          <h2>Liked Songs</h2>
          <span class="count">{{ likedSongs().length }} songs</span>
        </div>
        
        @if (loadingLiked()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
        } @else if (likedSongs().length === 0) {
        <div class="empty-state">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12.1 8.64 12 8.77l-.1-.13C10.14 6.6 7.1 6.24 5.05 8.28c-2.06 2.04-2.06 5.36 0 7.4l6.23 6.23c.4.4 1.05.4 1.45 0l6.23-6.23c2.06-2.04 2.06-5.36 0-7.4-2.05-2.04-5.09-1.68-6.86.36Z" fill="currentColor"/>
          </svg>
          <p>No liked songs yet</p>
          <p class="meta">Songs you like will appear here</p>
        </div>
        } @else {
        <div class="song-list">
          @for (song of likedSongs(); track song.id) {
          <button type="button" class="song-row">
            <div class="cover-art">{{ song.title.slice(0, 1) }}</div>
            <div class="song-info">
              <p class="title">{{ song.title }}</p>
              <p class="meta">{{ song.artist_name }} • {{ song.album_title }}</p>
            </div>
            <span class="mood-badge">{{ song.mood }}</span>
            <span class="duration">{{ song.duration | duration }}</span>
          </button>
          }
        </div>
        }
      </section>

      <section class="section">
        <div class="section-header">
          <h2>Playlists</h2>
          <button type="button" class="add-btn" (click)="showCreatePlaylist = !showCreatePlaylist">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="2"/>
            </svg>
            Create Playlist
          </button>
        </div>

        @if (showCreatePlaylist) {
        <div class="create-form">
          <input type="text" placeholder="Playlist name" [(ngModel)]="newPlaylistName" />
          <input type="text" placeholder="Description (optional)" [(ngModel)]="newPlaylistDesc" />
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="showCreatePlaylist = false">Cancel</button>
            <button type="button" class="btn-primary" (click)="createPlaylist()">Create</button>
          </div>
        </div>
        }

        @if (loadingPlaylists()) {
        <div class="loading">
          <div class="spinner"></div>
        </div>
        } @else if (playlists().length === 0) {
        <div class="empty-state">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 4h12v2H6zm-2 7h16v2H4zm4 7h8v2H8z" fill="currentColor"/>
          </svg>
          <p>No playlists yet</p>
          <p class="meta">Create a playlist to organize your music</p>
        </div>
        } @else {
        <div class="playlist-grid">
          @for (playlist of playlists(); track playlist.id) {
          <div class="playlist-card">
            <div class="playlist-cover">{{ playlist.name.slice(0, 1) }}</div>
            <div class="playlist-info">
              <h3>{{ playlist.name }}</h3>
              <p class="meta">{{ playlist.description || 'No description' }}</p>
              <p class="meta-small">By {{ playlist.owner_username }}</p>
            </div>
          </div>
          }
        </div>
        }
      </section>
    </div>
  `,
    styles: [`
    .library-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 3rem;
    }

    .page-header h1 {
      font-size: 3rem;
      margin: 0 0 0.5rem;
    }

    .subtitle {
      font-size: 1.1rem;
      color: #a3a3a3;
      margin: 0;
    }

    .section {
      margin-bottom: 4rem;
    }

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
    }

    .section-header h2 {
      font-size: 1.75rem;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }

    .count {
      font-size: 0.9rem;
      color: #a3a3a3;
      font-weight: 400;
    }

    .add-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.25rem;
      background: #1db954;
      border: none;
      border-radius: 999px;
      color: white;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .add-btn:hover {
      background: #1ed760;
      transform: scale(1.05);
    }

    .add-btn svg {
      width: 20px;
      height: 20px;
    }

    .create-form {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      padding: 1.5rem;
      margin-bottom: 2rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .create-form input {
      padding: 0.75rem 1rem;
      background: #0f0f0f;
      border: 1px solid #1f1f1f;
      border-radius: 8px;
      color: white;
      font-size: 1rem;
    }

    .create-form input:focus {
      outline: none;
      border-color: #1db954;
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      justify-content: flex-end;
    }

    .btn-primary, .btn-secondary {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 999px;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #1db954;
      color: white;
    }

    .btn-primary:hover {
      background: #1ed760;
    }

    .btn-secondary {
      background: transparent;
      border: 1px solid #1f1f1f;
      color: white;
    }

    .btn-secondary:hover {
      border-color: #1db954;
    }

    .loading {
      text-align: center;
      padding: 3rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #1f1f1f;
      border-top-color: #1db954;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
      color: #a3a3a3;
    }

    .empty-state svg {
      width: 64px;
      height: 64px;
      margin-bottom: 1rem;
      color: #404040;
    }

    .empty-state p {
      margin: 0.5rem 0;
    }

    .empty-state .meta {
      font-size: 0.9rem;
    }

    .song-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .song-row {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 8px;
      padding: 1rem;
      display: grid;
      grid-template-columns: auto 1fr auto auto;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }

    .song-row:hover {
      background: #282828;
      border-color: #1db954;
    }

    .cover-art {
      width: 56px;
      height: 56px;
      border-radius: 6px;
      background: linear-gradient(135deg, #1db954, #1ed760);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      font-weight: 700;
      color: white;
    }

    .song-info {
      min-width: 0;
    }

    .title {
      margin: 0 0 0.25rem;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .meta {
      margin: 0;
      font-size: 0.85rem;
      color: #a3a3a3;
    }

    .mood-badge {
      padding: 0.25rem 0.75rem;
      background: #0f0f0f;
      border: 1px solid #1f1f1f;
      border-radius: 999px;
      font-size: 0.85rem;
      color: #1db954;
    }

    .duration {
      color: #a3a3a3;
      font-size: 0.9rem;
    }

    .playlist-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }

    .playlist-card {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
    }

    .playlist-card:hover {
      background: #282828;
      border-color: #1db954;
      transform: translateY(-4px);
    }

    .playlist-cover {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      background: linear-gradient(135deg, #444, #666);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 1rem;
    }

    .playlist-info h3 {
      margin: 0 0 0.5rem;
      font-size: 1.1rem;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .playlist-info .meta {
      margin: 0 0 0.25rem;
      font-size: 0.85rem;
      color: #a3a3a3;
    }

    .meta-small {
      margin: 0;
      font-size: 0.75rem;
      color: #606060;
    }
  `]
})
export class LibraryComponent implements OnInit {
    private musicService = inject(MusicService);

    protected readonly likedSongs = signal<Song[]>([]);
    protected readonly playlists = signal<any[]>([]);
    protected readonly loadingLiked = signal(false);
    protected readonly loadingPlaylists = signal(false);
    protected showCreatePlaylist = false;
    protected newPlaylistName = '';
    protected newPlaylistDesc = '';

    ngOnInit(): void {
        this.loadData();
    }

    private async loadData(): Promise<void> {
        this.loadingLiked.set(true);
        this.loadingPlaylists.set(true);

        try {
            const [liked, playlists] = await Promise.all([
                this.musicService.getLikedSongs(),
                this.musicService.getPlaylists()
            ]);
            this.likedSongs.set(liked);
            this.playlists.set(playlists);
        } catch (error) {
            console.error('Error loading library data:', error);
        } finally {
            this.loadingLiked.set(false);
            this.loadingPlaylists.set(false);
        }
    }

    protected createPlaylist(): void {
        if (!this.newPlaylistName.trim()) return;

        // TODO: Add API call to create playlist
        console.log('Creating playlist:', this.newPlaylistName, this.newPlaylistDesc);

        this.showCreatePlaylist = false;
        this.newPlaylistName = '';
        this.newPlaylistDesc = '';
    }
}
