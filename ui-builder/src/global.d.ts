declare module "react-style-object-to-css" {
    import { type CSSProperties } from "react";
    export default function styleToCSS(css: CSSProperties | undefined): string;
}

declare module "is-self-closing" {
    export default function isSelfClosingTag(
        tagName: string | undefined,
    ): boolean;
}
