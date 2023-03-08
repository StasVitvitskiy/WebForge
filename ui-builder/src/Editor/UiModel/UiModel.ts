import { UiModelBuildingBlock } from "./UiModelBuildingBlock";

export interface UiModel {
    type: string;
    attributes: Record<string, unknown>;
    blocks: UiModelBuildingBlock[];
}
