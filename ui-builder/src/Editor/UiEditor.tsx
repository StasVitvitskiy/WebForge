import { Tabs } from "flowbite-react";
import React from "react";
import { styled } from "@linaria/react";
import { MdOutlineWidthWide, MdOutlineSchema } from "react-icons/md";
import { UiModel } from "~/Editor/UiModel/UiModel";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { Canvas } from "~/Editor/Canvas/Canvas";

const SidePanel = styled.div`
    [aria-label="Left side panel tabs"] {
        display: grid;
        grid-template-columns: 1fr 1fr;

        [role="tab"] {
            display: flex;
            justify-content: center;
            align-content: center;
        }
    }
`;
const BlocksIcon = styled(MdOutlineWidthWide)`
    width: 24px;
    height: 24px;
`;
const UiTreeIcon = styled(MdOutlineSchema)`
    width: 24px;
    height: 24px;
`;

export function UiEditor({
    uiModel,
    buildingBlocks,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
}) {
    return (
        <div className="h-full grid grid-cols-[20%_1fr_20%]">
            <SidePanel className="bg-gray-800 text-white p-4">
                <Tabs.Group aria-label="Left side panel tabs" style="underline">
                    <Tabs.Item
                        active
                        title=""
                        aria-title="Blocks"
                        icon={BlocksIcon}
                    >
                        Blocks Editor
                    </Tabs.Item>
                    <Tabs.Item title="" icon={UiTreeIcon} aria-title="UI tree">
                        UI tree
                    </Tabs.Item>
                </Tabs.Group>
            </SidePanel>

            <Canvas uiModel={uiModel} buildingBlocks={buildingBlocks} />

            <SidePanel className="bg-gray-800 text-white p-4">
                Right Panel
            </SidePanel>
        </div>
    );
}
