const properties = require("./cli/properties.json");

export interface SupportedProperty {
    name: string;
    value: string;
    initial?: string;
    appliesTo?: string;
    inherited?: string;
    percentages?: string;
    media?: string;
    computedValue?: string;
    animationType?: string;
    styleDeclaration?: string[];
    styleDeclarationProperty: string;
    referenceValues: string[];
}
export const supportedProperties = properties as {
    list: string[];
    hashTable: Record<string, SupportedProperty>;
};
