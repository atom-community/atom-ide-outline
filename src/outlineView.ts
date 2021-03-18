/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TextEditor, CursorPositionChangedEvent } from "atom"
import { OutlineTree } from "atom-ide-base"
import { isItemVisible } from "./utils"

export class OutlineView {
  public element: HTMLDivElement
  private pointToElementsMap = new Map<number, Array<HTMLLIElement>>() // TODO Point to element
  private focusedElms: HTMLElement[] | undefined // cache for focused elements

  // a cache to avoid rerendering
  lastEntries: OutlineTree[] | undefined

  constructor() {
    this.element = document.createElement("div")
    this.element.classList.add("outline-view")
  }

  destroy() {
    this.element.remove()
  }

  getElement() {
    return this.element
  }

  getTitle() {
    return "Outline"
  }

  getIconName() {
    return "list-unordered"
  }

  setOutline(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean) {
    // skip rendering if it is the same
    if (outlineTree === this.lastEntries) {
      return
    } else {
      this.lastEntries = outlineTree
    }

    const outlineViewElement = this.clearOutline()
    outlineViewElement.dataset.editorRootScope = editor.getRootScopeDescriptor().getScopesArray().join(" ")

    if (isLarge) {
      const largeFileElement = document.createElement("div")
      largeFileElement.innerHTML = `
        <span style = "
          font-size: var(--editor-font-size);
          font-family: var(--editor-font-family);
          line-height: var(--editor-line-height);
          color: #71844c;
        "
        >Large file mode</span>
      `
      outlineViewElement.appendChild(largeFileElement)
    }

    const outlineRoot = document.createElement("ul")
    const tabLength = editor.getTabLength()
    if (typeof tabLength === "number") {
      outlineRoot.style.setProperty("--editor-tab-length", Math.max(tabLength / 2, 2).toString(10))
    }
    addOutlineEntries(
      outlineRoot,
      outlineTree,
      editor,
      this.pointToElementsMap,
      /* foldInItially */ isLarge || atom.config.get("atom-ide-outline.foldInitially")
    )
    outlineViewElement.appendChild(outlineRoot)
  }

  clearOutline() {
    const outlineViewElement = this.getElement()
    outlineViewElement.innerHTML = ""
    outlineViewElement.dataset.editorRootScope = ""
    return outlineViewElement
  }

  presentStatus(status: { title: string; description: string }) {
    this.clearOutline()

    const statusElement = status && generateStatusElement(status)

    if (statusElement) {
      const outlineViewElement = this.getElement()
      outlineViewElement.appendChild(statusElement)
    }
  }

  // callback for scrolling and highlighting the element that the cursor is on
  selectAtCursorLine(newBufferPosition: CursorPositionChangedEvent["newBufferPosition"]) {
    // skip if not visible
    if (!this.isVisible()) {
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
    const cursorPoint = newBufferPosition.row
    this.focusedElms = this.pointToElementsMap.get(cursorPoint)

    if (this.focusedElms !== undefined) {
      for (const elm of this.focusedElms) {
        elm.toggleAttribute("cursorOn", true)
        elm.scrollIntoView({
          block: "center", // scroll until the entry is in the center of outline
        })
      }
    }
  }

  isVisible() {
    return isItemVisible(this)
  }
}

function generateStatusElement(status: { title: string; description: string }) {
  const element = document.createElement("div")
  element.className = "status"

  const { title = "", description = "" } = status
  element.innerHTML = `<h1>${title}</h1>
  <span>${description}</span>`

  return element
}

function addOutlineEntries(
  parent: HTMLUListElement,
  entries: OutlineTree[],
  editor: TextEditor,
  pointToElementsMap: Map<number, Array<HTMLLIElement>>,
  isLarge: boolean,
  level = 0
) {
  // NOTE: this function is called multiple times with each update in an editor!
  // a few of the calls is slow ~1-100ms

  // sort entries
  // TIME 0.1ms
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

  for (const item of entries) {
    const symbol = document.createElement("li")

    // symbol.setAttribute("level", `${level}`); // store level in the element

    // Hold an entry in a dedicated element to prevent hover conflicts - hover over an <li> tag would be cought by a parent <li>
    // TIME: ~0-0.1ms
    const labelElement = document.createElement("span")
    labelElement.innerText = (item.representativeName || item.plainText) ?? ""

    labelElement.prepend(/* iconElement */ getIcon(item?.icon, item?.kind))

    symbol.appendChild(labelElement)

    // update start position => elements map
    // TIME: 0-0.2ms
    const elms = pointToElementsMap.get(item.startPosition.row)
    if (elms !== undefined) {
      elms.push(symbol)
      pointToElementsMap.set(item.startPosition.row, elms)
    } else {
      pointToElementsMap.set(item.startPosition.row, [symbol])
    }

    // Cursor reposition on click
    // TIME: 0-0.1ms
    symbol.addEventListener("click", () => onClickEntry(item, editor), { passive: true })

    if (/* hasChildren */ item.children.length >= 1) {
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
      addOutlineEntries(childrenList, item.children, editor, pointToElementsMap, isLarge, level + 1)
    }

    // TIME: <0.1ms
    parent.appendChild(symbol)
  }
}

let clicked: boolean = false // HACK used to prevent scrolling in the outline list when an entry is clicked

function onClickEntry(item: OutlineTree, editor: TextEditor) {
  // only uses a reference to the editor and the pane and corsur are calculated on the fly
  const editorPane = atom.workspace.paneForItem(editor)
  if (editorPane === undefined) {
    return
  }
  editorPane.activate()

  editor.getCursors()[0].setBufferPosition(item.startPosition, {
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
