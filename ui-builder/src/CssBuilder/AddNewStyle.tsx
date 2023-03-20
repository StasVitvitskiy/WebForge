import { v4 as uuidv4 } from "uuid";
import { MdOutlineAddBox } from "react-icons/md";
import React, { useCallback, useState } from "react";
import { StyleNameComboBox } from "~/CssBuilder/StyleNameComboBox";

export function AddNewStyle({
    onChange,
}: {
    onChange?: (newStyle: { key: string; value: string }) => void;
}): JSX.Element {
    const [newStyle, setNewStyle] = useState({
        id: uuidv4(),
        key: "",
        value: "",
    });
    const onAddNewStyle = useCallback(() => {
        if (newStyle.key && newStyle.value) {
            onChange?.(newStyle);
            setNewStyle({
                id: uuidv4(),
                key: "",
                value: "",
            });
        }
    }, [onChange, newStyle]);

    return (
        <>
            <label className="mt-4 block text-sm font-medium leading-6 text-white">
                New style
            </label>
            <fieldset>
                <div className="mt-1 -space-y-px rounded-tl-md rounded-tr-md bg-white shadow-sm">
                    <div className="flex -space-x-px">
                        <div className="w-1/2 min-w-0 flex-1">
                            <StyleNameComboBox
                                key={newStyle.id}
                                Input={{
                                    className:
                                        "relative block w-full rounded-none rounded-tl-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6",
                                }}
                                placeholder="Style name"
                                onChange={(e) => {
                                    setNewStyle({
                                        ...newStyle,
                                        key: e.name,
                                    });
                                }}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <input
                                key={newStyle.id}
                                type="text"
                                name="new-style-value"
                                id="new-style-value"
                                className="relative block w-full rounded-none rounded-tr-md border-0 bg-transparent py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                placeholder="Style value"
                                onChange={(e) => {
                                    setNewStyle({
                                        ...newStyle,
                                        value: e.target.value,
                                    });
                                }}
                                autoComplete="off"
                                onKeyPress={(e) => {
                                    if (e.key === "Enter") {
                                        onAddNewStyle();
                                    }
                                }}
                            />
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="flex w-full items-center justify-center gap-x-1.5 rounded-none rounded-br-md rounded-bl-md border border-t-0 border-white bg-gray-800 py-1.5 px-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    onClick={onAddNewStyle}
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
