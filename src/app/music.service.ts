import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export type Mood = 'Chill' | 'Focus' | 'Energy' | 'Classic';

export interface Song {
    id: number;
    title: string;
    artist_name: string;
    album_title: string;
    duration: number;
    mood: Mood;
    is_liked: number;
    youtube_url: string;
    youtube_id: string;
}

export interface Playlist {
    id: number;
    name: string;
    description?: string;
    is_public: number;
    owner_username: string;
    created_at: string;
    songs?: Song[];
}

@Injectable({
    providedIn: 'root'
})
export class MusicService {
    private readonly apiUrl = 'http://localhost:3000/api';

    readonly songs = signal<Song[]>([]);
    readonly loading = signal(false);
    readonly error = signal<string | null>(null);
    readonly selectedSong = signal<Song | null>(null);

    constructor(private http: HttpClient) { }

    selectSong(song: Song): void {
        this.selectedSong.set(song);
        this.recordPlay(song.id);
    }

    async loadSongs(mood?: string, search?: string): Promise<void> {
        this.loading.set(true);
        this.error.set(null);

        try {
            const params: any = {};
            if (mood && mood !== 'All') params.mood = mood;
            if (search) params.search = search;

            const songs = await firstValueFrom(
                this.http.get<Song[]>(`${this.apiUrl}/songs`, { params })
            );

            this.songs.set(songs);
        } catch (err: any) {
            this.error.set(err.message || 'Failed to load songs');
            console.error('Error loading songs:', err);
        } finally {
            this.loading.set(false);
        }
    }

    async toggleLike(songId: number): Promise<void> {
        try {
            const result = await firstValueFrom(
                this.http.post<{ liked: boolean }>(`${this.apiUrl}/likes/${songId}`, {})
            );

            // Update the local state
            this.songs.update(songs =>
                songs.map(song =>
                    song.id === songId
                        ? { ...song, is_liked: result.liked ? 1 : 0 }
                        : song
                )
            );
        } catch (err) {
            console.error('Error toggling like:', err);
        }
    }

    async recordPlay(songId: number): Promise<void> {
        try {
            await firstValueFrom(
                this.http.post(`${this.apiUrl}/play/${songId}`, {})
            );
        } catch (err) {
            console.error('Error recording play:', err);
        }
    }

    async getLikedSongs(): Promise<Song[]> {
        try {
            return await firstValueFrom(
                this.http.get<Song[]>(`${this.apiUrl}/likes`)
            );
        } catch (err) {
            console.error('Error loading liked songs:', err);
            return [];
        }
    }

    async getPlaylists(): Promise<any[]> {
        try {
            return await firstValueFrom(
                this.http.get<any[]>(`${this.apiUrl}/playlists`)
            );
        } catch (err) {
            console.error('Error loading playlists:', err);
            return [];
        }
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }

    async addSongToPlaylist(playlistId: number, songId: number): Promise<void> {
        try {
            await firstValueFrom(
                this.http.post(`${this.apiUrl}/playlists/${playlistId}/songs`, { songId })
            );
        } catch (err) {
            console.error('Error adding song to playlist:', err);
            throw err;
        }
    }

    async createPlaylist(name: string, description: string = '', isPublic: boolean = true): Promise<{ id: number }> {
        try {
            return await firstValueFrom(
                this.http.post<{ id: number }>(`${this.apiUrl}/playlists`, {
                    name,
                    description,
                    is_public: isPublic
                })
            );
        } catch (err) {
            console.error('Error creating playlist:', err);
            throw err;
        }
    }
}
