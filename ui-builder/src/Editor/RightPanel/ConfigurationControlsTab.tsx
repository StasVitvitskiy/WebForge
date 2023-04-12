import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock";
import { type EditorBuildingBlock } from "~/Editor/EditorBuildingBlocks/EditorBuildingBlock";
import { groupBy } from "lodash";
import React, { Fragment, useMemo } from "react";
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

    const isGroupCollapsible = (
        group: EditorBuildingBlock["configurationControls"],
    ): boolean | undefined =>
        group?.every(
            (configurationControl) =>
                configurationControl.collapsible !== false,
        );

    if (controls) {
        return (
            <div>
                {Object.entries(grouped).map(([groupName, group], index) => {
                    if (!isGroupCollapsible(group)) {
                        return (
                            <Fragment key={groupName}>
                                {group.map((configurationControl) => {
                                    return (
                                        <configurationControl.Component
                                            key={selectedBlock?.id}
                                            block={
                                                selectedBlock as UiModelBuildingBlock
                                            }
                                            onChange={onChange}
                                        />
                                    );
                                })}
                            </Fragment>
                        );
                    }

                    return (
                        <div
                            key={groupName}
                            className={index > 0 ? "mt-4" : undefined}
                        >
                            <SidePanelAccordion
                                items={group.map((configurationControl) => ({
                                    key: selectedBlock?.id as string,
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
