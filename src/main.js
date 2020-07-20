import { CompositeDisposable, TextEditor } from "atom";
import { OutlineView } from "./outlineView";
import { ProviderRegistry } from "./providerRegistry";

export { statuses } from "./statuses"; // for spec
import { statuses } from "./statuses";

let subscriptions: CompositeDisposable;
let activeEditorContentUpdateSubscription = null;
let view: OutlineView;
export let outlineProviderRegistry = new ProviderRegistry();
let busySignalProvider;

export function activate() {
  subscriptions = new CompositeDisposable();
  view = new OutlineView(); // create outline pane
  addCommands();
  addObservers();
  if (atom.config.get("atom-ide-outline.InitialDisplay")) {
    toggleOutlineView(); // initially show outline pane    
  }
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

export async function consumeOutlineProvider(provider) {
  const providerRegistryEntry = outlineProviderRegistry.addProvider(provider);
  subscriptions.add(providerRegistryEntry);

  // Generate (try) an outline after obtaining a provider
  await getOutline();
}

function addCommands() {
  const outlineToggle = atom.commands.add("atom-workspace", {
    "outline:toggle": () => toggleOutlineView(),
  });
  subscriptions.add(outlineToggle);
}

function addObservers() {
  const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(
    async (editor: TextEditor) => {
      activeEditorContentUpdateSubscription?.dispose?.(); // dispose old content
      await getOutline(editor); // initial outline
      // changing of outline by changing the cursor
      activeEditorContentUpdateSubscription = editor?.onDidChangeCursorPosition(
        () => getOutline(editor)
      );
    }
  );
  subscriptions.add(activeTextEditorObserver);
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
  // editor
  const editor = activeEditor || atom.workspace.getActiveTextEditor();
  if (!editor) {
    return setStatus("noEditor");
  }

  // provider
  const provider = outlineProviderRegistry.getProvider(editor);

  if (!provider) {
    return setStatus("noProvider");
  }

  const target = editor.getFileName();
  busySignalProvider?.add(`Outline: ${target}`);

  const outline = await provider.getOutline(editor);

  view.setOutline({
    tree: (outline && outline.outlineTrees) || [],
    editor,
  });

  busySignalProvider?.clear();
}

export function setStatus(id) {
  const status = statuses[id];
  view.presentStatus(status);
}

export const config = {
  InitialDisplay: {
    title: "Initial Outline Display",
    description: "Show outline initially aftern atom loads",
    type: "boolean",
    default: true,
  },
};
