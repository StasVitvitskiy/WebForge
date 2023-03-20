const { last } = require("lodash");
const css = require("@webref/css");
const { writeFile } = require("fs/promises");

interface Property {
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
    styleDeclarationProperty?: string;
}
interface ValueType {
    name: string;
    value: string;
    type: "type";
}

function getReferenceValues(prop: Property): string[] {
    const values = (prop.value || "").split("|").map((el) => el.trim());
    return values.filter((el) => el.startsWith("<"));
}

async function main(): Promise<void> {
    const parsedFiles: Record<
        string,
        {
            properties: Property[];
            values: ValueType[];
        }
    > = await css.listAll();

    const properties: {
        list: string[];
        hashTable: Record<string, Property>;
    } = {
        list: Object.values(parsedFiles)
            .flatMap((spec) => spec.properties.map((property) => property.name))
            .filter((property) => !property.startsWith("-")),
        hashTable: Object.values(parsedFiles).reduce(
            (acc, spec) => ({
                ...acc,
                ...spec.properties.reduce((agg, prop) => {
                    return {
                        ...agg,
                        [prop.name]: {
                            ...prop,
                            styleDeclarationProperty:
                                last(prop.styleDeclaration ?? []) || prop.name,
                            referenceValues: getReferenceValues(prop),
                        },
                    };
                }, {}),
            }),
            {},
        ),
    };

    const values = Object.values(properties.hashTable).reduce(
        (acc, prop: Property) => {
            const referenceValues = getReferenceValues(prop);

            if (referenceValues.length) {
                return {
                    ...acc,
                    ...referenceValues.reduce<
                        Record<string, { properties: string[] }>
                    >((agg, el) => {
                        if (agg[el]) {
                            agg[el]?.properties.push(prop.name);

                            return agg;
                        }

                        return {
                            ...agg,
                            [el]: {
                                properties: [prop.name],
                            },
                        };
                    }, acc),
                };
            }

            return acc;
        },
        {},
    );

    const valueTypes = Object.values(parsedFiles).reduce((acc, spec) => {
        return {
            ...acc,
            ...spec.values.reduce(
                (agg, el) => ({
                    ...agg,
                    [el.name]: el,
                }),
                {},
            ),
        };
    }, {});

    await writeFile("./properties.json", JSON.stringify(properties, null, 4));
    await writeFile("./values.json", JSON.stringify(values, null, 4));
    await writeFile("./value-types.json", JSON.stringify(valueTypes, null, 4));
}

main()
    .then(() => {
        process.exit(0);
    })
    .catch(() => process.exit(1));
