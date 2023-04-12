import React, { useState } from "react";
import { PageBuilder } from "./PageBuilder";
import { type UiModel } from "~/Editor/UiModel/UiModel";
import { action } from "@storybook/addon-actions";

export default {
    title: "Page Builder",
};

const storagePageModelKey = "#storage:pageModel";
const readFromStorage = (): UiModel | undefined => {
    try {
        return (
            JSON.parse(localStorage.getItem(storagePageModelKey) as string) ||
            undefined
        );
    } catch {
        return undefined;
    }
};
const saveToStorage = (pageModel: UiModel): UiModel => {
    localStorage.setItem(storagePageModelKey, JSON.stringify(pageModel));
    return pageModel;
};

export const Basic = (): JSX.Element => {
    const [pageModel, setPageModel] = useState<UiModel | undefined>(
        readFromStorage(),
    );

    return (
        <div className="h-screen">
            <PageBuilder
                uiModel={pageModel}
                onChange={(newModel) => {
                    action("UI Model:")(newModel);
                    setPageModel(saveToStorage(newModel));
                }}
            />
        </div>
    );
};
