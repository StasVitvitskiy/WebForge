import { type UiModel } from "~/Editor/UiModel/UiModel";

export function setActiveElement({
    uiModel,
    activeElement,
}: {
    uiModel: UiModel;
    activeElement: string;
}): UiModel {
    return { ...uiModel, activeElement };
}
