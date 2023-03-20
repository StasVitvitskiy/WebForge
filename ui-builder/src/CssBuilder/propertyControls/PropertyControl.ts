import type React from "react";

interface Property {
    name: string;
    value: string | number;
}
export interface PropertyControlProps {
    property: Property;
    onChange: (value: Property) => void;
    onRemove: () => void;
}
export type PropertyControl = React.ComponentType<PropertyControlProps>;
