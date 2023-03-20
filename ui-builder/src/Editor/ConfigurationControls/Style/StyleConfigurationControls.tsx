import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import React from "react";
import { styled } from "@linaria/react";
import { CssBuilder } from "~/CssBuilder/CssBuilder";

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
            />
        </EditorWrapper>
    );
}
