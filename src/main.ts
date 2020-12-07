import { CompositeDisposable, TextEditor } from "atom"
import { OutlineView, selectAtCursorLine } from "./outlineView"
import { OutlineProvider, BusySignalRegistry, BusySignalProvider } from "atom-ide-base"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"

export { statuses } from "./statuses" // for spec
import { statuses } from "./statuses"
import { debounce, DebouncedFunc } from "lodash"

let subscriptions: CompositeDisposable

let view: OutlineView
export const outlineProviderRegistry = new ProviderRegistry<OutlineProvider>()

let busySignalProvider: BusySignalProvider

export function activate() {
  subscriptions = new CompositeDisposable()
  view = new OutlineView() // create outline pane
  addCommands()
  addObservers()
  if (atom.config.get("atom-ide-outline.initialDisplay")) {
    toggleOutlineView() // initially show outline pane
  }
}

export function deactivate() {
  onDidCompositeDisposable?.dispose?.()
  subscriptions.dispose()
  view.destroy()
}

export function consumeSignal(registry: BusySignalRegistry) {
  busySignalProvider = registry.create()
  subscriptions.add(busySignalProvider)
}

export async function consumeOutlineProvider(provider: OutlineProvider) {
  const providerRegistryEntry = outlineProviderRegistry.addProvider(provider)
  subscriptions.add(providerRegistryEntry)

  // Generate (try) an outline after obtaining a provider
  await getOutline()
}

function addCommands() {
  const outlineToggle = atom.commands.add("atom-workspace", "outline:toggle", () => toggleOutlineView())
  subscriptions.add(outlineToggle)
}

// disposables returned inside the oberservers
let onDidCompositeDisposable: CompositeDisposable | null

function addObservers() {
  onDidCompositeDisposable = new CompositeDisposable()

  const onDidChangeCursorPosition = debounce((cursorPositionChangedEvent) => {
  const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(async (editor?: TextEditor) => {
    if (!editor) {
      return
    }
    // dispose the old subscriptions
    onDidCompositeDisposable?.dispose?.()

    await getOutline(editor) // initial outline

    const lineCount = lineCountIfLarge(editor as TextEditor)
    onDidCompositeDisposable!.add(
      // update the outline if editor stops changing
      editor.onDidStopChanging(() => {
        onDidStopChanging(editor)
      }),

      // update outline if cursor changes position
      editor.onDidChangeCursorPosition((cursorPositionChangedEvent) => {
        onDidChangeCursorPosition(cursorPositionChangedEvent)
      }),

      // clean up if the editor editor is closed
      editor.onDidDestroy(() => {
        setStatus("noEditor")
      })
    )
  })
  subscriptions.add(activeTextEditorObserver)
}

export function toggleOutlineView() {
  const outlinePane = atom.workspace.paneForItem(view)
  if (outlinePane) {
    outlinePane.destroyItem(view)
    return
  }

  const rightDock = atom.workspace.getRightDock()
  const [pane] = rightDock.getPanes()

  pane.addItem(view)
  pane.activateItem(view)

  rightDock.show()
}

export async function getOutline(activeEditor?: TextEditor) {
  // editor
  const editor = activeEditor || atom.workspace.getActiveTextEditor()
  if (!editor) {
    return setStatus("noEditor")
  }

  // provider
  const provider = outlineProviderRegistry.getProviderForEditor(editor)

  if (!provider) {
    return setStatus("noProvider")
  }
  // @ts-ignore
  const target = editor.getFileName()
  busySignalProvider?.add(`Outline: ${target}`)

  const outline = await provider.getOutline(editor)

  view.setOutline({
    tree: outline?.outlineTrees ?? [],
    editor,
    isLarge: Boolean(lineCountIfLarge(editor as TextEditor)),
  })

  busySignalProvider?.clear()
}

export function setStatus(id: "noEditor" | "noProvider") {
  const status = statuses[id]
  view.presentStatus(status)
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
  },
}
