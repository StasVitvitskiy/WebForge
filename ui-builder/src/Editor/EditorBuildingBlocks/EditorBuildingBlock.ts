import React from "react";

export interface EditorBuildingBlock {
    name: string;
    Renderer: React.ComponentType<Record<string | number | symbol, unknown>>;
    group?: string;
}
