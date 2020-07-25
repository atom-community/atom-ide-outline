import { CompositeDisposable, Disposable, TextEditor } from "atom";
import { OutlineView, selectAtCursorLine } from "./outlineView";
import { ProviderRegistry } from "./providerRegistry";

export { statuses } from "./statuses"; // for spec
import { statuses } from "./statuses";

let subscriptions: CompositeDisposable;

// disposables returned inside the oberservers
let activeEditorContentUpdateSubscription: Disposable | null;
let activeEditorDisposeSubscription: Disposable | null;

let view: OutlineView;
export const outlineProviderRegistry = new ProviderRegistry();

let busySignalProvider; // TODO Type

export function activate() {
  subscriptions = new CompositeDisposable();
  view = new OutlineView(); // create outline pane
  addCommands();
  addObservers();
  if (atom.config.get("atom-ide-outline.initialDisplay")) {
    toggleOutlineView(); // initially show outline pane
  }
}

export function deactivate() {
  subscriptions.dispose();
  view.destroy();
}

export function consumeSignal(registry) {
  busySignalProvider = registry.create();
  subscriptions.add(busySignalProvider);
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
    async (editor?: TextEditor) => {
      if (!editor) {
        return;
      }
      // dispose the old subscriptions
      activeEditorContentUpdateSubscription?.dispose?.();
      activeEditorDisposeSubscription?.dispose?.();

      await getOutline(editor); // initial outline

      // update the outline if editor stops changing
      activeEditorContentUpdateSubscription = editor.onDidStopChanging(() =>
        getOutline(editor)
      );

      // update outline if cursor changes position
      activeEditorContentUpdateSubscription = editor.onDidChangeCursorPosition(
        (cursorPositionChangedEvent) =>
          selectAtCursorLine(cursorPositionChangedEvent)
      );

      // clean up if the editor editor is closed
      activeEditorDisposeSubscription = editor.onDidDestroy(() => {
        setStatus("noEditor");
      });
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

export async function getOutline(activeEditor?: TextEditor) {
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

export function setStatus(id: "noEditor" | "noProvider") {
  const status = statuses[id];
  view.presentStatus(status);
}

export const config = {
  initialDisplay: {
    title: "Initial Outline Display",
    description: "Show outline initially aftern atom loads",
    type: "boolean",
    default: true,
  },
  sortEntries: {
    title: "Sort entries based on the line number",
    description: "This option sorts the entries based on where they appear in the code.",
    type: "boolean",
    default: true,
  }
};
