import { Play, Star } from "lucide-react";

import {
  GlassCard,
  GlassCardCarousel,
  GlassCardClose,
  GlassCardDetails,
  GlassCardInfo,
  GlassCardMedia,
  GlassCardMediaAction,
  GlassCardMeta,
  GlassCardPlayButton,
  GlassCardRating,
  GlassCardTitle,
} from "@/components/ui/glass-card";

const films = [
  {
    title: "The Green Horizon",
    meta: "2019 · Drama",
    synopsis:
      "A retired lighthouse keeper returns to the coast to settle a debt he never spoke of.",
  },
  {
    title: "Oppenheimer",
    meta: "2023 · Biopic · ★ 8.9",
    synopsis:
      "The story of J. Robert Oppenheimer and the race to build the atomic bomb during the Second World War.",
  },
  {
    title: "Dune: Part Two",
    meta: "2024 · Epic Sci-Fi · ★ 8.8",
    synopsis:
      "Paul Atreides unites with the Fremen to seek revenge against the conspirators who destroyed his family.",
  },
  {
    title: "Blade Runner 2049",
    meta: "2017 · Neo-Noir · ★ 8.7",
    synopsis:
      "A young blade runner unearths a secret that could plunge what's left of society into chaos.",
  },
  {
    title: "Nova Requiem",
    meta: "2022 · Sci-Fi",
    synopsis: "The last crew of a dying colony ship chooses who gets to see the next sunrise.",
  },
];

export function GlassCardAnatomyExample() {
  return (
    <GlassCard className="w-full max-w-xs">
      <GlassCardMedia>
        <GlassCardPlayButton aria-label="Play trailer">
          <Play className="ml-0.5 fill-current" />
        </GlassCardPlayButton>
        <GlassCardMediaAction>
          <Play className="fill-current" />
          Watch Trailer
        </GlassCardMediaAction>
      </GlassCardMedia>
      <GlassCardInfo>
        <GlassCardTitle>Dune: Part Two</GlassCardTitle>
        <GlassCardMeta>
          2024 · Epic Sci-Fi ·{" "}
          <GlassCardRating>
            <Star className="fill-current text-brand" />
            8.8
          </GlassCardRating>
        </GlassCardMeta>
      </GlassCardInfo>
    </GlassCard>
  );
}

export function GlassCardMinimalExample() {
  return (
    <div className="flex w-full max-w-2xl items-center justify-center gap-6">
      <GlassCard tilt="left" className="max-w-48">
        <GlassCardMedia aspect="video">
          <GlassCardPlayButton aria-label="Play episode">
            <Play className="ml-0.5 fill-current" />
          </GlassCardPlayButton>
        </GlassCardMedia>
        <GlassCardInfo>
          <GlassCardTitle>Deep Field</GlassCardTitle>
          <GlassCardMeta>Podcast · 42 min</GlassCardMeta>
        </GlassCardInfo>
      </GlassCard>

      <GlassCard tilt="right" className="max-w-48">
        <GlassCardMedia aspect="video">
          <GlassCardPlayButton aria-label="Play episode">
            <Play className="ml-0.5 fill-current" />
          </GlassCardPlayButton>
        </GlassCardMedia>
        <GlassCardInfo>
          <GlassCardTitle>Late Bloom</GlassCardTitle>
          <GlassCardMeta>Podcast · 18 min</GlassCardMeta>
        </GlassCardInfo>
      </GlassCard>
    </div>
  );
}

export function GlassCardIntroExample() {
  return (
    <GlassCard intro expandable className="w-80">
      <GlassCardMedia aspect="video">
        <GlassCardPlayButton aria-label="Play trailer">
          <Play className="ml-0.5 fill-current" />
        </GlassCardPlayButton>
        <GlassCardMediaAction>
          <Play className="fill-current" />
          Watch Trailer
        </GlassCardMediaAction>
      </GlassCardMedia>
      <GlassCardInfo>
        <GlassCardTitle>Dune: Part Two</GlassCardTitle>
        <GlassCardMeta>2024 · Epic Sci-Fi · ★ 8.8</GlassCardMeta>
        <GlassCardDetails>
          <p className="line-clamp-2 min-w-0 flex-1">
            Paul Atreides unites with the Fremen to seek revenge against the conspirators who
            destroyed his family.
          </p>
          <GlassCardClose />
        </GlassCardDetails>
      </GlassCardInfo>
    </GlassCard>
  );
}

export function GlassCardCarouselExample() {
  return (
    <GlassCardCarousel className="w-full py-8">
      {films.map((film) => (
        <GlassCard key={film.title} expandable className="w-56">
          <GlassCardMedia>
            <GlassCardPlayButton aria-label={`Play ${film.title} trailer`}>
              <Play className="ml-0.5 fill-current" />
            </GlassCardPlayButton>
            <GlassCardMediaAction>
              <Play className="fill-current" />
              Watch Trailer
            </GlassCardMediaAction>
          </GlassCardMedia>
          <GlassCardInfo>
            <GlassCardTitle>{film.title}</GlassCardTitle>
            <GlassCardMeta>{film.meta}</GlassCardMeta>
            <GlassCardDetails>
              <p className="line-clamp-2 min-w-0 flex-1">{film.synopsis}</p>
              <GlassCardClose />
            </GlassCardDetails>
          </GlassCardInfo>
        </GlassCard>
      ))}
    </GlassCardCarousel>
  );
}
