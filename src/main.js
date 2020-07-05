import { CompositeDisposable } from "atom";
import { OutlineView } from "./outlineView";
import { ProviderRegistry } from "./providerRegistry";

export { statuses } from "./statuses"; // for spec
import { statuses } from "./statuses";

let subscriptions: CompositeDisposable
let activeEditorContentUpdateSubscription = null
let view: OutlineView
export let outlineProviderRegistry = new ProviderRegistry()
let busySignalProvider

export function activate() {
  subscriptions = new CompositeDisposable();
  view = new OutlineView();

  addCommands();

  const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(
      editor => {
        const getOutlineForActiveTextEditor = () => getOutline(editor);

        getOutlineForActiveTextEditor();

        const hasSaveSubscriptionToDispose =
            activeEditorContentUpdateSubscription &&
            activeEditorContentUpdateSubscription.dispose;
        if (hasSaveSubscriptionToDispose) {
          activeEditorContentUpdateSubscription.dispose();
        }

        activeEditorContentUpdateSubscription =
            editor && editor.onDidSave(getOutlineForActiveTextEditor);
      }
  );
  subscriptions.add(activeTextEditorObserver);
}

export function deactivate() {
  subscriptions.dispose();
  view.destroy();
}

export function consumeSignal(registry) {
  const provider = registry.create();

  busySignalProvider = provider;
  subscriptions.add(provider);
}

export function consumeOutlineProvider(provider) {
  const providerRegistryEntry = outlineProviderRegistry.addProvider(
      provider
  );
  subscriptions.add(providerRegistryEntry);

  // Generate (try) an outline after obtaining a provider
  getOutline();
}

function addCommands() {
  const outlineToggle = atom.commands.add("atom-workspace", {
    "outline:toggle": () => toggleOutlineView()
  });
  subscriptions.add(outlineToggle);
}

export function toggleOutlineView() {
  const outlinePane = atom.workspace.paneForItem(view);
  if (outlinePane) {
    return outlinePane.destroyItem(view);
  }

  const rightDock = atom.workspace.getRightDock();
  const [pane] = rightDock.getPanes();

  pane.addItem(view);
  pane.activateItem(view);

  rightDock.show();
}

export async function getOutline(activeEditor) {
  const editor = activeEditor || atom.workspace.getActiveTextEditor();
  if (!editor) {
    return setStatus("noEditor");
  }

  const provider = outlineProviderRegistry.getProvider(editor);

  if (!provider) {
    return setStatus("noProvider");
  }

  const target = editor.getFileName();
  busySignalProvider &&
  busySignalProvider.add(`Outline: ${target}`);

  const outline = await provider.getOutline(editor);

  view.setOutline({
    tree: (outline && outline.outlineTrees) || [],
    editor
  });

  busySignalProvider && busySignalProvider.clear();
}

export function setStatus(id) {
  const status = statuses[id];
  view.presentStatus(status);
}
