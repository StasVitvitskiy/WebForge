import { type UiModel } from "~/Editor/UiModel/UiModel";
import { v4 as uuidv4 } from "uuid";

export const EmptyPageModel: UiModel = {
    id: uuidv4(),
    type: "Page",
    attributes: {
        title: "",
        description: "",
    },
    blocks: [],
    activeElement: undefined,
};
