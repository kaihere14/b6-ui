import Link from "next/link";

import { ButtonBase } from "@/components/ui/button-base";
import {
  CardBase,
  CardBaseContent,
  CardBaseDescription,
  CardBaseFooter,
  CardBaseHeader,
  CardBaseTitle,
} from "@/components/ui/card-base";

export function CardBaseAnatomyExample() {
  return (
    <CardBase className="w-full max-w-sm">
      <CardBaseHeader>
        <CardBaseTitle>Registry</CardBaseTitle>
        <CardBaseDescription>Distributed through the shadcn CLI.</CardBaseDescription>
      </CardBaseHeader>
      <CardBaseContent>Every component ships as source you own.</CardBaseContent>
      <CardBaseFooter>
        <ButtonBase size="sm">Read more</ButtonBase>
      </CardBaseFooter>
    </CardBase>
  );
}

export function CardBaseInteractiveExample() {
  return (
    <CardBase asChild variant="elevated" interactive className="w-full max-w-sm">
      <Link href="/components/button-base">
        <CardBaseTitle>Button Base</CardBaseTitle>
      </Link>
    </CardBase>
  );
}
