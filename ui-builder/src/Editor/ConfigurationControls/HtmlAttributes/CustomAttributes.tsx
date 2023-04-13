import React, { useContext } from "react";
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { RxCrossCircled } from "react-icons/rx";
import { omit } from "lodash";
import { UiEditorContext } from "~/Editor/UiEditorContext";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";

export function CustomAttributes({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    const editorCtx = useContext(UiEditorContext);
    const { tagName, style, className, ...attributes } = omit<
        UiModelBuildingBlock["attributes"]
    >(
        block.attributes,
        (editorCtx?.buildingBlocks?.[block.type] as EditorBuildingBlock)
            .customAttributes ?? [],
    );

    return (
        <>
            {Object.entries(attributes).map(
                ([key, value]: [string, string | number | unknown]) => (
                    <div key={key + value}>
                        <label className="mt-2 block text-sm font-medium leading-6 text-white">
                            {key}
                        </label>
                        <div className="relative mt-1 rounded-md shadow-sm">
                            <input
                                type="text"
                                className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={value as string}
                                autoComplete="off"
                                onBlur={(e) => {
                                    onChange({
                                        ...block,
                                        attributes: {
                                            ...block.attributes,
                                            [key]: e.target.value,
                                        },
                                    });
                                }}
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <RxCrossCircled
                                    className="h-5 w-5 cursor-pointer text-gray-400"
                                    aria-hidden="true"
                                    onClick={() => {
                                        onChange({
                                            ...block,
                                            attributes: {
                                                ...omit(block.attributes, key),
                                            },
                                        });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                ),
            )}
        </>
    );
}
