import { FlattenedItem } from "~/Editor/DndKit/SortableTree/TreeItems";
import type { MutableRefObject } from "react";

export type SensorContext = MutableRefObject<{
    items: FlattenedItem[];
    offset: number;
}>;
