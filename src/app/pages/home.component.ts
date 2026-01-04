import { Component, computed, signal, effect, inject } from '@angular/core';
import { MusicService, type Mood, type Song } from '../music.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    template: `
    <div class="home-page">
      <section class="hero">
        <h1>Welcome to MusicApp</h1>
        <p>Your personal music streaming experience</p>
      </section>

      @if (recentlyPlayed().length > 0) {
      <section class="section">
        <h2>Recently Played</h2>
        <div class="song-grid">
          @for (song of recentlyPlayed(); track song.id) {
          <button type="button" class="song-card" (click)="playSong(song)">
            <div class="cover-art">{{ song.title.slice(0, 1) }}</div>
            <p class="title">{{ song.title }}</p>
            <p class="meta">{{ song.artist_name }}</p>
          </button>
          }
        </div>
      </section>
      }

      <section class="section">
        <h2>Popular Moods</h2>
        <div class="mood-grid">
          @for (mood of moods; track mood) {
          <a [routerLink]="['/browse']" [queryParams]="{mood: mood}" class="mood-card" [attr.data-mood]="mood">
            <h3>{{ mood }}</h3>
          </a>
          }
        </div>
      </section>

      <section class="section">
        <h2>Quick Actions</h2>
        <div class="action-grid">
          <a routerLink="/browse" class="action-card">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M4 5h16v2H4zm0 6h16v2H4zm0 6h10v2H4z" fill="currentColor"/>
            </svg>
            <span>Browse All Songs</span>
          </a>
          <a routerLink="/library" class="action-card">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6 4h12v2H6zm-2 7h16v2H4zm4 7h8v2H8z" fill="currentColor"/>
            </svg>
            <span>Your Library</span>
          </a>
        </div>
      </section>
    </div>
  `,
    styles: [`
    .home-page {
      padding: 2rem;
    }

    .hero {
      text-align: center;
      padding: 3rem 1rem;
      background: linear-gradient(135deg, #1db954, #1ed760);
      border-radius: 16px;
      margin-bottom: 2rem;
      color: white;
    }

    .hero h1 {
      font-size: 3rem;
      margin: 0 0 1rem;
    }

    .hero p {
      font-size: 1.25rem;
      margin: 0;
      opacity: 0.9;
    }

    .section {
      margin-bottom: 3rem;
    }

    .section h2 {
      font-size: 1.75rem;
      margin-bottom: 1.5rem;
    }

    .song-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }

    .song-card {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      padding: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-align: left;
      width: 100%;
    }

    .song-card:hover {
      background: #282828;
      border-color: #1db954;
      transform: translateY(-4px);
    }

    .cover-art {
      width: 100%;
      aspect-ratio: 1;
      border-radius: 8px;
      background: linear-gradient(135deg, #1db954, #1ed760);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      font-weight: 700;
      color: white;
      margin-bottom: 0.75rem;
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

    .mood-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
    }

    .mood-card {
      padding: 2rem;
      border-radius: 12px;
      border: 1px solid #1f1f1f;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: white;
    }

    .mood-card[data-mood="Chill"] {
      background: linear-gradient(135deg, #667eea, #764ba2);
    }

    .mood-card[data-mood="Focus"] {
      background: linear-gradient(135deg, #f093fb, #f5576c);
    }

    .mood-card[data-mood="Energy"] {
      background: linear-gradient(135deg, #fa709a, #fee140);
    }

    .mood-card[data-mood="Classic"] {
      background: linear-gradient(135deg, #30cfd0, #330867);
    }

    .mood-card:hover {
      transform: scale(1.05);
    }

    .mood-card h3 {
      margin: 0;
      font-size: 1.5rem;
    }

    .action-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 1rem;
    }

    .action-card {
      background: #181818;
      border: 1px solid #1f1f1f;
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      align-items: center;
      gap: 1rem;
      cursor: pointer;
      transition: all 0.2s;
      text-decoration: none;
      color: white;
    }

    .action-card:hover {
      background: #282828;
      border-color: #1db954;
    }

    .action-card svg {
      width: 32px;
      height: 32px;
      color: #1db954;
    }

    .action-card span {
      font-size: 1.1rem;
      font-weight: 600;
    }
  `]
})
export class HomeComponent {
    private musicService = inject(MusicService);

    protected readonly moods: Mood[] = ['Chill', 'Focus', 'Energy', 'Classic'];
    protected readonly recentlyPlayed = signal<Song[]>([]);

    constructor() {
        this.loadRecentlyPlayed();
    }

    private async loadRecentlyPlayed(): Promise<void> {
        const songs = await this.musicService.getLikedSongs();
        this.recentlyPlayed.set(songs.slice(0, 6));
    }

    protected playSong(song: Song): void {
        // Emit event or navigate to browse with song selected
        console.log('Playing:', song);
    }
}
