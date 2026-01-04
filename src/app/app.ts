import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MusicService, type Song } from './music.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly musicService = inject(MusicService);

  protected readonly selected = signal<Song | null>(null);
  protected readonly showProfile = signal(false);
  protected readonly likedSongs = signal<Song[]>([]);
  protected readonly userPlaylists = signal<any[]>([]);

  protected selectSong(song: Song): void {
    this.selected.set(song);
    this.musicService.recordPlay(song.id);
  }

  protected toggleLike(songId: number): void {
    this.musicService.toggleLike(songId);
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
