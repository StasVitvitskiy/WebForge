import {
    type PropertyControl,
    type PropertyControlProps,
} from "~/CssBuilder/propertyControls/PropertyControl";
import { debounce } from "lodash";
import { RxCrossCircled } from "react-icons/rx";
import React from "react";

export const FallbackPropertyControl: PropertyControl = ({
    property: { name, value },
    onChange,
    onRemove,
}: PropertyControlProps) => {
    return (
        <div>
            <label className="mt-2 block text-sm font-medium leading-6 text-white">
                {name}
            </label>
            <div className="relative mt-1 rounded-md shadow-sm">
                <input
                    type="text"
                    className="block w-full rounded-md border-0 py-1.5 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
