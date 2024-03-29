import { type ReactNode } from "react";
import type React from "react";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export interface EditorBuildingBlock {
    customAttributes?: string[];
    name: string;
    Renderer: React.ComponentType<
        { children?: ReactNode | undefined } & UiModelBuildingBlock
    >;
    group?: string;
    Icon?: React.ComponentType<Record<string | number | symbol, unknown>>;
    createUiBlock?: (id: string) => UiModelBuildingBlock;
    configurationControls?: Array<{
        key: string;
        group: string;
        Component: React.ComponentType<{
            block: UiModelBuildingBlock;
            onChange: (block: UiModelBuildingBlock) => void;
        }>;
        collapsible?: boolean;
    }>;
}
