import { createContext } from "react";
import { noop } from "lodash";
import { type UiModel } from "~/Editor/UiModel/UiModel";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";

export const UiEditorContext = createContext<{
    onChange: (newModel: UiModel) => void;
    uiModel?: UiModel;
    buildingBlocks?: Record<string, EditorBuildingBlock>;
}>({
    onChange: noop,
});
