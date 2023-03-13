import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";

export function flattenUiModelBlocks(
    blocks: UiModelBuildingBlock[],
): UiModelBuildingBlock[] {
    return blocks.flatMap((block) => [
        block,
        ...flattenUiModelBlocks(block.blocks ?? []),
    ]);
}
