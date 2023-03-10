import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { createPortal } from "react-dom";
import {
    Announcements,
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragStartEvent,
    DragOverlay,
    DragMoveEvent,
    DragEndEvent,
    DragOverEvent,
    MeasuringStrategy,
    DropAnimation,
    Modifier,
    defaultDropAnimation,
    UniqueIdentifier,
} from "@dnd-kit/core";
import {
    SortableContext,
    arrayMove,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import { SortableTreeItem } from "./SortableTreeItem";
import { CSS } from "@dnd-kit/utilities";
import { FlattenedItem, TreeItems } from "./TreeItems";
import { removeChildrenOf } from "./removeChildrenOf";
import { flattenTree } from "./flattenTree";
import { getProjection } from "./getProjection";
import { SensorContext } from "./SensorContext";
import { sortableTreeKeyboardCoordinates } from "./keyboardCoordinates";
import { getChildCount } from "./getChildCount";
import { buildTree } from "./buildTree";
import { removeItem } from "./removeItem";
import { setProperty } from "./setProperty";

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
}: SortableTreeProps) {
    const [items, setLocalItems] = useState(() => defaultItems);
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [overId, setOverId] = useState<UniqueIdentifier | null>(null);
    const [offsetLeft, setOffsetLeft] = useState(0);
    const [currentPosition, setCurrentPosition] =
        useState<{
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
                collapsed && children.length ? [...acc, id as string] : acc,
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

    const announcements: Announcements = {
        onDragStart({ active }) {
            return `Picked up ${active.id}.`;
        },
        onDragMove({ active, over }) {
            return getMovementAnnouncement("onDragMove", active.id, over?.id);
        },
        onDragOver({ active, over }) {
            return getMovementAnnouncement("onDragOver", active.id, over?.id);
        },
        onDragEnd({ active, over }) {
            return getMovementAnnouncement("onDragEnd", active.id, over?.id);
        },
        onDragCancel({ active }) {
            return `Moving was cancelled. ${active.id} was dropped in its original position.`;
        },
    };

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
                                onClick={() => onTreeItemClick?.(id as string)}
                                key={id}
                                id={id}
                                value={name}
                                depth={
                                    id === activeId && projected
                                        ? projected.depth
                                        : depth
                                }
                                indentationWidth={indentationWidth}
                                indicator={indicator}
                                collapsed={Boolean(
                                    collapsed && children.length,
                                )}
                                onCollapse={
                                    collapsible && children.length
                                        ? () => handleCollapse(id)
                                        : undefined
                                }
                                onRemove={
                                    removable
                                        ? () => handleRemove(id)
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
                        {activeId && activeItem ? (
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
                                value={activeId.toString()}
                                indentationWidth={indentationWidth}
                            />
                        ) : null}
                    </DragOverlay>,
                    document.body,
                )}
            </SortableContext>
        </DndContext>
    );

    function handleDragStart({ active: { id: activeId } }: DragStartEvent) {
        setActiveId(activeId);
        setOverId(activeId);

        const activeItem = flattenedItems.find(({ id }) => id === activeId);

        if (activeItem) {
            setCurrentPosition({
                parentId: activeItem.parentId,
                overId: activeId,
            });
        }

        document.body.style.setProperty("cursor", "grabbing");
    }

    function handleDragMove({ delta }: DragMoveEvent) {
        setOffsetLeft(delta.x);
    }

    function handleDragOver({ over }: DragOverEvent) {
        setOverId(over?.id ?? null);
    }

    function handleDragEnd({ active, over }: DragEndEvent) {
        resetState();

        if (projected && over) {
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

    function handleDragCancel() {
        resetState();
    }

    function resetState() {
        setOverId(null);
        setActiveId(null);
        setOffsetLeft(0);
        setCurrentPosition(null);

        document.body.style.setProperty("cursor", "");
    }

    function handleRemove(id: UniqueIdentifier) {
        setItems((items) => removeItem(items as TreeItems, id));
    }

    function handleCollapse(id: UniqueIdentifier) {
        setItems((items) =>
            setProperty(items as TreeItems, id, "collapsed", (value) => {
                return !value;
            }),
        );
    }

    function getMovementAnnouncement(
        eventName: string,
        activeId: UniqueIdentifier,
        overId?: UniqueIdentifier,
    ) {
        if (overId && projected) {
            if (eventName !== "onDragEnd") {
                if (
                    currentPosition &&
                    projected.parentId === currentPosition.parentId &&
                    overId === currentPosition.overId
                ) {
                    return;
                } else {
                    setCurrentPosition({
                        parentId: projected.parentId,
                        overId,
                    });
                }
            }

            const clonedItems: FlattenedItem[] = JSON.parse(
                JSON.stringify(flattenTree(items as TreeItems)),
            );
            const overIndex = clonedItems.findIndex(({ id }) => id === overId);
            const activeIndex = clonedItems.findIndex(
                ({ id }) => id === activeId,
            );
            const sortedItems = arrayMove(clonedItems, activeIndex, overIndex);

            const previousItem = sortedItems[overIndex - 1];

            let announcement;
            const movedVerb = eventName === "onDragEnd" ? "dropped" : "moved";
            const nestedVerb = eventName === "onDragEnd" ? "dropped" : "nested";

            if (!previousItem) {
                const nextItem = sortedItems[overIndex + 1];
                announcement = `${activeId} was ${movedVerb} before ${
                    nextItem!.id
                }.`;
            } else {
                if (projected.depth > previousItem.depth) {
                    announcement = `${activeId} was ${nestedVerb} under ${previousItem.id}.`;
                } else {
                    let previousSibling: FlattenedItem | undefined =
                        previousItem;
                    while (
                        previousSibling &&
                        projected.depth < previousSibling.depth
                    ) {
                        const parentId: UniqueIdentifier | null =
                            previousSibling.parentId;
                        previousSibling = sortedItems.find(
                            ({ id }) => id === parentId,
                        );
                    }

                    if (previousSibling) {
                        announcement = `${activeId} was ${movedVerb} after ${previousSibling.id}.`;
                    }
                }
            }

            return announcement;
        }

        return;
    }
}

const adjustTranslate: Modifier = ({ transform }) => {
    return {
        ...transform,
        y: transform.y - 25,
    };
};
