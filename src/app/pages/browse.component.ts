import { Component, computed, signal, effect, inject, OnInit } from '@angular/core';
import { MusicService, type Mood, type Song } from '../music.service';
import { ActivatedRoute } from '@angular/router';
import { DurationPipe } from '../pipes/duration.pipe';

@Component({
    selector: 'app-browse',
    standalone: true,
    imports: [DurationPipe],
    template: `
    <div class="browse-page">
      <header class="page-header">
        <h1>Browse Music</h1>
        <div class="filters">
          <div class="search">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M10.5 3a7.5 7.5 0 1 1 4.82 13.26l3.21 3.21-1.42 1.42-3.21-3.21A7.5 7.5 0 0 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z" fill="currentColor"/>
            </svg>
            <input type="search" placeholder="Search songs, artists, albums..." [value]="search()" (input)="updateSearch($event)" />
          </div>
          <div class="pill-group">
            @for (mood of moods; track mood) {
            <button type="button" class="pill" [class.active]="moodFilter() === mood" (click)="setMood(mood)">
              {{ mood }}
            </button>
            }
          </div>
        </div>
      </header>

      @if (musicService.loading()) {
      <div class="loading">
        <div class="spinner"></div>
        <p>Loading songs...</p>
      </div>
      } @else if (musicService.error()) {
      <div class="error-state">
        <p>{{ musicService.error() }}</p>
        <button type="button" class="retry-btn" (click)="retry()">Retry</button>
      </div>
      } @else if (filteredSongs().length === 0) {
      <div class="empty-state">
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
        </svg>
        <p>No songs found</p>
      </div>
      } @else {
      <div class="songs-list">
        <p class="count">{{ filteredSongs().length }} songs</p>
        <div class="table">
          @for (song of filteredSongs(); track song.id) {
          <button type="button" class="row" (click)="playSong(song)">
            <div class="cover-mini">{{ song.title.slice(0, 1) }}</div>
            <div class="details">
              <p class="title">{{ song.title }}</p>
              <p class="meta">{{ song.artist_name }} • {{ song.album_title }}</p>
            </div>
            <span class="pill small">{{ song.mood }}</span>
            <span class="length">{{ song.duration | duration }}</span>
            <button type="button" class="icon-btn" (click)="$event.stopPropagation(); toggleLike(song.id)">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path [attr.fill]="song.is_liked ? 'currentColor' : 'none'"
                  [attr.stroke]="song.is_liked ? 'currentColor' : 'currentColor'"
                  [attr.stroke-width]="song.is_liked ? 0 : 1.5"
                  d="M12.1 8.64 12 8.77l-.1-.13C10.14 6.6 7.1 6.24 5.05 8.28c-2.06 2.04-2.06 5.36 0 7.4l6.23 6.23c.4.4 1.05.4 1.45 0l6.23-6.23c2.06-2.04 2.06-5.36 0-7.4-2.05-2.04-5.09-1.68-6.86.36Z" />
              </svg>
            </button>
          </button>
          }
        </div>
      </div>
      }
    </div>
  `,
    styles: [`
    .browse-page {
      padding: 2rem;
      max-width: 1400px;
      margin: 0 auto;
    }

    .page-header {
      margin-bottom: 2rem;
    }

    .page-header h1 {
      font-size: 2.5rem;
      margin: 0 0 1.5rem;
    }

    .filters {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .search {
      position: relative;
      max-width: 600px;
    }

    .search svg {
      position: absolute;
      left: 1rem;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      height: 20px;
      color: #a3a3a3;
    }

    .search input {
      width: 100%;
      padding: 0.75rem 1rem 0.75rem 3rem;
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 999px;
      color: white;
      font-size: 1rem;
    }

    .search input:focus {
      outline: none;
      border-color: #1db954;
    }

    .pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .pill {
      padding: 0.5rem 1rem;
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 999px;
      color: white;
      cursor: pointer;
      transition: all 0.2s;
    }

    .pill:hover {
      border-color: #1db954;
    }

    .pill.active {
      background: #1db954;
      border-color: #1db954;
    }

    .pill.small {
      padding: 0.25rem 0.75rem;
      font-size: 0.85rem;
    }

    .loading, .empty-state, .error-state {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 48px;
      height: 48px;
      border: 4px solid #1f1f1f;
      border-top-color: #1db954;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      to { transform: rotate(360deg); }
    }

    .empty-state svg, .error-state svg {
      width: 64px;
      height: 64px;
      color: #a3a3a3;
      margin-bottom: 1rem;
    }

    .retry-btn {
      margin-top: 1rem;
      padding: 0.75rem 1.5rem;
      background: #1db954;
      border: none;
      border-radius: 999px;
      color: white;
      font-weight: 600;
      cursor: pointer;
    }

    .songs-list {
      margin-top: 2rem;
    }

    .count {
      margin-bottom: 1rem;
      color: #a3a3a3;
    }

    .table {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .row {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 8px;
      padding: 1rem;
      display: grid;
      grid-template-columns: auto 1fr auto auto auto;
      gap: 1rem;
      align-items: center;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }

    .row:hover {
      background: #282828;
      border-color: #1db954;
    }

    .cover-mini {
      width: 48px;
      height: 48px;
      border-radius: 4px;
      background: linear-gradient(135deg, #1db954, #1ed760);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      color: white;
    }

    .details {
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

    .length {
      color: #a3a3a3;
    }

    .icon-btn {
      background: transparent;
      border: none;
      color: #a3a3a3;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 50%;
      transition: all 0.2s;
    }

    .icon-btn:hover {
      color: #1db954;
      background: rgba(29, 185, 84, 0.1);
    }

    .icon-btn svg {
      width: 24px;
      height: 24px;
    }
  `]
})
export class BrowseComponent implements OnInit {
    protected readonly musicService = inject(MusicService);
    private readonly route = inject(ActivatedRoute);

    protected readonly search = signal('');
    protected readonly moodFilter = signal<Mood | 'All'>('All');
    protected readonly moods = ['All', 'Chill', 'Focus', 'Energy', 'Classic'] as const;

    protected readonly filteredSongs = computed(() => this.musicService.songs());

    ngOnInit(): void {
        // Check for mood query param
        this.route.queryParams.subscribe(params => {
            if (params['mood']) {
                this.setMood(params['mood'] as Mood);
            }
        });

        this.loadSongs();
    }

    private loadSongs(): void {
        this.musicService.loadSongs(
            this.moodFilter() !== 'All' ? this.moodFilter() : undefined,
            this.search() || undefined
        );
    }

    protected updateSearch(event: Event): void {
        const value = (event.target as HTMLInputElement).value;
        this.search.set(value);
        this.loadSongs();
    }

    protected setMood(mood: Mood | 'All'): void {
        this.moodFilter.set(mood);
        this.loadSongs();
    }

    protected toggleLike(songId: number): void {
        this.musicService.toggleLike(songId);
    }

    protected playSong(song: Song): void {
        this.musicService.recordPlay(song.id);
        // Add logic to play song
    }

    protected retry(): void {
        this.loadSongs();
    }
}
