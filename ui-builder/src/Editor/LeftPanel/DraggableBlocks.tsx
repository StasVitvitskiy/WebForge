import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import React, { useMemo } from "react";
import { groupBy } from "lodash";
import { EditorBuildingBlockGroup } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlockGroup";
import { Draggable } from "~/Editor/LeftPanel/Draggable";
import { DraggableBlockFigure } from "~/Editor/LeftPanel/DraggableBlockFigure";
import { SidePanelAccordion } from "~/Editor/SidePanel/SidePanelAccordion";

export function DraggableBlocks({
    buildingBlocks,
}: {
    buildingBlocks: Record<string, EditorBuildingBlock>;
}): JSX.Element {
    const groups = useMemo(
        () =>
            groupBy(
                Object.values(buildingBlocks)
                    .filter((block) => block.Icon)
                    .map((block) => ({
                        ...block,
                        group: block.group ?? EditorBuildingBlockGroup.Other,
                    })),
                "group",
            ),
        [buildingBlocks],
    );
    const groupNames = useMemo(() => Object.keys(groups), [groups]);

    return (
        <>
            <SidePanelAccordion
                items={groupNames.map((groupName) => ({
                    key: groupName,
                    title: <>{groupName}</>,
                    content: (
                        <>
                            {groups[groupName]?.map((block) => {
                                return (
                                    <Draggable
                                        key={block.name}
                                        id={block.name}
                                        data-draggable={block.name}
                                    >
                                        <DraggableBlockFigure block={block} />
                                    </Draggable>
                                );
                            })}
                        </>
                    ),
                }))}
            />
        </>
    );
}
