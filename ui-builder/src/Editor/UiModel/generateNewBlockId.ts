import { v4 as uuidv4 } from "uuid"

export function generateNewBlockId(): string {
  return uuidv4()
}
