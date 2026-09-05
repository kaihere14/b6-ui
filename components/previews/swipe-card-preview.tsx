"use client";

import * as React from "react";
import { Eye, EyeOff, Share, UserRoundPlus, X } from "lucide-react";

import { ButtonBase } from "@/components/ui/button-base";
import {
  SwipeCard,
  SwipeCardFooter,
  SwipeCardHeader,
  SwipeCardMedia,
  SwipeCardMediaAction,
  SwipeCardStack,
  SwipeCardStatus,
  SwipeCardTitle,
  type SwipeCardStackHandle,
} from "@/components/ui/swipe-card";

const people = [
  {
    name: "Ethan Brooks",
    status: "Online",
    tone: "brand" as const,
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&q=80",
  },
  {
    name: "Mason Carter",
    status: "Away",
    tone: "muted" as const,
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=80",
  },
  {
    name: "Nora Ellis",
    status: "Online",
    tone: "brand" as const,
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=640&q=80",
  },
  {
    name: "Iris Vance",
    status: "Do not disturb",
    tone: "destructive" as const,
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=640&q=80",
  },
];

export function SwipeCardPreview() {
  const stack = React.useRef<SwipeCardStackHandle>(null);
  const [showControls, setShowControls] = React.useState(true);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-6 py-2">
      <SwipeCardStack
        ref={stack}
        loop
        aria-label="Suggested contacts"
        className="h-112 w-full"
      >
        {people.map((person) => (
          <SwipeCard key={person.name}>
            <SwipeCardMedia wash="brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={person.photo} alt="" draggable={false} />
              <SwipeCardMediaAction aria-label={`Share ${person.name}`}>
                <Share />
              </SwipeCardMediaAction>
            </SwipeCardMedia>
            <SwipeCardFooter>
              <SwipeCardHeader>
                <SwipeCardTitle>{person.name}</SwipeCardTitle>
                <SwipeCardStatus tone={person.tone}>{person.status}</SwipeCardStatus>
              </SwipeCardHeader>
              <ButtonBase size="sm" className="rounded-full" leftIcon={<UserRoundPlus />}>
                Add
              </ButtonBase>
            </SwipeCardFooter>
          </SwipeCard>
        ))}
      </SwipeCardStack>

      {showControls ? (
        <div className="flex items-center gap-3">
          <ButtonBase
            size="icon"
            variant="outline"
            aria-label="Skip"
            onClick={() => stack.current?.swipe("left")}
          >
            <X />
          </ButtonBase>
          <ButtonBase
            size="icon"
            aria-label="Add to contacts"
            onClick={() => stack.current?.swipe("right")}
          >
            <UserRoundPlus />
          </ButtonBase>
        </div>
      ) : null}

      <ButtonBase
        size="sm"
        variant="ghost"
        aria-pressed={showControls}
        leftIcon={showControls ? <Eye /> : <EyeOff />}
        onClick={() => setShowControls((shown) => !shown)}
      >
        {showControls ? "Hide controls" : "Show controls"}
      </ButtonBase>
    </div>
  );
}
