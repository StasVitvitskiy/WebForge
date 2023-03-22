import {
    type PropertyControl,
    type PropertyControlProps,
} from "~/CssBuilder/propertyControls/PropertyControl";
import { debounce } from "lodash";
import { RxCrossCircled } from "react-icons/rx";
import React, { useState } from "react";
import { SketchPicker } from "react-color";

export const ColorPickerPropertyControl: PropertyControl = ({
    property: { name, value, label },
    onChange,
    onRemove,
}: PropertyControlProps) => {
    const [showColorPicker, setShowColorPicker] = useState(false);

    return (
        <div>
            <label className="mt-2 block text-sm font-medium leading-6 text-white">
                {label}
            </label>
            <div className="relative mt-1 grid grid-cols-[20%_1fr] rounded-md shadow-sm">
                {showColorPicker && (
                    <div className="absolute top-0 left-0 translate-x-[-100%]">
                        <SketchPicker
                            color={value as string}
                            onChangeComplete={(color) => {
                                onChange({
                                    name,
                                    value: `rgba(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}, ${color.rgb.a})`,
                                });
                            }}
                        />
                    </div>
                )}

                <span
                    style={{
                        backgroundColor: value as string,
                    }}
                    className="inline-flex cursor-pointer items-center rounded-l-md border border-r-0 border-gray-300 px-3 text-white sm:text-sm"
                    onClick={() => {
                        setShowColorPicker(!showColorPicker);
                    }}
                >
                    &nbsp;
                </span>
                <input
                    key={value}
                    type="text"
                    className="block rounded-md rounded-tl-none rounded-bl-none border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    defaultValue={value as string}
                    autoComplete="off"
                    onChange={debounce((e) => {
                        onChange({
                            name,
                            value: e.target.value,
                        });
                    }, 300)}
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <RxCrossCircled
                        className="h-5 w-5 cursor-pointer text-gray-400"
                        aria-hidden="true"
                        onClick={onRemove}
                    />
                </div>
            </div>
        </div>
    );
};
