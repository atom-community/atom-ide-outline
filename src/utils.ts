import type { Dock } from "atom"

/** A function to detect if an item (view) is visible in Atom */
export function isItemVisible(item: object) {
  const paneContainer = atom.workspace.paneContainerForItem(item)
  if (paneContainer === undefined) {
    return false
  }
  if (typeof (paneContainer as any).isVisible === "function") {
    return (paneContainer as Dock).isVisible()
  } else {
    return true
  }
}

/** Throw an Error using atom notifications */
export function notifyError(e: Error) {
  atom.notifications.addError(e.name, {
    stack: e.stack,
    detail: e.message,
  })
}
