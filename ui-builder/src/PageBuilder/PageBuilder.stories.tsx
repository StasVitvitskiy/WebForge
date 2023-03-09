import React, { useState } from "react";
import { PageBuilder } from "./PageBuilder";
import { UiModel } from "~/Editor/UiModel/UiModel";

export default {
    title: "Page Builder",
};

export const Basic = () => {
    const [pageModel, setPageModel] = useState<UiModel | undefined>(undefined);

    return (
        <div className="h-screen">
            <PageBuilder uiModel={pageModel} onChange={setPageModel} />
        </div>
    );
};
