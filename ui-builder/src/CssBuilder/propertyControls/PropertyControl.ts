import type React from "react";

interface Property {
    label: string;
    name: string;
    value: string | number;
}
export interface PropertyControlProps {
    property: Property;
    onChange: (value: { name: string; value: string | number }) => void;
    onRemove: () => void;
}
export type PropertyControl = React.ComponentType<PropertyControlProps>;
