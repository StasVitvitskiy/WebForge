import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { MdOutlineCodeOff } from "react-icons/md";
import { debounce } from "lodash";
import React from "react";

export function TagNameInput({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    return (
        <>
            <label
                htmlFor="tagName"
                className="block text-sm font-medium leading-6 text-white"
            >
                Tag name
            </label>
            <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-white sm:text-sm">
                    <MdOutlineCodeOff />
                </span>
                <input
                    type="text"
                    name="tagName"
                    id="tagName"
                    className="block w-full min-w-0 flex-1 rounded-none rounded-r-md border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="div"
                    defaultValue={block.attributes.tagName}
                    onChange={debounce((e) => {
                        onChange({
                            ...block,
                            attributes: {
                                ...block.attributes,
                                tagName: e.target.value,
                            },
                        });
                    }, 300)}
                    autoComplete="off"
                />
            </div>
        </>
    );
}
