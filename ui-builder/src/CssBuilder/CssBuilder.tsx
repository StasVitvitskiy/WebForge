import React, { type CSSProperties, useMemo } from "react";
import { type PropertyControl } from "./propertyControls/PropertyControl";
import { supportedProperties, type SupportedProperty } from "./cssSchema";
import { get, merge, omit } from "lodash";
import { builtInPropertyControls } from "./propertyControls/builtInPropertyControls";
import { AddNewStyle } from "~/CssBuilder/AddNewStyle";

export function CssBuilder({
    css,
    propertyControls = {},
    media,
    onChange,
}: {
    css: CSSProperties;
    propertyControls?: {
        byName?: Record<string, PropertyControl>;
        byPredicate?: (prop: SupportedProperty) => PropertyControl | undefined;
        FallbackPropertyControl?: PropertyControl;
    };
    media?: string;
    onChange?: (newCss: CSSProperties) => void;
}): JSX.Element {
    const mergedPropertyControls = useMemo(
        () => merge({}, propertyControls, builtInPropertyControls),
        [propertyControls],
    );

    return (
        <div>
            {Object.entries(css).map(([key, value]) => {
                const propertyByKey =
                    Object.values(supportedProperties.hashTable).find(
                        (el) => el.styleDeclarationProperty === key,
                    ) ?? supportedProperties.hashTable[key];

                const Renderer: PropertyControl =
                    mergedPropertyControls.byName?.[key] ??
                    (propertyByKey
                        ? mergedPropertyControls.byPredicate?.(
                              supportedProperties.hashTable?.[
                                  propertyByKey.name
                              ] as SupportedProperty,
                          )
                        : undefined) ??
                    mergedPropertyControls.FallbackPropertyControl;

                return (
                    <div key={key}>
                        <Renderer
                            property={{
                                name: key,
                                value,
                                label: propertyByKey?.name ?? key,
                            }}
                            onChange={(style) => {
                                if (media) {
                                    onChange?.(
                                        merge({}, css, {
                                            [media]: {
                                                [style.name]: style.value,
                                            },
                                        }),
                                    );
                                } else {
                                    onChange?.({
                                        ...css,
                                        [style.name]: style.value,
                                    });
                                }
                            }}
                            onRemove={() => {
                                if (media) {
                                    onChange?.({
                                        ...css,
                                        [media]: omit(
                                            {
                                                ...(get(css, media) || {}),
                                            },
                                            key,
                                        ),
                                    });
                                } else {
                                    onChange?.(omit(css, key));
                                }
                            }}
                        />
                    </div>
                );
            })}

            <AddNewStyle
                onChange={({ key, value }) => {
                    if (media) {
                        merge({}, css, {
                            [media]: {
                                [key]: value,
                            },
                        });
                    } else {
                        onChange?.({
                            ...css,
                            [key]: value,
                        });
                    }
                }}
            />
        </div>
    );
}
