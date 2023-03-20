import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { MdMore } from "react-icons/md";
import { debounce } from "lodash";
import React from "react";

export function ClassNameInput({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    return (
        <>
            <label
                htmlFor="className"
                className="mt-2 block text-sm font-medium leading-6 text-white"
            >
                CSS classes
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-white sm:text-sm">
                    <MdMore />
                </span>
                <input
                    type="text"
                    name="className"
                    id="className"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={block.attributes.className}
                    onChange={debounce((e) => {
                        onChange({
                            ...block,
                            attributes: {
                                ...block.attributes,
                                className: e.target.value,
                            },
                        });
                    }, 300)}
                    autoComplete="off"
                />
            </div>
        </>
    );
}
