export function getDragDepth(offset: number, indentationWidth: number): number {
  return Math.round(offset / indentationWidth)
}
