"use babel";

import { CompositeDisposable } from "atom";
import { OutlineView } from "./outlineView";
import { ProviderRegistry } from "./providerRegistry";

export default {
  subscriptions: null,
  activeEditorContentUpdateSubscription: null,
  view: null,
  outlineProviderRegistry: new ProviderRegistry(),
  busySignalProvider: null,

  activate() {
    this.subscriptions = new CompositeDisposable();
    this.view = new OutlineView();

    this.addCommands();

    const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(
      editor => {
        const getOutlineForActiveTextEditor = () => this.getOutline(editor);

        getOutlineForActiveTextEditor();

        const hasSaveSubscriptionToDispose =
          this.activeEditorContentUpdateSubscription &&
          this.activeEditorContentUpdateSubscription.dispose;
        if (hasSaveSubscriptionToDispose) {
          this.activeEditorContentUpdateSubscription.dispose();
        }

        this.activeEditorContentUpdateSubscription =
          editor && editor.onDidSave(getOutlineForActiveTextEditor);
      }
    );
    this.subscriptions.add(activeTextEditorObserver);
  },

  deactivate() {
    this.subscriptions.dispose();
    this.view.destroy();
  },

  consumeSignal(registry) {
    const provider = registry.create();

    this.busySignalProvider = provider;
    this.subscriptions.add(provider);
  },

  consumeOutlineProvider(provider) {
    const providerRegistryEntry = this.outlineProviderRegistry.addProvider(
      provider
    );
    this.subscriptions.add(providerRegistryEntry);

    // Generate (try) an outline after obtaining a provider
    this.getOutline();
  },

  addCommands() {
    const outlineToggle = atom.commands.add("atom-workspace", {
      "outline:toggle": () => this.toggleOutlineView()
    });
    this.subscriptions.add(outlineToggle);
  },

  toggleOutlineView() {
    const outlinePane = atom.workspace.paneForItem(this.view);
    if (outlinePane) {
      return outlinePane.destroyItem(this.view);
    }

    const rightDock = atom.workspace.getRightDock();
    const [pane] = rightDock.getPanes();

    pane.addItem(this.view);
    pane.activateItem(this.view);

    rightDock.show();
  },

  async getOutline(activeEditor) {
    const editor = activeEditor || atom.workspace.getActiveTextEditor();
    if (!editor) {
      return this.view.clearOutline();
    }

    const target = editor.getFileName();
    this.busySignalProvider &&
      this.busySignalProvider.add(`Outline: ${target}`);

    const provider = this.outlineProviderRegistry.getProvider(editor);
    const outline = provider && (await provider.getOutline(editor));

    this.view.setOutline({
      tree: (outline && outline.outlineTrees) || [],
      editor
    });

    this.busySignalProvider && this.busySignalProvider.clear();
  }
};
