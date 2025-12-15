import { Component, computed, signal } from '@angular/core';

type Mood = 'Chill' | 'Focus' | 'Energy' | 'Classic';

interface Song {
  id: number;
  title: string;
  artist: string;
  album: string;
  length: string;
  mood: Mood;
  liked: boolean;
}

@Component({
  selector: 'app-root',
  imports: [],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private readonly library = signal<Song[]>([
    { id: 1, title: 'Neon Streets', artist: 'Luna Rivers', album: 'City Glow', length: '3:32', mood: 'Energy', liked: true },
    { id: 2, title: 'Coastline', artist: 'Atlas Grey', album: 'Blue Horizon', length: '4:08', mood: 'Chill', liked: false },
    { id: 3, title: 'Golden Hour', artist: 'Mara Vale', album: 'Sunset Stories', length: '2:57', mood: 'Chill', liked: true },
    { id: 4, title: 'Night Shift', artist: 'Echo Arcade', album: 'Late Drive', length: '3:44', mood: 'Focus', liked: false },
    { id: 5, title: 'Static Bloom', artist: 'Novah', album: 'Signal', length: '3:15', mood: 'Focus', liked: false },
    { id: 6, title: 'Runway Lights', artist: 'Indigo Frame', album: 'Terminal', length: '3:58', mood: 'Energy', liked: false },
    { id: 7, title: 'Paper Planes', artist: 'Cora Mae', album: 'Fine Lines', length: '3:21', mood: 'Classic', liked: false },
    { id: 8, title: 'Falling Up', artist: 'Velvet Pilot', album: 'Gravity', length: '4:02', mood: 'Energy', liked: false },
    { id: 9, title: 'Quiet Signal', artist: 'Northbound', album: 'Static', length: '3:05', mood: 'Focus', liked: true },
    { id: 10, title: 'Horizon Line', artist: 'Sienna Coast', album: 'Open Sky', length: '3:47', mood: 'Chill', liked: false }
  ]);

  protected readonly search = signal('');
  protected readonly moodFilter = signal<Mood | 'All'>('All');
  protected readonly selected = signal<Song>(this.library()[0]);

  protected readonly moods = ['All', 'Chill', 'Focus', 'Energy', 'Classic'] as const;

  protected readonly filteredSongs = computed(() => {
    const term = this.search().toLowerCase().trim();
    const mood = this.moodFilter();

    return this.library().filter((song) => {
      const matchesTerm = !term || `${song.title} ${song.artist} ${song.album}`.toLowerCase().includes(term);
      const matchesMood = mood === 'All' || song.mood === mood;
      return matchesTerm && matchesMood;
    });
  });

  protected readonly queue = computed(() => this.filteredSongs().slice(0, 4));

  protected selectSong(song: Song): void {
    this.selected.set(song);
  }

  protected toggleLike(songId: number): void {
    this.library.update((songs) =>
      songs.map((song) => (song.id === songId ? { ...song, liked: !song.liked } : song))
    );

    const current = this.selected();
    if (current.id === songId) {
      const updated = this.library().find((song) => song.id === songId);
      if (updated) {
        this.selected.set(updated);
      }
    }
  }

  protected updateSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value ?? '';
    this.search.set(value);
  }

  protected setMood(filter: Mood | 'All'): void {
    this.moodFilter.set(filter);
  }
}
