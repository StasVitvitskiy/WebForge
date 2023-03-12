import React, { useState } from "react";
import { PageBuilder } from "./PageBuilder";
import { type UiModel } from "~/Editor/UiModel/UiModel";
import { action } from "@storybook/addon-actions";

export default {
    title: "Page Builder",
};

export const Basic = (): JSX.Element => {
    const [pageModel, setPageModel] = useState<UiModel | undefined>(undefined);

    return (
        <div className="h-screen">
            <PageBuilder
                uiModel={pageModel}
                onChange={(newModel) => {
                    action("UI Model:")(newModel);
                    setPageModel(newModel);
                }}
            />
        </div>
    );
};
