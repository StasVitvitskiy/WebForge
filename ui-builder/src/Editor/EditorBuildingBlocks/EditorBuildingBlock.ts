import { type ReactNode } from "react"
import type React from "react"
import { type UiModelBuildingBlock } from "~/Editor/UiModel/UiModelBuildingBlock"

export interface EditorBuildingBlock {
  name: string
  Renderer: React.ComponentType<
  { children?: ReactNode | undefined } & UiModelBuildingBlock
  >
  group?: string
  Icon?: React.ComponentType<Record<string | number | symbol, unknown>>
  createUiBlock?: (id: string) => UiModelBuildingBlock
}
