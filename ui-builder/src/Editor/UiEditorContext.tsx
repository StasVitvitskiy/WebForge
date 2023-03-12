import { createContext } from "react"
import { noop } from "lodash"
import { type UiModel } from "~/Editor/UiModel/UiModel"

export const UiEditorContext = createContext<{
  onChange: (newModel: UiModel) => void
  uiModel?: UiModel
}>({
      onChange: noop,
    })
