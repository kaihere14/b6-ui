"use client";

import * as React from "react";

import {
  CircularMusicPlayer,
  CircularMusicPlayerMatrix,
  CircularMusicPlayerProgress,
} from "@/components/ui/circular-music-player";

export function CircularMusicPlayerPreview() {
  const [progress, setProgress] = React.useState(0.28);

  React.useEffect(() => {
    const id = window.setInterval(() => setProgress((p) => (p + 0.004) % 1), 120);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="flex items-center justify-center py-12">
      <CircularMusicPlayer label="Now playing" playing progress={progress}>
        <CircularMusicPlayerProgress />
        <CircularMusicPlayerMatrix inset="sm" />
      </CircularMusicPlayer>
    </div>
  );
}
