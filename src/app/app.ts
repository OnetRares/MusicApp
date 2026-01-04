import { Component, signal, inject, OnInit, ViewChild, ElementRef, effect } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { MusicService, type Song } from './music.service';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
    youtubeApiPromise: Promise<void>;
  }
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly musicService = inject(MusicService);

  protected readonly showProfile = signal(false);
  protected readonly likedSongs = signal<Song[]>([]);
  protected readonly userPlaylists = signal<any[]>([]);
  protected readonly isPlaying = signal(false);
  protected readonly playerReady = signal(false);

  @ViewChild('playerContainer') playerContainer!: ElementRef;

  private youtubePlayer: any = null;
  private youtubeApiReady = new Promise<void>((resolve) => {
    (window as any).onYouTubeIframeAPIReady = () => {
      console.log('YouTube IFrame API Ready!');
      resolve();
    };
  });

  constructor() {
    // Setup effect in constructor (required in Angular 21+)
    effect(() => {
      const currentSong = this.musicService.selectedSong();
      if (currentSong) {
        console.log('=== EFFECT: Selected song changed to:', currentSong.title);
        this.initPlayer(currentSong);
      }
    });
  }

  ngOnInit(): void {
    this.loadPlaylists();
    this.loadYoutubeAPI();
  }

  private loadPlaylists(): void {
    try {
      const playlistsPromise = this.musicService.getPlaylists();
      playlistsPromise.then(p => this.userPlaylists.set(p));
    } catch (error) {
      console.error('Error loading playlists:', error);
    }
  }

  private loadYoutubeAPI(): void {
    console.log('Checking if YouTube API is already loaded...');

    if ((window as any).YT) {
      console.log('YouTube API already loaded');
      this.playerReady.set(true);
      return;
    }

    console.log('Loading YouTube API script...');
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';

    tag.onload = () => {
      console.log('YouTube API script tag loaded');
    };

    tag.onerror = () => {
      console.error('Failed to load YouTube API script');
    };

    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Wait for YouTube API to be ready
    this.youtubeApiReady.then(() => {
      console.log('YouTube API is now ready');
      this.playerReady.set(true);
    });
  }

  private initPlayer(song: Song): void {
    console.log('=== initPlayer called ===');
    console.log('playerReady:', this.playerReady(), 'song:', song.title);

    if (!this.playerReady()) {
      console.log('Waiting for YouTube API...');
      setTimeout(() => this.initPlayer(song), 500);
      return;
    }

    const videoId = song.youtube_id;
    console.log('Video ID:', videoId);

    try {
      // Destroy old player completely
      if (this.youtubePlayer) {
        console.log('Destroying old player...');
        try {
          this.youtubePlayer.destroy();
        } catch (e) {
          console.warn('Destroy error (expected):', e);
        }
        this.youtubePlayer = null;
      }

      // Clear and reset container
      const container = document.getElementById('youtube-player');
      if (container) {
        console.log('Clearing container HTML...');
        container.innerHTML = '';
      }

      // Wait a moment for cleanup
      setTimeout(() => {
        console.log('Creating new YouTube Player with videoId:', videoId);

        try {
          this.youtubePlayer = new (window as any).YT.Player('youtube-player', {
            height: '200',
            width: '200',
            videoId: videoId,
            playerVars: {
              autoplay: 1,
              controls: 0,
              enablejsapi: 1,
              origin: window.location.origin,
              playsinline: 1
            },
            events: {
              onReady: (event: any) => {
                console.log('onReady event');
                this.onPlayerReady(event);
              },
              onStateChange: (event: any) => {
                console.log('onStateChange:', event.data);
                this.onPlayerStateChange(event);
              },
              onError: (event: any) => {
                console.error('YouTube Error:', event.data);
              }
            }
          });
          console.log('Player created successfully');
        } catch (e) {
          console.error('Error creating player:', e);
        }
      }, 100);
    } catch (e) {
      console.error('initPlayer error:', e);
    }
  }

  private onPlayerReady(event: any): void {
    console.log('=== onPlayerReady ===');
    if (this.youtubePlayer && this.musicService.selectedSong()) {
      console.log('Starting playback of:', this.musicService.selectedSong()?.title);
      try {
        this.youtubePlayer.unMute();
        this.youtubePlayer.setVolume(100);

        // Try to play but don't fail if autoplay is blocked
        try {
          const playPromise = this.youtubePlayer.playVideo();
          if (playPromise?.catch) {
            playPromise.catch((e: any) => {
              console.warn('Autoplay blocked:', e);
              // User will need to click play button
            });
          }
        } catch (e) {
          console.warn('Play error:', e);
        }
      } catch (error) {
        console.error('Error in onPlayerReady:', error);
      }
    } else {
      console.warn('No player or song in onPlayerReady');
    }
  }

  private onPlayerStateChange(event: any): void {
    const YT = (window as any).YT;
    console.log('Player state changed to:', event.data);

    if (event.data === YT.PlayerState.PLAYING) {
      console.log('Setting isPlaying to true');
      this.isPlaying.set(true);
    } else if (event.data === YT.PlayerState.PAUSED) {
      console.log('Setting isPlaying to false (paused)');
      this.isPlaying.set(false);
    } else if (event.data === YT.PlayerState.BUFFERING) {
      console.log('Player is buffering...');
    } else if (event.data === YT.PlayerState.CUED) {
      console.log('Video cued');
    }

    if (event.data === YT.PlayerState.ENDED) {
      console.log('Video ended, moving to next track');
      this.isPlaying.set(false);
      this.nextTrack();
    }
  }

  togglePlayPause(): void {
    console.log('=== togglePlayPause CALLED ===');
    console.log('youtubePlayer exists:', !!this.youtubePlayer);
    console.log('isPlaying:', this.isPlaying());
    console.log('selectedSong:', this.musicService.selectedSong()?.title);

    if (!this.youtubePlayer) {
      console.warn('YouTube player not initialized yet');
      // Try to reinitialize
      const song = this.musicService.selectedSong();
      if (song) {
        console.log('Attempting to reinitialize player...');
        this.initPlayer(song);
      }
      return;
    }

    try {
      if (this.isPlaying()) {
        console.log('Pausing video...');
        this.youtubePlayer.pauseVideo();
        this.isPlaying.set(false);
      } else {
        console.log('Playing video...');
        this.youtubePlayer.playVideo();
        this.isPlaying.set(true);
      }
    } catch (error) {
      console.error('Error toggling playback:', error);
    }
  }

  nextTrack(): void {
    console.log('=== nextTrack called ===');
    const currentSong = this.musicService.selectedSong();
    const allSongs = this.musicService.songs();

    console.log('Current song:', currentSong?.title);
    console.log('All songs count:', allSongs.length);

    if (!currentSong || allSongs.length === 0) {
      console.log('No current song or empty playlist');
      return;
    }

    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    console.log('Current index:', currentIndex, 'Total songs:', allSongs.length);

    if (currentIndex === -1) {
      console.log('Current song not found, playing first');
      this.musicService.selectSong(allSongs[0]);
    } else if (currentIndex < allSongs.length - 1) {
      console.log('Playing next song at index:', currentIndex + 1);
      this.musicService.selectSong(allSongs[currentIndex + 1]);
    } else {
      console.log('At end, looping to first');
      this.musicService.selectSong(allSongs[0]);
    }
  }

  previousTrack(): void {
    console.log('=== previousTrack called ===');
    const currentSong = this.musicService.selectedSong();
    const allSongs = this.musicService.songs();

    console.log('Current song:', currentSong?.title);
    console.log('All songs count:', allSongs.length);

    if (!currentSong || allSongs.length === 0) {
      console.log('No current song or empty playlist');
      return;
    }

    const currentIndex = allSongs.findIndex(s => s.id === currentSong.id);
    console.log('Current index:', currentIndex, 'Total songs:', allSongs.length);

    if (currentIndex === -1) {
      console.log('Current song not found, playing last');
      this.musicService.selectSong(allSongs[allSongs.length - 1]);
    } else if (currentIndex > 0) {
      console.log('Playing previous song at index:', currentIndex - 1);
      this.musicService.selectSong(allSongs[currentIndex - 1]);
    } else {
      console.log('At beginning, looping to last');
      this.musicService.selectSong(allSongs[allSongs.length - 1]);
    }
  }

  selectSong(song: Song): void {
    this.musicService.selectSong(song);
  }

  toggleLike(songId: number): void {
    this.musicService.toggleLike(songId);
  }

  formatDuration(seconds: number): string {
    return this.musicService.formatDuration(seconds);
  }

  toggleProfile(): void {
    const isOpen = this.showProfile();
    this.showProfile.set(!isOpen);

    if (!isOpen) {
      // Load profile data when opening
      this.loadProfileData();
    }
  }

  async loadProfileData(): Promise<void> {
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
