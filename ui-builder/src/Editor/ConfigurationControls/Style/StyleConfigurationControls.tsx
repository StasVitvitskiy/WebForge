import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import React from "react";
import { styled } from "@linaria/react";
import { CssBuilder } from "~/CssBuilder/CssBuilder";
import { ColorPickerPropertyControl } from "~/Editor/ConfigurationControls/Style/ColorPickerPropertyControl";

const EditorWrapper = styled.div``;

export function StyleConfigurationControls({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    return (
        <EditorWrapper>
            <CssBuilder
                key={block.id}
                css={block.attributes.style ?? {}}
                onChange={(newCss) => {
                    onChange?.({
                        ...block,
                        attributes: {
                            ...block.attributes,
                            style: newCss,
                        },
                    });
                }}
                propertyControls={{
                    byPredicate: (prop) => {
                        if (
                            prop.referenceValues.length === 1 &&
                            prop.referenceValues[0] === "<color>"
                        ) {
                            return ColorPickerPropertyControl;
                        }

                        return undefined;
                    },
                }}
            />
        </EditorWrapper>
    );
}
