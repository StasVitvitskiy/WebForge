import { supportedProperties, type SupportedProperty } from "./cssSchema";
import React, { Fragment, type KeyboardEventHandler, useState } from "react";
import { Combobox, Transition } from "@headlessui/react";
import { matchSorter } from "match-sorter";

const options = Object.values(supportedProperties.hashTable);

export function StyleNameComboBox({
    onChange,
    placeholder,
    Input = {
        className:
            "w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0",
    },
    onKeyPress,
}: {
    onChange?: (propertyName: SupportedProperty) => void;
    placeholder?: string;
    Input?: {
        className?: string;
    };
    onKeyPress?: KeyboardEventHandler<HTMLInputElement> | undefined;
}): JSX.Element {
    const [selected, setSelected] = useState<SupportedProperty>(
        {} as SupportedProperty,
    );
    const [query, setQuery] = useState("");

    const filteredOptions = matchSorter(
        options.filter((option: SupportedProperty) =>
            option.name.includes(query),
        ),
        query,
        {
            keys: ["name"],
        },
    );

    return (
        <div className="">
            <Combobox
                by={(a: SupportedProperty, b: SupportedProperty) =>
                    a.name === b.name
                }
                value={selected}
                onChange={(option: SupportedProperty) => {
                    setSelected(option);
                    onChange?.(option);
                }}
            >
                <div className="relative">
                    <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
                        <Combobox.Input
                            className={Input.className}
                            displayValue={(option: SupportedProperty) =>
                                option.name
                            }
                            onChange={(event) => {
                                setQuery(event.target.value);
                            }}
                            placeholder={placeholder}
                            onKeyPress={onKeyPress}
                        />
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => {
                            setQuery("");
                        }}
                    >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                            {filteredOptions.length === 0 && query !== "" ? (
                                <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                                    Nothing found.
                                </div>
                            ) : (
                                filteredOptions.map(
                                    (option: SupportedProperty) => (
                                        <Combobox.Option
                                            key={option.name}
                                            className={({ active }) =>
                                                `relative cursor-default select-none py-2 pl-2 pr-3 ${
                                                    active
                                                        ? "bg-gray-800 text-white"
                                                        : "text-gray-900"
                                                }`
                                            }
                                            value={option}
                                        >
                                            {({ selected }) => (
                                                <>
                                                    <span
                                                        className={`block truncate ${
                                                            selected
                                                                ? "font-medium"
                                                                : "font-normal"
                                                        }`}
                                                    >
                                                        {option.name}
                                                    </span>
                                                </>
                                            )}
                                        </Combobox.Option>
                                    ),
                                )
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    );
}
