"use client";

import * as React from "react";

import {
  CircularMusicPlayer,
  CircularMusicPlayerMatrix,
  CircularMusicPlayerMeta,
  CircularMusicPlayerProgress,
  CircularMusicPlayerTitle,
} from "@/components/ui/circular-music-player";

/** Ticking position, standing in for a `progress_ms / duration_ms` that updates. */
function useDemoProgress(from: number, running = true) {
  const [progress, setProgress] = React.useState(from);
  React.useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => setProgress((p) => (p + 0.005) % 1), 150);
    return () => window.clearInterval(id);
  }, [running]);
  return progress;
}

export function CircularMusicPlayerAnatomyExample() {
  return (
    <div className="flex justify-center py-6">
      <CircularMusicPlayer label="Now playing">
        <CircularMusicPlayerMatrix />
      </CircularMusicPlayer>
    </div>
  );
}

export function CircularMusicPlayerRingExample() {
  const progress = useDemoProgress(0.34);

  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      <CircularMusicPlayer label="Dashed ring" progress={progress}>
        <CircularMusicPlayerProgress variant="dashed" />
        <CircularMusicPlayerMatrix inset="sm" />
      </CircularMusicPlayer>
      <CircularMusicPlayer label="Solid ring" progress={progress}>
        <CircularMusicPlayerProgress variant="solid" />
        <CircularMusicPlayerMatrix inset="sm" />
      </CircularMusicPlayer>
      <CircularMusicPlayer label="Paused" playing={false} progress={0.62}>
        <CircularMusicPlayerProgress variant="solid" thickness={1.2} />
        <CircularMusicPlayerMatrix inset="sm" />
      </CircularMusicPlayer>
    </div>
  );
}

export function CircularMusicPlayerSpotifyExample() {
  // Stands in for whatever the Spotify endpoint returned on the server.
  const song = {
    name: "Weightless",
    artists: "Marconi Union",
    isPlaying: true,
    progressMs: 96_000,
    durationMs: 483_000,
  };
  const ticking = useDemoProgress(song.progressMs / song.durationMs, song.isPlaying);

  return (
    <div className="flex justify-center py-6">
      <div className="flex items-center gap-5 rounded-lg border border-border bg-card p-5">
        <CircularMusicPlayer
          size="sm"
          label={`${song.name} by ${song.artists}`}
          playing={song.isPlaying}
          progress={ticking}
        >
          <CircularMusicPlayerProgress />
          <CircularMusicPlayerMatrix columns={18} inset="sm" />
        </CircularMusicPlayer>

        <div className="flex flex-col gap-1">
          <CircularMusicPlayerMeta>
            {song.isPlaying ? "Now playing" : "Last played"}
          </CircularMusicPlayerMeta>
          <CircularMusicPlayerTitle>{song.name}</CircularMusicPlayerTitle>
          <CircularMusicPlayerMeta>{song.artists}</CircularMusicPlayerMeta>
        </div>
      </div>
    </div>
  );
}

export function CircularMusicPlayerSizesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      <CircularMusicPlayer size="sm">
        <CircularMusicPlayerMatrix columns={18} />
      </CircularMusicPlayer>
      <CircularMusicPlayer size="md">
        <CircularMusicPlayerMatrix />
      </CircularMusicPlayer>
      <CircularMusicPlayer size="lg">
        <CircularMusicPlayerMatrix columns={30} />
      </CircularMusicPlayer>
    </div>
  );
}

export function CircularMusicPlayerTonesExample() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-6 py-6">
      <CircularMusicPlayer tone="glyph">
        <CircularMusicPlayerMatrix />
      </CircularMusicPlayer>
      <CircularMusicPlayer tone="surface">
        <CircularMusicPlayerMatrix />
      </CircularMusicPlayer>
      <CircularMusicPlayer tone="muted" playing={false}>
        <CircularMusicPlayerMatrix />
      </CircularMusicPlayer>
    </div>
  );
}
