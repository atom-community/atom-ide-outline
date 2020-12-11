import { CompositeDisposable, TextEditor, CursorPositionChangedEvent } from "atom"
import { OutlineView, selectAtCursorLine } from "./outlineView"
import { OutlineProvider, BusySignalRegistry, BusySignalProvider } from "atom-ide-base"
import { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry"

export { statuses } from "./statuses" // for spec
import { statuses } from "./statuses"
import { debounce } from "lodash"

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
  subscriptions.add(/*  providerRegistryEntry */ outlineProviderRegistry.addProvider(provider))

  // Generate (try) an outline after obtaining a provider
  await getOutline()
}

function addCommands() {
  subscriptions.add(
    /* outlineToggle */ atom.commands.add("atom-workspace", "outline:toggle", () => toggleOutlineView())
  )
}

const largeFileLineCount = 3000 // minimum number of lines to trigger large file optimizations
function lineCountIfLarge(editor: TextEditor) {
  // @ts-ignore
  if (editor.largeFileMode) {
    return 20000
  }
  const lineCount = editor.getLineCount()
  if (lineCount > largeFileLineCount) {
    return lineCount
  } else {
    return 0 // small file
  }
}

// disposables returned inside the oberservers
let onDidCompositeDisposable: CompositeDisposable | null

function addObservers() {
  onDidCompositeDisposable = new CompositeDisposable()
  const activeTextEditorObserver = atom.workspace.observeActiveTextEditor(async (editor?: TextEditor) => {
    if (!editor) {
      return
    }
    // dispose the old subscriptions
    onDidCompositeDisposable?.dispose?.()

    await getOutline(editor) // initial outline

    const lineCount = lineCountIfLarge(editor as TextEditor)

    // How long to wait for the new changes before updating the outline.
    // A high number will increase the responsiveness of the text editor in large files.
    const updateDebounceTime = Math.max(lineCount / 5, 300) // 1/5 of the line count

    // skip following cursor in large files
    if (/* !isLarge */ lineCount === 0) {
      // following cursor disposable
      const onDidChangeCursorPosition = debounce((newBufferPosition: CursorPositionChangedEvent["newBufferPosition"]) => {
        selectAtCursorLine(newBufferPosition)
      }, updateDebounceTime)

      onDidCompositeDisposable!.add(
        // update outline if cursor changes position
        editor.onDidChangeCursorPosition((cursorPositionChangedEvent: CursorPositionChangedEvent) => {
          onDidChangeCursorPosition(cursorPositionChangedEvent.newBufferPosition)
        })
      )
    }

    const onDidStopChanging = debounce((editor) => {
      getOutline(editor)
    }, updateDebounceTime)

    onDidCompositeDisposable!.add(
      // update the outline if editor stops changing
      editor.onDidStopChanging(() => {
        onDidStopChanging(editor)
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

  view.setOutline(outline?.outlineTrees ?? [], editor, Boolean(lineCountIfLarge(editor as TextEditor)))

  busySignalProvider?.clear()
}

export function setStatus(id: "noEditor" | "noProvider") {
  view.presentStatus(statuses[id])
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
  foldInitially: {
    title: "Fold the entries initially",
    description:
      "If enabled, the outline entries are folded initially. This is enabled automatically in large file mode.",
    type: "boolean",
    default: false,
  },
}
