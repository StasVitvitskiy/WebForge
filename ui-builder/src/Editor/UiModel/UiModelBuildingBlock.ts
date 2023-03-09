import React, { ReactHTML } from "react";

export interface UiModelBuildingBlockAttributes
    extends React.HTMLAttributes<HTMLElement>,
        Record<string | number | symbol, unknown> {
    tagName?: keyof ReactHTML;
}

export interface UiModelBuildingBlock {
    id: string;
    type: string;
    name?: string;
    attributes: UiModelBuildingBlockAttributes;
    blocks?: UiModelBuildingBlock[];
}
