export class OutlineView {
  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("outline-view");
  }

  destroy() {
    this.element.remove();
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return "Outline";
  }

  setOutline({ tree: outlineTree, editor }) {
    const outlineViewElement = this.getElement();
    outlineViewElement.innerHTML = "";

    const outlineRoot = document.createElement("ul");
    addOutlineEntries({
      parent: outlineRoot,
      entries: outlineTree,
      editor,
    });
    outlineViewElement.append(outlineRoot);
  }

  clearOutline() {
    const outlineViewElement = this.getElement();
    outlineViewElement.innerHTML = "";
  }

  presentStatus(status) {
    this.clearOutline();

    const statusElement = status && generateStatusElement(status);

    if (statusElement) {
      const outlineViewElement = this.getElement();
      outlineViewElement.append(statusElement);
    }
  }
}

function generateStatusElement(status) {
  const element = document.createElement("div");
  element.className = "status";

  const { title = "", description = "" } = status;
  element.innerHTML = `<h1>${title}</h1>
  <span>${description}</span>`;

  return element;
}

function addOutlineEntries({ parent, entries, editor, level = 0 }) {
  entries.forEach((item) => {
    const symbol = document.createElement("li");

    // Hold an entry in a dedicated element to prevent hover conflicts - hover over an <li> tag would be cought by a parent <li>
    const labelElement = document.createElement("span");
    labelElement.style.paddingLeft = `${10 * level}px`;
    labelElement.innerText = item.representativeName;

    const iconElement = getIcon(item?.icon, item?.kind);
    labelElement.prepend(iconElement);

    symbol.append(labelElement);

    // Cursor reposition on click
    symbol.addEventListener("click", () => {
      const editorPane = atom.workspace.paneForItem(editor);
      editorPane.activate();

      editor.cursors[0].setBufferPosition(item.startPosition, {
        autoscroll: true,
      });
    });

    const hasChildren = item.children && !!item.children[0];
    if (hasChildren) {
      const childrenList = document.createElement("ul");
      childrenList.addEventListener("click", (event) =>
        event.stopPropagation()
      );

      symbol.append(childrenList);
      addOutlineEntries({
        parent: childrenList,
        entries: item.children,
        editor,
        level: level + 1,
      });
    }

    parent.append(symbol);
  });
}

function getIcon(iconType:? string, kindType:? string) {
  // LSP specification: https://microsoft.github.io/language-server-protocol/specifications/specification-current/#textDocument_documentSymbol
  // atom-languageclient mapping: https://github.com/atom/atom-languageclient/blob/485bb9d706b422456640c9070eee456ef2cf09c0/lib/adapters/outline-view-adapter.ts#L270

  const iconElement = document.createElement("span");
  iconElement.classList.add("icon")

  // icon
  const hasIconType = typeof iconType === "string" && iconType.length > 0;
  if (hasIconType) {
    iconElement.classList.add(iconType);
  }

  // kind
  const hasKindType = typeof kindType === "string" && kindType.length > 0;
  let type;
  if (hasKindType) {
    let kindClass;
    if (kindType.indexOf("type-") === 0) { // supplied with type-...
      kindClass = `${kindType}`;
      type = kindType.replace("type-", "");
    } else { // supplied without type-
      kindClass = `type-${kindType}`;
      type = kindType;
    }
    iconElement.classList.add(kindClass);
  }

  const iconSymbol = type ? type.substring(0, 1) : "?";
  iconElement.innerHTML = `<span>${iconSymbol}</span>`;

  return iconElement;
}
