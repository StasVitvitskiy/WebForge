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
import { SortableTree } from "~/Editor/DndKit/SortableTree/SortableTree";
import { getSortableTree } from "~/Editor/UiModel/getSortableTree";
import { setActiveElement } from "~/Editor/UiModel/setActiveElement";
import { updateModelOnSort } from "~/Editor/UiModel/updateModelOnSort";
import { DndKitSortableTreeItems } from "~/Editor/DndKit/SortableTree/treeModel/TreeItems";
import { changeUiBlockName } from "~/Editor/UiModel/changeUiBlockName";

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

    [role="tabpanel"] {
        padding: 0;
        padding-top: 16px;
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
    const onTreeItemClick = useCallback(
        (id: string) => {
            onChange?.(setActiveElement({ uiModel, activeElement: id }));
        },
        [uiModel, onChange],
    );
    const onSortableTreeChange = useCallback(
        (newTree: DndKitSortableTreeItems) => {
            onChange?.(
                updateModelOnSort({
                    sortableTree: newTree,
                    uiModel,
                }),
            );
        },
        [uiModel, onChange],
    );

    return (
        <UiEditorContext.Provider value={{ onChange, uiModel }}>
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="h-full grid grid-cols-[20%_1fr_20%]">
                    <SidePanel className="bg-gray-800 text-white py-4">
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
                                <div className="p-4">
                                    <DraggableBlocks
                                        buildingBlocks={buildingBlocks}
                                    />
                                </div>
                            </Tabs.Item>
                            <Tabs.Item
                                title=""
                                icon={UiTreeIcon}
                                aria-title="UI tree"
                            >
                                <SortableTree
                                    key={Date.now()}
                                    defaultItems={getSortableTree(uiModel)}
                                    onTreeItemClick={onTreeItemClick}
                                    selectedItemId={uiModel.activeElement}
                                    onChange={onSortableTreeChange}
                                    onItemNameChange={(id, name) => {
                                        onChange?.(
                                            changeUiBlockName({
                                                uiModel,
                                                id,
                                                name,
                                            }),
                                        );
                                    }}
                                />
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
