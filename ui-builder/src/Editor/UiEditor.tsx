import { Tabs } from "flowbite-react";
import React, { useCallback, useMemo, useState } from "react";
import { styled } from "@linaria/react";
import { MdOutlineWidthWide, MdOutlineSchema } from "react-icons/md";
import { type UiModel } from "~/Editor/UiModel/UiModel";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { Canvas } from "~/Editor/Canvas/Canvas";
import { DraggableBlocks } from "~/Editor/LeftPanel/DraggableBlocks";
import {
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core";
import {
    type DragEndEvent,
    type DragStartEvent,
} from "@dnd-kit/core/dist/types";
import { DraggableBlockFigure } from "~/Editor/LeftPanel/DraggableBlockFigure";
import { insertBlock } from "~/Editor/UiModel/insertBlock";
import { UiEditorContext } from "~/Editor/UiEditorContext";
import { noop } from "lodash";
import { SortableTree } from "~/Editor/DndKit/SortableTree/SortableTree";
import { getSortableTree } from "~/Editor/UiModel/getSortableTree";
import { setActiveElement } from "~/Editor/UiModel/setActiveElement";
import { updateModelOnSort } from "~/Editor/UiModel/updateModelOnSort";
import { type DndKitSortableTreeItems } from "~/Editor/DndKit/SortableTree/treeModel/TreeItems";
import { changeUiBlockName } from "~/Editor/UiModel/changeUiBlockName";
import { ConfigurationControlsTab } from "~/Editor/RightPanel/ConfigurationControlsTab";
import { getSelectedUiBlock } from "~/Editor/UiModel/getSelectedUiBlock";
import { updateModelBlock } from "~/Editor/UiModel/updateModelBlock";
import { HiAdjustmentsHorizontal } from "react-icons/hi2";

const SidePanel = styled.div`
    [aria-label="Side panel tabs"] {
        display: grid;
        grid-template-columns: 1fr 1fr;

        [role="tab"] {
            display: flex;
            justify-content: center;
            align-content: center;
            padding: 8px 0;

            svg {
                margin: 0;
                padding: 0;
            }
        }
    }

    [role="tabpanel"] {
        padding: 0;
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
    leftPanel,
}: {
    uiModel: UiModel;
    buildingBlocks: Record<string, EditorBuildingBlock>;
    onChange?: (newModel: UiModel) => void;
    leftPanel?: {
        activeTab?: "BuildingBlocks" | "UiTree";
    };
}): JSX.Element {
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

    const activationConstraint = useMemo(
        () => ({
            distance: 15,
        }),
        [],
    );
    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint,
    });
    const touchSensor = useSensor(TouchSensor, {
        activationConstraint,
    });
    const keyboardSensor = useSensor(KeyboardSensor, {});
    const sensors = useSensors(mouseSensor, touchSensor, keyboardSensor);

    return (
        <UiEditorContext.Provider value={{ onChange, uiModel, buildingBlocks }}>
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
                sensors={sensors}
            >
                <div className="grid h-full grid-cols-[20%_1fr_min-content]">
                    <SidePanel className="bg-gray-800 text-white">
                        <Tabs.Group
                            aria-label="Side panel tabs"
                            style="underline"
                        >
                            <Tabs.Item
                                active={
                                    leftPanel?.activeTab === "BuildingBlocks"
                                }
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
                                active={leftPanel?.activeTab === "UiTree"}
                                title=""
                                icon={UiTreeIcon}
                                aria-title="UI tree"
                            >
                                <div className="pt-3">
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
                                </div>
                            </Tabs.Item>
                        </Tabs.Group>
                    </SidePanel>

                    <div className="relative">
                        <Canvas
                            uiModel={uiModel}
                            buildingBlocks={buildingBlocks}
                        />
                    </div>

                    <SidePanel className="min-w-[400px] overflow-y-scroll bg-gray-800 text-white">
                        <Tabs.Group
                            aria-label="Side panel tabs"
                            style="underline"
                        >
                            <Tabs.Item
                                title=""
                                aria-title="Active block settings"
                                icon={HiAdjustmentsHorizontal}
                            >
                                <div className="p-4">
                                    <ConfigurationControlsTab
                                        onChange={(updatedBlock) => {
                                            onChange?.(
                                                updateModelBlock({
                                                    uiModel,
                                                    updatedBlock,
                                                }),
                                            );
                                        }}
                                        buildingBlocks={buildingBlocks}
                                        selectedBlock={getSelectedUiBlock({
                                            uiModel,
                                        })}
                                    />
                                </div>
                            </Tabs.Item>
                        </Tabs.Group>
                    </SidePanel>
                </div>

                <DragOverlay dropAnimation={null}>
                    {Boolean(draggingBlockId) && (
                        <div className="text-black">
                            <DraggableBlockFigure
                                block={
                                    buildingBlocks[
                                        draggingBlockId as string
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
