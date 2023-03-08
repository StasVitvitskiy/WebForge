import React from "react";

export interface UiModelBuildingBlockAttributes
    extends React.HTMLAttributes<HTMLElement>,
        Record<string | number | symbol, unknown> {}

export interface UiModelBuildingBlock {
    id: string;
    type: string;
    attributes: UiModelBuildingBlockAttributes;
}
