import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { groupBy } from "lodash";
import React, { useMemo } from "react";
import { SidePanelAccordion } from "~/Editor/SidePanel/SidePanelAccordion";

export function ConfigurationControlsTab({
    selectedBlock,
    buildingBlocks,
    onChange,
}: {
    selectedBlock?: UiModelBuildingBlock;
    buildingBlocks: Record<string, EditorBuildingBlock>;
    onChange: (updatedBlock: UiModelBuildingBlock) => void;
}): JSX.Element | null {
    const buildingBlock = buildingBlocks[selectedBlock?.type as string];
    const controls = buildingBlock?.configurationControls;
    const grouped = useMemo(() => groupBy(controls ?? [], "group"), [controls]);

    if (controls) {
        return (
            <div>
                {Object.entries(grouped).map(([groupName, group], index) => {
                    return (
                        <div
                            key={groupName}
                            className={index > 0 ? "mt-4" : undefined}
                        >
                            <SidePanelAccordion
                                items={group.map((configurationControl) => ({
                                    key: configurationControl.key,
                                    title: <>{groupName}</>,
                                    content: (
                                        <>
                                            {
                                                <configurationControl.Component
                                                    block={
                                                        selectedBlock as UiModelBuildingBlock
                                                    }
                                                    onChange={onChange}
                                                />
                                            }
                                        </>
                                    ),
                                }))}
                            />
                        </div>
                    );
                })}
            </div>
        );
    }

    return null;
}
