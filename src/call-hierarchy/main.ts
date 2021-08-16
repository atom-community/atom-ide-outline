import { CompositeDisposable } from "atom"
import type { Disposable } from "atom"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import type { CallHierarchyProvider } from "atom-ide-base"

import { CallHierarchyView } from "./call-hierarchy-view"
import { TabHandler } from "./tab-handler"

const providerRegistry = new ProviderRegistry<CallHierarchyProvider>()
const subscriptions = new CompositeDisposable()
const callHierarchyTab = new TabHandler({
  createItem: () => new CallHierarchyView({ providerRegistry }),
})

export function activate() {
  subscriptions.add(
    atom.commands.add("atom-workspace", "outline:toggle-call-hierarchy", () => callHierarchyTab.toggle()),
    atom.commands.add("atom-workspace", "outline:show-call-hierarchy", () => callHierarchyTab.show())
  )
}

export function deactivate() {
  subscriptions.dispose()
  callHierarchyTab.delete()
}

export function consumeCallHierarchyProvider(provider: CallHierarchyProvider): Disposable {
  const providerDisposer = providerRegistry.addProvider(provider)
  subscriptions.add(providerDisposer)
  callHierarchyTab.item?.showCallHierarchy()
  return providerDisposer
}
