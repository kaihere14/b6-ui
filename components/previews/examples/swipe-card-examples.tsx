"use client";

import * as React from "react";
import { RotateCcw, Share, UserRoundPlus, X } from "lucide-react";

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
  type SwipeDirection,
} from "@/components/ui/swipe-card";

type Person = {
  name: string;
  status: string;
  tone: "brand" | "muted" | "destructive";
  photo: string;
};

const people: Person[] = [
  {
    name: "Ethan Brooks",
    status: "Online",
    tone: "brand",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=640&q=80",
  },
  {
    name: "Mason Carter",
    status: "Away",
    tone: "muted",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&q=80",
  },
  {
    name: "Nora Ellis",
    status: "Online",
    tone: "brand",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=640&q=80",
  },
  {
    name: "Iris Vance",
    status: "Do not disturb",
    tone: "destructive",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=640&q=80",
  },
];

function PersonCard({ person, wash = "brand" }: { person: Person; wash?: "brand" | "none" }) {
  return (
    <SwipeCard>
      <SwipeCardMedia wash={wash}>
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
  );
}

export function SwipeCardDeckExample() {
  return (
    <SwipeCardStack loop aria-label="Suggested contacts" className="h-112 w-full max-w-xs">
      {people.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </SwipeCardStack>
  );
}

export function SwipeCardControlsExample() {
  const stack = React.useRef<SwipeCardStackHandle>(null);
  const [last, setLast] = React.useState<SwipeDirection | null>(null);

  return (
    <div className="flex w-full max-w-xs flex-col items-center gap-5">
      <SwipeCardStack
        ref={stack}
        loop
        onSwipe={(direction) => setLast(direction)}
        aria-label="Reviewed contacts"
        className="h-112 w-full"
      >
        {people.map((person) => (
          <PersonCard key={person.name} person={person} />
        ))}
      </SwipeCardStack>

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
          variant="ghost"
          aria-label="Reset the deck"
          onClick={() => stack.current?.reset()}
        >
          <RotateCcw />
        </ButtonBase>
        <ButtonBase
          size="icon"
          aria-label="Add to contacts"
          onClick={() => stack.current?.swipe("right")}
        >
          <UserRoundPlus />
        </ButtonBase>
      </div>

      <p className="text-small text-muted-foreground">
        {last ? `Last swipe: ${last}.` : "No swipe yet."}
      </p>
    </div>
  );
}

export function SwipeCardWashExample() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-3">
      <SwipeCard>
        <SwipeCardMedia aspect="portrait">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={people[0]!.photo} alt="" draggable={false} />
        </SwipeCardMedia>
        <SwipeCardFooter>
          <SwipeCardHeader>
            <SwipeCardTitle as="h4">None</SwipeCardTitle>
            <SwipeCardStatus tone="muted">Untouched</SwipeCardStatus>
          </SwipeCardHeader>
        </SwipeCardFooter>
      </SwipeCard>

      <SwipeCard>
        <SwipeCardMedia aspect="portrait" wash="brand">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={people[0]!.photo} alt="" draggable={false} />
        </SwipeCardMedia>
        <SwipeCardFooter>
          <SwipeCardHeader>
            <SwipeCardTitle as="h4">Brand</SwipeCardTitle>
            <SwipeCardStatus tone="brand">Hue only</SwipeCardStatus>
          </SwipeCardHeader>
        </SwipeCardFooter>
      </SwipeCard>

      <SwipeCard>
        <SwipeCardMedia aspect="portrait" wash="scrim">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={people[0]!.photo} alt="" draggable={false} />
        </SwipeCardMedia>
        <SwipeCardFooter>
          <SwipeCardHeader>
            <SwipeCardTitle as="h4">Scrim</SwipeCardTitle>
            <SwipeCardStatus tone="muted">For text</SwipeCardStatus>
          </SwipeCardHeader>
        </SwipeCardFooter>
      </SwipeCard>
    </div>
  );
}

export function SwipeCardDepthExample() {
  return (
    <SwipeCardStack
      loop
      visibleCards={4}
      scaleStep={0.07}
      offsetStep={22}
      rotateStep={7}
      opacityStep={0.1}
      aria-label="A deeper stack"
      className="h-112 w-full max-w-xs"
    >
      {people.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </SwipeCardStack>
  );
}

export function SwipeCardAxisExample() {
  return (
    <SwipeCardStack
      loop
      axis="y"
      stackFrom="top"
      aria-label="A vertical wallet stack"
      className="h-112 w-full max-w-xs"
    >
      {people.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </SwipeCardStack>
  );
}

export function SwipeCardEmptyExample() {
  const stack = React.useRef<SwipeCardStackHandle>(null);

  return (
    <SwipeCardStack
      ref={stack}
      aria-label="A deck that runs out"
      className="h-112 w-full max-w-xs"
      empty={
        <div className="flex size-full flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border">
          <p className="text-small text-muted-foreground">That was the last one.</p>
          <ButtonBase size="sm" variant="outline" onClick={() => stack.current?.reset()}>
            Start over
          </ButtonBase>
        </div>
      }
    >
      {people.map((person) => (
        <PersonCard key={person.name} person={person} />
      ))}
    </SwipeCardStack>
  );
}
