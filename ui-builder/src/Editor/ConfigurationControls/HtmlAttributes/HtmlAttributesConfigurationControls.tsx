import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import React from "react";
import { TagNameInput } from "./TagNameInput";
import { ClassNameInput } from "./ClassNameInput";
import { AddNewAttribute } from "./AddNewAttribute";
import { CustomAttributes } from "./CustomAttributes";

export function HtmlAttributesConfigurationControls(props: {
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
