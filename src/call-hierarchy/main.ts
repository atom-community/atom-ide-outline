import { CompositeDisposable } from "atom"
import type { Disposable } from "atom"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"
import type { CallHierarchyProvider } from "atom-ide-base"

import { CallHierarchyView } from "./call-hierarchy-view"
import { TabHandler } from './tab-handler'

const callHierarchyProviderRegistry = new ProviderRegistry<CallHierarchyProvider>()
const subscriptions = new CompositeDisposable()
const callHierarchyTab = new TabHandler<CallHierarchyView>({
  onOpen() {
    return new CallHierarchyView({
      providerRegistry: callHierarchyProviderRegistry,
    })
  },
  onClose(item) {
    item.dispose()
  }
})

export function activate() {
  subscriptions.add(
    atom.commands.add("atom-workspace", "call-hierarchy:toggle", ()=>callHierarchyTab.toggle()),
    atom.commands.add("atom-workspace", "call-hierarchy:show", ()=>callHierarchyTab.show())
  )
  if (atom.config.get("atom-ide-outline.initialCallHierarchyDisplay")) {
    callHierarchyTab.toggle()
  }
}

export function deactivate() {
  subscriptions.dispose()
  callHierarchyTab.delete()
}

export function consumeCallHierarchyProvider(provider: CallHierarchyProvider): Disposable {
  const providerDisposer = callHierarchyProviderRegistry.addProvider(provider)
  subscriptions.add(providerDisposer)
  callHierarchyTab.item?.showCallHierarchy()
  return providerDisposer
}

export const config = {
  initialCallHierarchyDisplay: {
    title: "Initial Call Hierarchy Display",
    description: "Show call hierarchy initially aftern atom loads",
    type: "boolean",
    default: true,
  },
}
