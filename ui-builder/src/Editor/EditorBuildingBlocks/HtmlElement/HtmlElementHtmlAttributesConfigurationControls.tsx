import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import React from "react";
import { TagNameInput } from "~/Editor/EditorBuildingBlocks/HtmlElement/TagNameInput";
import { ClassNameInput } from "~/Editor/EditorBuildingBlocks/HtmlElement/ClassNameInput";
import { AddNewAttribute } from "~/Editor/EditorBuildingBlocks/HtmlElement/AddNewAttribute";
import { CustomAttributes } from "~/Editor/EditorBuildingBlocks/HtmlElement/CustomAttributes";

export function HtmlElementHtmlAttributesConfigurationControls(props: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    return (
        <>
            <div>
                <TagNameInput {...props} />

                <ClassNameInput {...props} />

                <CustomAttributes {...props} />

                <AddNewAttribute {...props} />
            </div>
        </>
    );
}
