import { Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MusicService, Playlist, Song } from '../music.service';
import { DurationPipe } from '../pipes/duration.pipe';

@Component({
    selector: 'app-playlist-detail',
    standalone: true,
    imports: [RouterLink, DurationPipe],
    template: `
    <div class="playlist-detail">
      @if (loading()) {
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading playlist...</p>
        </div>
      } @else if (error()) {
        <div class="error">
          <p>{{ error() }}</p>
          <button (click)="loadPlaylist()" class="retry-btn">Try Again</button>
        </div>
      } @else if (playlist()) {
        <div class="playlist-header">
          <div class="playlist-cover">
            <i class="icon">🎵</i>
          </div>
          <div class="playlist-info">
            <p class="type">Playlist</p>
            <h1>{{ playlist()!.name }}</h1>
            @if (playlist()!.description) {
              <p class="description">{{ playlist()!.description }}</p>
            }
            <div class="meta">
              <span>{{ playlist()!.owner_username }}</span>
              <span class="separator">•</span>
              <span>{{ playlist()!.songs?.length || 0 }} songs</span>
            </div>
          </div>
        </div>

        <div class="playlist-controls">
          <button class="play-all-btn" (click)="playAll()">
            <i class="icon">▶</i> Play All
          </button>
          <button class="back-btn" routerLink="/library">
            <i class="icon">←</i> Back to Library
          </button>
        </div>

        @if (playlist()!.songs && playlist()!.songs!.length > 0) {
          <div class="songs-table">
            <div class="table-header">
              <div class="col-number">#</div>
              <div class="col-title">Title</div>
              <div class="col-artist">Artist</div>
              <div class="col-album">Album</div>
              <div class="col-duration">Duration</div>
              <div class="col-actions"></div>
            </div>

            @for (song of playlist()!.songs; track song.id; let i = $index) {
              <div 
                class="song-row" 
                [class.selected]="musicService.selectedSong()?.id === song.id"
                (click)="selectSong(song)">
                <div class="col-number">{{ i + 1 }}</div>
                <div class="col-title">
                  <strong>{{ song.title }}</strong>
                </div>
                <div class="col-artist">{{ song.artist_name }}</div>
                <div class="col-album">{{ song.album_title || 'Single' }}</div>
                <div class="col-duration">{{ song.duration | duration }}</div>
                <div class="col-actions">
                  <button 
                    class="icon-btn like-btn" 
                    [class.liked]="song.is_liked"
                    (click)="toggleLike($event, song)"
                    title="{{ song.is_liked ? 'Remove from Liked Songs' : 'Add to Liked Songs' }}">
                    {{ song.is_liked ? '💚' : '🤍' }}
                  </button>
                  <button 
                    class="icon-btn remove-btn"
                    (click)="removeSong($event, song)"
                    title="Remove from playlist">
                    ✕
                  </button>
                </div>
              </div>
            }
          </div>
        } @else {
          <div class="empty-state">
            <div class="empty-icon">🎵</div>
            <h2>This playlist is empty</h2>
            <p>Add songs from the Browse page to get started!</p>
            <button routerLink="/browse" class="browse-btn">Browse Songs</button>
          </div>
        }
      }
    </div>
  `,
    styles: [`
    .playlist-detail {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .loading, .error {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 50px;
      height: 50px;
      border: 4px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .error p {
      color: #ff6b6b;
      margin-bottom: 1rem;
    }

    .retry-btn {
      padding: 0.75rem 1.5rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .retry-btn:hover {
      transform: scale(1.05);
    }

    .playlist-header {
      display: flex;
      gap: 2rem;
      margin-bottom: 2rem;
      align-items: flex-end;
    }

    .playlist-cover {
      width: 232px;
      height: 232px;
      background: linear-gradient(135deg, var(--primary), #1aa34a);
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .playlist-cover .icon {
      font-size: 80px;
      filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3));
    }

    .playlist-info {
      flex: 1;
    }

    .playlist-info .type {
      text-transform: uppercase;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 0.5rem;
      opacity: 0.8;
    }

    .playlist-info h1 {
      font-size: 4rem;
      font-weight: 900;
      margin: 0 0 0.5rem;
      line-height: 1.1;
    }

    .playlist-info .description {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 1rem;
    }

    .playlist-info .meta {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;
      font-weight: 600;
    }

    .playlist-info .meta .separator {
      opacity: 0.5;
    }

    .playlist-controls {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
    }

    .play-all-btn, .back-btn {
      padding: 0.75rem 2rem;
      border: none;
      border-radius: 24px;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: transform 0.2s;
    }

    .play-all-btn {
      background: var(--primary);
      color: white;
    }

    .play-all-btn:hover {
      transform: scale(1.05);
    }

    .back-btn {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    .back-btn:hover {
      background: rgba(255, 255, 255, 0.15);
    }

    .songs-table {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 8px;
      overflow: hidden;
    }

    .table-header {
      display: grid;
      grid-template-columns: 50px 2fr 1.5fr 1.5fr 100px 120px;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      font-size: 0.75rem;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
      opacity: 0.7;
    }

    .song-row {
      display: grid;
      grid-template-columns: 50px 2fr 1.5fr 1.5fr 100px 120px;
      gap: 1rem;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      cursor: pointer;
      transition: background 0.2s;
      align-items: center;
    }

    .song-row:hover {
      background: rgba(255, 255, 255, 0.05);
    }

    .song-row.selected {
      background: rgba(29, 185, 84, 0.1);
      border-left: 3px solid var(--primary);
    }

    .col-number {
      text-align: center;
      opacity: 0.7;
    }

    .col-title strong {
      color: white;
    }

    .col-artist, .col-album {
      opacity: 0.7;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .col-duration {
      opacity: 0.7;
      text-align: right;
    }

    .col-actions {
      display: flex;
      gap: 0.5rem;
      justify-content: flex-end;
      opacity: 0;
      transition: opacity 0.2s;
    }

    .song-row:hover .col-actions {
      opacity: 1;
    }

    .icon-btn {
      background: none;
      border: none;
      cursor: pointer;
      font-size: 1.25rem;
      padding: 0.25rem;
      transition: transform 0.2s;
    }

    .icon-btn:hover {
      transform: scale(1.1);
    }

    .like-btn.liked {
      animation: likeAnimation 0.3s ease;
    }

    @keyframes likeAnimation {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.3); }
    }

    .remove-btn {
      opacity: 0.5;
      color: #ff6b6b;
    }

    .remove-btn:hover {
      opacity: 1;
    }

    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .empty-icon {
      font-size: 5rem;
      opacity: 0.3;
      margin-bottom: 1rem;
    }

    .empty-state h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
    }

    .empty-state p {
      color: rgba(255, 255, 255, 0.6);
      margin-bottom: 2rem;
    }

    .browse-btn {
      padding: 0.75rem 2rem;
      background: var(--primary);
      color: white;
      border: none;
      border-radius: 24px;
      cursor: pointer;
      font-weight: 600;
      transition: transform 0.2s;
    }

    .browse-btn:hover {
      transform: scale(1.05);
    }

    @media (max-width: 1024px) {
      .playlist-header {
        flex-direction: column;
        align-items: flex-start;
      }

      .playlist-info h1 {
        font-size: 2.5rem;
      }

      .table-header, .song-row {
        grid-template-columns: 40px 2fr 1fr 80px 100px;
      }

      .col-album {
        display: none;
      }
    }

    @media (max-width: 640px) {
      .playlist-detail {
        padding: 1rem;
      }

      .playlist-cover {
        width: 192px;
        height: 192px;
      }

      .playlist-cover .icon {
        font-size: 64px;
      }

      .playlist-info h1 {
        font-size: 2rem;
      }

      .table-header {
        display: none;
      }

      .song-row {
        grid-template-columns: 1fr auto;
        gap: 0.5rem;
      }

      .col-number, .col-artist, .col-duration {
        display: none;
      }

      .col-title {
        grid-column: 1;
      }

      .col-actions {
        grid-column: 2;
        opacity: 1;
      }
    }
  `]
})
export class PlaylistDetailComponent {
    private route = inject(ActivatedRoute);
    private router = inject(Router);
    musicService = inject(MusicService);

    playlist = signal<Playlist | null>(null);
    loading = signal(true);
    error = signal<string | null>(null);

    constructor() {
        // Subscribe to route params changes
        this.route.paramMap.subscribe(params => {
            const playlistId = params.get('id');
            if (playlistId) {
                this.loadPlaylist(playlistId);
            }
        });
    }

    async loadPlaylist(playlistId?: string) {
        if (!playlistId) {
            playlistId = this.route.snapshot.paramMap.get('id') || '';
        }
        if (!playlistId) return;

        this.loading.set(true);
        this.error.set(null);

        try {
            const response = await fetch(`http://localhost:3000/api/playlists/${playlistId}`);
            if (!response.ok) {
                throw new Error('Failed to load playlist');
            }
            const data = await response.json();
            this.playlist.set(data);
        } catch (err) {
            this.error.set('Failed to load playlist. Please try again.');
            console.error('Error loading playlist:', err);
        } finally {
            this.loading.set(false);
        }
    }

    selectSong(song: Song) {
        this.musicService.selectSong(song);
    }

    playAll() {
        const songs = this.playlist()?.songs;
        if (songs && songs.length > 0) {
            this.musicService.selectSong(songs[0]);
        }
    }

    async toggleLike(event: Event, song: Song) {
        event.stopPropagation();
        await this.musicService.toggleLike(song.id);
        // Reload to update like status
        await this.loadPlaylist();
    }

    async removeSong(event: Event, song: Song) {
        event.stopPropagation();

        if (!confirm(`Remove "${song.title}" from this playlist?`)) {
            return;
        }

        const playlistId = this.route.snapshot.paramMap.get('id');
        if (!playlistId) return;

        try {
            const response = await fetch(`http://localhost:3000/api/playlists/${playlistId}/songs/${song.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove song');
            }

            // Reload playlist
            await this.loadPlaylist();
        } catch (err) {
            console.error('Error removing song:', err);
            alert('Failed to remove song from playlist');
        }
    }
}
