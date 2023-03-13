import { styled } from "@linaria/react";
import { Accordion } from "flowbite-react";
import React, { type ReactNode } from "react";

const Wrapper = styled.div`
    button[type="button"] {
        padding: 10px;
    }
`;

export function SidePanelAccordion({
    items,
}: {
    items: Array<{ title: ReactNode; content: ReactNode; key: string }>;
}): JSX.Element {
    return (
        <Wrapper>
            <Accordion>
                {items.map(({ key, title, content }) => (
                    <Accordion.Panel key={key}>
                        <Accordion.Title className="bg-gray-800 text-white hover:bg-gray-800 hover:text-white">
                            {title}
                        </Accordion.Title>
                        <Accordion.Content>{content}</Accordion.Content>
                    </Accordion.Panel>
                ))}
            </Accordion>
        </Wrapper>
    );
}
