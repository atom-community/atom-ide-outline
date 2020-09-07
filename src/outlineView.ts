/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { TextEditor, Point, CursorPositionChangedEvent } from "atom"

type OutlineEntry = any // TODO type
type OutlineTree = any // TODO type

export class OutlineView {
  public element: HTMLDivElement
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

  setOutline({ tree: outlineTree, editor }: { tree: OutlineTree; editor: TextEditor }) {
    const outlineViewElement = this.getElement()
    outlineViewElement.innerHTML = ""

    const outlineRoot = document.createElement("ul")
    addOutlineEntries({
      parent: outlineRoot,
      entries: outlineTree,
      editor,
    })
    outlineViewElement.append(outlineRoot)
  }

  clearOutline() {
    const outlineViewElement = this.getElement()
    outlineViewElement.innerHTML = ""
  }

  presentStatus(status: { title: string; description: string }) {
    this.clearOutline()

    const statusElement = status && generateStatusElement(status)

    if (statusElement) {
      const outlineViewElement = this.getElement()
      outlineViewElement.append(statusElement)
    }
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

const PointToElementsMap: Map<number, Array<HTMLLIElement>> = new Map() // TODO Point to element

function addOutlineEntries({
  parent,
  entries,
  editor,
  level = 0,
}: {
  parent: HTMLUListElement
  entries: OutlineTree
  editor: TextEditor
  level?: number
}) {
  // NOTE: this function is called multiple times with each update in an editor!
  // a few of the calls is slow ~1-100ms

  // calculate indent length
  const tabLength = editor.getTabLength()
  const indentRatio = 12 * (typeof tabLength === "number" ? tabLength : 4)

  // sort entries
  // TIME 0.1ms
  if (atom.config.get("atom-ide-outline.sortEntries")) {
    entries.sort((e1: OutlineEntry, e2: OutlineEntry) => {
      const rowCompare = e1.startPosition.row - e2.startPosition.row
      if (rowCompare === 0) {
        // compare based on column if on the same row
        return e1.startPosition.column - e1.startPosition.column
      }
      return rowCompare
    })
  }

  entries.forEach((item: OutlineEntry) => {
    const symbol = document.createElement("li")

    // symbol.setAttribute("level", `${level}`); // store level in the element

    // Hold an entry in a dedicated element to prevent hover conflicts - hover over an <li> tag would be cought by a parent <li>
    // TIME: ~0-0.1ms
    const labelElement = document.createElement("span")
    labelElement.innerText = item.representativeName || item.plainText

    const { iconElement, kindClass } = getIcon(item?.icon, item?.kind)
    labelElement.prepend(iconElement)

    symbol.append(labelElement)

    // update start position => elements map
    // TIME: 0-0.2ms
    const elms = PointToElementsMap.get(item.startPosition.row)
    if (elms !== undefined) {
      elms.push(symbol)
      PointToElementsMap.set(item.startPosition.row, elms)
    } else {
      PointToElementsMap.set(item.startPosition.row, [symbol])
    }

    // Cursor reposition on click
    // TIME: 0-0.1ms
    symbol.addEventListener("click", () => {
      const editorPane = atom.workspace.paneForItem(editor)
      if (!editorPane) {
        return
      }
      editorPane.activate()

      editor.getCursors()[0].setBufferPosition(item.startPosition, {
        autoscroll: true,
      })
    })

    const hasChildren = item.children && !!item.children[0]

    // indentation
    if (!hasChildren) {
      labelElement.style.paddingLeft = level !== 0 ? `${indentRatio * level}px` : `${foldButtonWidth}px`
    } else {
      // compensate for the fold button
      labelElement.style.paddingLeft = level !== 0 ? `${indentRatio * level - foldButtonWidth}px` : `0px`
    }

    // create Child elements
    if (hasChildren) {
      // TIME 0-0.2ms
      const childrenList = document.createElement("ul")
      childrenList.addEventListener("click", (event) => event.stopPropagation())
      symbol.append(childrenList)

      // fold Button
      const foldButton = createFoldButton(childrenList)
      labelElement.prepend(foldButton)

      // add children to outline
      // TIME: last one of each batch is slower 0-20ms
      addOutlineEntries({
        parent: childrenList,
        entries: item.children,
        editor,
        level: level + 1,
      })
    }

    // TIME: <0.1ms
    parent.append(symbol)
  })
}

const supportedTypes = [
  "array",
  "boolean",
  "class",
  "constant",
  "constructor",
  "enum",
  "field",
  "file",
  "function",
  "interface",
  "method",
  "module",
  "namespace",
  "number",
  "package",
  "property",
  "string",
  "variable",
]

function getIcon(iconType?: string, kindType?: string) {
  // LSP specification: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_documentSymbol
  // atom-languageclient mapping: https://github.com/atom/atom-languageclient/blob/485bb9d706b422456640c9070eee456ef2cf09c0/lib/adapters/outline-view-adapter.ts#L270

  const iconElement = document.createElement("span")
  iconElement.classList.add("icon")

  // if iconType given instead
  if (kindType == undefined && iconType != undefined) {
    kindType = iconType
  }

  let kindClass = ""
  let type
  if (typeof kindType === "string" && kindType.length > 0) {
    // hasKind
    if (kindType.indexOf("type-") === 0) {
      // supplied with type-...
      kindClass = `${kindType}`
      type = kindType.replace("type-", "")
    } else if (supportedTypes.includes(kindType)) {
      // supplied without type-
      kindClass = `type-${kindType}`
      type = kindType
    } else {
      // as is
      kindClass = kindType
    }
    iconElement.classList.add(kindClass)
  }

  const iconSymbol = type ? type.substring(0, 1) : "•"
  iconElement.innerHTML = `<span>${iconSymbol}</span>`

  return { iconElement, kindClass }
}

const foldButtonWidth = 20

function createFoldButton(childrenList: HTMLUListElement) {
  // TIME: ~0.1-0.5ms
  // fold button
  const foldButton = document.createElement("button")
  foldButton.classList.add("fold", "expanded")

  // fold listener
  foldButton.addEventListener("click", (event) => {
    childrenList.hidden = !childrenList.hidden
    if (childrenList.hidden) {
      foldButton.classList.remove("expanded")
      foldButton.classList.add("collapsed")
    } else {
      foldButton.classList.remove("collapsed")
      foldButton.classList.add("expanded")
    }
    event.stopPropagation()
  })
  return foldButton
}

let focusedElms: HTMLElement[] | undefined // cache for focused elements

// callback for scrolling and highlighting the element that the cursor is on
export function selectAtCursorLine({ newBufferPosition }: CursorPositionChangedEvent) {
  // TIME: ~0.2-0.3ms
  // TODO use range of start and end instead of just the line number

  // remove old cursorOn attribue
  if (focusedElms !== undefined) {
    for (const elm of focusedElms) {
      elm.toggleAttribute("cursorOn", false)
    }
  }

  // add new cursorOn attribue
  const cursorPoint = newBufferPosition.row
  focusedElms = PointToElementsMap.get(cursorPoint)

  if (focusedElms !== undefined) {
    for (const elm of focusedElms) {
      elm.toggleAttribute("cursorOn", true)

      // const level = parseInt(elm.getAttribute("level") ?? "0", 10);

      // TODO this works for the LSPs that their 0 level is the file name or module.
      // For json for example, they do not have such a thing, and so it scrolls to the element itself
      elm.scrollIntoView()
      // if (level <= 1) {
      //   // if level is 1 or 0, scroll to itself
      //   elm.scrollIntoView();
      // } else {
      //   // otherwise scroll to its parent entry
      //   elm.parentElement?.parentElement?.scrollIntoView();
      // }
    }
  }
}
