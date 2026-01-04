import { Component, computed, signal, effect, inject } from '@angular/core';
import { MusicService, type Mood, type Song } from './music.service';

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly musicService = inject(MusicService);

  protected readonly search = signal('');
  protected readonly moodFilter = signal<Mood | 'All'>('All');
  protected readonly selected = signal<Song | null>(null);
  protected readonly showProfile = signal(false);
  protected readonly likedSongs = signal<Song[]>([]);
  protected readonly userPlaylists = signal<any[]>([]);

  protected readonly moods = ['All', 'Chill', 'Focus', 'Energy', 'Classic'] as const;

  protected readonly filteredSongs = computed(() => this.musicService.songs());
  protected readonly queue = computed(() => this.filteredSongs().slice(0, 4));

  constructor() {
    // Load initial songs
    this.musicService.loadSongs();

    // Auto-select first song when songs are loaded
    effect(() => {
      const songs = this.musicService.songs();
      if (songs.length > 0 && !this.selected()) {
        this.selected.set(songs[0]);
      }
    });

    // Reload songs when filters change
    effect(() => {
      const search = this.search();
      const mood = this.moodFilter();
      this.musicService.loadSongs(mood, search);
    });
  }

  protected selectSong(song: Song): void {
    this.selected.set(song);
    this.musicService.recordPlay(song.id);
  }

  protected toggleLike(songId: number): void {
    this.musicService.toggleLike(songId);
  }

  protected updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.search.set(value);
  }

  protected setMood(filter: Mood | 'All'): void {
    this.moodFilter.set(filter);
  }

  protected formatDuration(seconds: number): string {
    return this.musicService.formatDuration(seconds);
  }

  protected toggleProfile(): void {
    const isOpen = this.showProfile();
    this.showProfile.set(!isOpen);

    if (!isOpen) {
      // Load profile data when opening
      this.loadProfileData();
    }
  }

  protected async loadProfileData(): Promise<void> {
    try {
      const [liked, playlists] = await Promise.all([
        this.musicService.getLikedSongs(),
        this.musicService.getPlaylists()
      ]);
      this.likedSongs.set(liked);
      this.userPlaylists.set(playlists);
    } catch (error) {
      console.error('Error loading profile data:', error);
    }
  }
}
