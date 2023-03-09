import { Tabs } from "flowbite-react";
import React, { useCallback, useState } from "react";
import { styled } from "@linaria/react";
import { MdOutlineWidthWide, MdOutlineSchema } from "react-icons/md";
import { UiModel } from "~/Editor/UiModel/UiModel";
import { EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { Canvas } from "~/Editor/Canvas/Canvas";
import { DraggableBlocks } from "~/Editor/LeftPanel/DraggableBlocks";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { DragEndEvent, DragStartEvent } from "@dnd-kit/core/dist/types";
import { DraggableBlockFigure } from "~/Editor/LeftPanel/DraggableBlockFigure";
import { insertBlock } from "~/Editor/UiModel/insertBlock";
import { UiEditorContext } from "~/Editor/UiEditorContext";
import { noop } from "lodash";

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
    onChange = noop,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
    onChange?: (newModel: UiModel) => void;
}) {
    const [draggingBlockId, setDraggingBlockId] = useState<string | null>(null);
    const onDragStart = useCallback((event: DragStartEvent) => {
        setDraggingBlockId(event.active.id as string);
    }, []);
    const onDragEnd = useCallback(
        (event: DragEndEvent) => {
            onChange?.(
                insertBlock({
                    uiModel,
                    parentId: event?.over?.id as string,
                    newBlock: buildingBlocks[
                        draggingBlockId as string
                    ] as EditorBuildingBlock,
                }),
            );
            setDraggingBlockId(null);
        },
        [uiModel, draggingBlockId, buildingBlocks, onChange],
    );

    return (
        <UiEditorContext.Provider value={{ onChange, uiModel }}>
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="h-full grid grid-cols-[20%_1fr_20%]">
                    <SidePanel className="bg-gray-800 text-white p-4">
                        <Tabs.Group
                            aria-label="Left side panel tabs"
                            style="underline"
                        >
                            <Tabs.Item
                                active
                                title=""
                                aria-title="Blocks"
                                icon={BlocksIcon}
                            >
                                <DraggableBlocks
                                    buildingBlocks={buildingBlocks}
                                />
                            </Tabs.Item>
                            <Tabs.Item
                                title=""
                                icon={UiTreeIcon}
                                aria-title="UI tree"
                            >
                                UI tree
                            </Tabs.Item>
                        </Tabs.Group>
                    </SidePanel>

                    <div className="relative">
                        <Canvas
                            uiModel={uiModel}
                            buildingBlocks={buildingBlocks}
                        />
                    </div>

                    <SidePanel className="bg-gray-800 text-white p-4">
                        Right Panel
                    </SidePanel>
                </div>

                <DragOverlay dropAnimation={null}>
                    {draggingBlockId && (
                        <div className="text-black">
                            <DraggableBlockFigure
                                block={
                                    buildingBlocks[
                                        draggingBlockId
                                    ] as EditorBuildingBlock
                                }
                            />
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </UiEditorContext.Provider>
    );
}
