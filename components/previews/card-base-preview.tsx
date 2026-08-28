import { ButtonBase } from "@/components/ui/button-base";
import {
  CardBase,
  CardBaseContent,
  CardBaseDescription,
  CardBaseFooter,
  CardBaseHeader,
  CardBaseTitle,
} from "@/components/ui/card-base";

export function CardBasePreview() {
  return (
    <div className="grid w-full max-w-2xl gap-4 sm:grid-cols-2">
      <CardBase>
        <CardBaseHeader>
          <CardBaseTitle>Outline</CardBaseTitle>
          <CardBaseDescription>
            The default B6 surface: hairline border, flat.
          </CardBaseDescription>
        </CardBaseHeader>
        <CardBaseContent className="text-small text-muted-foreground">
          Use it for dense lists and settings panels.
        </CardBaseContent>
        <CardBaseFooter>
          <ButtonBase size="sm" variant="secondary">
            Action
          </ButtonBase>
        </CardBaseFooter>
      </CardBase>

      <CardBase variant="elevated" interactive>
        <CardBaseHeader>
          <CardBaseTitle>Elevated</CardBaseTitle>
          <CardBaseDescription>Lifts on hover when marked interactive.</CardBaseDescription>
        </CardBaseHeader>
        <CardBaseContent className="text-small text-muted-foreground">
          Use it for cards that navigate somewhere.
        </CardBaseContent>
      </CardBase>
    </div>
  );
}
