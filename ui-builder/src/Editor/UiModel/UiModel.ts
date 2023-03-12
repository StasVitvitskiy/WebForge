import { type UiModelBuildingBlock } from "./UiModelBuildingBlock";

export interface UiModel {
    id: string;
    type: string;
    attributes: Record<string, unknown>;
    blocks: UiModelBuildingBlock[];
    activeElement?: string;
}
