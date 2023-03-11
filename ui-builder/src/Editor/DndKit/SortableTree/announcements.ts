import { Announcements, UniqueIdentifier } from "@dnd-kit/core";
import { useMemo } from "react";
import {
    FlattenedItem,
    TreeItems,
} from "~/Editor/DndKit/SortableTree/treeModel/TreeItems";
import { flattenTree } from "~/Editor/DndKit/SortableTree/treeModel/flattenTree";
import { arrayMove } from "@dnd-kit/sortable";
import { getProjection } from "~/Editor/DndKit/SortableTree/treeModel/getProjection";

type CurrentPosition = {
    parentId: UniqueIdentifier | null;
    overId: UniqueIdentifier;
} | null;

export function useAnnouncements({
    projected,
    currentPosition,
    setCurrentPosition,
    items,
}: {
    projected: ReturnType<typeof getProjection> | null;
    currentPosition: CurrentPosition;
    setCurrentPosition: (newCurrentPosition: CurrentPosition) => void;
    items: TreeItems;
}): Announcements {
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

    return useMemo(
        () => ({
            onDragStart({ active }) {
                return `Picked up ${active.id}.`;
            },
            onDragMove({ active, over }) {
                return getMovementAnnouncement(
                    "onDragMove",
                    active.id,
                    over?.id,
                );
            },
            onDragOver({ active, over }) {
                return getMovementAnnouncement(
                    "onDragOver",
                    active.id,
                    over?.id,
                );
            },
            onDragEnd({ active, over }) {
                return getMovementAnnouncement(
                    "onDragEnd",
                    active.id,
                    over?.id,
                );
            },
            onDragCancel({ active }) {
                return `Moving was cancelled. ${active.id} was dropped in its original position.`;
            },
        }),
        [],
    );
}
