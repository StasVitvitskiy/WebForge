import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { MdOutlineAddBox } from "react-icons/md";
import React, { useCallback, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export function AddNewAttribute({
    block,
    onChange,
}: {
    block: UiModelBuildingBlock;
    onChange: (block: UiModelBuildingBlock) => void;
}): JSX.Element {
    const [newAttribute, setNewAttribute] = useState({
        id: uuidv4(),
        key: "",
        value: "",
    });
    const onAddNewAttribute = useCallback(() => {
        if (newAttribute.key && newAttribute.value) {
            onChange({
                ...block,
                attributes: {
                    ...block.attributes,
                    [newAttribute.key]: newAttribute.value,
                },
            });
            setNewAttribute({
                id: uuidv4(),
                key: "",
                value: "",
            });
        }
    }, [onChange, block, newAttribute]);

    return (
        <>
            <label
                htmlFor="className"
                className="mt-4 block text-sm font-medium leading-6 text-white"
            >
                New attribute
            </label>
            <fieldset>
                <div className="mt-1 -space-y-px rounded-tl-md rounded-tr-md bg-white shadow-sm">
                    <div className="flex -space-x-px">
                        <div className="w-1/2 min-w-0 flex-1">
                            <input
                                key={newAttribute.id}
                                type="text"
                                name="new-attribute-name"
                                id="new-attribute-name"
                                className="relative block w-full rounded-none rounded-tl-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Attribute name"
                                onChange={(e) => {
                                    setNewAttribute({
                                        ...newAttribute,
                                        key: e.target.value,
                                    });
                                }}
                                autoComplete="off"
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <input
                                key={newAttribute.id}
                                type="text"
                                name="new-attribute-value"
                                id="new-attribute-value"
                                className="relative block w-full rounded-none rounded-tr-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                placeholder="Attribute value"
                                onChange={(e) => {
                                    setNewAttribute({
                                        ...newAttribute,
                                        value: e.target.value,
                                    });
                                }}
                                autoComplete="off"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        onAddNewAttribute();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-x-1.5 rounded-none rounded-br-md rounded-bl-md border border-t-0 border-white bg-gray-800 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    onClick={onAddNewAttribute}
                >
                    Add
                    <MdOutlineAddBox
                        className="-mr-0.5 h-5 w-5"
                        aria-hidden="true"
                    />
                </button>
            </fieldset>
        </>
    );
}
