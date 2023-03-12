import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    type DragStartEvent,
    DragOverlay,
    type DragMoveEvent,
    type DragEndEvent,
    type DragOverEvent,
    MeasuringStrategy,
    type DropAnimation,
    type Modifier,
    defaultDropAnimation,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableTreeItem } from "./SortableTreeItem/SortableTreeItem";
import { CSS } from "@dnd-kit/utilities";
import { type FlattenedItem, type TreeItems } from "./treeModel/TreeItems";
import { removeChildrenOf } from "./treeModel/removeChildrenOf";
import { flattenTree } from "./treeModel/flattenTree";
import { getProjection } from "./treeModel/getProjection";
import { type SensorContext } from "./SensorContext";
import { sortableTreeKeyboardCoordinates } from "./platform/keyboardCoordinates";
import { getChildCount } from "./treeModel/getChildCount";
import { buildTree } from "./treeModel/buildTree";
import { removeItem } from "./treeModel/removeItem";
import { setProperty } from "./treeModel/setProperty";
import { useAnnouncements } from "./announcements";

const measuring = {
    droppable: {
        strategy: MeasuringStrategy.Always,
    },
};

const dropAnimationConfig: DropAnimation = {
    keyframes({ transform }) {
        return [
            {
                opacity: 1,
                transform: CSS.Transform.toString(transform.initial),
            },
            {
                opacity: 0,
                transform: CSS.Transform.toString({
                    ...transform.final,
                    x: transform.final.x + 5,
                    y: transform.final.y + 5,
                }),
            },
        ];
    },
    easing: "ease-out",
    sideEffects({ active }) {
        active.node.animate([{ opacity: 0 }, { opacity: 1 }], {
            duration: defaultDropAnimation.duration,
            easing: defaultDropAnimation.easing,
        });
    },
};

interface SortableTreeProps {
    collapsible?: boolean;
    defaultItems?: TreeItems;
    indentationWidth?: number;
    indicator?: boolean;
    removable?: boolean;
    onTreeItemClick?: (id: string) => void;
    selectedItemId?: string;
    onChange?: (newTree: TreeItems) => void;
    onItemNameChange?: (id: string, name: string) => void;
}
export function SortableTree({
    onTreeItemClick,
    collapsible = true,
    defaultItems,
    indicator = true,
    indentationWidth = 16,
    removable = true,
    selectedItemId,
    onChange,
    onItemNameChange,
}: SortableTreeProps): JSX.Element {
    const [items, setLocalItems] = useState(() => defaultItems);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [currentPosition, setCurrentPosition] = useState<{
        parentId: UniqueIdentifier | null;
        overId: UniqueIdentifier;
    } | null>(null);

    const setItems = useCallback(
        (cb: ((oldItems: TreeItems | undefined) => TreeItems) | TreeItems) => {
            const newItems = typeof cb === "function" ? cb(items) : cb;

            setLocalItems(newItems);
            onChange?.(newItems);
        },
        [onChange, items],
    );

    const flattenedItems = useMemo(() => {
        const flattenedTree = flattenTree(items as TreeItems);
        const collapsedItems = flattenedTree.reduce<string[]>(
            (acc, { children, collapsed, id }) =>
                collapsed && children.length > 0 ? [...acc, id as string] : acc,
            [],
        );

        return removeChildrenOf(
            flattenedTree,
            activeId ? [activeId, ...collapsedItems] : collapsedItems,
        );
    }, [activeId, items]);
    const projected =
        activeId && overId
            ? getProjection(
                  flattenedItems,
                  activeId,
                  overId,
                  offsetLeft,
                  indentationWidth,
              )
            : null;
    const sensorContext: SensorContext = useRef({
        items: flattenedItems,
        offset: offsetLeft,
    });
    const [coordinateGetter] = useState(() =>
        sortableTreeKeyboardCoordinates(
            sensorContext,
            indicator,
            indentationWidth,
        ),
    );
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter,
        }),
    );

    const sortedIds = useMemo(
        () => flattenedItems.map(({ id }) => id),
        [flattenedItems],
    );
    const activeItem = activeId
        ? flattenedItems.find(({ id }) => id === activeId)
        : null;

    useEffect(() => {
        sensorContext.current = {
            items: flattenedItems,
            offset: offsetLeft,
        };
    }, [flattenedItems, offsetLeft]);

    const announcements = useAnnouncements({
        projected,
        currentPosition,
        setCurrentPosition,
        items: items as TreeItems,
    });

    return (
        <DndContext
            accessibility={{ announcements }}
            sensors={sensors}
            collisionDetection={closestCenter}
            measuring={measuring}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
            onDragCancel={handleDragCancel}
        >
            <SortableContext
                items={sortedIds}
                strategy={verticalListSortingStrategy}
            >
                {flattenedItems.map(
                    ({ id, children, collapsed, name, depth }) => {
                        return (
                            <SortableTreeItem
                                onClick={() => {
                                    onTreeItemClick?.(id as string);
                                }}
                                onNameChange={(name) => {
                                    onItemNameChange?.(id as string, name);
                                }}
                                key={id}
                                id={id}
                                value={name}
                                depth={
                                    id === activeId && projected != null
                                        ? projected.depth
                                        : depth
                                }
                                indentationWidth={indentationWidth}
                                indicator={indicator}
                                collapsed={Boolean(
                                    collapsed && children.length,
                                )}
                                onCollapse={
                                    collapsible && children.length > 0
                                        ? () => {
                                              handleCollapse(id);
                                          }
                                        : undefined
                                }
                                onRemove={
                                    removable
                                        ? () => {
                                              handleRemove(id);
                                          }
                                        : undefined
                                }
                                className={`border-y border-gray-200 ${
                                    selectedItemId === id
                                        ? "text-blue-600"
                                        : "text-white"
                                }`}
                            />
                        );
                    },
                )}
                {createPortal(
                    <DragOverlay
                        dropAnimation={dropAnimationConfig}
                        modifiers={indicator ? [adjustTranslate] : undefined}
                    >
                        {activeId && activeItem != null ? (
                            <SortableTreeItem
                                id={activeId}
                                depth={activeItem.depth}
                                clone
                                childCount={
                                    getChildCount(
                                        items as TreeItems,
                                        activeId,
                                    ) + 1
                                }
                                value={activeItem.name}
                                indentationWidth={indentationWidth}
                            />
                        ) : null}
                    </DragOverlay>,
                    document.body,
                )}
            </SortableContext>
        </DndContext>
    );

    function handleDragStart({
        active: { id: activeId },
    }: DragStartEvent): void {
        setActiveId(activeId);
        setOverId(activeId);

        const activeItem = flattenedItems.find(({ id }) => id === activeId);

        if (activeItem != null) {
            setCurrentPosition({
                parentId: activeItem.parentId,
                overId: activeId,
            });
        }

        document.body.style.setProperty("cursor", "grabbing");
    }

    function handleDragMove({ delta }: DragMoveEvent): void {
        setOffsetLeft(delta.x);
    }

    function handleDragOver({ over }: DragOverEvent): void {
        setOverId(over?.id ?? null);
    }

    function handleDragEnd({ active, over }: DragEndEvent): void {
        resetState();

        if (projected != null && over != null) {
            const { depth, parentId } = projected;
            const clonedItems: FlattenedItem[] = JSON.parse(
                JSON.stringify(flattenTree(items as TreeItems)),
            );
            const overIndex = clonedItems.findIndex(({ id }) => id === over.id);
            const activeIndex = clonedItems.findIndex(
                ({ id }) => id === active.id,
            );
            const activeTreeItem = clonedItems[activeIndex];

            clonedItems[activeIndex] = {
                ...activeTreeItem,
                depth,
                parentId,
            } as FlattenedItem;

            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);
            const newItems = buildTree(sortedItems);

            setItems(newItems);
        }
    }

    function handleDragCancel(): void {
        resetState();
    }

    function resetState(): void {
        setOverId(null);
        setActiveId(null);
        setOffsetLeft(0);
        setCurrentPosition(null);

        document.body.style.setProperty("cursor", "");
    }

    function handleRemove(id: UniqueIdentifier): void {
        setItems((items) => removeItem(items as TreeItems, id));
    }

    function handleCollapse(id: UniqueIdentifier): void {
        setItems((items) =>
            setProperty(items as TreeItems, id, "collapsed", (value) => {
                return !value;
            }),
        );
    }
}

const adjustTranslate: Modifier = ({ transform }) => {
    return {
        ...transform,
        y: transform.y - 25,
    };
};
