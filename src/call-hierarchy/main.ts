import { CompositeDisposable } from "atom"
import type { Disposable, Pane } from "atom"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import type { CallHierarchyProvider } from "atom-ide-base"

import { CallHierarchyView } from "./call-hierarchy-view"

const callHierarchyProviderRegistry = new ProviderRegistry<CallHierarchyProvider>()
const subscriptions = new CompositeDisposable()
let item: CallHierarchyView | undefined

export function activate() {
  subscriptions.add(
    atom.commands.add("atom-workspace", "call-hierarchy:toggle", toggleCallHierarchyTab),
    atom.commands.add("atom-workspace", "call-hierarchy:show", showCallHierarchyTab)
  )
  if (atom.config.get("atom-ide-outline.initialCallHierarchyDisplay")) {
    toggleCallHierarchyTab()
  }
}

export function deactivate() {
  subscriptions.dispose()
  deleteCallHierarchyTab()
}

export function consumeCallHierarchyProvider(provider: CallHierarchyProvider): Disposable {
  const providerDisposer = callHierarchyProviderRegistry.addProvider(provider)
  subscriptions.add(providerDisposer)
  item?.showCallHierarchy()
  return providerDisposer
}

/** toggle the call-hierarchy tab */
function toggleCallHierarchyTab() {
  const {state, targetPane} = getCallHierarchyTabState()
  if (state=='hidden') {
    displayCallHierarchyTab({targetPane})
  } else if (state=='noItem') {
    createCallHierarchyTab({targetPane})
  } else {
    destroyCallHierarchyTab({targetPane})
  }
}

/** show the call-hierarchy tab if it was shown */
function showCallHierarchyTab() {
  const {state, targetPane} = getCallHierarchyTabState()
  if (state=='hidden') {
    displayCallHierarchyTab({targetPane})
  } else if (state=='noItem') {
    createCallHierarchyTab({targetPane})
  }
}

/** delete the call-hierarchy tab if it was shown */
function deleteCallHierarchyTab() {
  const targetPane = item && atom.workspace.paneForItem(item)
  if (targetPane) {
    destroyCallHierarchyTab({targetPane})
  }
}

/** display the hidden call-hierarchy tab at target pane */
function displayCallHierarchyTab({targetPane}: {targetPane: Pane}) {
  item && targetPane.activateItem(item)
  const dock = atom.workspace.getPaneContainers().find(v=>v.getPanes().includes(targetPane))
  dock && 'show' in dock && dock.show()
}

/** create the new call-hierarchy tab at target pane */
function createCallHierarchyTab({targetPane}: {targetPane: Pane}) {
  item = new CallHierarchyView({
    providerRegistry: callHierarchyProviderRegistry,
  })
  targetPane.addItem(item)
  targetPane.activateItem(item)
  atom.workspace.getRightDock().show()
}

/** destroy the call-hierarchy tab from target pane */
function destroyCallHierarchyTab({targetPane}: {targetPane: Pane}) {
  item && targetPane.destroyItem(item)
}

/** get the state of the call hierarchy tab */
function getCallHierarchyTabState() {
  const pane = item && atom.workspace.paneForItem(item)
  return pane
    // @ts-ignore (getVisiblePanes is not includes typedef)
    ?pane.getActiveItem() === item &&atom.workspace.getVisiblePanes().includes(pane)
      ?{state: 'visible', targetPane: pane} as const
      :{state: 'hidden', targetPane: pane} as const
    :{state: 'noItem', targetPane: atom.workspace.getRightDock().getActivePane()} as const
}

export const config = {
  initialCallHierarchyDisplay: {
    title: "Initial Call Hierarchy Display",
    description: "Show call hierarchy initially aftern atom loads",
    type: "boolean",
    default: true,
  },
}
