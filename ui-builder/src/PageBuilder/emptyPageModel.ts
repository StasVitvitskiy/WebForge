import { UiModel } from "~/Editor/UiModel/UiModel";
import { v4 as uuidv4 } from "uuid";

export const EmptyPageModel: UiModel = {
    type: "Page",
    attributes: {
        title: "",
        description: "",
    },
    blocks: [
        {
            id: uuidv4(),
            type: "Root",
            attributes: {
                style: {
                    width: "100%",
                    height: "100%",
                },
            },
        },
    ],
};
