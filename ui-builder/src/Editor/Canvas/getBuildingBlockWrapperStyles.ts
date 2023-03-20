import { type CSSProperties } from "react";
import { omitBy } from "lodash";

export function getBuildingBlockWrapperStyles(
    css: CSSProperties,
): CSSProperties {
    return omitBy(css, (_value, key) => key.includes("border"));
}
