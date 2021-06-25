import { TextEditor, Point, Disposable } from "atom"
import { OutlineTree } from "atom-ide-base"
import { isItemVisible, scrollIntoViewIfNeeded } from "atom-ide-base/commons-ui"
import { TreeFilterer } from "zadeh"
import type { Tree } from "zadeh"

export class OutlineView {
  public element: HTMLDivElement

  /** Contains the content of the outline which is either the status element or the list element */
  public outlineContent: HTMLDivElement
  /** The actual outline list element */
  private outlineList: HTMLUListElement | undefined = undefined

  /** Cache for reveal corsur */
  private pointToElementsMap = new Map<number, Array<HTMLLIElement>>() // TODO Point to element
  /** Cache for focused elements */
  private focusedElms: HTMLElement[] | undefined
  /** Cache of last rendered list used to avoid rerendering */
  lastEntries: OutlineTree[] | undefined

  private treeFilterer = new TreeFilterer<"representativeName" | "plainText", "children">()
  private searchBarEditor: TextEditor | undefined
  private searchBarEditorDisposable: Disposable | undefined

  constructor() {
    this.element = document.createElement("div")
    this.element.classList.add("atom-ide-outline")

    this.element.appendChild(makeOutlineToolbar())
    this.element.appendChild(this.createSearchBar())

    this.outlineContent = document.createElement("div")
    this.element.appendChild(this.outlineContent)

    this.outlineContent.classList.add("outline-content")
  }

  destroy() {
    this.element.remove()
  }

  getElement() {
    return this.element
  }

  // needed for Atom
  /* eslint-disable class-methods-use-this */
  getTitle() {
    return "Outline"
  }

  getIconName() {
    return "list-unordered"
  }
  /* eslint-enable class-methods-use-this */

  /**
   * The main function of {OutlineView} which renders the content in the outline or only update the event listeners if
   * the outline tree hasn't changed
   */
  setOutline(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean) {
    // skip rendering if it is the same
    // TIME 0.2-1.2ms // the check itself takes ~0.2-0.5ms, so it is better than rerendering
    if (this.lastEntries !== undefined && hasEqualContent(outlineTree, this.lastEntries)) {
      this.pointToElementsMap.clear() // empty revealCorsur cache
      addEntriesOnClick(
        this.outlineList! /* because this.lastEntries is not undefined */,
        outlineTree,
        editor,
        this.pointToElementsMap,
        0
      )
      return
    } else {
      this.lastEntries = outlineTree
    }

    this.createOutlineList(outlineTree, editor, isLarge)
  }

  /** The function to render the content in the outline */
  createOutlineList(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean) {
    this.clearContent()

    if (isLarge) {
      this.outlineContent.appendChild(createLargeFileElement())
    }
    this.updateSearchBar(outlineTree, editor, isLarge)

    this.outlineList = createOutlineList(outlineTree, editor, isLarge, this.pointToElementsMap)
    this.outlineContent.appendChild(this.outlineList)
  }

  clearContent() {
    this.outlineContent.innerHTML = ""
    if (this.outlineList !== undefined) {
      this.outlineList.dataset.editorRootScope = ""
    }
    this.lastEntries = undefined
  }

  updateSearchBar(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean) {
    this.searchBarEditorDisposable?.dispose()

    // detect if representativeName exists on an entry of the tree, if it doesn't, then we use plainText
    const firstOutlineTree = outlineTree?.[0]
    const dataKey = firstOutlineTree?.representativeName !== undefined ? "representativeName" : "plainText"

    // @ts-ignore we check if representitiveName is undefined, and if it is, we will use plainText instead
    this.treeFilterer.setCandidates(outlineTree, dataKey, "children")

    this.searchBarEditorDisposable = this.searchBarEditor?.onDidStopChanging(() =>
      this.filterOutlineTree(editor, isLarge)
    )
  }

  createSearchBar() {
    this.searchBarEditor = new TextEditor({ mini: true, placeholderText: "Filter" })

    const searchBar = document.createElement("div")
    // searchBar.classList.add("outline-toolbar")

    searchBar.appendChild(atom.views.getView(this.searchBarEditor))

    return searchBar
  }

  renderLastOutlienList() {
    if (this.outlineList !== undefined) {
      this.clearContent()
      this.outlineContent.appendChild(this.outlineList)
    }
  }

  filterOutlineTree(editor: TextEditor, isLarge: boolean) {
    const text = this.searchBarEditor?.getText()
    let query: string
    if (text === undefined) {
      this.renderLastOutlienList()
      return
    } else {
      query = text.trim()
      if (query.length === 0) {
        this.renderLastOutlienList()
        return
      }
    }
    let filteredTree = this.treeFilterer.filter(query)
    // TODO why returns duplicates?
    filteredTree = [...new Set(filteredTree)]
    const filteredOutlineList = createOutlineList(
      (filteredTree as unknown) as OutlineTree[],
      editor,
      isLarge,
      this.pointToElementsMap
    )
    this.clearContent()
    this.outlineContent.appendChild(filteredOutlineList)
  }

  presentStatus(status: { title: string; description: string }) {
    this.clearContent()

    const statusElement = status && generateStatusElement(status)

    if (statusElement) {
      this.outlineContent.appendChild(statusElement)
    }
  }

  // callback for scrolling and highlighting the element that the cursor is on
  selectAtCursorLine(editor: TextEditor) {
    const cursor = editor.getLastCursor()

    // no cursor
    if (!cursor) {
      return
    }

    // skip if not visible
    if (!isItemVisible(this)) {
      return
    }

    if (clicked) {
      // HACK do not scroll when the cursor has moved to a click on the outline entry
      clicked = false
      return
    }

    // TIME: ~0.2-0.3ms
    // TODO use range of start and end instead of just the line number

    // remove old cursorOn attribue
    if (this.focusedElms !== undefined) {
      for (const elm of this.focusedElms) {
        elm.toggleAttribute("cursorOn", false)
      }
    }

    // add new cursorOn attribue
    const cursorPoint = cursor.getBufferRow()
    this.focusedElms = this.pointToElementsMap.get(cursorPoint)

    if (this.focusedElms !== undefined) {
      for (const elm of this.focusedElms) {
        scrollIntoViewIfNeeded(elm, true)
        elm.toggleAttribute("cursorOn", true)
      }
      // remove focus once cursor moved
      const disposable = editor.onDidChangeCursorPosition(() => {
        if (this.focusedElms !== undefined) {
          for (const elm of this.focusedElms) {
            elm.toggleAttribute("cursorOn", false)
          }
        }
        disposable.dispose()
      })
    }
  }
}

/** Create the main outline list */
function createOutlineList(
  outlineTree: OutlineTree[],
  editor: TextEditor,
  isLarge: boolean,
  pointToElementsMap: Map<number, Array<HTMLLIElement>>
) {
  const outlineList = document.createElement("ul")
  outlineList.dataset.editorRootScope = editor.getRootScopeDescriptor().getScopesArray().join(" ")

  const tabLength = editor.getTabLength()
  if (typeof tabLength === "number") {
    outlineList.style.setProperty("--editor-tab-length", Math.max(tabLength / 2, 2).toString(10))
  }
  addOutlineEntries(
    outlineList,
    outlineTree,
    editor,
    /* foldInItially */ isLarge || atom.config.get("atom-ide-outline.foldInitially"),
    0
  )
  // TIME 0.2-0.5m
  addEntriesOnClick(outlineList, outlineTree, editor, pointToElementsMap, 0)
  return outlineList
}

/** Compares the content of the two given {OutlineTree[]} It only compares the content that affects rendering */
function hasEqualContent(ot1: OutlineTree[], ot2: OutlineTree[]) {
  // simple compare
  if (ot1 === ot2) {
    return true
  } else {
    // compare length
    const ot1Len = ot1.length
    const ot2Len = ot2.length
    if (ot1Len !== ot2Len) {
      return false
    }
    // compare the content
    for (let iEntry = 0; iEntry < ot1Len; iEntry++) {
      const e1 = ot1[iEntry]
      const e2 = ot2[iEntry]
      if (
        e1.representativeName !== e2.representativeName ||
        e1.plainText !== e2.plainText ||
        e1.kind !== e2.kind ||
        e1.icon !== e2.icon ||
        !hasEqualContent(e1.children, e2.children)
      ) {
        return false
      }
    }
  }
  return true
}

function makeOutlineToolbar() {
  const toolbar = document.createElement("span")
  toolbar.className = "outline-toolbar"

  const revealCursorButton = document.createElement("button")
  revealCursorButton.innerHTML = "Reveal Cursor"
  revealCursorButton.className = "btn outline-btn"

  revealCursorButton.addEventListener("click", () => {
    atom.commands.dispatch(atom.views.getView(atom.workspace), "outline:reveal-cursor")
  })

  toolbar.appendChild(revealCursorButton)
  return toolbar
}

function createLargeFileElement() {
  const largeFileElement = document.createElement("div")
  largeFileElement.innerHTML = `<span class="large-file-mode">Large file mode</span>`
  return largeFileElement
}

function generateStatusElement(status: { title: string; description: string }) {
  const element = document.createElement("div")
  element.className = "status"

  const { title = "", description = "" } = status
  element.innerHTML = `<h1>${title}</h1>
  <span>${description}</span>`

  return element
}

function hasChildren(entry: OutlineTree) {
  return entry.children.length >= 1
}

function sortEntries(entries: OutlineTree[]) {
  if (atom.config.get("atom-ide-outline.sortEntries")) {
    entries.sort((e1: OutlineTree, e2: OutlineTree) => {
      const rowCompare = e1.startPosition.row - e2.startPosition.row
      if (rowCompare === 0) {
        // compare based on column if on the same row
        return e1.startPosition.column - e1.startPosition.column
      }
      return rowCompare
    })
  }
}

function addOutlineEntries(
  parent: HTMLUListElement,
  entries: OutlineTree[],
  editor: TextEditor,
  isLarge: boolean,
  level: number
) {
  // NOTE: this function is called multiple times with each update in an editor!
  // a few of the calls is slow ~1-100ms

  // TIME 0.1ms
  sortEntries(entries)

  for (const item of entries) {
    const symbol = document.createElement("li")

    // symbol.setAttribute("level", `${level}`); // store level in the element

    // Hold an entry in a dedicated element to prevent hover conflicts - hover over an <li> tag would be cought by a parent <li>
    // TIME: ~0-0.1ms
    const labelElement = document.createElement("span")

    // TODO support item.tokenizedText
    labelElement.innerText = (item.representativeName || item.plainText) ?? ""

    labelElement.prepend(/* iconElement */ getIcon(item?.icon, item?.kind))

    symbol.appendChild(labelElement)

    if (hasChildren(item)) {
      // create Child elements
      // TIME 0-0.2ms
      const childrenList = document.createElement("ul")
      childrenList.style.setProperty("--indent-level", (level + 1).toString(10))
      childrenList.addEventListener("click", (event) => event.stopPropagation(), { passive: true })
      symbol.appendChild(childrenList)

      // fold Button
      const foldButton = createFoldButton(childrenList, isLarge)
      labelElement.prepend(foldButton)

      // add children to outline
      // TIME: last one of each batch is slower 0-20ms
      addOutlineEntries(childrenList, item.children, editor, isLarge, level + 1)
    }

    // TIME: <0.1ms
    parent.appendChild(symbol)
  }
}

/**
 * Adds onClick to the outline entries.
 *
 * @attention The assumption about the type of Elements are added using `as HTML...`. After editing code, make sure that the types are correct
 */
function addEntriesOnClick(
  parent: HTMLUListElement,
  entries: OutlineTree[],
  editor: TextEditor,
  pointToElementsMap: Map<number, Array<HTMLLIElement>>,
  level: number
) {
  const entriesElements = parent.children
  for (let iEntry = 0, len = entries.length; iEntry < len; iEntry++) {
    const item = entries[iEntry]
    const element = entriesElements[iEntry] as HTMLLIElement

    // Cursor reposition on click
    element.addEventListener("click", () => onClickEntry(item.startPosition, editor), { passive: true })

    // update the cache for selectAtCursorLine
    addToPointToElementsMap(pointToElementsMap, item.startPosition.row, element)

    if (hasChildren(item)) {
      const chilrenRootElement = element.lastElementChild as HTMLUListElement
      addEntriesOnClick(chilrenRootElement, item.children, editor, pointToElementsMap, level + 1)
    }
  }
}

/** Update start position => elements map used in `selectAtCursorLine` */
function addToPointToElementsMap(
  pointToElementsMap: Map<number, Array<HTMLLIElement>>,
  pointStartPositionRow: number,
  element: HTMLLIElement
) {
  // TIME: 0-0.2ms
  const elms = pointToElementsMap.get(pointStartPositionRow)
  if (elms !== undefined) {
    elms.push(element)
    pointToElementsMap.set(pointStartPositionRow, elms)
  } else {
    pointToElementsMap.set(pointStartPositionRow, [element])
  }
}

let clicked: boolean = false // HACK used to prevent scrolling in the outline list when an entry is clicked

function onClickEntry(itemStartPosition: Point, editor: TextEditor) {
  // only uses a reference to the editor and the pane and corsur are calculated on the fly
  const editorPane = atom.workspace.paneForItem(editor)
  if (editorPane === undefined) {
    return
  }
  editorPane.activate()

  editor.getCursors()[0].setBufferPosition(itemStartPosition, {
    autoscroll: true,
  })
  // HACK
  clicked = true
}

function getIcon(iconType: string | undefined, kindType: string | undefined) {
  // LSP specification: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_documentSymbol
  // atom-languageclient mapping: https://github.com/atom/atom-languageclient/blob/485bb9d706b422456640c9070eee456ef2cf09c0/lib/adapters/outline-view-adapter.ts#L270

  const iconElement = document.createElement("span")
  iconElement.classList.add("outline-icon")

  // if iconType given instead
  if (kindType === undefined && iconType !== undefined) {
    kindType = iconType
  }

  let type: string = "🞇"
  if (typeof kindType === "string" && kindType.length > 0) {
    let kindClass: string
    // hasKind
    if (kindType.indexOf("type-") === 0) {
      // supplied with type-...
      kindClass = `${kindType}`
      type = kindType.replace("type-", "")
    } else {
      // supplied without type-
      kindClass = `type-${kindType}`
      type = kindType
    }
    iconElement.classList.add(kindClass)
  }

  iconElement.innerHTML = `<span>${type.substring(0, 3)}</span>`

  return iconElement
}

function createFoldButton(childrenList: HTMLUListElement, foldInitially: boolean) {
  // TIME: ~0.1-0.5ms
  // fold button
  const foldButton = document.createElement("button")

  if (foldInitially) {
    // collapse in large files by default
    childrenList.hidden = true
    foldButton.classList.add("outline-fold-btn", "collapsed")
  } else {
    foldButton.classList.add("outline-fold-btn", "expanded")
  }

  // fold listener
  foldButton.addEventListener(
    "click",
    (event) => {
      childrenList.hidden = !childrenList.hidden
      if (childrenList.hidden) {
        foldButton.classList.remove("expanded")
        foldButton.classList.add("collapsed")
      } else {
        foldButton.classList.remove("collapsed")
        foldButton.classList.add("expanded")
      }
      event.stopPropagation()
    },
    { passive: true }
  )
  return foldButton
}
