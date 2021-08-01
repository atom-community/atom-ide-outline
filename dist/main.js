'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var require$$0 = require('atom');
var zadeh = require('zadeh');
var require$$0$1 = require('path');
var require$$1 = require('util');
var require$$2 = require('fs');
var require$$1$1 = require('assert');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var require$$0__default = /*#__PURE__*/_interopDefaultLegacy(require$$0);
var require$$0__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$0$1);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
var require$$2__default = /*#__PURE__*/_interopDefaultLegacy(require$$2);
var require$$1__default$1 = /*#__PURE__*/_interopDefaultLegacy(require$$1$1);

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

var scrollIntoView$1 = {};

Object.defineProperty(scrollIntoView$1, "__esModule", {
  value: true
});
scrollIntoView$1.scrollIntoView = scrollIntoView;
var scrollIntoViewIfNeeded_1 = scrollIntoView$1.scrollIntoViewIfNeeded = scrollIntoViewIfNeeded;
scrollIntoView$1.isOverflowHidden = isOverflowHidden;

/* globals getComputedStyle */

/**
 * Use these functions instead of `Element::scrollIntoView()` and `Element::scrollIntoViewIfNeeded()`!
 *
 * We've had a recurring issue in Nuclide (e.g. T20028138) where the UI would shift, leaving part of the workspace
 * element offscreen and a blank area in the window. This was caused by called to the native `scrollIntoView()` and
 * `scrollIntoViewIfNeeded()` which, according to the spec, has two potentially surprising behaviors:
 *
 * 1. It scrolls every scrollable ancestor (not just the closest), where
 * 2. "scrollable" is explicitly defined to include elements with `overflow: hidden`
 *
 * This is surprising because `overflow: hidden` is typically used to make elements *not scrollable*.
 *
 * Once the `overflow: hidden` element is scrolled, the user has no way to return it to its original position (as it has
 * no scrollbars).
 *
 * Note that this API doesn't support smooth scrolling. If that becomes necessary, we'll need to come up with a better fix.
 *
 * It's tempting to assume that using `scrollIntoViewIfNeeded()` would fix this issue, however, if the window is small
 * enough so that no amount of scrolling the desired scrollable element would ever reveal the element you're trying to,
 * the browser will keep scrolling ancestors.
 */
function scrollIntoView(el, alignToTop) {
  const scrollTops = getScrollTops(el);
  el.scrollIntoView(alignToTop);
  restoreOverflowHiddenScrollTops(scrollTops);
}

function scrollIntoViewIfNeeded(el, center = true) {
  var _scrollIntoViewIfNeed, _scrollIntoViewIfNeed2, _ref;

  const scrollTops = getScrollTops(el) // eslint-disable-next-line no-unused-expressions
  ;
  (_scrollIntoViewIfNeed = (_scrollIntoViewIfNeed2 = (_ref = el).scrollIntoViewIfNeeded) === null || _scrollIntoViewIfNeed2 === void 0 ? void 0 : _scrollIntoViewIfNeed2.call(_ref, center)) !== null && _scrollIntoViewIfNeed !== void 0 ? _scrollIntoViewIfNeed : el.scrollIntoView(center);
  restoreOverflowHiddenScrollTops(scrollTops);
}

function getScrollTops(el_) {
  let el = el_;
  const scrollTops = new Map();

  while (el !== null) {
    scrollTops.set(el, el.scrollTop);
    el = el.parentElement;
  }

  return scrollTops;
}

function restoreOverflowHiddenScrollTops(scrollTops) {
  scrollTops.forEach((scrollTop, el) => {
    if (el.scrollTop !== scrollTop && isOverflowHidden(el)) {
      el.scrollTop = scrollTop;
    }
  });
}

function isOverflowHidden(el) {
  const overflowStyle = el === null || el === void 0 ? void 0 : el.style.overflow;
  const overflow = overflowStyle !== null && overflowStyle !== void 0 ? overflowStyle : getComputedStyle(el).overflow;
  return overflow === "hidden";
}

var items = {};

Object.defineProperty(items, "__esModule", {
  value: true
});
var isItemVisible_1 = items.isItemVisible = isItemVisible;
items.isElementVisible = isElementVisible;
items.getItemElement = getItemElement;

/**
 * A function to detect if an item (view) is visible in Atom. This is useful to skip code excecution or updating when
 * the item is not visible.
 *
 * @param item This is an item that is stored in {ViewRegistry}. It has the same type of the argument that you pass to
 *   `atom.view.getView(item)`.
 */
function isItemVisible(item) {
  if (item === undefined || item === null) {
    return false;
  } // check the HTMLElement itself (important for when the dock/container is visible but the tab is not selected)
  // try getting the element


  const element = getItemElement(item);

  if (element !== undefined && !isElementVisible(element)) {
    return false; // if it we can't detect the invisiblity using HTML we need to consider Atom's context so we continue
  } // etch component
  // if (item?.component?.visible === false) {
  //   return false
  // }


  const paneContainer = atom.workspace.paneContainerForItem(item); // if no container it is not visible

  if (paneContainer === undefined) {
    return false;
  } else if (typeof paneContainer.isVisible === "function") {
    // use Dock.isVisible()
    return paneContainer.isVisible();
  } else {
    // it is visible (when paneContainer is not a dock like TextEditor)
    return true;
  }
}
/**
 * A function to detect if an HTMLElement is visible. It doesn't consider the Atom context. To detect if an item is
 * visible in Atom use {isItemVisible} instead This is useful to skip code excecution or updating when the element is
 * not visible.
 *
 * @param element
 */


function isElementVisible(element) {
  if (element instanceof HTMLElement && (element.style.display === "none" || element.hidden || element.offsetHeight === 0)) {
    return false;
  }

  return true;
}
/** Get the HTMLElement of an item using `.getElement()` or `.element` */


function getItemElement(item) {
  if (item === undefined || item === null) {
    return undefined;
  }

  return typeof item.getElement === "function" ? item.getElement() : item.element;
}

var HAS_WEAKSET_SUPPORT = typeof WeakSet === 'function';
var keys = Object.keys;
/**
 * are the values passed strictly equal or both NaN
 *
 * @param a the value to compare against
 * @param b the value to test
 * @returns are the values equal by the SameValueZero principle
 */
function sameValueZeroEqual(a, b) {
    return a === b || (a !== a && b !== b);
}
/**
 * is the value a plain object
 *
 * @param value the value to test
 * @returns is the value a plain object
 */
function isPlainObject(value) {
    return value.constructor === Object || value.constructor == null;
}
/**
 * is the value promise-like (meaning it is thenable)
 *
 * @param value the value to test
 * @returns is the value promise-like
 */
function isPromiseLike(value) {
    return !!value && typeof value.then === 'function';
}
/**
 * is the value passed a react element
 *
 * @param value the value to test
 * @returns is the value a react element
 */
function isReactElement(value) {
    return !!(value && value.$$typeof);
}
/**
 * in cases where WeakSet is not supported, creates a new custom
 * object that mimics the necessary API aspects for cache purposes
 *
 * @returns the new cache object
 */
function getNewCacheFallback() {
    var values = [];
    return {
        add: function (value) {
            values.push(value);
        },
        has: function (value) {
            return values.indexOf(value) !== -1;
        },
    };
}
/**
 * get a new cache object to prevent circular references
 *
 * @returns the new cache object
 */
var getNewCache = (function (canUseWeakMap) {
    if (canUseWeakMap) {
        return function _getNewCache() {
            return new WeakSet();
        };
    }
    return getNewCacheFallback;
})(HAS_WEAKSET_SUPPORT);
/**
 * create a custom isEqual handler specific to circular objects
 *
 * @param [isEqual] the isEqual comparator to use instead of isDeepEqual
 * @returns the method to create the `isEqual` function
 */
function createCircularEqualCreator(isEqual) {
    return function createCircularEqual(comparator) {
        var _comparator = isEqual || comparator;
        return function circularEqual(a, b, cache) {
            if (cache === void 0) { cache = getNewCache(); }
            var isCacheableA = !!a && typeof a === 'object';
            var isCacheableB = !!b && typeof b === 'object';
            if (isCacheableA || isCacheableB) {
                var hasA = isCacheableA && cache.has(a);
                var hasB = isCacheableB && cache.has(b);
                if (hasA || hasB) {
                    return hasA && hasB;
                }
                if (isCacheableA) {
                    cache.add(a);
                }
                if (isCacheableB) {
                    cache.add(b);
                }
            }
            return _comparator(a, b, cache);
        };
    };
}
/**
 * are the arrays equal in value
 *
 * @param a the array to test
 * @param b the array to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the arrays equal
 */
function areArraysEqual(a, b, isEqual, meta) {
    var index = a.length;
    if (b.length !== index) {
        return false;
    }
    while (index-- > 0) {
        if (!isEqual(a[index], b[index], meta)) {
            return false;
        }
    }
    return true;
}
/**
 * are the maps equal in value
 *
 * @param a the map to test
 * @param b the map to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta map to pass through
 * @returns are the maps equal
 */
function areMapsEqual(a, b, isEqual, meta) {
    var isValueEqual = a.size === b.size;
    if (isValueEqual && a.size) {
        a.forEach(function (aValue, aKey) {
            if (isValueEqual) {
                isValueEqual = false;
                b.forEach(function (bValue, bKey) {
                    if (!isValueEqual && isEqual(aKey, bKey, meta)) {
                        isValueEqual = isEqual(aValue, bValue, meta);
                    }
                });
            }
        });
    }
    return isValueEqual;
}
var OWNER = '_owner';
var hasOwnProperty$1 = Function.prototype.bind.call(Function.prototype.call, Object.prototype.hasOwnProperty);
/**
 * are the objects equal in value
 *
 * @param a the object to test
 * @param b the object to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta object to pass through
 * @returns are the objects equal
 */
function areObjectsEqual(a, b, isEqual, meta) {
    var keysA = keys(a);
    var index = keysA.length;
    if (keys(b).length !== index) {
        return false;
    }
    if (index) {
        var key = void 0;
        while (index-- > 0) {
            key = keysA[index];
            if (key === OWNER) {
                var reactElementA = isReactElement(a);
                var reactElementB = isReactElement(b);
                if ((reactElementA || reactElementB) &&
                    reactElementA !== reactElementB) {
                    return false;
                }
            }
            if (!hasOwnProperty$1(b, key) || !isEqual(a[key], b[key], meta)) {
                return false;
            }
        }
    }
    return true;
}
/**
 * are the regExps equal in value
 *
 * @param a the regExp to test
 * @param b the regExp to test agains
 * @returns are the regExps equal
 */
function areRegExpsEqual(a, b) {
    return (a.source === b.source &&
        a.global === b.global &&
        a.ignoreCase === b.ignoreCase &&
        a.multiline === b.multiline &&
        a.unicode === b.unicode &&
        a.sticky === b.sticky &&
        a.lastIndex === b.lastIndex);
}
/**
 * are the sets equal in value
 *
 * @param a the set to test
 * @param b the set to test against
 * @param isEqual the comparator to determine equality
 * @param meta the meta set to pass through
 * @returns are the sets equal
 */
function areSetsEqual(a, b, isEqual, meta) {
    var isValueEqual = a.size === b.size;
    if (isValueEqual && a.size) {
        a.forEach(function (aValue) {
            if (isValueEqual) {
                isValueEqual = false;
                b.forEach(function (bValue) {
                    if (!isValueEqual) {
                        isValueEqual = isEqual(aValue, bValue, meta);
                    }
                });
            }
        });
    }
    return isValueEqual;
}

var HAS_MAP_SUPPORT = typeof Map === 'function';
var HAS_SET_SUPPORT = typeof Set === 'function';
function createComparator(createIsEqual) {
    var isEqual = 
    /* eslint-disable no-use-before-define */
    typeof createIsEqual === 'function'
        ? createIsEqual(comparator)
        : comparator;
    /* eslint-enable */
    /**
     * compare the value of the two objects and return true if they are equivalent in values
     *
     * @param a the value to test against
     * @param b the value to test
     * @param [meta] an optional meta object that is passed through to all equality test calls
     * @returns are a and b equivalent in value
     */
    function comparator(a, b, meta) {
        if (a === b) {
            return true;
        }
        if (a && b && typeof a === 'object' && typeof b === 'object') {
            if (isPlainObject(a) && isPlainObject(b)) {
                return areObjectsEqual(a, b, isEqual, meta);
            }
            var aShape = Array.isArray(a);
            var bShape = Array.isArray(b);
            if (aShape || bShape) {
                return aShape === bShape && areArraysEqual(a, b, isEqual, meta);
            }
            aShape = a instanceof Date;
            bShape = b instanceof Date;
            if (aShape || bShape) {
                return (aShape === bShape && sameValueZeroEqual(a.getTime(), b.getTime()));
            }
            aShape = a instanceof RegExp;
            bShape = b instanceof RegExp;
            if (aShape || bShape) {
                return aShape === bShape && areRegExpsEqual(a, b);
            }
            if (isPromiseLike(a) || isPromiseLike(b)) {
                return a === b;
            }
            if (HAS_MAP_SUPPORT) {
                aShape = a instanceof Map;
                bShape = b instanceof Map;
                if (aShape || bShape) {
                    return aShape === bShape && areMapsEqual(a, b, isEqual, meta);
                }
            }
            if (HAS_SET_SUPPORT) {
                aShape = a instanceof Set;
                bShape = b instanceof Set;
                if (aShape || bShape) {
                    return aShape === bShape && areSetsEqual(a, b, isEqual, meta);
                }
            }
            return areObjectsEqual(a, b, isEqual, meta);
        }
        return a !== a && b !== b;
    }
    return comparator;
}

var deepEqual = createComparator();
createComparator(function () { return sameValueZeroEqual; });
createComparator(createCircularEqualCreator());
createComparator(createCircularEqualCreator(sameValueZeroEqual));

function unique(array) {
    return array.filter((elm2, index) => array.findIndex((elm1) => deepEqual(elm1, elm2)) === index);
}
function getIcon(iconType, kindType) {
    const iconElement = document.createElement("span");
    iconElement.classList.add("outline-icon");
    if (kindType === undefined && iconType !== undefined) {
        kindType = iconType;
    }
    let type = "🞇";
    if (typeof kindType === "string" && kindType.length > 0) {
        let kindClass;
        if (kindType.indexOf("type-") === 0) {
            kindClass = `${kindType}`;
            type = kindType.replace("type-", "");
        }
        else {
            kindClass = `type-${kindType}`;
            type = kindType;
        }
        iconElement.classList.add(kindClass);
    }
    iconElement.innerHTML = `<span>${type.substring(0, 3)}</span>`;
    return iconElement;
}

class OutlineView {
    constructor() {
        this.outlineList = undefined;
        this.pointToElementsMap = new Map();
        this.treeFilterer = new zadeh.TreeFilterer();
        this.element = document.createElement("div");
        this.element.classList.add("atom-ide-outline");
        this.element.appendChild(makeOutlineToolbar());
        this.element.appendChild(this.createSearchBar());
        this.outlineContent = document.createElement("div");
        this.element.appendChild(this.outlineContent);
        this.outlineContent.classList.add("outline-content");
    }
    reset() {
        var _a, _b, _c;
        (_a = this.searchBarEditorDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
        (_b = this.selectCursorDisposable) === null || _b === void 0 ? void 0 : _b.dispose();
        (_c = this.searchBarEditor) === null || _c === void 0 ? void 0 : _c.setText("");
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
    getIconName() {
        return "list-unordered";
    }
    setOutline(outlineTree, editor, isLarge) {
        if (this.lastEntries !== undefined && hasEqualContent(outlineTree, this.lastEntries)) {
            this.pointToElementsMap.clear();
            addEntriesOnClick(this.outlineList, outlineTree, editor, this.pointToElementsMap);
            return;
        }
        else {
            this.lastEntries = outlineTree;
        }
        this.createOutlineList(outlineTree, editor, isLarge);
    }
    createOutlineList(outlineTree, editor, isLarge) {
        this.clearContent();
        if (isLarge) {
            this.outlineContent.appendChild(createLargeFileElement());
        }
        this.updateSearchBar(outlineTree, editor, isLarge);
        this.outlineList = createOutlineList(outlineTree, editor, isLarge, this.pointToElementsMap);
        this.outlineContent.appendChild(this.outlineList);
    }
    clearContent() {
        this.outlineContent.innerHTML = "";
        if (this.outlineList !== undefined) {
            this.outlineList.dataset.editorRootScope = "";
        }
        this.lastEntries = undefined;
    }
    updateSearchBar(outlineTree, editor, isLarge) {
        var _a, _b;
        (_a = this.searchBarEditorDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
        const firstOutlineTree = outlineTree[0];
        const dataKey = (firstOutlineTree === null || firstOutlineTree === void 0 ? void 0 : firstOutlineTree.representativeName) !== undefined ? "representativeName" : "plainText";
        this.treeFilterer.setCandidates(outlineTree, dataKey, "children");
        this.searchBarEditorDisposable = (_b = this.searchBarEditor) === null || _b === void 0 ? void 0 : _b.onDidStopChanging(() => this.filterOutlineTree(editor, isLarge));
    }
    createSearchBar() {
        this.searchBarEditor = new require$$0.TextEditor({ mini: true, placeholderText: "Filter" });
        const searchBar = document.createElement("div");
        searchBar.classList.add("outline-searchbar");
        searchBar.appendChild(atom.views.getView(this.searchBarEditor));
        return searchBar;
    }
    renderLastOutlienList() {
        if (this.outlineList !== undefined) {
            this.clearContent();
            this.outlineContent.appendChild(this.outlineList);
        }
    }
    filterOutlineTree(editor, isLarge) {
        var _a, _b;
        if (!editor.isAlive() || !isItemVisible_1(editor)) {
            return;
        }
        const text = (_a = this.searchBarEditor) === null || _a === void 0 ? void 0 : _a.getText();
        if (typeof text !== "string") {
            this.renderLastOutlienList();
            return;
        }
        const query = text.trim();
        if (query.length === 0) {
            this.renderLastOutlienList();
            return;
        }
        let filterResults;
        try {
            filterResults = this.treeFilterer.filter(query, { maxResults: 100, usePathScoring: false });
        }
        catch (err) {
            const error = err;
            error.message = `Filtering failed for unkown reasons.\n${error.message}`;
            console.error(error);
            this.reset();
            const candidates = this.treeFilterer.candidates;
            this.treeFilterer = new zadeh.TreeFilterer(candidates);
            this.updateSearchBar(candidates, editor, isLarge);
            (_b = this.searchBarEditor) === null || _b === void 0 ? void 0 : _b.setText(query);
            this.filterOutlineTree(editor, isLarge);
            return;
        }
        const filteredTree = unique(filterResults);
        if (filteredTree.length === 0) {
            return setStatus("noResult");
        }
        const filteredOutlineList = createOutlineList(filteredTree, editor, isLarge, this.pointToElementsMap);
        this.clearContent();
        this.outlineContent.appendChild(filteredOutlineList);
    }
    presentStatus(status) {
        this.clearContent();
        const statusElement = generateStatusElement(status);
        this.outlineContent.appendChild(statusElement);
    }
    selectAtCursorLine(editor) {
        const cursor = editor.getLastCursor();
        if (!isItemVisible_1(this)) {
            return;
        }
        if (clicked) {
            clicked = false;
            return;
        }
        if (this.focusedElms !== undefined) {
            for (const elm of this.focusedElms) {
                elm.toggleAttribute("cursorOn", false);
            }
        }
        const cursorPoint = cursor.getBufferRow();
        this.focusedElms = this.pointToElementsMap.get(cursorPoint);
        if (this.focusedElms === undefined) {
            const points = this.pointToElementsMap.keys();
            let previousPoint = 0;
            for (const point of points) {
                if (point >= cursorPoint) {
                    const previousElms = this.pointToElementsMap.get(previousPoint);
                    previousElms[previousElms.length - 1].classList.add("after-border");
                    const currentElms = this.pointToElementsMap.get(point);
                    this.focusedElms = [...currentElms, ...previousElms];
                    break;
                }
                else {
                    previousPoint = point;
                }
            }
        }
        if (this.focusedElms !== undefined) {
            for (const elm of this.focusedElms) {
                scrollIntoViewIfNeeded_1(elm, true);
                elm.toggleAttribute("cursorOn", true);
            }
            this.selectCursorDisposable = editor.onDidChangeCursorPosition(() => {
                var _a;
                if (this.focusedElms !== undefined) {
                    for (const elm of this.focusedElms) {
                        elm.toggleAttribute("cursorOn", false);
                    }
                }
                (_a = this.selectCursorDisposable) === null || _a === void 0 ? void 0 : _a.dispose();
            });
        }
        atom.views.getView(editor).focus();
    }
}
function createOutlineList(outlineTree, editor, isLarge, pointToElementsMap) {
    const outlineList = document.createElement("ul");
    outlineList.dataset.editorRootScope = editor.getRootScopeDescriptor().getScopesArray().join(" ");
    const tabLength = editor.getTabLength();
    if (typeof tabLength === "number") {
        outlineList.style.setProperty("--editor-tab-length", Math.max(tabLength / 2, 2).toString(10));
    }
    addOutlineEntries(outlineList, outlineTree, editor, isLarge || atom.config.get("atom-ide-outline.foldInitially"), 0);
    addEntriesOnClick(outlineList, outlineTree, editor, pointToElementsMap);
    return outlineList;
}
function hasEqualContent(ot1, ot2) {
    if (ot1 === ot2) {
        return true;
    }
    else {
        const ot1Len = ot1.length;
        const ot2Len = ot2.length;
        if (ot1Len !== ot2Len) {
            return false;
        }
        for (let iEntry = 0; iEntry < ot1Len; iEntry++) {
            const e1 = ot1[iEntry];
            const e2 = ot2[iEntry];
            if (e1.representativeName !== e2.representativeName ||
                e1.plainText !== e2.plainText ||
                e1.kind !== e2.kind ||
                e1.icon !== e2.icon ||
                !hasEqualContent(e1.children, e2.children)) {
                return false;
            }
        }
    }
    return true;
}
function makeOutlineToolbar() {
    const toolbar = document.createElement("span");
    toolbar.className = "outline-toolbar";
    const revealCursorButton = document.createElement("button");
    revealCursorButton.innerHTML = "Reveal Cursor";
    revealCursorButton.className = "btn outline-btn";
    revealCursorButton.addEventListener("click", () => atom.commands.dispatch(atom.views.getView(atom.workspace), "outline:reveal-cursor"));
    toolbar.appendChild(revealCursorButton);
    const showCallHierarchyButton = document.createElement("button");
    showCallHierarchyButton.innerHTML = "Show Call Hierarchy";
    showCallHierarchyButton.className = "btn outline-btn";
    showCallHierarchyButton.addEventListener("click", () => atom.commands.dispatch(atom.views.getView(atom.workspace), "outline:show-call-hierarchy"));
    toolbar.appendChild(showCallHierarchyButton);
    return toolbar;
}
function createLargeFileElement() {
    const largeFileElement = document.createElement("div");
    largeFileElement.innerHTML = `<span class="large-file-mode">Large file mode</span>`;
    return largeFileElement;
}
function generateStatusElement(status) {
    const element = document.createElement("div");
    element.className = "status";
    const { title = "", description = "" } = status;
    element.innerHTML = `<h1>${title}</h1>
  <span>${description}</span>`;
    return element;
}
function hasChildren(entry) {
    return entry.children.length >= 1;
}
function sortEntries$1(entries) {
    if (atom.config.get("atom-ide-outline.sortEntries")) {
        entries.sort((e1, e2) => {
            const rowCompare = e1.startPosition.row - e2.startPosition.row;
            if (rowCompare === 0) {
                return e1.startPosition.column - e1.startPosition.column;
            }
            return rowCompare;
        });
    }
}
function addOutlineEntries(parent, entries, editor, isLarge, level) {
    var _a, _b;
    sortEntries$1(entries);
    for (const item of entries) {
        const symbol = document.createElement("li");
        const labelElement = document.createElement("span");
        labelElement.innerText = (_b = (_a = item.representativeName) !== null && _a !== void 0 ? _a : item.plainText) !== null && _b !== void 0 ? _b : "";
        labelElement.prepend(getIcon(item.icon, item.kind));
        symbol.appendChild(labelElement);
        if (hasChildren(item)) {
            const childrenList = document.createElement("ul");
            childrenList.style.setProperty("--indent-level", (level + 1).toString(10));
            childrenList.addEventListener("click", (event) => event.stopPropagation(), { passive: true });
            symbol.appendChild(childrenList);
            const foldButton = createFoldButton(childrenList, isLarge);
            labelElement.prepend(foldButton);
            addOutlineEntries(childrenList, item.children, editor, isLarge, level + 1);
        }
        parent.appendChild(symbol);
    }
}
function addEntriesOnClick(parent, entries, editor, pointToElementsMap, level) {
    const entriesElements = parent.children;
    for (let iEntry = 0, len = entries.length; iEntry < len; iEntry++) {
        const item = entries[iEntry];
        const element = entriesElements[iEntry];
        element.addEventListener("click", () => onClickEntry(item.startPosition, editor), { passive: true });
        addToPointToElementsMap(pointToElementsMap, item.startPosition.row, element);
        if (hasChildren(item)) {
            const chilrenRootElement = element.lastElementChild;
            addEntriesOnClick(chilrenRootElement, item.children, editor, pointToElementsMap);
        }
    }
}
function addToPointToElementsMap(pointToElementsMap, pointStartPositionRow, element) {
    const elms = pointToElementsMap.get(pointStartPositionRow);
    if (elms !== undefined) {
        elms.push(element);
        pointToElementsMap.set(pointStartPositionRow, elms);
    }
    else {
        pointToElementsMap.set(pointStartPositionRow, [element]);
    }
}
let clicked = false;
function onClickEntry(itemStartPosition, editor) {
    const editorPane = atom.workspace.paneForItem(editor);
    if (editorPane === undefined) {
        return;
    }
    editorPane.activate();
    editor.getCursors()[0].setBufferPosition(itemStartPosition, {
        autoscroll: true,
    });
    clicked = true;
}
function createFoldButton(childrenList, foldInitially) {
    const foldButton = document.createElement("button");
    if (foldInitially) {
        childrenList.hidden = true;
        foldButton.classList.add("outline-fold-btn", "collapsed");
    }
    else {
        foldButton.classList.add("outline-fold-btn", "expanded");
    }
    foldButton.addEventListener("click", (event) => {
        childrenList.hidden = !childrenList.hidden;
        if (childrenList.hidden) {
            foldButton.classList.remove("expanded");
            foldButton.classList.add("collapsed");
        }
        else {
            foldButton.classList.remove("collapsed");
            foldButton.classList.add("expanded");
        }
        event.stopPropagation();
    }, { passive: true });
    return foldButton;
}

var ProviderRegistry$1 = {};

Object.defineProperty(ProviderRegistry$1, "__esModule", { value: true });
var ProviderRegistry_2 = ProviderRegistry$1.ProviderRegistry = void 0;
const atom_1$1 = require$$0__default['default'];
class ProviderRegistry {
    constructor() {
        this.providers = [];
    }
    addProvider(provider) {
        const index = this.providers.findIndex((p) => provider.priority > p.priority);
        if (index === -1) {
            this.providers.push(provider);
        }
        else {
            this.providers.splice(index, 0, provider);
        }
        return new atom_1$1.Disposable(() => {
            this.removeProvider(provider);
        });
    }
    removeProvider(provider) {
        const index = this.providers.indexOf(provider);
        if (index !== -1) {
            this.providers.splice(index, 1);
        }
    }
    // TODO deprecate since there can be N providers.
    getProviderForEditor(editor) {
        const grammar = editor.getGrammar().scopeName;
        return this.findProvider(grammar);
    }
    // TODO create an ordering or priority aware util to prefer instead.
    getAllProvidersForEditor(editor) {
        const grammar = editor.getGrammar().scopeName;
        return this.findAllProviders(grammar);
    }
    findProvider(grammar) {
        for (const provider of this.findAllProviders(grammar)) {
            return provider;
        }
        return null;
    }
    /** Iterates over all providers matching the grammar, in priority order. */
    *findAllProviders(grammar) {
        for (const provider of this.providers) {
            if (provider.grammarScopes == null || provider.grammarScopes.indexOf(grammar) !== -1) {
                yield provider;
            }
        }
    }
}
ProviderRegistry_2 = ProviderRegistry$1.ProviderRegistry = ProviderRegistry;

var commonsAtom = {};

var getCwd$1 = {};

Object.defineProperty(getCwd$1, "__esModule", { value: true });
getCwd$1.getCwd = void 0;
const path_1 = require$$0__default$1['default'];
const util_1 = require$$1__default['default'];
const fs_1 = require$$2__default['default'];
const statAsync = util_1.promisify(fs_1.stat);
async function getCwd(target = "") {
    var _a;
    let cwd;
    if (target) {
        cwd = target;
    }
    else {
        const previousActiveItem = atom.workspace.getActivePaneItem();
        cwd = (_a = previousActiveItem === null || previousActiveItem === void 0 ? void 0 : previousActiveItem.getPath) === null || _a === void 0 ? void 0 : _a.call(previousActiveItem);
        if (cwd) {
            const dir = atom.project.relativizePath(cwd)[0];
            if (dir) {
                // Use project paths whenever they are available by default.
                return dir;
            }
        }
    }
    try {
        if (cwd) {
            // Otherwise, if the path exists on the local file system, use the
            // path or parent directory as appropriate.
            const stats = await statAsync(cwd);
            if (stats.isDirectory()) {
                return cwd;
            }
            cwd = path_1.dirname(cwd);
            const dirStats = await statAsync(cwd);
            if (dirStats.isDirectory()) {
                return cwd;
            }
        }
    }
    catch (_b) {
        //fail silently
    }
    cwd = atom.project.getPaths()[0];
    // no project paths
    return cwd;
}
getCwd$1.getCwd = getCwd;

var range = {};

var __importDefault = (commonjsGlobal && commonjsGlobal.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(range, "__esModule", { value: true });
range.isPositionInRange = range.matchRegexEndingAt = range.wordAtPositionFromBuffer = range.getWordFromCursorOrSelection = range.getWordFromMouseEvent = range.trimRange = range.wordAtPosition = void 0;
const atom_1 = require$$0__default['default'];
const assert_1 = __importDefault(require$$1__default$1['default']);
/**
 * Finds the word at the position. You can either provide a word regex yourself, or have Atom use the word regex in
 * force at the scopes at that position, in which case it uses the optional includeNonWordCharacters, default true. (I
 * know that's a weird default but it follows Atom's convention...)
 */
function wordAtPosition(editor, position, wordRegex) {
    let wordRegex_;
    if (wordRegex instanceof RegExp) {
        wordRegex_ = wordRegex;
    }
    else {
        // What is the word regex associated with the position? We'd like to use
        // Cursor.wordRegExp, except that function gets the regex associated
        // with the editor's current cursor while we want the regex associated with
        // the specific position. So we re-implement it ourselves...
        // @ts-ignore: https://github.com/atom/atom/blob/aa3c34bedb361e09a5068dce9620b460a20ca3fb/src/text-editor.js#L5032
        const nonWordChars = editor.getNonWordCharacters(position);
        const escaped = nonWordChars.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&");
        // We copied this escaping regex from Cursor.wordRegexp, rather than
        // using the library function 'escapeStringRegExp'. That's because the
        // library function doesn't escape the hyphen character and so is
        // unsuitable for use inside a range.
        let r = `^[\t ]*$|[^\\s${escaped}]+`;
        if (wordRegex == null || wordRegex.includeNonWordCharacters) {
            r += `|[${escaped}]+`;
        }
        wordRegex_ = new RegExp(r, "g");
    }
    return wordAtPositionFromBuffer(editor.getBuffer(), position, wordRegex_);
}
range.wordAtPosition = wordAtPosition;
/**
 * Gets the trimmed range from a given range, i.e. moves the start and end points to the first and last non-whitespace
 * characters (or specified regex) within the range respectively.
 *
 * @param editor The editor containing the range
 * @param rangeToTrim The range to trim
 * @param stopRegex Stop trimming when the first match is found for this regex, defaults to first non-whitespace character
 * @returns Range the trimmed range
 */
function trimRange(editor, rangeToTrim, stopRegex = /\S/) {
    const buffer = editor.getBuffer();
    let { start, end } = rangeToTrim;
    buffer.scanInRange(stopRegex, rangeToTrim, ({ range, stop }) => {
        start = range.start;
        stop();
    });
    buffer.backwardsScanInRange(stopRegex, rangeToTrim, ({ range, stop }) => {
        end = range.end;
        stop();
    });
    return new atom_1.Range(start, end);
}
range.trimRange = trimRange;
function getSingleWordAtPosition(editor, position) {
    const match = wordAtPosition(editor, position);
    // We should only receive a single identifier from a single point.
    if (match == null || match.wordMatch.length !== 1) {
        return null;
    }
    return match.wordMatch[0];
}
/**
 * Gets the word being right-clicked on in a MouseEvent. A good use case for this is performing an action on a word from
 * a context menu.
 *
 * @param editor The editor containing the word where the MouseEvent occurred from
 * @param event The MouseEvent containing the screen position of the click
 */
function getWordFromMouseEvent(editor, event) {
    // We can't immediately get the identifier right-clicked on from
    // the MouseEvent. Using its target element content would work in
    // some cases but wouldn't work if there was additional content
    // in the same element, such as in a comment.
    // @ts-ignore: https://github.com/atom/atom/blob/aa3c34bedb361e09a5068dce9620b460a20ca3fb/src/text-editor.js#L5075
    const component = editor.getElement().component;
    assert_1.default(component);
    // This solution doesn't feel ideal but it is the way hyperclick does it.
    const point = component.screenPositionForMouseEvent(event);
    return getSingleWordAtPosition(editor, point);
}
range.getWordFromMouseEvent = getWordFromMouseEvent;
/**
 * Attempts to get a word from the last selection or cursor. A good use case for this is performing an action on an
 * 'active' word after a command is triggered via a keybinding.
 *
 * @param editor The editor containing the 'active' word when the keybinding is triggered
 */
function getWordFromCursorOrSelection(editor) {
    const selection = editor.getSelectedText();
    if (selection && selection.length > 0) {
        return selection;
    }
    // There was no selection so we can go ahead and try the cursor position.
    const point = editor.getCursorScreenPosition();
    return getSingleWordAtPosition(editor, point);
}
range.getWordFromCursorOrSelection = getWordFromCursorOrSelection;
function wordAtPositionFromBuffer(buffer, position, wordRegex) {
    const { row, column } = position;
    const rowRange = buffer.rangeForRow(row);
    let matchData;
    // Extract the expression from the row text.
    buffer.scanInRange(wordRegex, rowRange, (data) => {
        const { range } = data;
        if (range.start.isLessThanOrEqual(position) && range.end.isGreaterThan(position)) {
            matchData = data;
        }
        // Stop the scan if the scanner has passed our position.
        if (range.end.column > column) {
            data.stop();
        }
    });
    // @ts-ignore (it is assigned above)
    if (matchData) {
        return {
            wordMatch: matchData.match,
            range: matchData.range,
        };
    }
    else {
        return null;
    }
}
range.wordAtPositionFromBuffer = wordAtPositionFromBuffer;
// Matches a regex on the text of the line ending at endPosition.
// regex should end with a '$'.
// Useful for autocomplete.
function matchRegexEndingAt(buffer, endPosition, regex) {
    const line = buffer.getTextInRange([[endPosition.row, 0], endPosition]);
    const match = regex.exec(line);
    return match == null ? null : match[0];
}
range.matchRegexEndingAt = matchRegexEndingAt;
function isPositionInRange(position, range) {
    return Array.isArray(range) ? range.some((r) => r.containsPoint(position)) : range.containsPoint(position);
}
range.isPositionInRange = isPositionInRange;

var errors = {};

Object.defineProperty(errors, "__esModule", { value: true });
errors.notifyError = void 0;
/** Show a JavaScript Error as an atom notifications */
function notifyError(e) {
    atom.notifications.addError(e.name, {
        stack: e.stack,
        detail: e.message,
    });
}
errors.notifyError = notifyError;

var editorLargeness = {};

Object.defineProperty(editorLargeness, "__esModule", { value: true });
editorLargeness.lineLengthIfLong = editorLargeness.lineCountIfLarge = editorLargeness.largeness = void 0;
/**
 * Find if an editor's largeness based on the given threashold
 *
 * @param editor
 * @param largeLineCount LineCountIfLarge threashold
 * @param longLineLength LineLengthIfLong threashold
 * @returns The largness score if editor is large. Otherwise it returns 0 (a small file)
 */
function largeness(editor, largeLineCount = atom.config.get("atom-ide-base.largeLineCount") || 4000, longLineLength = atom.config.get("atom-ide-base.longLineLength") || 4000) {
    const lineCount = lineCountIfLarge(editor, largeLineCount);
    if (lineCount !== 0) {
        return lineCount;
    }
    const longLine = lineLengthIfLong(editor, longLineLength);
    if (longLine !== 0) {
        return longLine;
    }
    return 0; // small file
}
editorLargeness.largeness = largeness;
/**
 * Find if an editor has a line that is longer than the given threashold
 *
 * @param editor
 * @param threashold LargeLineCount threashold
 * @returns The line count if it is larger than threashold. Otherwise it returns 0 (a small file)
 */
function lineCountIfLarge(editor, threashold) {
    // @ts-ignore
    if (editor.largeFileMode) {
        return 100000;
    }
    const lineCount = editor.getLineCount();
    if (lineCount >= threashold) {
        return lineCount;
    }
    return 0; // small file
}
editorLargeness.lineCountIfLarge = lineCountIfLarge;
/**
 * Find if an editor has a line that is longer than the given threashold
 *
 * @param editor
 * @param threashold LineLengthForRow threashold
 * @param lineCount Count up to this line. Default is {editor.getLineCount()}
 * @returns The first line length that has a length larger than threashold. If no line is found, it returns 0
 */
function lineLengthIfLong(editor, threashold, lineCount = editor.getLineCount()) {
    const buffer = editor.getBuffer();
    for (let i = 0, len = lineCount; i < len; i++) {
        const lineLength = buffer.lineLengthForRow(i);
        if (lineLength > threashold) {
            return lineLength;
        }
    }
    return 0; // small file
}
editorLargeness.lineLengthIfLong = lineLengthIfLong;

(function (exports) {
var __createBinding = (commonjsGlobal && commonjsGlobal.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (commonjsGlobal && commonjsGlobal.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(getCwd$1, exports);
__exportStar(ProviderRegistry$1, exports);
__exportStar(range, exports);
__exportStar(errors, exports);
__exportStar(editorLargeness, exports);

}(commonsAtom));

const statuses$1 = {
    noEditor: {
        title: "Outline is unavailable.",
        description: "Open a text editor.",
    },
    noProvider: {
        title: "Provider is unavailable",
        description: "Looks like a provider for this type of file is not available. Check if a relevant IDE language package is installed and has outline support, or try adding one from Atom's package registry (e.g.: atom-ide-javascript, atom-typescript, ide-python, ide-rust, ide-css, ide-json).",
    },
    noResult: {
        title: "No result was found.",
        description: "The Outline could not found the text you entered in the filter bar.",
    },
};

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */

function isObject$2(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

var isObject_1 = isObject$2;

/** Detect free variable `global` from Node.js. */

var freeGlobal$1 = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

var _freeGlobal = freeGlobal$1;

var freeGlobal = _freeGlobal;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root$2 = freeGlobal || freeSelf || Function('return this')();

var _root = root$2;

var root$1 = _root;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now$1 = function() {
  return root$1.Date.now();
};

var now_1 = now$1;

/** Used to match a single whitespace character. */

var reWhitespace = /\s/;

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last non-whitespace
 * character of `string`.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {number} Returns the index of the last non-whitespace character.
 */
function trimmedEndIndex$1(string) {
  var index = string.length;

  while (index-- && reWhitespace.test(string.charAt(index))) {}
  return index;
}

var _trimmedEndIndex = trimmedEndIndex$1;

var trimmedEndIndex = _trimmedEndIndex;

/** Used to match leading whitespace. */
var reTrimStart = /^\s+/;

/**
 * The base implementation of `_.trim`.
 *
 * @private
 * @param {string} string The string to trim.
 * @returns {string} Returns the trimmed string.
 */
function baseTrim$1(string) {
  return string
    ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, '')
    : string;
}

var _baseTrim = baseTrim$1;

var root = _root;

/** Built-in value references. */
var Symbol$2 = root.Symbol;

var _Symbol = Symbol$2;

var Symbol$1 = _Symbol;

/** Used for built-in method references. */
var objectProto$1 = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto$1.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString$1 = objectProto$1.toString;

/** Built-in value references. */
var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1),
      tag = value[symToStringTag$1];

  try {
    value[symToStringTag$1] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}

var _getRawTag = getRawTag$1;

/** Used for built-in method references. */

var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}

var _objectToString = objectToString$1;

var Symbol = _Symbol,
    getRawTag = _getRawTag,
    objectToString = _objectToString;

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag$1(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

var _baseGetTag = baseGetTag$1;

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */

function isObjectLike$1(value) {
  return value != null && typeof value == 'object';
}

var isObjectLike_1 = isObjectLike$1;

var baseGetTag = _baseGetTag,
    isObjectLike = isObjectLike_1;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol$1(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

var isSymbol_1 = isSymbol$1;

var baseTrim = _baseTrim,
    isObject$1 = isObject_1,
    isSymbol = isSymbol_1;

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber$1(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject$1(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject$1(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = baseTrim(value);
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

var toNumber_1 = toNumber$1;

var isObject = isObject_1,
    now = now_1,
    toNumber = toNumber_1;

/** Error message constants. */
var FUNC_ERROR_TEXT = 'Expected a function';

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        timeWaiting = wait - timeSinceLastCall;

    return maxing
      ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke)
      : timeWaiting;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        clearTimeout(timerId);
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

var debounce_1 = debounce;

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

var noEditor={title:"Call Hierarchy is unavailable.",description:"Open a text editor."};var noProvider={title:"Provider is unavailable.",description:"Looks like a provider for this type of file is not available. Check if a relevant IDE language package is installed and has call hierarchy support, or try adding one from Atom's package registry (e.g.: atom-ide-javascript, atom-typescript, ide-python, ide-rust, ide-css, ide-json)."};var noResult={title:"No result was found.",description:"Move the cursor over the function name."};var statuses = {noEditor:noEditor,noProvider:noProvider,noResult:noResult};

var _CallHierarchyView_subscriptions, _CallHierarchyView_editorSubscriptions, _CallHierarchyView_providerRegistry, _CallHierarchyView_outputElement, _CallHierarchyView_currentType, _CallHierarchyView_debounceWaitTime, _CallHierarchyView_status, _CallHierarchyView_toggleCurrentType, _CallHierarchyView_updateCallHierarchyView, _CallHierarchyViewItem_callHierarchy, _CallHierarchyViewItem_dblclickWaitTime, _CallHierarchyViewItem_showDocument;
class CallHierarchyView extends HTMLElement {
    constructor({ providerRegistry }) {
        super();
        _CallHierarchyView_subscriptions.set(this, new require$$0.CompositeDisposable());
        _CallHierarchyView_editorSubscriptions.set(this, void 0);
        _CallHierarchyView_providerRegistry.set(this, void 0);
        _CallHierarchyView_outputElement.set(this, void 0);
        _CallHierarchyView_currentType.set(this, void 0);
        _CallHierarchyView_debounceWaitTime.set(this, 300);
        _CallHierarchyView_status.set(this, void 0);
        this.destroyed = false;
        this.getTitle = () => "Call Hierarchy";
        this.getIconName = () => "link";
        _CallHierarchyView_toggleCurrentType.set(this, () => {
            __classPrivateFieldSet(this, _CallHierarchyView_currentType, __classPrivateFieldGet(this, _CallHierarchyView_currentType, "f") === "incoming" ? "outgoing" : "incoming", "f");
            this.setAttribute("current-type", __classPrivateFieldGet(this, _CallHierarchyView_currentType, "f"));
            this.showCallHierarchy();
        });
        _CallHierarchyView_updateCallHierarchyView.set(this, async (newData) => {
            const prevStatus = __classPrivateFieldGet(this, _CallHierarchyView_status, "f");
            const currentStatus = (__classPrivateFieldSet(this, _CallHierarchyView_status, CallHierarchyView.getStatus(newData), "f"));
            if (currentStatus === "valid") {
                __classPrivateFieldGet(this, _CallHierarchyView_outputElement, "f").innerHTML = "";
                const item = new CallHierarchyViewItem(newData);
                __classPrivateFieldGet(this, _CallHierarchyView_outputElement, "f").appendChild(item);
                await item.toggleAllItem();
                return;
            }
            if (prevStatus === currentStatus) {
                return;
            }
            __classPrivateFieldGet(this, _CallHierarchyView_outputElement, "f").innerHTML = "";
            const item = new CallHierarchyViewStatusItem(statuses[currentStatus]);
            __classPrivateFieldGet(this, _CallHierarchyView_outputElement, "f").appendChild(item);
        });
        __classPrivateFieldSet(this, _CallHierarchyView_providerRegistry, providerRegistry, "f");
        const headerElement = this.appendChild(document.createElement("div"));
        headerElement.innerHTML = `
      <div class="icon icon-alignment-align">Incoming</div>
      <div class="icon icon-alignment-aligned-to">Outgoing</div>
    `;
        headerElement.addEventListener("click", () => __classPrivateFieldGet(this, _CallHierarchyView_toggleCurrentType, "f").call(this));
        __classPrivateFieldSet(this, _CallHierarchyView_outputElement, this.appendChild(document.createElement("div")), "f");
        __classPrivateFieldSet(this, _CallHierarchyView_currentType, "incoming", "f");
        this.setAttribute("current-type", "incoming");
        const debouncedShowCallHierarchy = debounce_1(this.showCallHierarchy.bind(this), __classPrivateFieldGet(this, _CallHierarchyView_debounceWaitTime, "f"));
        __classPrivateFieldGet(this, _CallHierarchyView_subscriptions, "f").add(atom.workspace.observeActiveTextEditor((editor) => {
            var _a;
            (_a = __classPrivateFieldGet(this, _CallHierarchyView_editorSubscriptions, "f")) === null || _a === void 0 ? void 0 : _a.dispose();
            __classPrivateFieldSet(this, _CallHierarchyView_editorSubscriptions, editor === null || editor === void 0 ? void 0 : editor.onDidChangeCursorPosition((event) => {
                debouncedShowCallHierarchy(editor, event.newBufferPosition);
            }), "f");
            this.showCallHierarchy(editor);
        }));
    }
    static getStatus(data) {
        if (typeof data === "string") {
            return data;
        }
        if (!data || data.data.length === 0) {
            return "noResult";
        }
        return "valid";
    }
    async showCallHierarchy(editor, point) {
        if (this.destroyed) {
            return;
        }
        const targetEditor = editor !== null && editor !== void 0 ? editor : atom.workspace.getActiveTextEditor();
        if (!targetEditor) {
            await __classPrivateFieldGet(this, _CallHierarchyView_updateCallHierarchyView, "f").call(this, "noEditor");
            return;
        }
        const targetPoint = point !== null && point !== void 0 ? point : targetEditor.getCursorBufferPosition();
        const provider = __classPrivateFieldGet(this, _CallHierarchyView_providerRegistry, "f").getProviderForEditor(targetEditor);
        if (!provider) {
            await __classPrivateFieldGet(this, _CallHierarchyView_updateCallHierarchyView, "f").call(this, "noProvider");
            return;
        }
        await __classPrivateFieldGet(this, _CallHierarchyView_updateCallHierarchyView, "f").call(this, await (__classPrivateFieldGet(this, _CallHierarchyView_currentType, "f") === "incoming"
            ? provider.getIncomingCallHierarchy(targetEditor, targetPoint)
            : provider.getOutgoingCallHierarchy(targetEditor, targetPoint)));
    }
    destroy() {
        var _a;
        this.innerHTML = "";
        (_a = __classPrivateFieldGet(this, _CallHierarchyView_editorSubscriptions, "f")) === null || _a === void 0 ? void 0 : _a.dispose();
        __classPrivateFieldGet(this, _CallHierarchyView_subscriptions, "f").dispose();
        this.destroyed = true;
    }
}
_CallHierarchyView_subscriptions = new WeakMap(), _CallHierarchyView_editorSubscriptions = new WeakMap(), _CallHierarchyView_providerRegistry = new WeakMap(), _CallHierarchyView_outputElement = new WeakMap(), _CallHierarchyView_currentType = new WeakMap(), _CallHierarchyView_debounceWaitTime = new WeakMap(), _CallHierarchyView_status = new WeakMap(), _CallHierarchyView_toggleCurrentType = new WeakMap(), _CallHierarchyView_updateCallHierarchyView = new WeakMap();
customElements.define("atom-ide-outline-call-hierarchy-view", CallHierarchyView);
class CallHierarchyViewItem extends HTMLElement {
    constructor(callHierarchy) {
        super();
        _CallHierarchyViewItem_callHierarchy.set(this, void 0);
        _CallHierarchyViewItem_dblclickWaitTime.set(this, 300);
        _CallHierarchyViewItem_showDocument.set(this, ({ path, range: { start: { row, column }, }, selectionRange, }) => {
            const editor = atom.workspace.getActiveTextEditor();
            if ((editor === null || editor === void 0 ? void 0 : editor.getPath()) === path) {
                editor.setCursorBufferPosition([row, column]);
                editor.scrollToBufferPosition([row, column], { center: true });
                editor.setSelectedBufferRange(selectionRange);
            }
            else {
                atom.workspace
                    .open(path, {
                    initialLine: row,
                    initialColumn: column,
                    searchAllPanes: true,
                    activatePane: true,
                    activateItem: true,
                })
                    .then((editor) => editor === null || editor === void 0 ? void 0 : editor.setSelectedBufferRange(selectionRange));
            }
        });
        __classPrivateFieldSet(this, _CallHierarchyViewItem_callHierarchy, callHierarchy, "f");
        if (CallHierarchyViewItem.isEmpty(__classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f"))) {
            this.innerHTML = `<div class="call-hierarchy-no-data">No result was found.</div>`;
            return;
        }
        this.append(...__classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f").data.map((item, i) => {
            var _a, _b, _c;
            const itemEl = document.createElement("div");
            itemEl.setAttribute("title", item.path);
            itemEl.innerHTML = `
        <div class="icon icon-chevron-right">
          <div>
            <span>${escapeHTML(item.name)}</span>
            <span class="detail">${escapeHTML(item.detail ? ` - ${item.detail}` : "")}</span>
            ${item.tags.map((str) => `<span class="tag-${escapeHTML(str)}">${escapeHTML(str)}</span>`).join("")}
          </div>
        </div>
        `;
            (_a = itemEl
                .querySelector(":scope>div>div")) === null || _a === void 0 ? void 0 : _a.insertAdjacentElement("afterbegin", getIcon((_b = item.icon) !== null && _b !== void 0 ? _b : undefined, undefined));
            let isDblclick = false;
            (_c = itemEl.querySelector(":scope>div")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", (e) => {
                e.stopPropagation();
                if (isDblclick && __classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f")) {
                    __classPrivateFieldGet(this, _CallHierarchyViewItem_showDocument, "f").call(this, __classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f").data[i]);
                    return;
                }
                this.toggleItemAt(i);
                window.setTimeout(() => (isDblclick = false), __classPrivateFieldGet(this, _CallHierarchyViewItem_dblclickWaitTime, "f"));
                isDblclick = true;
            }, false);
            return itemEl;
        }));
    }
    static isEmpty(callHierarchy) {
        return !callHierarchy || callHierarchy.data.length == 0;
    }
    async toggleItemAt(i) {
        var _a;
        const itemEl = this.querySelectorAll(":scope>div")[i];
        const titleEl = itemEl.querySelector(":scope>div");
        const childEl = itemEl.querySelector("atom-ide-outline-call-hierarchy-item");
        if (childEl) {
            if (childEl.style.display !== "none") {
                childEl.style.display = "none";
                titleEl === null || titleEl === void 0 ? void 0 : titleEl.classList.replace("icon-chevron-down", "icon-chevron-right");
            }
            else {
                childEl.style.display = "";
                titleEl === null || titleEl === void 0 ? void 0 : titleEl.classList.replace("icon-chevron-right", "icon-chevron-down");
            }
        }
        else {
            itemEl.appendChild(new CallHierarchyViewItem(await ((_a = __classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f")) === null || _a === void 0 ? void 0 : _a.itemAt(i))));
            titleEl === null || titleEl === void 0 ? void 0 : titleEl.classList.replace("icon-chevron-right", "icon-chevron-down");
        }
    }
    async toggleAllItem() {
        var _a, _b;
        const dataLen = (_b = (_a = __classPrivateFieldGet(this, _CallHierarchyViewItem_callHierarchy, "f")) === null || _a === void 0 ? void 0 : _a.data.length) !== null && _b !== void 0 ? _b : 0;
        await Promise.all([...Array(dataLen).keys()].map((i) => this.toggleItemAt(i)));
    }
}
_CallHierarchyViewItem_callHierarchy = new WeakMap(), _CallHierarchyViewItem_dblclickWaitTime = new WeakMap(), _CallHierarchyViewItem_showDocument = new WeakMap();
customElements.define("atom-ide-outline-call-hierarchy-item", CallHierarchyViewItem);
class CallHierarchyViewStatusItem extends HTMLElement {
    constructor({ title, description }) {
        super();
        this.innerHTML = `
      <h1>${escapeHTML(title)}</h1>
      <span>${escapeHTML(description)}</span>
    `;
    }
}
customElements.define("atom-ide-outline-call-hierarchy-status-item", CallHierarchyViewStatusItem);
function escapeHTML(str) {
    return str.replace(/["&'<>`]/g, (match) => ({
        "&": "&amp;",
        "'": "&#x27;",
        "`": "&#x60;",
        '"': "&quot;",
        "<": "&lt;",
        ">": "&gt;",
    }[match]));
}

var _TabHandler_instances, _a, _TabHandler_getDefaultDock, _TabHandler_createItem, _TabHandler_display, _TabHandler_create, _TabHandler_destroy, _TabHandler_getState;
class TabHandler {
    constructor({ createItem, }) {
        _TabHandler_instances.add(this);
        _TabHandler_createItem.set(this, void 0);
        __classPrivateFieldSet(this, _TabHandler_createItem, createItem, "f");
    }
    toggle() {
        const { state, targetPane } = __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_getState).call(this);
        if (state === "hidden") {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_display).call(this, { targetPane });
        }
        else if (state === "noItem") {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_create).call(this, { targetPane });
        }
        else {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_destroy).call(this, { targetPane });
        }
    }
    show() {
        const { state, targetPane } = __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_getState).call(this);
        if (state === "hidden") {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_display).call(this, { targetPane });
        }
        else if (state === "noItem") {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_create).call(this, { targetPane });
        }
    }
    delete() {
        const targetPane = this.item && atom.workspace.paneForItem(this.item);
        if (targetPane) {
            __classPrivateFieldGet(this, _TabHandler_instances, "m", _TabHandler_destroy).call(this, { targetPane });
        }
    }
}
_a = TabHandler, _TabHandler_createItem = new WeakMap(), _TabHandler_instances = new WeakSet(), _TabHandler_getDefaultDock = function _TabHandler_getDefaultDock() {
    return atom.workspace.getRightDock();
}, _TabHandler_display = function _TabHandler_display({ targetPane }) {
    if (this.item) {
        targetPane.activateItem(this.item);
    }
    const dock = atom.workspace.getPaneContainers().find((v) => v.getPanes().includes(targetPane));
    if (dock && "show" in dock) {
        dock.show();
    }
}, _TabHandler_create = function _TabHandler_create({ targetPane }) {
    this.item = __classPrivateFieldGet(this, _TabHandler_createItem, "f").call(this);
    targetPane.addItem(this.item);
    targetPane.activateItem(this.item);
    __classPrivateFieldGet(TabHandler, _a, "m", _TabHandler_getDefaultDock).call(TabHandler).show();
}, _TabHandler_destroy = function _TabHandler_destroy({ targetPane }) {
    if (this.item) {
        targetPane.destroyItem(this.item);
    }
}, _TabHandler_getState = function _TabHandler_getState() {
    const pane = this.item && atom.workspace.paneForItem(this.item);
    if (pane) {
        if (pane.getActiveItem() === this.item &&
            atom.workspace.getVisiblePanes().includes(pane)) {
            return { state: "visible", targetPane: pane };
        }
        else {
            return { state: "hidden", targetPane: pane };
        }
    }
    else {
        return {
            state: "noItem",
            targetPane: __classPrivateFieldGet(TabHandler, _a, "m", _TabHandler_getDefaultDock).call(TabHandler).getActivePane(),
        };
    }
};

const providerRegistry = new ProviderRegistry_2();
const subscriptions$1 = new require$$0.CompositeDisposable();
const callHierarchyTab = new TabHandler({
    createItem: () => new CallHierarchyView({ providerRegistry }),
});
function activate$1() {
    subscriptions$1.add(atom.commands.add("atom-workspace", "outline:toggle-call-hierarchy", () => callHierarchyTab.toggle()), atom.commands.add("atom-workspace", "outline:show-call-hierarchy", () => callHierarchyTab.show()));
}
function deactivate$1() {
    subscriptions$1.dispose();
    callHierarchyTab.delete();
}
function consumeCallHierarchyProvider(provider) {
    var _a;
    const providerDisposer = providerRegistry.addProvider(provider);
    subscriptions$1.add(providerDisposer);
    (_a = callHierarchyTab.item) === null || _a === void 0 ? void 0 : _a.showCallHierarchy();
    return providerDisposer;
}

var initialDisplay={title:"Initial Outline Display",description:"Show outline initially aftern atom loads",type:"boolean","default":true};var sortEntries={title:"Sort entries based on the line number",description:"This option sorts the entries based on where they appear in the code.",type:"boolean","default":true};var foldInitially={title:"Fold the entries initially",description:"If enabled, the outline entries are folded initially. This is enabled automatically in large file mode.",type:"boolean","default":false};var config = {initialDisplay:initialDisplay,sortEntries:sortEntries,foldInitially:foldInitially};

const subscriptions = new require$$0.CompositeDisposable();
let view;
const outlineProviderRegistry = new ProviderRegistry_2();
function activate() {
    activate$1();
    addCommands();
    addObservers();
    if (atom.config.get("atom-ide-outline.initialDisplay")) {
        toggleOutlineView().catch((e) => {
            commonsAtom.notifyError(e);
        });
    }
}
function addCommands() {
    subscriptions.add(atom.commands.add("atom-workspace", "outline:toggle", toggleOutlineView), atom.commands.add("atom-workspace", "outline:reveal-cursor", revealCursor));
}
function addObservers() {
    subscriptions.add(atom.workspace.onDidChangeActiveTextEditor(editorChanged));
}
function deactivate() {
    deactivate$1();
    onEditorChangedDisposable === null || onEditorChangedDisposable === void 0 ? void 0 : onEditorChangedDisposable.dispose();
    subscriptions.dispose();
    view === null || view === void 0 ? void 0 : view.destroy();
    view = undefined;
}
async function consumeOutlineProvider(provider) {
    subscriptions.add(outlineProviderRegistry.addProvider(provider));
    await getOutline();
}
let onEditorChangedDisposable = undefined;
async function editorChanged(editor) {
    if (editor === undefined) {
        return;
    }
    onEditorChangedDisposable === null || onEditorChangedDisposable === void 0 ? void 0 : onEditorChangedDisposable.dispose();
    onEditorChangedDisposable = new require$$0.CompositeDisposable();
    await getOutline(editor);
    const largeness = commonsAtom.largeness(editor);
    const updateDebounceTime = Math.max(largeness / 4, 300);
    const doubouncedGetOutline = debounce_1(getOutlintIfVisible, updateDebounceTime);
    onEditorChangedDisposable.add(editor.onDidStopChanging(async () => {
        await doubouncedGetOutline(editor);
    }), editor.onDidDestroy(() => {
        setStatus("noEditor");
    }));
}
function revealCursor() {
    const editor = atom.workspace.getActiveTextEditor();
    if (editor === undefined) {
        return;
    }
    if (view !== undefined) {
        view.selectAtCursorLine(editor);
    }
}
async function toggleOutlineView() {
    if (view === undefined) {
        view = new OutlineView();
    }
    const outlinePane = atom.workspace.paneForItem(view);
    if (outlinePane) {
        await outlinePane.destroyItem(view);
        return;
    }
    const rightDock = atom.workspace.getRightDock();
    const [pane] = rightDock.getPanes();
    pane.addItem(view);
    pane.activateItem(view);
    rightDock.show();
    try {
        await editorChanged(atom.workspace.getActiveTextEditor());
    }
    catch (e) {
        commonsAtom.notifyError(e);
    }
}
function getOutlintIfVisible(editor = atom.workspace.getActiveTextEditor()) {
    if (!isItemVisible_1(view)) {
        return;
    }
    return getOutline(editor);
}
async function getOutline(editor = atom.workspace.getActiveTextEditor()) {
    var _a;
    if (view === undefined) {
        view = new OutlineView();
    }
    else {
        view.reset();
    }
    if (editor === undefined) {
        return setStatus("noEditor");
    }
    const provider = outlineProviderRegistry.getProviderForEditor(editor);
    if (!provider) {
        return setStatus("noProvider");
    }
    const outline = await provider.getOutline(editor);
    view.setOutline((_a = outline === null || outline === void 0 ? void 0 : outline.outlineTrees) !== null && _a !== void 0 ? _a : [], editor, Boolean(commonsAtom.largeness(editor)));
}
function setStatus(id) {
    view === null || view === void 0 ? void 0 : view.presentStatus(statuses$1[id]);
}

exports.activate = activate;
exports.config = config;
exports.consumeCallHierarchyProvider = consumeCallHierarchyProvider;
exports.consumeOutlineProvider = consumeOutlineProvider;
exports.deactivate = deactivate;
exports.getOutline = getOutline;
exports.outlineProviderRegistry = outlineProviderRegistry;
exports.revealCursor = revealCursor;
exports.setStatus = setStatus;
exports.statuses = statuses$1;
exports.toggleOutlineView = toggleOutlineView;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsiLi4vbm9kZV9tb2R1bGVzL2F0b20taWRlLWJhc2Uvc3JjLWNvbW1vbnMtdWkvc2Nyb2xsSW50b1ZpZXcudHMiLCIuLi9ub2RlX21vZHVsZXMvYXRvbS1pZGUtYmFzZS9zcmMtY29tbW9ucy11aS9pdGVtcy50cyIsIi4uL25vZGVfbW9kdWxlcy9mYXN0LWVxdWFscy9zcmMvdXRpbHMudHMiLCIuLi9ub2RlX21vZHVsZXMvZmFzdC1lcXVhbHMvc3JjL2NvbXBhcmF0b3IudHMiLCIuLi9ub2RlX21vZHVsZXMvZmFzdC1lcXVhbHMvc3JjL2luZGV4LnRzIiwiLi4vc3JjL3V0aWxzLnRzIiwiLi4vc3JjL291dGxpbmVWaWV3LnRzIiwiLi4vbm9kZV9tb2R1bGVzL2F0b20taWRlLWJhc2Uvc3JjLWNvbW1vbnMtYXRvbS9Qcm92aWRlclJlZ2lzdHJ5LnRzIiwiLi4vbm9kZV9tb2R1bGVzL2F0b20taWRlLWJhc2Uvc3JjLWNvbW1vbnMtYXRvbS9nZXRDd2QudHMiLCIuLi9ub2RlX21vZHVsZXMvYXRvbS1pZGUtYmFzZS9zcmMtY29tbW9ucy1hdG9tL3JhbmdlLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2F0b20taWRlLWJhc2Uvc3JjLWNvbW1vbnMtYXRvbS9lcnJvcnMudHMiLCIuLi9ub2RlX21vZHVsZXMvYXRvbS1pZGUtYmFzZS9zcmMtY29tbW9ucy1hdG9tL2VkaXRvci1sYXJnZW5lc3MudHMiLCIuLi9ub2RlX21vZHVsZXMvYXRvbS1pZGUtYmFzZS9zcmMtY29tbW9ucy1hdG9tL2luZGV4LnRzIiwiLi4vc3JjL3N0YXR1c2VzLnRzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc09iamVjdC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2ZyZWVHbG9iYWwuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19yb290LmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9ub3cuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL190cmltbWVkRW5kSW5kZXguanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL19iYXNlVHJpbS5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX1N5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX2dldFJhd1RhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvX29iamVjdFRvU3RyaW5nLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9fYmFzZUdldFRhZy5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvaXNPYmplY3RMaWtlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL2xvZGFzaC9pc1N5bWJvbC5qcyIsIi4uL25vZGVfbW9kdWxlcy9sb2Rhc2gvdG9OdW1iZXIuanMiLCIuLi9ub2RlX21vZHVsZXMvbG9kYXNoL2RlYm91bmNlLmpzIiwiLi4vbm9kZV9tb2R1bGVzL3RzbGliL3RzbGliLmVzNi5qcyIsIi4uL3NyYy9jYWxsLWhpZXJhcmNoeS9jYWxsLWhpZXJhcmNoeS12aWV3LnRzIiwiLi4vc3JjL2NhbGwtaGllcmFyY2h5L3RhYi1oYW5kbGVyLnRzIiwiLi4vc3JjL2NhbGwtaGllcmFyY2h5L21haW4udHMiLCIuLi9zcmMvbWFpbi50cyJdLCJzb3VyY2VzQ29udGVudCI6WyIvKiBnbG9iYWxzIGdldENvbXB1dGVkU3R5bGUgKi9cblxuLyoqXG4gKiBVc2UgdGhlc2UgZnVuY3Rpb25zIGluc3RlYWQgb2YgYEVsZW1lbnQ6OnNjcm9sbEludG9WaWV3KClgIGFuZCBgRWxlbWVudDo6c2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCgpYCFcbiAqXG4gKiBXZSd2ZSBoYWQgYSByZWN1cnJpbmcgaXNzdWUgaW4gTnVjbGlkZSAoZS5nLiBUMjAwMjgxMzgpIHdoZXJlIHRoZSBVSSB3b3VsZCBzaGlmdCwgbGVhdmluZyBwYXJ0IG9mIHRoZSB3b3Jrc3BhY2VcbiAqIGVsZW1lbnQgb2Zmc2NyZWVuIGFuZCBhIGJsYW5rIGFyZWEgaW4gdGhlIHdpbmRvdy4gVGhpcyB3YXMgY2F1c2VkIGJ5IGNhbGxlZCB0byB0aGUgbmF0aXZlIGBzY3JvbGxJbnRvVmlldygpYCBhbmRcbiAqIGBzY3JvbGxJbnRvVmlld0lmTmVlZGVkKClgIHdoaWNoLCBhY2NvcmRpbmcgdG8gdGhlIHNwZWMsIGhhcyB0d28gcG90ZW50aWFsbHkgc3VycHJpc2luZyBiZWhhdmlvcnM6XG4gKlxuICogMS4gSXQgc2Nyb2xscyBldmVyeSBzY3JvbGxhYmxlIGFuY2VzdG9yIChub3QganVzdCB0aGUgY2xvc2VzdCksIHdoZXJlXG4gKiAyLiBcInNjcm9sbGFibGVcIiBpcyBleHBsaWNpdGx5IGRlZmluZWQgdG8gaW5jbHVkZSBlbGVtZW50cyB3aXRoIGBvdmVyZmxvdzogaGlkZGVuYFxuICpcbiAqIFRoaXMgaXMgc3VycHJpc2luZyBiZWNhdXNlIGBvdmVyZmxvdzogaGlkZGVuYCBpcyB0eXBpY2FsbHkgdXNlZCB0byBtYWtlIGVsZW1lbnRzICpub3Qgc2Nyb2xsYWJsZSouXG4gKlxuICogT25jZSB0aGUgYG92ZXJmbG93OiBoaWRkZW5gIGVsZW1lbnQgaXMgc2Nyb2xsZWQsIHRoZSB1c2VyIGhhcyBubyB3YXkgdG8gcmV0dXJuIGl0IHRvIGl0cyBvcmlnaW5hbCBwb3NpdGlvbiAoYXMgaXQgaGFzXG4gKiBubyBzY3JvbGxiYXJzKS5cbiAqXG4gKiBOb3RlIHRoYXQgdGhpcyBBUEkgZG9lc24ndCBzdXBwb3J0IHNtb290aCBzY3JvbGxpbmcuIElmIHRoYXQgYmVjb21lcyBuZWNlc3NhcnksIHdlJ2xsIG5lZWQgdG8gY29tZSB1cCB3aXRoIGEgYmV0dGVyIGZpeC5cbiAqXG4gKiBJdCdzIHRlbXB0aW5nIHRvIGFzc3VtZSB0aGF0IHVzaW5nIGBzY3JvbGxJbnRvVmlld0lmTmVlZGVkKClgIHdvdWxkIGZpeCB0aGlzIGlzc3VlLCBob3dldmVyLCBpZiB0aGUgd2luZG93IGlzIHNtYWxsXG4gKiBlbm91Z2ggc28gdGhhdCBubyBhbW91bnQgb2Ygc2Nyb2xsaW5nIHRoZSBkZXNpcmVkIHNjcm9sbGFibGUgZWxlbWVudCB3b3VsZCBldmVyIHJldmVhbCB0aGUgZWxlbWVudCB5b3UncmUgdHJ5aW5nIHRvLFxuICogdGhlIGJyb3dzZXIgd2lsbCBrZWVwIHNjcm9sbGluZyBhbmNlc3RvcnMuXG4gKi9cblxuZXhwb3J0IGZ1bmN0aW9uIHNjcm9sbEludG9WaWV3KGVsOiBFbGVtZW50LCBhbGlnblRvVG9wPzogYm9vbGVhbik6IHZvaWQge1xuICBjb25zdCBzY3JvbGxUb3BzID0gZ2V0U2Nyb2xsVG9wcyhlbClcbiAgZWwuc2Nyb2xsSW50b1ZpZXcoYWxpZ25Ub1RvcClcbiAgcmVzdG9yZU92ZXJmbG93SGlkZGVuU2Nyb2xsVG9wcyhzY3JvbGxUb3BzKVxufVxuXG5leHBvcnQgdHlwZSBFbGVtZW50RXh0ZW5kZWQgPSBFbGVtZW50ICYgeyBzY3JvbGxJbnRvVmlld0lmTmVlZGVkPzogKHNob3VsZENlbnRlcjogYm9vbGVhbikgPT4gdm9pZCB9XG5cbmV4cG9ydCBmdW5jdGlvbiBzY3JvbGxJbnRvVmlld0lmTmVlZGVkKGVsOiBFbGVtZW50LCBjZW50ZXI6IGJvb2xlYW4gPSB0cnVlKTogdm9pZCB7XG4gIGNvbnN0IHNjcm9sbFRvcHMgPSBnZXRTY3JvbGxUb3BzKGVsKVxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW51c2VkLWV4cHJlc3Npb25zXG4gIDsoZWwgYXMgRWxlbWVudEV4dGVuZGVkKS5zY3JvbGxJbnRvVmlld0lmTmVlZGVkPy4oY2VudGVyKSA/PyBlbC5zY3JvbGxJbnRvVmlldyhjZW50ZXIpXG4gIHJlc3RvcmVPdmVyZmxvd0hpZGRlblNjcm9sbFRvcHMoc2Nyb2xsVG9wcylcbn1cblxuZnVuY3Rpb24gZ2V0U2Nyb2xsVG9wcyhlbF86IEVsZW1lbnQpOiBNYXA8RWxlbWVudCwgbnVtYmVyPiB7XG4gIGxldCBlbDogRWxlbWVudCB8IG51bGwgPSBlbF9cbiAgY29uc3Qgc2Nyb2xsVG9wcyA9IG5ldyBNYXA8RWxlbWVudCwgbnVtYmVyPigpXG4gIHdoaWxlIChlbCAhPT0gbnVsbCkge1xuICAgIHNjcm9sbFRvcHMuc2V0KGVsLCBlbC5zY3JvbGxUb3ApXG4gICAgZWwgPSBlbC5wYXJlbnRFbGVtZW50XG4gIH1cbiAgcmV0dXJuIHNjcm9sbFRvcHNcbn1cblxuZnVuY3Rpb24gcmVzdG9yZU92ZXJmbG93SGlkZGVuU2Nyb2xsVG9wcyhzY3JvbGxUb3BzOiBNYXA8RWxlbWVudCwgbnVtYmVyPik6IHZvaWQge1xuICBzY3JvbGxUb3BzLmZvckVhY2goKHNjcm9sbFRvcCwgZWwpID0+IHtcbiAgICBpZiAoZWwuc2Nyb2xsVG9wICE9PSBzY3JvbGxUb3AgJiYgaXNPdmVyZmxvd0hpZGRlbihlbCkpIHtcbiAgICAgIGVsLnNjcm9sbFRvcCA9IHNjcm9sbFRvcFxuICAgIH1cbiAgfSlcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlzT3ZlcmZsb3dIaWRkZW4oZWw6IEhUTUxFbGVtZW50IHwgU1ZHRWxlbWVudCB8IEVsZW1lbnQpOiBib29sZWFuIHtcbiAgY29uc3Qgb3ZlcmZsb3dTdHlsZSA9IChlbCBhcyBIVE1MRWxlbWVudCk/LnN0eWxlLm92ZXJmbG93XG4gIGNvbnN0IG92ZXJmbG93ID0gb3ZlcmZsb3dTdHlsZSA/PyBnZXRDb21wdXRlZFN0eWxlKGVsKS5vdmVyZmxvd1xuICByZXR1cm4gb3ZlcmZsb3cgPT09IFwiaGlkZGVuXCJcbn1cbiIsImltcG9ydCB0eXBlIHsgRG9jaywgVmlld1JlZ2lzdHJ5IH0gZnJvbSBcImF0b21cIlxuXG4vKipcbiAqIEEgZnVuY3Rpb24gdG8gZGV0ZWN0IGlmIGFuIGl0ZW0gKHZpZXcpIGlzIHZpc2libGUgaW4gQXRvbS4gVGhpcyBpcyB1c2VmdWwgdG8gc2tpcCBjb2RlIGV4Y2VjdXRpb24gb3IgdXBkYXRpbmcgd2hlblxuICogdGhlIGl0ZW0gaXMgbm90IHZpc2libGUuXG4gKlxuICogQHBhcmFtIGl0ZW0gVGhpcyBpcyBhbiBpdGVtIHRoYXQgaXMgc3RvcmVkIGluIHtWaWV3UmVnaXN0cnl9LiBJdCBoYXMgdGhlIHNhbWUgdHlwZSBvZiB0aGUgYXJndW1lbnQgdGhhdCB5b3UgcGFzcyB0b1xuICogICBgYXRvbS52aWV3LmdldFZpZXcoaXRlbSlgLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNJdGVtVmlzaWJsZShpdGVtOiBQYXJhbWV0ZXJzPFZpZXdSZWdpc3RyeVtcImdldFZpZXdcIl0+WzBdIHwgdW5kZWZpbmVkIHwgbnVsbCkge1xuICBpZiAoaXRlbSA9PT0gdW5kZWZpbmVkIHx8IGl0ZW0gPT09IG51bGwpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxuICAvLyBjaGVjayB0aGUgSFRNTEVsZW1lbnQgaXRzZWxmIChpbXBvcnRhbnQgZm9yIHdoZW4gdGhlIGRvY2svY29udGFpbmVyIGlzIHZpc2libGUgYnV0IHRoZSB0YWIgaXMgbm90IHNlbGVjdGVkKVxuICAvLyB0cnkgZ2V0dGluZyB0aGUgZWxlbWVudFxuICBjb25zdCBlbGVtZW50ID0gZ2V0SXRlbUVsZW1lbnQoaXRlbSlcbiAgaWYgKGVsZW1lbnQgIT09IHVuZGVmaW5lZCAmJiAhaXNFbGVtZW50VmlzaWJsZShlbGVtZW50KSkge1xuICAgIHJldHVybiBmYWxzZVxuICAgIC8vIGlmIGl0IHdlIGNhbid0IGRldGVjdCB0aGUgaW52aXNpYmxpdHkgdXNpbmcgSFRNTCB3ZSBuZWVkIHRvIGNvbnNpZGVyIEF0b20ncyBjb250ZXh0IHNvIHdlIGNvbnRpbnVlXG4gIH1cbiAgLy8gZXRjaCBjb21wb25lbnRcbiAgLy8gaWYgKGl0ZW0/LmNvbXBvbmVudD8udmlzaWJsZSA9PT0gZmFsc2UpIHtcbiAgLy8gICByZXR1cm4gZmFsc2VcbiAgLy8gfVxuICBjb25zdCBwYW5lQ29udGFpbmVyID0gYXRvbS53b3Jrc3BhY2UucGFuZUNvbnRhaW5lckZvckl0ZW0oaXRlbSlcbiAgLy8gaWYgbm8gY29udGFpbmVyIGl0IGlzIG5vdCB2aXNpYmxlXG4gIGlmIChwYW5lQ29udGFpbmVyID09PSB1bmRlZmluZWQpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfSBlbHNlIGlmICh0eXBlb2YgKHBhbmVDb250YWluZXIgYXMgYW55KS5pc1Zpc2libGUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgIC8vIHVzZSBEb2NrLmlzVmlzaWJsZSgpXG4gICAgcmV0dXJuIChwYW5lQ29udGFpbmVyIGFzIERvY2spLmlzVmlzaWJsZSgpXG4gIH0gZWxzZSB7XG4gICAgLy8gaXQgaXMgdmlzaWJsZSAod2hlbiBwYW5lQ29udGFpbmVyIGlzIG5vdCBhIGRvY2sgbGlrZSBUZXh0RWRpdG9yKVxuICAgIHJldHVybiB0cnVlXG4gIH1cbn1cblxuLyoqXG4gKiBBIGZ1bmN0aW9uIHRvIGRldGVjdCBpZiBhbiBIVE1MRWxlbWVudCBpcyB2aXNpYmxlLiBJdCBkb2Vzbid0IGNvbnNpZGVyIHRoZSBBdG9tIGNvbnRleHQuIFRvIGRldGVjdCBpZiBhbiBpdGVtIGlzXG4gKiB2aXNpYmxlIGluIEF0b20gdXNlIHtpc0l0ZW1WaXNpYmxlfSBpbnN0ZWFkIFRoaXMgaXMgdXNlZnVsIHRvIHNraXAgY29kZSBleGNlY3V0aW9uIG9yIHVwZGF0aW5nIHdoZW4gdGhlIGVsZW1lbnQgaXNcbiAqIG5vdCB2aXNpYmxlLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0VsZW1lbnRWaXNpYmxlKGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gIGlmIChcbiAgICBlbGVtZW50IGluc3RhbmNlb2YgSFRNTEVsZW1lbnQgJiZcbiAgICAoZWxlbWVudC5zdHlsZS5kaXNwbGF5ID09PSBcIm5vbmVcIiB8fCBlbGVtZW50LmhpZGRlbiB8fCBlbGVtZW50Lm9mZnNldEhlaWdodCA9PT0gMClcbiAgKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbiAgcmV0dXJuIHRydWVcbn1cblxuLyoqIEdldCB0aGUgSFRNTEVsZW1lbnQgb2YgYW4gaXRlbSB1c2luZyBgLmdldEVsZW1lbnQoKWAgb3IgYC5lbGVtZW50YCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEl0ZW1FbGVtZW50KGl0ZW06IG9iamVjdCB8IHVuZGVmaW5lZCB8IG51bGwpIHtcbiAgaWYgKGl0ZW0gPT09IHVuZGVmaW5lZCB8fCBpdGVtID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG4gIHJldHVybiB0eXBlb2YgKGl0ZW0gYXMgYW55KS5nZXRFbGVtZW50ID09PSBcImZ1bmN0aW9uXCJcbiAgICA/IChpdGVtIGFzIHsgZ2V0RWxlbWVudDogKCkgPT4gSFRNTEVsZW1lbnQgfSkuZ2V0RWxlbWVudCgpXG4gICAgOiAoaXRlbSBhcyB7IGVsZW1lbnQ6IEhUTUxFbGVtZW50IHwgdW5kZWZpbmVkIH0pLmVsZW1lbnRcbn1cbiIsImNvbnN0IEhBU19XRUFLU0VUX1NVUFBPUlQgPSB0eXBlb2YgV2Vha1NldCA9PT0gJ2Z1bmN0aW9uJztcblxuY29uc3QgeyBrZXlzIH0gPSBPYmplY3Q7XG5cbnR5cGUgQ2FjaGUgPSB7XG4gIGFkZDogKHZhbHVlOiBhbnkpID0+IHZvaWQ7XG4gIGhhczogKHZhbHVlOiBhbnkpID0+IGJvb2xlYW47XG59O1xuXG5leHBvcnQgdHlwZSBFcXVhbGl0eUNvbXBhcmF0b3IgPSAoYTogYW55LCBiOiBhbnksIG1ldGE/OiBhbnkpID0+IGJvb2xlYW47XG5cbi8qKlxuICogYXJlIHRoZSB2YWx1ZXMgcGFzc2VkIHN0cmljdGx5IGVxdWFsIG9yIGJvdGggTmFOXG4gKlxuICogQHBhcmFtIGEgdGhlIHZhbHVlIHRvIGNvbXBhcmUgYWdhaW5zdFxuICogQHBhcmFtIGIgdGhlIHZhbHVlIHRvIHRlc3RcbiAqIEByZXR1cm5zIGFyZSB0aGUgdmFsdWVzIGVxdWFsIGJ5IHRoZSBTYW1lVmFsdWVaZXJvIHByaW5jaXBsZVxuICovXG5leHBvcnQgZnVuY3Rpb24gc2FtZVZhbHVlWmVyb0VxdWFsKGE6IGFueSwgYjogYW55KSB7XG4gIHJldHVybiBhID09PSBiIHx8IChhICE9PSBhICYmIGIgIT09IGIpO1xufVxuXG4vKipcbiAqIGlzIHRoZSB2YWx1ZSBhIHBsYWluIG9iamVjdFxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMgaXMgdGhlIHZhbHVlIGEgcGxhaW4gb2JqZWN0XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1BsYWluT2JqZWN0KHZhbHVlOiBhbnkpIHtcbiAgcmV0dXJuIHZhbHVlLmNvbnN0cnVjdG9yID09PSBPYmplY3QgfHwgdmFsdWUuY29uc3RydWN0b3IgPT0gbnVsbDtcbn1cblxuLyoqXG4gKiBpcyB0aGUgdmFsdWUgcHJvbWlzZS1saWtlIChtZWFuaW5nIGl0IGlzIHRoZW5hYmxlKVxuICpcbiAqIEBwYXJhbSB2YWx1ZSB0aGUgdmFsdWUgdG8gdGVzdFxuICogQHJldHVybnMgaXMgdGhlIHZhbHVlIHByb21pc2UtbGlrZVxuICovXG5leHBvcnQgZnVuY3Rpb24gaXNQcm9taXNlTGlrZSh2YWx1ZTogYW55KSB7XG4gIHJldHVybiAhIXZhbHVlICYmIHR5cGVvZiB2YWx1ZS50aGVuID09PSAnZnVuY3Rpb24nO1xufVxuXG4vKipcbiAqIGlzIHRoZSB2YWx1ZSBwYXNzZWQgYSByZWFjdCBlbGVtZW50XG4gKlxuICogQHBhcmFtIHZhbHVlIHRoZSB2YWx1ZSB0byB0ZXN0XG4gKiBAcmV0dXJucyBpcyB0aGUgdmFsdWUgYSByZWFjdCBlbGVtZW50XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1JlYWN0RWxlbWVudCh2YWx1ZTogYW55KSB7XG4gIHJldHVybiAhISh2YWx1ZSAmJiB2YWx1ZS4kJHR5cGVvZik7XG59XG5cbi8qKlxuICogaW4gY2FzZXMgd2hlcmUgV2Vha1NldCBpcyBub3Qgc3VwcG9ydGVkLCBjcmVhdGVzIGEgbmV3IGN1c3RvbVxuICogb2JqZWN0IHRoYXQgbWltaWNzIHRoZSBuZWNlc3NhcnkgQVBJIGFzcGVjdHMgZm9yIGNhY2hlIHB1cnBvc2VzXG4gKlxuICogQHJldHVybnMgdGhlIG5ldyBjYWNoZSBvYmplY3RcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE5ld0NhY2hlRmFsbGJhY2soKTogQ2FjaGUge1xuICBjb25zdCB2YWx1ZXM6IGFueVtdID0gW107XG5cbiAgcmV0dXJuIHtcbiAgICBhZGQodmFsdWU6IGFueSkge1xuICAgICAgdmFsdWVzLnB1c2godmFsdWUpO1xuICAgIH0sXG5cbiAgICBoYXModmFsdWU6IGFueSkge1xuICAgICAgcmV0dXJuIHZhbHVlcy5pbmRleE9mKHZhbHVlKSAhPT0gLTE7XG4gICAgfSxcbiAgfTtcbn1cblxuLyoqXG4gKiBnZXQgYSBuZXcgY2FjaGUgb2JqZWN0IHRvIHByZXZlbnQgY2lyY3VsYXIgcmVmZXJlbmNlc1xuICpcbiAqIEByZXR1cm5zIHRoZSBuZXcgY2FjaGUgb2JqZWN0XG4gKi9cbmV4cG9ydCBjb25zdCBnZXROZXdDYWNoZSA9ICgoY2FuVXNlV2Vha01hcDogYm9vbGVhbikgPT4ge1xuICBpZiAoY2FuVXNlV2Vha01hcCkge1xuICAgIHJldHVybiBmdW5jdGlvbiBfZ2V0TmV3Q2FjaGUoKTogQ2FjaGUge1xuICAgICAgcmV0dXJuIG5ldyBXZWFrU2V0KCk7XG4gICAgfTtcbiAgfVxuXG4gIHJldHVybiBnZXROZXdDYWNoZUZhbGxiYWNrO1xufSkoSEFTX1dFQUtTRVRfU1VQUE9SVCk7XG5cbi8qKlxuICogY3JlYXRlIGEgY3VzdG9tIGlzRXF1YWwgaGFuZGxlciBzcGVjaWZpYyB0byBjaXJjdWxhciBvYmplY3RzXG4gKlxuICogQHBhcmFtIFtpc0VxdWFsXSB0aGUgaXNFcXVhbCBjb21wYXJhdG9yIHRvIHVzZSBpbnN0ZWFkIG9mIGlzRGVlcEVxdWFsXG4gKiBAcmV0dXJucyB0aGUgbWV0aG9kIHRvIGNyZWF0ZSB0aGUgYGlzRXF1YWxgIGZ1bmN0aW9uXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBjcmVhdGVDaXJjdWxhckVxdWFsQ3JlYXRvcihpc0VxdWFsPzogRXF1YWxpdHlDb21wYXJhdG9yKSB7XG4gIHJldHVybiBmdW5jdGlvbiBjcmVhdGVDaXJjdWxhckVxdWFsKGNvbXBhcmF0b3I6IEVxdWFsaXR5Q29tcGFyYXRvcikge1xuICAgIGNvbnN0IF9jb21wYXJhdG9yID0gaXNFcXVhbCB8fCBjb21wYXJhdG9yO1xuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIGNpcmN1bGFyRXF1YWwoXG4gICAgICBhOiBhbnksXG4gICAgICBiOiBhbnksXG4gICAgICBjYWNoZTogQ2FjaGUgPSBnZXROZXdDYWNoZSgpLFxuICAgICkge1xuICAgICAgY29uc3QgaXNDYWNoZWFibGVBID0gISFhICYmIHR5cGVvZiBhID09PSAnb2JqZWN0JztcbiAgICAgIGNvbnN0IGlzQ2FjaGVhYmxlQiA9ICEhYiAmJiB0eXBlb2YgYiA9PT0gJ29iamVjdCc7XG5cbiAgICAgIGlmIChpc0NhY2hlYWJsZUEgfHwgaXNDYWNoZWFibGVCKSB7XG4gICAgICAgIGNvbnN0IGhhc0EgPSBpc0NhY2hlYWJsZUEgJiYgY2FjaGUuaGFzKGEpO1xuICAgICAgICBjb25zdCBoYXNCID0gaXNDYWNoZWFibGVCICYmIGNhY2hlLmhhcyhiKTtcblxuICAgICAgICBpZiAoaGFzQSB8fCBoYXNCKSB7XG4gICAgICAgICAgcmV0dXJuIGhhc0EgJiYgaGFzQjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0NhY2hlYWJsZUEpIHtcbiAgICAgICAgICBjYWNoZS5hZGQoYSk7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAoaXNDYWNoZWFibGVCKSB7XG4gICAgICAgICAgY2FjaGUuYWRkKGIpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBfY29tcGFyYXRvcihhLCBiLCBjYWNoZSk7XG4gICAgfTtcbiAgfTtcbn1cblxuLyoqXG4gKiBhcmUgdGhlIGFycmF5cyBlcXVhbCBpbiB2YWx1ZVxuICpcbiAqIEBwYXJhbSBhIHRoZSBhcnJheSB0byB0ZXN0XG4gKiBAcGFyYW0gYiB0aGUgYXJyYXkgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0gaXNFcXVhbCB0aGUgY29tcGFyYXRvciB0byBkZXRlcm1pbmUgZXF1YWxpdHlcbiAqIEBwYXJhbSBtZXRhIHRoZSBtZXRhIG9iamVjdCB0byBwYXNzIHRocm91Z2hcbiAqIEByZXR1cm5zIGFyZSB0aGUgYXJyYXlzIGVxdWFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcmVBcnJheXNFcXVhbChcbiAgYTogYW55W10sXG4gIGI6IGFueVtdLFxuICBpc0VxdWFsOiBFcXVhbGl0eUNvbXBhcmF0b3IsXG4gIG1ldGE6IGFueSxcbikge1xuICBsZXQgaW5kZXggPSBhLmxlbmd0aDtcblxuICBpZiAoYi5sZW5ndGggIT09IGluZGV4KSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgd2hpbGUgKGluZGV4LS0gPiAwKSB7XG4gICAgaWYgKCFpc0VxdWFsKGFbaW5kZXhdLCBiW2luZGV4XSwgbWV0YSkpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBhcmUgdGhlIG1hcHMgZXF1YWwgaW4gdmFsdWVcbiAqXG4gKiBAcGFyYW0gYSB0aGUgbWFwIHRvIHRlc3RcbiAqIEBwYXJhbSBiIHRoZSBtYXAgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0gaXNFcXVhbCB0aGUgY29tcGFyYXRvciB0byBkZXRlcm1pbmUgZXF1YWxpdHlcbiAqIEBwYXJhbSBtZXRhIHRoZSBtZXRhIG1hcCB0byBwYXNzIHRocm91Z2hcbiAqIEByZXR1cm5zIGFyZSB0aGUgbWFwcyBlcXVhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJlTWFwc0VxdWFsKFxuICBhOiBNYXA8YW55LCBhbnk+LFxuICBiOiBNYXA8YW55LCBhbnk+LFxuICBpc0VxdWFsOiBFcXVhbGl0eUNvbXBhcmF0b3IsXG4gIG1ldGE6IGFueSxcbikge1xuICBsZXQgaXNWYWx1ZUVxdWFsID0gYS5zaXplID09PSBiLnNpemU7XG5cbiAgaWYgKGlzVmFsdWVFcXVhbCAmJiBhLnNpemUpIHtcbiAgICBhLmZvckVhY2goKGFWYWx1ZSwgYUtleSkgPT4ge1xuICAgICAgaWYgKGlzVmFsdWVFcXVhbCkge1xuICAgICAgICBpc1ZhbHVlRXF1YWwgPSBmYWxzZTtcblxuICAgICAgICBiLmZvckVhY2goKGJWYWx1ZSwgYktleSkgPT4ge1xuICAgICAgICAgIGlmICghaXNWYWx1ZUVxdWFsICYmIGlzRXF1YWwoYUtleSwgYktleSwgbWV0YSkpIHtcbiAgICAgICAgICAgIGlzVmFsdWVFcXVhbCA9IGlzRXF1YWwoYVZhbHVlLCBiVmFsdWUsIG1ldGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gaXNWYWx1ZUVxdWFsO1xufVxuXG50eXBlIERpY3Rpb25hcnk8VHlwZT4gPSB7XG4gIFtrZXk6IHN0cmluZ106IFR5cGU7XG4gIFtpbmRleDogbnVtYmVyXTogVHlwZTtcbn07XG5cbmNvbnN0IE9XTkVSID0gJ19vd25lcic7XG5cbmNvbnN0IGhhc093blByb3BlcnR5ID0gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChcbiAgRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwsXG4gIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksXG4pO1xuXG4vKipcbiAqIGFyZSB0aGUgb2JqZWN0cyBlcXVhbCBpbiB2YWx1ZVxuICpcbiAqIEBwYXJhbSBhIHRoZSBvYmplY3QgdG8gdGVzdFxuICogQHBhcmFtIGIgdGhlIG9iamVjdCB0byB0ZXN0IGFnYWluc3RcbiAqIEBwYXJhbSBpc0VxdWFsIHRoZSBjb21wYXJhdG9yIHRvIGRldGVybWluZSBlcXVhbGl0eVxuICogQHBhcmFtIG1ldGEgdGhlIG1ldGEgb2JqZWN0IHRvIHBhc3MgdGhyb3VnaFxuICogQHJldHVybnMgYXJlIHRoZSBvYmplY3RzIGVxdWFsXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhcmVPYmplY3RzRXF1YWwoXG4gIGE6IERpY3Rpb25hcnk8YW55PixcbiAgYjogRGljdGlvbmFyeTxhbnk+LFxuICBpc0VxdWFsOiBFcXVhbGl0eUNvbXBhcmF0b3IsXG4gIG1ldGE6IGFueSxcbikge1xuICBjb25zdCBrZXlzQSA9IGtleXMoYSk7XG5cbiAgbGV0IGluZGV4ID0ga2V5c0EubGVuZ3RoO1xuXG4gIGlmIChrZXlzKGIpLmxlbmd0aCAhPT0gaW5kZXgpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cblxuICBpZiAoaW5kZXgpIHtcbiAgICBsZXQga2V5OiBzdHJpbmc7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSA+IDApIHtcbiAgICAgIGtleSA9IGtleXNBW2luZGV4XTtcblxuICAgICAgaWYgKGtleSA9PT0gT1dORVIpIHtcbiAgICAgICAgY29uc3QgcmVhY3RFbGVtZW50QSA9IGlzUmVhY3RFbGVtZW50KGEpO1xuICAgICAgICBjb25zdCByZWFjdEVsZW1lbnRCID0gaXNSZWFjdEVsZW1lbnQoYik7XG5cbiAgICAgICAgaWYgKFxuICAgICAgICAgIChyZWFjdEVsZW1lbnRBIHx8IHJlYWN0RWxlbWVudEIpICYmXG4gICAgICAgICAgcmVhY3RFbGVtZW50QSAhPT0gcmVhY3RFbGVtZW50QlxuICAgICAgICApIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKCFoYXNPd25Qcm9wZXJ0eShiLCBrZXkpIHx8ICFpc0VxdWFsKGFba2V5XSwgYltrZXldLCBtZXRhKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogYXJlIHRoZSByZWdFeHBzIGVxdWFsIGluIHZhbHVlXG4gKlxuICogQHBhcmFtIGEgdGhlIHJlZ0V4cCB0byB0ZXN0XG4gKiBAcGFyYW0gYiB0aGUgcmVnRXhwIHRvIHRlc3QgYWdhaW5zXG4gKiBAcmV0dXJucyBhcmUgdGhlIHJlZ0V4cHMgZXF1YWxcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFyZVJlZ0V4cHNFcXVhbChhOiBSZWdFeHAsIGI6IFJlZ0V4cCkge1xuICByZXR1cm4gKFxuICAgIGEuc291cmNlID09PSBiLnNvdXJjZSAmJlxuICAgIGEuZ2xvYmFsID09PSBiLmdsb2JhbCAmJlxuICAgIGEuaWdub3JlQ2FzZSA9PT0gYi5pZ25vcmVDYXNlICYmXG4gICAgYS5tdWx0aWxpbmUgPT09IGIubXVsdGlsaW5lICYmXG4gICAgYS51bmljb2RlID09PSBiLnVuaWNvZGUgJiZcbiAgICBhLnN0aWNreSA9PT0gYi5zdGlja3kgJiZcbiAgICBhLmxhc3RJbmRleCA9PT0gYi5sYXN0SW5kZXhcbiAgKTtcbn1cblxuLyoqXG4gKiBhcmUgdGhlIHNldHMgZXF1YWwgaW4gdmFsdWVcbiAqXG4gKiBAcGFyYW0gYSB0aGUgc2V0IHRvIHRlc3RcbiAqIEBwYXJhbSBiIHRoZSBzZXQgdG8gdGVzdCBhZ2FpbnN0XG4gKiBAcGFyYW0gaXNFcXVhbCB0aGUgY29tcGFyYXRvciB0byBkZXRlcm1pbmUgZXF1YWxpdHlcbiAqIEBwYXJhbSBtZXRhIHRoZSBtZXRhIHNldCB0byBwYXNzIHRocm91Z2hcbiAqIEByZXR1cm5zIGFyZSB0aGUgc2V0cyBlcXVhbFxuICovXG5leHBvcnQgZnVuY3Rpb24gYXJlU2V0c0VxdWFsKFxuICBhOiBTZXQ8YW55PixcbiAgYjogU2V0PGFueT4sXG4gIGlzRXF1YWw6IEVxdWFsaXR5Q29tcGFyYXRvcixcbiAgbWV0YTogYW55LFxuKSB7XG4gIGxldCBpc1ZhbHVlRXF1YWwgPSBhLnNpemUgPT09IGIuc2l6ZTtcblxuICBpZiAoaXNWYWx1ZUVxdWFsICYmIGEuc2l6ZSkge1xuICAgIGEuZm9yRWFjaCgoYVZhbHVlKSA9PiB7XG4gICAgICBpZiAoaXNWYWx1ZUVxdWFsKSB7XG4gICAgICAgIGlzVmFsdWVFcXVhbCA9IGZhbHNlO1xuXG4gICAgICAgIGIuZm9yRWFjaCgoYlZhbHVlKSA9PiB7XG4gICAgICAgICAgaWYgKCFpc1ZhbHVlRXF1YWwpIHtcbiAgICAgICAgICAgIGlzVmFsdWVFcXVhbCA9IGlzRXF1YWwoYVZhbHVlLCBiVmFsdWUsIG1ldGEpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICByZXR1cm4gaXNWYWx1ZUVxdWFsO1xufVxuIiwiaW1wb3J0IHtcbiAgRXF1YWxpdHlDb21wYXJhdG9yLFxuICBhcmVBcnJheXNFcXVhbCxcbiAgYXJlTWFwc0VxdWFsLFxuICBhcmVPYmplY3RzRXF1YWwsXG4gIGFyZVJlZ0V4cHNFcXVhbCxcbiAgYXJlU2V0c0VxdWFsLFxuICBpc1BsYWluT2JqZWN0LFxuICBpc1Byb21pc2VMaWtlLFxuICBzYW1lVmFsdWVaZXJvRXF1YWwsXG59IGZyb20gJy4vdXRpbHMnO1xuXG5jb25zdCBIQVNfTUFQX1NVUFBPUlQgPSB0eXBlb2YgTWFwID09PSAnZnVuY3Rpb24nO1xuY29uc3QgSEFTX1NFVF9TVVBQT1JUID0gdHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJztcblxudHlwZSBFcXVhbGl0eUNvbXBhcmF0b3JDcmVhdG9yID0gKGZuOiBFcXVhbGl0eUNvbXBhcmF0b3IpID0+IEVxdWFsaXR5Q29tcGFyYXRvcjtcblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUNvbXBhcmF0b3IoY3JlYXRlSXNFcXVhbD86IEVxdWFsaXR5Q29tcGFyYXRvckNyZWF0b3IpIHtcbiAgY29uc3QgaXNFcXVhbDogRXF1YWxpdHlDb21wYXJhdG9yID1cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby11c2UtYmVmb3JlLWRlZmluZSAqL1xuICAgIHR5cGVvZiBjcmVhdGVJc0VxdWFsID09PSAnZnVuY3Rpb24nXG4gICAgICA/IGNyZWF0ZUlzRXF1YWwoY29tcGFyYXRvcilcbiAgICAgIDogY29tcGFyYXRvcjtcbiAgLyogZXNsaW50LWVuYWJsZSAqL1xuXG4gIC8qKlxuICAgKiBjb21wYXJlIHRoZSB2YWx1ZSBvZiB0aGUgdHdvIG9iamVjdHMgYW5kIHJldHVybiB0cnVlIGlmIHRoZXkgYXJlIGVxdWl2YWxlbnQgaW4gdmFsdWVzXG4gICAqXG4gICAqIEBwYXJhbSBhIHRoZSB2YWx1ZSB0byB0ZXN0IGFnYWluc3RcbiAgICogQHBhcmFtIGIgdGhlIHZhbHVlIHRvIHRlc3RcbiAgICogQHBhcmFtIFttZXRhXSBhbiBvcHRpb25hbCBtZXRhIG9iamVjdCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRvIGFsbCBlcXVhbGl0eSB0ZXN0IGNhbGxzXG4gICAqIEByZXR1cm5zIGFyZSBhIGFuZCBiIGVxdWl2YWxlbnQgaW4gdmFsdWVcbiAgICovXG4gIGZ1bmN0aW9uIGNvbXBhcmF0b3IoYTogYW55LCBiOiBhbnksIG1ldGE/OiBhbnkpIHtcbiAgICBpZiAoYSA9PT0gYikge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKGEgJiYgYiAmJiB0eXBlb2YgYSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIGIgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNQbGFpbk9iamVjdChhKSAmJiBpc1BsYWluT2JqZWN0KGIpKSB7XG4gICAgICAgIHJldHVybiBhcmVPYmplY3RzRXF1YWwoYSwgYiwgaXNFcXVhbCwgbWV0YSk7XG4gICAgICB9XG5cbiAgICAgIGxldCBhU2hhcGUgPSBBcnJheS5pc0FycmF5KGEpO1xuICAgICAgbGV0IGJTaGFwZSA9IEFycmF5LmlzQXJyYXkoYik7XG5cbiAgICAgIGlmIChhU2hhcGUgfHwgYlNoYXBlKSB7XG4gICAgICAgIHJldHVybiBhU2hhcGUgPT09IGJTaGFwZSAmJiBhcmVBcnJheXNFcXVhbChhLCBiLCBpc0VxdWFsLCBtZXRhKTtcbiAgICAgIH1cblxuICAgICAgYVNoYXBlID0gYSBpbnN0YW5jZW9mIERhdGU7XG4gICAgICBiU2hhcGUgPSBiIGluc3RhbmNlb2YgRGF0ZTtcblxuICAgICAgaWYgKGFTaGFwZSB8fCBiU2hhcGUpIHtcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICBhU2hhcGUgPT09IGJTaGFwZSAmJiBzYW1lVmFsdWVaZXJvRXF1YWwoYS5nZXRUaW1lKCksIGIuZ2V0VGltZSgpKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBhU2hhcGUgPSBhIGluc3RhbmNlb2YgUmVnRXhwO1xuICAgICAgYlNoYXBlID0gYiBpbnN0YW5jZW9mIFJlZ0V4cDtcblxuICAgICAgaWYgKGFTaGFwZSB8fCBiU2hhcGUpIHtcbiAgICAgICAgcmV0dXJuIGFTaGFwZSA9PT0gYlNoYXBlICYmIGFyZVJlZ0V4cHNFcXVhbChhLCBiKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGlzUHJvbWlzZUxpa2UoYSkgfHwgaXNQcm9taXNlTGlrZShiKSkge1xuICAgICAgICByZXR1cm4gYSA9PT0gYjtcbiAgICAgIH1cblxuICAgICAgaWYgKEhBU19NQVBfU1VQUE9SVCkge1xuICAgICAgICBhU2hhcGUgPSBhIGluc3RhbmNlb2YgTWFwO1xuICAgICAgICBiU2hhcGUgPSBiIGluc3RhbmNlb2YgTWFwO1xuXG4gICAgICAgIGlmIChhU2hhcGUgfHwgYlNoYXBlKSB7XG4gICAgICAgICAgcmV0dXJuIGFTaGFwZSA9PT0gYlNoYXBlICYmIGFyZU1hcHNFcXVhbChhLCBiLCBpc0VxdWFsLCBtZXRhKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAoSEFTX1NFVF9TVVBQT1JUKSB7XG4gICAgICAgIGFTaGFwZSA9IGEgaW5zdGFuY2VvZiBTZXQ7XG4gICAgICAgIGJTaGFwZSA9IGIgaW5zdGFuY2VvZiBTZXQ7XG5cbiAgICAgICAgaWYgKGFTaGFwZSB8fCBiU2hhcGUpIHtcbiAgICAgICAgICByZXR1cm4gYVNoYXBlID09PSBiU2hhcGUgJiYgYXJlU2V0c0VxdWFsKGEsIGIsIGlzRXF1YWwsIG1ldGEpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBhcmVPYmplY3RzRXF1YWwoYSwgYiwgaXNFcXVhbCwgbWV0YSk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGEgIT09IGEgJiYgYiAhPT0gYjtcbiAgfVxuXG4gIHJldHVybiBjb21wYXJhdG9yO1xufVxuIiwiaW1wb3J0IHsgY3JlYXRlQ29tcGFyYXRvciB9IGZyb20gJy4vY29tcGFyYXRvcic7XG5pbXBvcnQgeyBjcmVhdGVDaXJjdWxhckVxdWFsQ3JlYXRvciwgc2FtZVZhbHVlWmVyb0VxdWFsIH0gZnJvbSAnLi91dGlscyc7XG5cbmV4cG9ydCB7IGNyZWF0ZUNvbXBhcmF0b3IgYXMgY3JlYXRlQ3VzdG9tRXF1YWwsIHNhbWVWYWx1ZVplcm9FcXVhbCB9O1xuXG5leHBvcnQgY29uc3QgZGVlcEVxdWFsID0gY3JlYXRlQ29tcGFyYXRvcigpO1xuZXhwb3J0IGNvbnN0IHNoYWxsb3dFcXVhbCA9IGNyZWF0ZUNvbXBhcmF0b3IoKCkgPT4gc2FtZVZhbHVlWmVyb0VxdWFsKTtcblxuZXhwb3J0IGNvbnN0IGNpcmN1bGFyRGVlcEVxdWFsID0gY3JlYXRlQ29tcGFyYXRvcihjcmVhdGVDaXJjdWxhckVxdWFsQ3JlYXRvcigpKTtcbmV4cG9ydCBjb25zdCBjaXJjdWxhclNoYWxsb3dFcXVhbCA9IGNyZWF0ZUNvbXBhcmF0b3IoXG4gIGNyZWF0ZUNpcmN1bGFyRXF1YWxDcmVhdG9yKHNhbWVWYWx1ZVplcm9FcXVhbCksXG4pO1xuIiwiaW1wb3J0IHsgZGVlcEVxdWFsIH0gZnJvbSBcImZhc3QtZXF1YWxzXCJcclxuXHJcbi8qIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZXhwbGljaXQtYW55ICovXHJcbmV4cG9ydCBmdW5jdGlvbiB1bmlxdWU8VCBleHRlbmRzIFJlY29yZDxzdHJpbmcsIGFueT4+KGFycmF5OiBUW10pIHtcclxuICByZXR1cm4gYXJyYXkuZmlsdGVyKChlbG0yLCBpbmRleCkgPT4gYXJyYXkuZmluZEluZGV4KChlbG0xKSA9PiBkZWVwRXF1YWwoZWxtMSwgZWxtMikpID09PSBpbmRleClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGdldEljb24oaWNvblR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCwga2luZFR5cGU6IHN0cmluZyB8IHVuZGVmaW5lZCkge1xyXG4gIC8vIExTUCBzcGVjaWZpY2F0aW9uOiBodHRwczovL21pY3Jvc29mdC5naXRodWIuaW8vbGFuZ3VhZ2Utc2VydmVyLXByb3RvY29sL3NwZWNpZmljYXRpb25zL3NwZWNpZmljYXRpb24tY3VycmVudC8jdGV4dERvY3VtZW50X2RvY3VtZW50U3ltYm9sXHJcbiAgLy8gYXRvbS1sYW5ndWFnZWNsaWVudCBtYXBwaW5nOiBodHRwczovL2dpdGh1Yi5jb20vYXRvbS9hdG9tLWxhbmd1YWdlY2xpZW50L2Jsb2IvNDg1YmI5ZDcwNmI0MjI0NTY2NDBjOTA3MGVlZTQ1NmVmMmNmMDljMC9saWIvYWRhcHRlcnMvb3V0bGluZS12aWV3LWFkYXB0ZXIudHMjTDI3MFxyXG5cclxuICBjb25zdCBpY29uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXHJcbiAgaWNvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChcIm91dGxpbmUtaWNvblwiKVxyXG5cclxuICAvLyBpZiBpY29uVHlwZSBnaXZlbiBpbnN0ZWFkXHJcbiAgaWYgKGtpbmRUeXBlID09PSB1bmRlZmluZWQgJiYgaWNvblR5cGUgIT09IHVuZGVmaW5lZCkge1xyXG4gICAga2luZFR5cGUgPSBpY29uVHlwZVxyXG4gIH1cclxuXHJcbiAgbGV0IHR5cGU6IHN0cmluZyA9IFwi8J+eh1wiXHJcbiAgaWYgKHR5cGVvZiBraW5kVHlwZSA9PT0gXCJzdHJpbmdcIiAmJiBraW5kVHlwZS5sZW5ndGggPiAwKSB7XHJcbiAgICBsZXQga2luZENsYXNzOiBzdHJpbmdcclxuICAgIC8vIGhhc0tpbmRcclxuICAgIGlmIChraW5kVHlwZS5pbmRleE9mKFwidHlwZS1cIikgPT09IDApIHtcclxuICAgICAgLy8gc3VwcGxpZWQgd2l0aCB0eXBlLS4uLlxyXG4gICAgICBraW5kQ2xhc3MgPSBgJHtraW5kVHlwZX1gXHJcbiAgICAgIHR5cGUgPSBraW5kVHlwZS5yZXBsYWNlKFwidHlwZS1cIiwgXCJcIilcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIHN1cHBsaWVkIHdpdGhvdXQgdHlwZS1cclxuICAgICAga2luZENsYXNzID0gYHR5cGUtJHtraW5kVHlwZX1gXHJcbiAgICAgIHR5cGUgPSBraW5kVHlwZVxyXG4gICAgfVxyXG4gICAgaWNvbkVsZW1lbnQuY2xhc3NMaXN0LmFkZChraW5kQ2xhc3MpXHJcbiAgfVxyXG5cclxuICBpY29uRWxlbWVudC5pbm5lckhUTUwgPSBgPHNwYW4+JHt0eXBlLnN1YnN0cmluZygwLCAzKX08L3NwYW4+YFxyXG5cclxuICByZXR1cm4gaWNvbkVsZW1lbnRcclxufVxyXG4iLCJpbXBvcnQgeyBUZXh0RWRpdG9yLCBQb2ludCwgRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCJcclxuaW1wb3J0IHR5cGUgeyBPdXRsaW5lVHJlZSB9IGZyb20gXCJhdG9tLWlkZS1iYXNlXCJcclxuaW1wb3J0IHsgc2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCB9IGZyb20gXCJhdG9tLWlkZS1iYXNlL2NvbW1vbnMtdWkvc2Nyb2xsSW50b1ZpZXdcIlxyXG5pbXBvcnQgeyBpc0l0ZW1WaXNpYmxlIH0gZnJvbSBcImF0b20taWRlLWJhc2UvY29tbW9ucy11aS9pdGVtc1wiXHJcbmltcG9ydCB7IFRyZWVGaWx0ZXJlciwgVHJlZSB9IGZyb20gXCJ6YWRlaFwiXHJcbmltcG9ydCB7IHVuaXF1ZSwgZ2V0SWNvbiB9IGZyb20gXCIuL3V0aWxzXCJcclxuaW1wb3J0IHsgc2V0U3RhdHVzIH0gZnJvbSBcIi4vbWFpblwiXHJcblxyXG5leHBvcnQgY2xhc3MgT3V0bGluZVZpZXcge1xyXG4gIHB1YmxpYyBlbGVtZW50OiBIVE1MRGl2RWxlbWVudFxyXG5cclxuICAvKiogQ29udGFpbnMgdGhlIGNvbnRlbnQgb2YgdGhlIG91dGxpbmUgd2hpY2ggaXMgZWl0aGVyIHRoZSBzdGF0dXMgZWxlbWVudCBvciB0aGUgbGlzdCBlbGVtZW50ICovXHJcbiAgcHVibGljIG91dGxpbmVDb250ZW50OiBIVE1MRGl2RWxlbWVudFxyXG4gIC8qKiBUaGUgYWN0dWFsIG91dGxpbmUgbGlzdCBlbGVtZW50ICovXHJcbiAgcHJpdmF0ZSBvdXRsaW5lTGlzdDogSFRNTFVMaXN0RWxlbWVudCB8IHVuZGVmaW5lZCA9IHVuZGVmaW5lZFxyXG5cclxuICAvKiogQ2FjaGUgZm9yIHJldmVhbCBjb3JzdXIgKi9cclxuICBwcml2YXRlIHBvaW50VG9FbGVtZW50c01hcCA9IG5ldyBNYXA8bnVtYmVyLCBBcnJheTxIVE1MTElFbGVtZW50Pj4oKSAvLyBUT0RPIFBvaW50IHRvIGVsZW1lbnRcclxuICAvKiogQ2FjaGUgZm9yIGZvY3VzZWQgZWxlbWVudHMgKi9cclxuICBwcml2YXRlIGZvY3VzZWRFbG1zOiBIVE1MRWxlbWVudFtdIHwgdW5kZWZpbmVkXHJcbiAgLyoqIENhY2hlIG9mIGxhc3QgcmVuZGVyZWQgbGlzdCB1c2VkIHRvIGF2b2lkIHJlcmVuZGVyaW5nICovXHJcbiAgbGFzdEVudHJpZXM6IE91dGxpbmVUcmVlW10gfCB1bmRlZmluZWRcclxuXHJcbiAgcHJpdmF0ZSB0cmVlRmlsdGVyZXIgPSBuZXcgVHJlZUZpbHRlcmVyPFwicmVwcmVzZW50YXRpdmVOYW1lXCIgfCBcInBsYWluVGV4dFwiLCBcImNoaWxkcmVuXCI+KClcclxuICBwdWJsaWMgc2VhcmNoQmFyRWRpdG9yOiBUZXh0RWRpdG9yIHwgdW5kZWZpbmVkXHJcbiAgcHJpdmF0ZSBzZWFyY2hCYXJFZGl0b3JEaXNwb3NhYmxlOiBEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXHJcbiAgcHJpdmF0ZSBzZWxlY3RDdXJzb3JEaXNwb3NhYmxlOiBEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5lbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgdGhpcy5lbGVtZW50LmNsYXNzTGlzdC5hZGQoXCJhdG9tLWlkZS1vdXRsaW5lXCIpXHJcblxyXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKG1ha2VPdXRsaW5lVG9vbGJhcigpKVxyXG4gICAgdGhpcy5lbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlU2VhcmNoQmFyKCkpXHJcblxyXG4gICAgdGhpcy5vdXRsaW5lQ29udGVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICAgIHRoaXMuZWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLm91dGxpbmVDb250ZW50KVxyXG5cclxuICAgIHRoaXMub3V0bGluZUNvbnRlbnQuY2xhc3NMaXN0LmFkZChcIm91dGxpbmUtY29udGVudFwiKVxyXG4gIH1cclxuXHJcbiAgcmVzZXQoKSB7XHJcbiAgICB0aGlzLnNlYXJjaEJhckVkaXRvckRpc3Bvc2FibGU/LmRpc3Bvc2UoKVxyXG4gICAgdGhpcy5zZWxlY3RDdXJzb3JEaXNwb3NhYmxlPy5kaXNwb3NlKClcclxuICAgIHRoaXMuc2VhcmNoQmFyRWRpdG9yPy5zZXRUZXh0KFwiXCIpXHJcbiAgfVxyXG5cclxuICBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5lbGVtZW50LnJlbW92ZSgpXHJcbiAgfVxyXG5cclxuICBnZXRFbGVtZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFxyXG4gIH1cclxuXHJcbiAgLy8gbmVlZGVkIGZvciBBdG9tXHJcbiAgLyogZXNsaW50LWRpc2FibGUgY2xhc3MtbWV0aG9kcy11c2UtdGhpcyAqL1xyXG4gIGdldFRpdGxlKCkge1xyXG4gICAgcmV0dXJuIFwiT3V0bGluZVwiXHJcbiAgfVxyXG5cclxuICBnZXRJY29uTmFtZSgpIHtcclxuICAgIHJldHVybiBcImxpc3QtdW5vcmRlcmVkXCJcclxuICB9XHJcbiAgLyogZXNsaW50LWVuYWJsZSBjbGFzcy1tZXRob2RzLXVzZS10aGlzICovXHJcblxyXG4gIC8qKlxyXG4gICAqIFRoZSBtYWluIGZ1bmN0aW9uIG9mIHtPdXRsaW5lVmlld30gd2hpY2ggcmVuZGVycyB0aGUgY29udGVudCBpbiB0aGUgb3V0bGluZSBvciBvbmx5IHVwZGF0ZSB0aGUgZXZlbnQgbGlzdGVuZXJzIGlmXHJcbiAgICogdGhlIG91dGxpbmUgdHJlZSBoYXNuJ3QgY2hhbmdlZFxyXG4gICAqL1xyXG4gIHNldE91dGxpbmUob3V0bGluZVRyZWU6IE91dGxpbmVUcmVlW10sIGVkaXRvcjogVGV4dEVkaXRvciwgaXNMYXJnZTogYm9vbGVhbikge1xyXG4gICAgLy8gc2tpcCByZW5kZXJpbmcgaWYgaXQgaXMgdGhlIHNhbWVcclxuICAgIC8vIFRJTUUgMC4yLTEuMm1zIC8vIHRoZSBjaGVjayBpdHNlbGYgdGFrZXMgfjAuMi0wLjVtcywgc28gaXQgaXMgYmV0dGVyIHRoYW4gcmVyZW5kZXJpbmdcclxuICAgIGlmICh0aGlzLmxhc3RFbnRyaWVzICE9PSB1bmRlZmluZWQgJiYgaGFzRXF1YWxDb250ZW50KG91dGxpbmVUcmVlLCB0aGlzLmxhc3RFbnRyaWVzKSkge1xyXG4gICAgICB0aGlzLnBvaW50VG9FbGVtZW50c01hcC5jbGVhcigpIC8vIGVtcHR5IHJldmVhbENvcnN1ciBjYWNoZVxyXG4gICAgICBhZGRFbnRyaWVzT25DbGljayhcclxuICAgICAgICB0aGlzLm91dGxpbmVMaXN0ISAvKiBiZWNhdXNlIHRoaXMubGFzdEVudHJpZXMgaXMgbm90IHVuZGVmaW5lZCAqLyxcclxuICAgICAgICBvdXRsaW5lVHJlZSxcclxuICAgICAgICBlZGl0b3IsXHJcbiAgICAgICAgdGhpcy5wb2ludFRvRWxlbWVudHNNYXAsXHJcbiAgICAgICAgMFxyXG4gICAgICApXHJcbiAgICAgIHJldHVyblxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5sYXN0RW50cmllcyA9IG91dGxpbmVUcmVlXHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jcmVhdGVPdXRsaW5lTGlzdChvdXRsaW5lVHJlZSwgZWRpdG9yLCBpc0xhcmdlKVxyXG4gIH1cclxuXHJcbiAgLyoqIFRoZSBmdW5jdGlvbiB0byByZW5kZXIgdGhlIGNvbnRlbnQgaW4gdGhlIG91dGxpbmUgKi9cclxuICBjcmVhdGVPdXRsaW5lTGlzdChvdXRsaW5lVHJlZTogT3V0bGluZVRyZWVbXSwgZWRpdG9yOiBUZXh0RWRpdG9yLCBpc0xhcmdlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmNsZWFyQ29udGVudCgpXHJcblxyXG4gICAgaWYgKGlzTGFyZ2UpIHtcclxuICAgICAgdGhpcy5vdXRsaW5lQ29udGVudC5hcHBlbmRDaGlsZChjcmVhdGVMYXJnZUZpbGVFbGVtZW50KCkpXHJcbiAgICB9XHJcbiAgICB0aGlzLnVwZGF0ZVNlYXJjaEJhcihvdXRsaW5lVHJlZSwgZWRpdG9yLCBpc0xhcmdlKVxyXG5cclxuICAgIHRoaXMub3V0bGluZUxpc3QgPSBjcmVhdGVPdXRsaW5lTGlzdChvdXRsaW5lVHJlZSwgZWRpdG9yLCBpc0xhcmdlLCB0aGlzLnBvaW50VG9FbGVtZW50c01hcClcclxuICAgIHRoaXMub3V0bGluZUNvbnRlbnQuYXBwZW5kQ2hpbGQodGhpcy5vdXRsaW5lTGlzdClcclxuICB9XHJcblxyXG4gIGNsZWFyQ29udGVudCgpIHtcclxuICAgIHRoaXMub3V0bGluZUNvbnRlbnQuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgaWYgKHRoaXMub3V0bGluZUxpc3QgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aGlzLm91dGxpbmVMaXN0LmRhdGFzZXQuZWRpdG9yUm9vdFNjb3BlID0gXCJcIlxyXG4gICAgfVxyXG4gICAgdGhpcy5sYXN0RW50cmllcyA9IHVuZGVmaW5lZFxyXG4gIH1cclxuXHJcbiAgdXBkYXRlU2VhcmNoQmFyKG91dGxpbmVUcmVlOiBPdXRsaW5lVHJlZVtdLCBlZGl0b3I6IFRleHRFZGl0b3IsIGlzTGFyZ2U6IGJvb2xlYW4pIHtcclxuICAgIHRoaXMuc2VhcmNoQmFyRWRpdG9yRGlzcG9zYWJsZT8uZGlzcG9zZSgpXHJcblxyXG4gICAgLy8gZGV0ZWN0IGlmIHJlcHJlc2VudGF0aXZlTmFtZSBleGlzdHMgb24gYW4gZW50cnkgb2YgdGhlIHRyZWUsIGlmIGl0IGRvZXNuJ3QsIHRoZW4gd2UgdXNlIHBsYWluVGV4dFxyXG4gICAgY29uc3QgZmlyc3RPdXRsaW5lVHJlZSA9IG91dGxpbmVUcmVlWzBdXHJcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXVubmVjZXNzYXJ5LWNvbmRpdGlvblxyXG4gICAgY29uc3QgZGF0YUtleSA9IGZpcnN0T3V0bGluZVRyZWU/LnJlcHJlc2VudGF0aXZlTmFtZSAhPT0gdW5kZWZpbmVkID8gXCJyZXByZXNlbnRhdGl2ZU5hbWVcIiA6IFwicGxhaW5UZXh0XCJcclxuXHJcbiAgICAvLyBAdHMtaWdub3JlIHdlIGNoZWNrIGlmIHJlcHJlc2VudGl0aXZlTmFtZSBpcyB1bmRlZmluZWQsIGFuZCBpZiBpdCBpcywgd2Ugd2lsbCB1c2UgcGxhaW5UZXh0IGluc3RlYWRcclxuICAgIHRoaXMudHJlZUZpbHRlcmVyLnNldENhbmRpZGF0ZXMob3V0bGluZVRyZWUsIGRhdGFLZXksIFwiY2hpbGRyZW5cIilcclxuXHJcbiAgICB0aGlzLnNlYXJjaEJhckVkaXRvckRpc3Bvc2FibGUgPSB0aGlzLnNlYXJjaEJhckVkaXRvcj8ub25EaWRTdG9wQ2hhbmdpbmcoKCkgPT5cclxuICAgICAgdGhpcy5maWx0ZXJPdXRsaW5lVHJlZShlZGl0b3IsIGlzTGFyZ2UpXHJcbiAgICApXHJcbiAgfVxyXG5cclxuICBjcmVhdGVTZWFyY2hCYXIoKSB7XHJcbiAgICB0aGlzLnNlYXJjaEJhckVkaXRvciA9IG5ldyBUZXh0RWRpdG9yKHsgbWluaTogdHJ1ZSwgcGxhY2Vob2xkZXJUZXh0OiBcIkZpbHRlclwiIH0pXHJcblxyXG4gICAgY29uc3Qgc2VhcmNoQmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgc2VhcmNoQmFyLmNsYXNzTGlzdC5hZGQoXCJvdXRsaW5lLXNlYXJjaGJhclwiKVxyXG5cclxuICAgIHNlYXJjaEJhci5hcHBlbmRDaGlsZChhdG9tLnZpZXdzLmdldFZpZXcodGhpcy5zZWFyY2hCYXJFZGl0b3IpKVxyXG5cclxuICAgIHJldHVybiBzZWFyY2hCYXJcclxuICB9XHJcblxyXG4gIHJlbmRlckxhc3RPdXRsaWVuTGlzdCgpIHtcclxuICAgIGlmICh0aGlzLm91dGxpbmVMaXN0ICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgdGhpcy5jbGVhckNvbnRlbnQoKVxyXG4gICAgICB0aGlzLm91dGxpbmVDb250ZW50LmFwcGVuZENoaWxkKHRoaXMub3V0bGluZUxpc3QpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmaWx0ZXJPdXRsaW5lVHJlZShlZGl0b3I6IFRleHRFZGl0b3IsIGlzTGFyZ2U6IGJvb2xlYW4pIHtcclxuICAgIC8vIEB0cy1pZ25vcmVcclxuICAgIGlmICghKGVkaXRvci5pc0FsaXZlKCkgYXMgYm9vbGVhbikgfHwgIWlzSXRlbVZpc2libGUoZWRpdG9yKSkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5zZWFyY2hCYXJFZGl0b3I/LmdldFRleHQoKVxyXG4gICAgaWYgKHR5cGVvZiB0ZXh0ICE9PSBcInN0cmluZ1wiKSB7XHJcbiAgICAgIHRoaXMucmVuZGVyTGFzdE91dGxpZW5MaXN0KClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBjb25zdCBxdWVyeSA9IHRleHQudHJpbSgpXHJcbiAgICBpZiAocXVlcnkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgIHRoaXMucmVuZGVyTGFzdE91dGxpZW5MaXN0KClcclxuICAgICAgcmV0dXJuXHJcbiAgICB9XHJcbiAgICBsZXQgZmlsdGVyUmVzdWx0czogVHJlZTxcInJlcHJlc2VudGF0aXZlTmFtZVwiIHwgXCJwbGFpblRleHRcIiwgXCJjaGlsZHJlblwiPltdXHJcbiAgICB0cnkge1xyXG4gICAgICBmaWx0ZXJSZXN1bHRzID0gdGhpcy50cmVlRmlsdGVyZXIuZmlsdGVyKHF1ZXJ5LCB7IG1heFJlc3VsdHM6IDEwMCwgdXNlUGF0aFNjb3Jpbmc6IGZhbHNlIH0pXHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc3QgZXJyb3IgPSBlcnIgYXMgRXJyb3JcclxuICAgICAgZXJyb3IubWVzc2FnZSA9IGBGaWx0ZXJpbmcgZmFpbGVkIGZvciB1bmtvd24gcmVhc29ucy5cXG4ke2Vycm9yLm1lc3NhZ2V9YFxyXG4gICAgICBjb25zb2xlLmVycm9yKGVycm9yKVxyXG4gICAgICB0aGlzLnJlc2V0KClcclxuICAgICAgLy8gUmV0cnk6XHJcbiAgICAgIC8vIEB0cy1pZ25vcmUgaW50ZXJuYWwgYXBpXHJcbiAgICAgIGNvbnN0IGNhbmRpZGF0ZXMgPSB0aGlzLnRyZWVGaWx0ZXJlci5jYW5kaWRhdGVzIGFzIFRyZWU8XCJyZXByZXNlbnRhdGl2ZU5hbWVcIiB8IFwicGxhaW5UZXh0XCIsIFwiY2hpbGRyZW5cIj5bXVxyXG4gICAgICB0aGlzLnRyZWVGaWx0ZXJlciA9IG5ldyBUcmVlRmlsdGVyZXIoY2FuZGlkYXRlcylcclxuICAgICAgdGhpcy51cGRhdGVTZWFyY2hCYXIoY2FuZGlkYXRlcyBhcyB1bmtub3duIGFzIE91dGxpbmVUcmVlW10sIGVkaXRvciwgaXNMYXJnZSlcclxuICAgICAgdGhpcy5zZWFyY2hCYXJFZGl0b3I/LnNldFRleHQocXVlcnkpXHJcbiAgICAgIHRoaXMuZmlsdGVyT3V0bGluZVRyZWUoZWRpdG9yLCBpc0xhcmdlKVxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuXHJcbiAgICAvLyBUT0RPIHdoeSByZXR1cm5zIGR1cGxpY2F0ZXM/IH4wLTAuMnNcclxuICAgIGNvbnN0IGZpbHRlcmVkVHJlZSA9IHVuaXF1ZShmaWx0ZXJSZXN1bHRzKVxyXG4gICAgaWYgKGZpbHRlcmVkVHJlZS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIHNldFN0YXR1cyhcIm5vUmVzdWx0XCIpXHJcbiAgICB9XHJcbiAgICBjb25zdCBmaWx0ZXJlZE91dGxpbmVMaXN0ID0gY3JlYXRlT3V0bGluZUxpc3QoXHJcbiAgICAgIGZpbHRlcmVkVHJlZSBhcyB1bmtub3duIGFzIE91dGxpbmVUcmVlW10sXHJcbiAgICAgIGVkaXRvcixcclxuICAgICAgaXNMYXJnZSxcclxuICAgICAgdGhpcy5wb2ludFRvRWxlbWVudHNNYXBcclxuICAgIClcclxuICAgIHRoaXMuY2xlYXJDb250ZW50KClcclxuICAgIHRoaXMub3V0bGluZUNvbnRlbnQuYXBwZW5kQ2hpbGQoZmlsdGVyZWRPdXRsaW5lTGlzdClcclxuICB9XHJcblxyXG4gIHByZXNlbnRTdGF0dXMoc3RhdHVzOiB7IHRpdGxlOiBzdHJpbmc7IGRlc2NyaXB0aW9uOiBzdHJpbmcgfSkge1xyXG4gICAgdGhpcy5jbGVhckNvbnRlbnQoKVxyXG5cclxuICAgIGNvbnN0IHN0YXR1c0VsZW1lbnQgPSBnZW5lcmF0ZVN0YXR1c0VsZW1lbnQoc3RhdHVzKVxyXG5cclxuICAgIHRoaXMub3V0bGluZUNvbnRlbnQuYXBwZW5kQ2hpbGQoc3RhdHVzRWxlbWVudClcclxuICB9XHJcblxyXG4gIC8vIGNhbGxiYWNrIGZvciBzY3JvbGxpbmcgYW5kIGhpZ2hsaWdodGluZyB0aGUgZWxlbWVudCB0aGF0IHRoZSBjdXJzb3IgaXMgb25cclxuICBzZWxlY3RBdEN1cnNvckxpbmUoZWRpdG9yOiBUZXh0RWRpdG9yKSB7XHJcbiAgICBjb25zdCBjdXJzb3IgPSBlZGl0b3IuZ2V0TGFzdEN1cnNvcigpXHJcblxyXG4gICAgLy8gc2tpcCBpZiBub3QgdmlzaWJsZVxyXG4gICAgaWYgKCFpc0l0ZW1WaXNpYmxlKHRoaXMpKSB7XHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIGlmIChjbGlja2VkKSB7XHJcbiAgICAgIC8vIEhBQ0sgZG8gbm90IHNjcm9sbCB3aGVuIHRoZSBjdXJzb3IgaGFzIG1vdmVkIHRvIGEgY2xpY2sgb24gdGhlIG91dGxpbmUgZW50cnlcclxuICAgICAgY2xpY2tlZCA9IGZhbHNlXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG5cclxuICAgIC8vIFRJTUU6IH4wLjItMC4zbXNcclxuICAgIC8vIFRPRE8gdXNlIHJhbmdlIG9mIHN0YXJ0IGFuZCBlbmQgaW5zdGVhZCBvZiBqdXN0IHRoZSBsaW5lIG51bWJlclxyXG5cclxuICAgIC8vIHJlbW92ZSBvbGQgY3Vyc29yT24gYXR0cmlidWVcclxuICAgIGlmICh0aGlzLmZvY3VzZWRFbG1zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgZm9yIChjb25zdCBlbG0gb2YgdGhpcy5mb2N1c2VkRWxtcykge1xyXG4gICAgICAgIGVsbS50b2dnbGVBdHRyaWJ1dGUoXCJjdXJzb3JPblwiLCBmYWxzZSlcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIC8vIGFkZCBuZXcgY3Vyc29yT24gYXR0cmlidWVcclxuICAgIGNvbnN0IGN1cnNvclBvaW50ID0gY3Vyc29yLmdldEJ1ZmZlclJvdygpXHJcbiAgICB0aGlzLmZvY3VzZWRFbG1zID0gdGhpcy5wb2ludFRvRWxlbWVudHNNYXAuZ2V0KGN1cnNvclBvaW50KVxyXG5cclxuICAgIC8vIHNlYXJjaCBpbiBiZXR3ZWVuIHRoZSBwb2ludHNcclxuICAgIGlmICh0aGlzLmZvY3VzZWRFbG1zID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgY29uc3QgcG9pbnRzID0gdGhpcy5wb2ludFRvRWxlbWVudHNNYXAua2V5cygpXHJcbiAgICAgIGxldCBwcmV2aW91c1BvaW50OiBudW1iZXIgPSAwXHJcbiAgICAgIGZvciAoY29uc3QgcG9pbnQgb2YgcG9pbnRzKSB7XHJcbiAgICAgICAgLy8gZmluZCB0aGUgZmlyc3QgcG9pbnQgd2hpY2ggaGFzIGEgbGFyZ2VyIHBvaW50XHJcbiAgICAgICAgaWYgKHBvaW50ID49IGN1cnNvclBvaW50KSB7XHJcbiAgICAgICAgICBjb25zdCBwcmV2aW91c0VsbXMgPSB0aGlzLnBvaW50VG9FbGVtZW50c01hcC5nZXQocHJldmlvdXNQb2ludCkhXHJcbiAgICAgICAgICBwcmV2aW91c0VsbXNbcHJldmlvdXNFbG1zLmxlbmd0aCAtIDFdLmNsYXNzTGlzdC5hZGQoXCJhZnRlci1ib3JkZXJcIilcclxuICAgICAgICAgIGNvbnN0IGN1cnJlbnRFbG1zID0gdGhpcy5wb2ludFRvRWxlbWVudHNNYXAuZ2V0KHBvaW50KSFcclxuICAgICAgICAgIHRoaXMuZm9jdXNlZEVsbXMgPSBbLi4uY3VycmVudEVsbXMsIC4uLnByZXZpb3VzRWxtc10gLy8gaW4gcmV2ZXJzZSBzbyB0aGUgcHJldmlvdXMgZWxtcyBhcmUgc2Nyb2xsZWQgaW50byBpbiB0aGUgZW5kXHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAvLyB1cGRhdGUgcHJldmlvdXMgcG9pbnQgZm9yIHRoZSBuZXh0IGl0ZXJhdGlvblxyXG4gICAgICAgICAgcHJldmlvdXNQb2ludCA9IHBvaW50XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgLy8gYWRkIGN1cnNvck9uIGFuZCBzY3JvbGxJbnRvXHJcbiAgICBpZiAodGhpcy5mb2N1c2VkRWxtcyAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZWxtIG9mIHRoaXMuZm9jdXNlZEVsbXMpIHtcclxuICAgICAgICBzY3JvbGxJbnRvVmlld0lmTmVlZGVkKGVsbSwgdHJ1ZSlcclxuICAgICAgICBlbG0udG9nZ2xlQXR0cmlidXRlKFwiY3Vyc29yT25cIiwgdHJ1ZSlcclxuICAgICAgfVxyXG4gICAgICAvLyByZW1vdmUgZm9jdXMgb25jZSBjdXJzb3IgbW92ZWRcclxuICAgICAgdGhpcy5zZWxlY3RDdXJzb3JEaXNwb3NhYmxlID0gZWRpdG9yLm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKCkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmZvY3VzZWRFbG1zICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgIGZvciAoY29uc3QgZWxtIG9mIHRoaXMuZm9jdXNlZEVsbXMpIHtcclxuICAgICAgICAgICAgZWxtLnRvZ2dsZUF0dHJpYnV0ZShcImN1cnNvck9uXCIsIGZhbHNlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNlbGVjdEN1cnNvckRpc3Bvc2FibGU/LmRpc3Bvc2UoKVxyXG4gICAgICB9KVxyXG4gICAgfVxyXG4gICAgLy8gZm9jdXMgb24gdGhlIGVkaXRvciBhZnRlciBmaW5kaW5nXHJcbiAgICBhdG9tLnZpZXdzLmdldFZpZXcoZWRpdG9yKS5mb2N1cygpXHJcbiAgfVxyXG59XHJcblxyXG4vKiogQ3JlYXRlIHRoZSBtYWluIG91dGxpbmUgbGlzdCAqL1xyXG5mdW5jdGlvbiBjcmVhdGVPdXRsaW5lTGlzdChcclxuICBvdXRsaW5lVHJlZTogT3V0bGluZVRyZWVbXSxcclxuICBlZGl0b3I6IFRleHRFZGl0b3IsXHJcbiAgaXNMYXJnZTogYm9vbGVhbixcclxuICBwb2ludFRvRWxlbWVudHNNYXA6IE1hcDxudW1iZXIsIEFycmF5PEhUTUxMSUVsZW1lbnQ+PlxyXG4pIHtcclxuICBjb25zdCBvdXRsaW5lTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKVxyXG4gIG91dGxpbmVMaXN0LmRhdGFzZXQuZWRpdG9yUm9vdFNjb3BlID0gZWRpdG9yLmdldFJvb3RTY29wZURlc2NyaXB0b3IoKS5nZXRTY29wZXNBcnJheSgpLmpvaW4oXCIgXCIpXHJcblxyXG4gIGNvbnN0IHRhYkxlbmd0aCA9IGVkaXRvci5nZXRUYWJMZW5ndGgoKVxyXG4gIGlmICh0eXBlb2YgdGFiTGVuZ3RoID09PSBcIm51bWJlclwiKSB7XHJcbiAgICBvdXRsaW5lTGlzdC5zdHlsZS5zZXRQcm9wZXJ0eShcIi0tZWRpdG9yLXRhYi1sZW5ndGhcIiwgTWF0aC5tYXgodGFiTGVuZ3RoIC8gMiwgMikudG9TdHJpbmcoMTApKVxyXG4gIH1cclxuICBhZGRPdXRsaW5lRW50cmllcyhcclxuICAgIG91dGxpbmVMaXN0LFxyXG4gICAgb3V0bGluZVRyZWUsXHJcbiAgICBlZGl0b3IsXHJcbiAgICAvKiBmb2xkSW5JdGlhbGx5ICovIGlzTGFyZ2UgfHwgKGF0b20uY29uZmlnLmdldChcImF0b20taWRlLW91dGxpbmUuZm9sZEluaXRpYWxseVwiKSBhcyBib29sZWFuKSxcclxuICAgIDBcclxuICApXHJcbiAgLy8gVElNRSAwLjItMC41bVxyXG4gIGFkZEVudHJpZXNPbkNsaWNrKG91dGxpbmVMaXN0LCBvdXRsaW5lVHJlZSwgZWRpdG9yLCBwb2ludFRvRWxlbWVudHNNYXAsIDApXHJcbiAgcmV0dXJuIG91dGxpbmVMaXN0XHJcbn1cclxuXHJcbi8qKiBDb21wYXJlcyB0aGUgY29udGVudCBvZiB0aGUgdHdvIGdpdmVuIHtPdXRsaW5lVHJlZVtdfSBJdCBvbmx5IGNvbXBhcmVzIHRoZSBjb250ZW50IHRoYXQgYWZmZWN0cyByZW5kZXJpbmcgKi9cclxuZnVuY3Rpb24gaGFzRXF1YWxDb250ZW50KG90MTogT3V0bGluZVRyZWVbXSwgb3QyOiBPdXRsaW5lVHJlZVtdKSB7XHJcbiAgLy8gc2ltcGxlIGNvbXBhcmVcclxuICBpZiAob3QxID09PSBvdDIpIHtcclxuICAgIHJldHVybiB0cnVlXHJcbiAgfSBlbHNlIHtcclxuICAgIC8vIGNvbXBhcmUgbGVuZ3RoXHJcbiAgICBjb25zdCBvdDFMZW4gPSBvdDEubGVuZ3RoXHJcbiAgICBjb25zdCBvdDJMZW4gPSBvdDIubGVuZ3RoXHJcbiAgICBpZiAob3QxTGVuICE9PSBvdDJMZW4pIHtcclxuICAgICAgcmV0dXJuIGZhbHNlXHJcbiAgICB9XHJcbiAgICAvLyBjb21wYXJlIHRoZSBjb250ZW50XHJcbiAgICBmb3IgKGxldCBpRW50cnkgPSAwOyBpRW50cnkgPCBvdDFMZW47IGlFbnRyeSsrKSB7XHJcbiAgICAgIGNvbnN0IGUxID0gb3QxW2lFbnRyeV1cclxuICAgICAgY29uc3QgZTIgPSBvdDJbaUVudHJ5XVxyXG4gICAgICBpZiAoXHJcbiAgICAgICAgZTEucmVwcmVzZW50YXRpdmVOYW1lICE9PSBlMi5yZXByZXNlbnRhdGl2ZU5hbWUgfHxcclxuICAgICAgICBlMS5wbGFpblRleHQgIT09IGUyLnBsYWluVGV4dCB8fFxyXG4gICAgICAgIGUxLmtpbmQgIT09IGUyLmtpbmQgfHxcclxuICAgICAgICBlMS5pY29uICE9PSBlMi5pY29uIHx8XHJcbiAgICAgICAgIWhhc0VxdWFsQ29udGVudChlMS5jaGlsZHJlbiwgZTIuY2hpbGRyZW4pXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiB0cnVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1ha2VPdXRsaW5lVG9vbGJhcigpIHtcclxuICBjb25zdCB0b29sYmFyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIilcclxuICB0b29sYmFyLmNsYXNzTmFtZSA9IFwib3V0bGluZS10b29sYmFyXCJcclxuXHJcbiAgY29uc3QgcmV2ZWFsQ3Vyc29yQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxyXG4gIHJldmVhbEN1cnNvckJ1dHRvbi5pbm5lckhUTUwgPSBcIlJldmVhbCBDdXJzb3JcIlxyXG4gIHJldmVhbEN1cnNvckJ1dHRvbi5jbGFzc05hbWUgPSBcImJ0biBvdXRsaW5lLWJ0blwiXHJcblxyXG4gIHJldmVhbEN1cnNvckJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKCkgPT5cclxuICAgIGF0b20uY29tbWFuZHMuZGlzcGF0Y2goYXRvbS52aWV3cy5nZXRWaWV3KGF0b20ud29ya3NwYWNlKSwgXCJvdXRsaW5lOnJldmVhbC1jdXJzb3JcIilcclxuICApXHJcblxyXG4gIHRvb2xiYXIuYXBwZW5kQ2hpbGQocmV2ZWFsQ3Vyc29yQnV0dG9uKVxyXG5cclxuICBjb25zdCBzaG93Q2FsbEhpZXJhcmNoeUJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIilcclxuICBzaG93Q2FsbEhpZXJhcmNoeUJ1dHRvbi5pbm5lckhUTUwgPSBcIlNob3cgQ2FsbCBIaWVyYXJjaHlcIlxyXG4gIHNob3dDYWxsSGllcmFyY2h5QnV0dG9uLmNsYXNzTmFtZSA9IFwiYnRuIG91dGxpbmUtYnRuXCJcclxuXHJcbiAgc2hvd0NhbGxIaWVyYXJjaHlCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+XHJcbiAgICBhdG9tLmNvbW1hbmRzLmRpc3BhdGNoKGF0b20udmlld3MuZ2V0VmlldyhhdG9tLndvcmtzcGFjZSksIFwib3V0bGluZTpzaG93LWNhbGwtaGllcmFyY2h5XCIpXHJcbiAgKVxyXG5cclxuICB0b29sYmFyLmFwcGVuZENoaWxkKHNob3dDYWxsSGllcmFyY2h5QnV0dG9uKVxyXG4gIHJldHVybiB0b29sYmFyXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUxhcmdlRmlsZUVsZW1lbnQoKSB7XHJcbiAgY29uc3QgbGFyZ2VGaWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIilcclxuICBsYXJnZUZpbGVFbGVtZW50LmlubmVySFRNTCA9IGA8c3BhbiBjbGFzcz1cImxhcmdlLWZpbGUtbW9kZVwiPkxhcmdlIGZpbGUgbW9kZTwvc3Bhbj5gXHJcbiAgcmV0dXJuIGxhcmdlRmlsZUVsZW1lbnRcclxufVxyXG5cclxuZnVuY3Rpb24gZ2VuZXJhdGVTdGF0dXNFbGVtZW50KHN0YXR1czogeyB0aXRsZTogc3RyaW5nOyBkZXNjcmlwdGlvbjogc3RyaW5nIH0pIHtcclxuICBjb25zdCBlbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gIGVsZW1lbnQuY2xhc3NOYW1lID0gXCJzdGF0dXNcIlxyXG5cclxuICBjb25zdCB7IHRpdGxlID0gXCJcIiwgZGVzY3JpcHRpb24gPSBcIlwiIH0gPSBzdGF0dXNcclxuICBlbGVtZW50LmlubmVySFRNTCA9IGA8aDE+JHt0aXRsZX08L2gxPlxyXG4gIDxzcGFuPiR7ZGVzY3JpcHRpb259PC9zcGFuPmBcclxuXHJcbiAgcmV0dXJuIGVsZW1lbnRcclxufVxyXG5cclxuZnVuY3Rpb24gaGFzQ2hpbGRyZW4oZW50cnk6IE91dGxpbmVUcmVlKSB7XHJcbiAgcmV0dXJuIGVudHJ5LmNoaWxkcmVuLmxlbmd0aCA+PSAxXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHNvcnRFbnRyaWVzKGVudHJpZXM6IE91dGxpbmVUcmVlW10pIHtcclxuICBpZiAoYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1pZGUtb3V0bGluZS5zb3J0RW50cmllc1wiKSBhcyBib29sZWFuKSB7XHJcbiAgICBlbnRyaWVzLnNvcnQoKGUxOiBPdXRsaW5lVHJlZSwgZTI6IE91dGxpbmVUcmVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHJvd0NvbXBhcmUgPSBlMS5zdGFydFBvc2l0aW9uLnJvdyAtIGUyLnN0YXJ0UG9zaXRpb24ucm93XHJcbiAgICAgIGlmIChyb3dDb21wYXJlID09PSAwKSB7XHJcbiAgICAgICAgLy8gY29tcGFyZSBiYXNlZCBvbiBjb2x1bW4gaWYgb24gdGhlIHNhbWUgcm93XHJcbiAgICAgICAgcmV0dXJuIGUxLnN0YXJ0UG9zaXRpb24uY29sdW1uIC0gZTEuc3RhcnRQb3NpdGlvbi5jb2x1bW5cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gcm93Q29tcGFyZVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGFkZE91dGxpbmVFbnRyaWVzKFxyXG4gIHBhcmVudDogSFRNTFVMaXN0RWxlbWVudCxcclxuICBlbnRyaWVzOiBPdXRsaW5lVHJlZVtdLFxyXG4gIGVkaXRvcjogVGV4dEVkaXRvcixcclxuICBpc0xhcmdlOiBib29sZWFuLFxyXG4gIGxldmVsOiBudW1iZXJcclxuKSB7XHJcbiAgLy8gTk9URTogdGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBlYWNoIHVwZGF0ZSBpbiBhbiBlZGl0b3IhXHJcbiAgLy8gYSBmZXcgb2YgdGhlIGNhbGxzIGlzIHNsb3cgfjEtMTAwbXNcclxuXHJcbiAgLy8gVElNRSAwLjFtc1xyXG4gIHNvcnRFbnRyaWVzKGVudHJpZXMpXHJcblxyXG4gIGZvciAoY29uc3QgaXRlbSBvZiBlbnRyaWVzKSB7XHJcbiAgICBjb25zdCBzeW1ib2wgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlcIilcclxuXHJcbiAgICAvLyBzeW1ib2wuc2V0QXR0cmlidXRlKFwibGV2ZWxcIiwgYCR7bGV2ZWx9YCk7IC8vIHN0b3JlIGxldmVsIGluIHRoZSBlbGVtZW50XHJcblxyXG4gICAgLy8gSG9sZCBhbiBlbnRyeSBpbiBhIGRlZGljYXRlZCBlbGVtZW50IHRvIHByZXZlbnQgaG92ZXIgY29uZmxpY3RzIC0gaG92ZXIgb3ZlciBhbiA8bGk+IHRhZyB3b3VsZCBiZSBjb3VnaHQgYnkgYSBwYXJlbnQgPGxpPlxyXG4gICAgLy8gVElNRTogfjAtMC4xbXNcclxuICAgIGNvbnN0IGxhYmVsRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpXHJcblxyXG4gICAgLy8gVE9ETyBzdXBwb3J0IGl0ZW0udG9rZW5pemVkVGV4dFxyXG4gICAgbGFiZWxFbGVtZW50LmlubmVyVGV4dCA9IGl0ZW0ucmVwcmVzZW50YXRpdmVOYW1lID8/IGl0ZW0ucGxhaW5UZXh0ID8/IFwiXCJcclxuXHJcbiAgICBsYWJlbEVsZW1lbnQucHJlcGVuZCgvKiBpY29uRWxlbWVudCAqLyBnZXRJY29uKGl0ZW0uaWNvbiwgaXRlbS5raW5kKSlcclxuXHJcbiAgICBzeW1ib2wuYXBwZW5kQ2hpbGQobGFiZWxFbGVtZW50KVxyXG5cclxuICAgIGlmIChoYXNDaGlsZHJlbihpdGVtKSkge1xyXG4gICAgICAvLyBjcmVhdGUgQ2hpbGQgZWxlbWVudHNcclxuICAgICAgLy8gVElNRSAwLTAuMm1zXHJcbiAgICAgIGNvbnN0IGNoaWxkcmVuTGlzdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJ1bFwiKVxyXG4gICAgICBjaGlsZHJlbkxpc3Quc3R5bGUuc2V0UHJvcGVydHkoXCItLWluZGVudC1sZXZlbFwiLCAobGV2ZWwgKyAxKS50b1N0cmluZygxMCkpXHJcbiAgICAgIGNoaWxkcmVuTGlzdC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgKGV2ZW50KSA9PiBldmVudC5zdG9wUHJvcGFnYXRpb24oKSwgeyBwYXNzaXZlOiB0cnVlIH0pXHJcbiAgICAgIHN5bWJvbC5hcHBlbmRDaGlsZChjaGlsZHJlbkxpc3QpXHJcblxyXG4gICAgICAvLyBmb2xkIEJ1dHRvblxyXG4gICAgICBjb25zdCBmb2xkQnV0dG9uID0gY3JlYXRlRm9sZEJ1dHRvbihjaGlsZHJlbkxpc3QsIGlzTGFyZ2UpXHJcbiAgICAgIGxhYmVsRWxlbWVudC5wcmVwZW5kKGZvbGRCdXR0b24pXHJcblxyXG4gICAgICAvLyBhZGQgY2hpbGRyZW4gdG8gb3V0bGluZVxyXG4gICAgICAvLyBUSU1FOiBsYXN0IG9uZSBvZiBlYWNoIGJhdGNoIGlzIHNsb3dlciAwLTIwbXNcclxuICAgICAgYWRkT3V0bGluZUVudHJpZXMoY2hpbGRyZW5MaXN0LCBpdGVtLmNoaWxkcmVuLCBlZGl0b3IsIGlzTGFyZ2UsIGxldmVsICsgMSlcclxuICAgIH1cclxuXHJcbiAgICAvLyBUSU1FOiA8MC4xbXNcclxuICAgIHBhcmVudC5hcHBlbmRDaGlsZChzeW1ib2wpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICogQWRkcyBvbkNsaWNrIHRvIHRoZSBvdXRsaW5lIGVudHJpZXMuXHJcbiAqXHJcbiAqIEBhdHRlbnRpb24gVGhlIGFzc3VtcHRpb24gYWJvdXQgdGhlIHR5cGUgb2YgRWxlbWVudHMgYXJlIGFkZGVkIHVzaW5nIGBhcyBIVE1MLi4uYC4gQWZ0ZXIgZWRpdGluZyBjb2RlLCBtYWtlIHN1cmUgdGhhdCB0aGUgdHlwZXMgYXJlIGNvcnJlY3RcclxuICovXHJcbmZ1bmN0aW9uIGFkZEVudHJpZXNPbkNsaWNrKFxyXG4gIHBhcmVudDogSFRNTFVMaXN0RWxlbWVudCxcclxuICBlbnRyaWVzOiBPdXRsaW5lVHJlZVtdLFxyXG4gIGVkaXRvcjogVGV4dEVkaXRvcixcclxuICBwb2ludFRvRWxlbWVudHNNYXA6IE1hcDxudW1iZXIsIEFycmF5PEhUTUxMSUVsZW1lbnQ+PixcclxuICBsZXZlbDogbnVtYmVyXHJcbikge1xyXG4gIGNvbnN0IGVudHJpZXNFbGVtZW50cyA9IHBhcmVudC5jaGlsZHJlblxyXG4gIGZvciAobGV0IGlFbnRyeSA9IDAsIGxlbiA9IGVudHJpZXMubGVuZ3RoOyBpRW50cnkgPCBsZW47IGlFbnRyeSsrKSB7XHJcbiAgICBjb25zdCBpdGVtID0gZW50cmllc1tpRW50cnldXHJcbiAgICBjb25zdCBlbGVtZW50ID0gZW50cmllc0VsZW1lbnRzW2lFbnRyeV0gYXMgSFRNTExJRWxlbWVudFxyXG5cclxuICAgIC8vIEN1cnNvciByZXBvc2l0aW9uIG9uIGNsaWNrXHJcbiAgICBlbGVtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiBvbkNsaWNrRW50cnkoaXRlbS5zdGFydFBvc2l0aW9uLCBlZGl0b3IpLCB7IHBhc3NpdmU6IHRydWUgfSlcclxuXHJcbiAgICAvLyB1cGRhdGUgdGhlIGNhY2hlIGZvciBzZWxlY3RBdEN1cnNvckxpbmVcclxuICAgIGFkZFRvUG9pbnRUb0VsZW1lbnRzTWFwKHBvaW50VG9FbGVtZW50c01hcCwgaXRlbS5zdGFydFBvc2l0aW9uLnJvdywgZWxlbWVudClcclxuXHJcbiAgICBpZiAoaGFzQ2hpbGRyZW4oaXRlbSkpIHtcclxuICAgICAgY29uc3QgY2hpbHJlblJvb3RFbGVtZW50ID0gZWxlbWVudC5sYXN0RWxlbWVudENoaWxkIGFzIEhUTUxVTGlzdEVsZW1lbnRcclxuICAgICAgYWRkRW50cmllc09uQ2xpY2soY2hpbHJlblJvb3RFbGVtZW50LCBpdGVtLmNoaWxkcmVuLCBlZGl0b3IsIHBvaW50VG9FbGVtZW50c01hcCwgbGV2ZWwgKyAxKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuLyoqIFVwZGF0ZSBzdGFydCBwb3NpdGlvbiA9PiBlbGVtZW50cyBtYXAgdXNlZCBpbiBgc2VsZWN0QXRDdXJzb3JMaW5lYCAqL1xyXG5mdW5jdGlvbiBhZGRUb1BvaW50VG9FbGVtZW50c01hcChcclxuICBwb2ludFRvRWxlbWVudHNNYXA6IE1hcDxudW1iZXIsIEFycmF5PEhUTUxMSUVsZW1lbnQ+PixcclxuICBwb2ludFN0YXJ0UG9zaXRpb25Sb3c6IG51bWJlcixcclxuICBlbGVtZW50OiBIVE1MTElFbGVtZW50XHJcbikge1xyXG4gIC8vIFRJTUU6IDAtMC4ybXNcclxuICBjb25zdCBlbG1zID0gcG9pbnRUb0VsZW1lbnRzTWFwLmdldChwb2ludFN0YXJ0UG9zaXRpb25Sb3cpXHJcbiAgaWYgKGVsbXMgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgZWxtcy5wdXNoKGVsZW1lbnQpXHJcbiAgICBwb2ludFRvRWxlbWVudHNNYXAuc2V0KHBvaW50U3RhcnRQb3NpdGlvblJvdywgZWxtcylcclxuICB9IGVsc2Uge1xyXG4gICAgcG9pbnRUb0VsZW1lbnRzTWFwLnNldChwb2ludFN0YXJ0UG9zaXRpb25Sb3csIFtlbGVtZW50XSlcclxuICB9XHJcbn1cclxuXHJcbmxldCBjbGlja2VkOiBib29sZWFuID0gZmFsc2UgLy8gSEFDSyB1c2VkIHRvIHByZXZlbnQgc2Nyb2xsaW5nIGluIHRoZSBvdXRsaW5lIGxpc3Qgd2hlbiBhbiBlbnRyeSBpcyBjbGlja2VkXHJcblxyXG5mdW5jdGlvbiBvbkNsaWNrRW50cnkoaXRlbVN0YXJ0UG9zaXRpb246IFBvaW50LCBlZGl0b3I6IFRleHRFZGl0b3IpIHtcclxuICAvLyBvbmx5IHVzZXMgYSByZWZlcmVuY2UgdG8gdGhlIGVkaXRvciBhbmQgdGhlIHBhbmUgYW5kIGNvcnN1ciBhcmUgY2FsY3VsYXRlZCBvbiB0aGUgZmx5XHJcbiAgY29uc3QgZWRpdG9yUGFuZSA9IGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKGVkaXRvcilcclxuICBpZiAoZWRpdG9yUGFuZSA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICByZXR1cm5cclxuICB9XHJcbiAgZWRpdG9yUGFuZS5hY3RpdmF0ZSgpXHJcblxyXG4gIGVkaXRvci5nZXRDdXJzb3JzKClbMF0uc2V0QnVmZmVyUG9zaXRpb24oaXRlbVN0YXJ0UG9zaXRpb24sIHtcclxuICAgIGF1dG9zY3JvbGw6IHRydWUsXHJcbiAgfSlcclxuICAvLyBIQUNLXHJcbiAgY2xpY2tlZCA9IHRydWVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9sZEJ1dHRvbihjaGlsZHJlbkxpc3Q6IEhUTUxVTGlzdEVsZW1lbnQsIGZvbGRJbml0aWFsbHk6IGJvb2xlYW4pIHtcclxuICAvLyBUSU1FOiB+MC4xLTAuNW1zXHJcbiAgLy8gZm9sZCBidXR0b25cclxuICBjb25zdCBmb2xkQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKVxyXG5cclxuICBpZiAoZm9sZEluaXRpYWxseSkge1xyXG4gICAgLy8gY29sbGFwc2UgaW4gbGFyZ2UgZmlsZXMgYnkgZGVmYXVsdFxyXG4gICAgY2hpbGRyZW5MaXN0LmhpZGRlbiA9IHRydWVcclxuICAgIGZvbGRCdXR0b24uY2xhc3NMaXN0LmFkZChcIm91dGxpbmUtZm9sZC1idG5cIiwgXCJjb2xsYXBzZWRcIilcclxuICB9IGVsc2Uge1xyXG4gICAgZm9sZEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwib3V0bGluZS1mb2xkLWJ0blwiLCBcImV4cGFuZGVkXCIpXHJcbiAgfVxyXG5cclxuICAvLyBmb2xkIGxpc3RlbmVyXHJcbiAgZm9sZEJ1dHRvbi5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgXCJjbGlja1wiLFxyXG4gICAgKGV2ZW50KSA9PiB7XHJcbiAgICAgIGNoaWxkcmVuTGlzdC5oaWRkZW4gPSAhY2hpbGRyZW5MaXN0LmhpZGRlblxyXG4gICAgICBpZiAoY2hpbGRyZW5MaXN0LmhpZGRlbikge1xyXG4gICAgICAgIGZvbGRCdXR0b24uY2xhc3NMaXN0LnJlbW92ZShcImV4cGFuZGVkXCIpXHJcbiAgICAgICAgZm9sZEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiY29sbGFwc2VkXCIpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9sZEJ1dHRvbi5jbGFzc0xpc3QucmVtb3ZlKFwiY29sbGFwc2VkXCIpXHJcbiAgICAgICAgZm9sZEJ1dHRvbi5jbGFzc0xpc3QuYWRkKFwiZXhwYW5kZWRcIilcclxuICAgICAgfVxyXG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKVxyXG4gICAgfSxcclxuICAgIHsgcGFzc2l2ZTogdHJ1ZSB9XHJcbiAgKVxyXG4gIHJldHVybiBmb2xkQnV0dG9uXHJcbn1cclxuIiwiaW1wb3J0IHsgRGlzcG9zYWJsZSwgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCJcbmltcG9ydCB7IFByb3ZpZGVyIGFzIFByb3ZpZGVyVHlwZXMsIEJ1c3lTaWduYWxQcm92aWRlciwgRmluZFJlZmVyZW5jZXNQcm92aWRlciB9IGZyb20gXCIuLi90eXBlcy1wYWNrYWdlcy9tYWluLmRcIlxuXG5leHBvcnQgY2xhc3MgUHJvdmlkZXJSZWdpc3RyeTxQcm92aWRlciBleHRlbmRzIEV4Y2x1ZGU8UHJvdmlkZXJUeXBlcywgQnVzeVNpZ25hbFByb3ZpZGVyIHwgRmluZFJlZmVyZW5jZXNQcm92aWRlcj4+IHtcbiAgcHJpdmF0ZSBwcm92aWRlcnM6IEFycmF5PFByb3ZpZGVyPlxuXG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMucHJvdmlkZXJzID0gW11cbiAgfVxuXG4gIGFkZFByb3ZpZGVyKHByb3ZpZGVyOiBQcm92aWRlcik6IERpc3Bvc2FibGUge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wcm92aWRlcnMuZmluZEluZGV4KChwKSA9PiBwcm92aWRlci5wcmlvcml0eSA+IHAucHJpb3JpdHkpXG4gICAgaWYgKGluZGV4ID09PSAtMSkge1xuICAgICAgdGhpcy5wcm92aWRlcnMucHVzaChwcm92aWRlcilcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5wcm92aWRlcnMuc3BsaWNlKGluZGV4LCAwLCBwcm92aWRlcilcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBEaXNwb3NhYmxlKCgpID0+IHtcbiAgICAgIHRoaXMucmVtb3ZlUHJvdmlkZXIocHJvdmlkZXIpXG4gICAgfSlcbiAgfVxuXG4gIHJlbW92ZVByb3ZpZGVyKHByb3ZpZGVyOiBQcm92aWRlcik6IHZvaWQge1xuICAgIGNvbnN0IGluZGV4ID0gdGhpcy5wcm92aWRlcnMuaW5kZXhPZihwcm92aWRlcilcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XG4gICAgICB0aGlzLnByb3ZpZGVycy5zcGxpY2UoaW5kZXgsIDEpXG4gICAgfVxuICB9XG5cbiAgLy8gVE9ETyBkZXByZWNhdGUgc2luY2UgdGhlcmUgY2FuIGJlIE4gcHJvdmlkZXJzLlxuICBnZXRQcm92aWRlckZvckVkaXRvcihlZGl0b3I6IFRleHRFZGl0b3IpOiBQcm92aWRlciB8IG51bGwge1xuICAgIGNvbnN0IGdyYW1tYXIgPSBlZGl0b3IuZ2V0R3JhbW1hcigpLnNjb3BlTmFtZVxuICAgIHJldHVybiB0aGlzLmZpbmRQcm92aWRlcihncmFtbWFyKVxuICB9XG5cbiAgLy8gVE9ETyBjcmVhdGUgYW4gb3JkZXJpbmcgb3IgcHJpb3JpdHkgYXdhcmUgdXRpbCB0byBwcmVmZXIgaW5zdGVhZC5cbiAgZ2V0QWxsUHJvdmlkZXJzRm9yRWRpdG9yKGVkaXRvcjogVGV4dEVkaXRvcik6IEl0ZXJhYmxlPFByb3ZpZGVyPiB7XG4gICAgY29uc3QgZ3JhbW1hciA9IGVkaXRvci5nZXRHcmFtbWFyKCkuc2NvcGVOYW1lXG4gICAgcmV0dXJuIHRoaXMuZmluZEFsbFByb3ZpZGVycyhncmFtbWFyKVxuICB9XG5cbiAgZmluZFByb3ZpZGVyKGdyYW1tYXI6IHN0cmluZyk6IFByb3ZpZGVyIHwgbnVsbCB7XG4gICAgZm9yIChjb25zdCBwcm92aWRlciBvZiB0aGlzLmZpbmRBbGxQcm92aWRlcnMoZ3JhbW1hcikpIHtcbiAgICAgIHJldHVybiBwcm92aWRlclxuICAgIH1cbiAgICByZXR1cm4gbnVsbFxuICB9XG5cbiAgLyoqIEl0ZXJhdGVzIG92ZXIgYWxsIHByb3ZpZGVycyBtYXRjaGluZyB0aGUgZ3JhbW1hciwgaW4gcHJpb3JpdHkgb3JkZXIuICovXG4gICpmaW5kQWxsUHJvdmlkZXJzKGdyYW1tYXI6IHN0cmluZyk6IEl0ZXJhYmxlPFByb3ZpZGVyPiB7XG4gICAgZm9yIChjb25zdCBwcm92aWRlciBvZiB0aGlzLnByb3ZpZGVycykge1xuICAgICAgaWYgKHByb3ZpZGVyLmdyYW1tYXJTY29wZXMgPT0gbnVsbCB8fCBwcm92aWRlci5ncmFtbWFyU2NvcGVzLmluZGV4T2YoZ3JhbW1hcikgIT09IC0xKSB7XG4gICAgICAgIHlpZWxkIHByb3ZpZGVyXG4gICAgICB9XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgeyBkaXJuYW1lIH0gZnJvbSBcInBhdGhcIlxuaW1wb3J0IHsgcHJvbWlzaWZ5IH0gZnJvbSBcInV0aWxcIlxuaW1wb3J0IHsgc3RhdCB9IGZyb20gXCJmc1wiXG5jb25zdCBzdGF0QXN5bmMgPSBwcm9taXNpZnkoc3RhdClcblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldEN3ZCh0YXJnZXQgPSBcIlwiKTogUHJvbWlzZTxzdHJpbmcgfCB1bmRlZmluZWQ+IHtcbiAgbGV0IGN3ZDogc3RyaW5nXG5cbiAgaWYgKHRhcmdldCkge1xuICAgIGN3ZCA9IHRhcmdldFxuICB9IGVsc2Uge1xuICAgIGNvbnN0IHByZXZpb3VzQWN0aXZlSXRlbSA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVBhbmVJdGVtKCkgYXMgeyBnZXRQYXRoPzogKCkgPT4gc3RyaW5nIH1cbiAgICBjd2QgPSBwcmV2aW91c0FjdGl2ZUl0ZW0/LmdldFBhdGg/LigpIGFzIHN0cmluZ1xuICAgIGlmIChjd2QpIHtcbiAgICAgIGNvbnN0IGRpciA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChjd2QpWzBdXG4gICAgICBpZiAoZGlyKSB7XG4gICAgICAgIC8vIFVzZSBwcm9qZWN0IHBhdGhzIHdoZW5ldmVyIHRoZXkgYXJlIGF2YWlsYWJsZSBieSBkZWZhdWx0LlxuICAgICAgICByZXR1cm4gZGlyXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgdHJ5IHtcbiAgICBpZiAoY3dkKSB7XG4gICAgICAvLyBPdGhlcndpc2UsIGlmIHRoZSBwYXRoIGV4aXN0cyBvbiB0aGUgbG9jYWwgZmlsZSBzeXN0ZW0sIHVzZSB0aGVcbiAgICAgIC8vIHBhdGggb3IgcGFyZW50IGRpcmVjdG9yeSBhcyBhcHByb3ByaWF0ZS5cbiAgICAgIGNvbnN0IHN0YXRzID0gYXdhaXQgc3RhdEFzeW5jKGN3ZClcbiAgICAgIGlmIChzdGF0cy5pc0RpcmVjdG9yeSgpKSB7XG4gICAgICAgIHJldHVybiBjd2RcbiAgICAgIH1cblxuICAgICAgY3dkID0gZGlybmFtZShjd2QpXG4gICAgICBjb25zdCBkaXJTdGF0cyA9IGF3YWl0IHN0YXRBc3luYyhjd2QpXG4gICAgICBpZiAoZGlyU3RhdHMuaXNEaXJlY3RvcnkoKSkge1xuICAgICAgICByZXR1cm4gY3dkXG4gICAgICB9XG4gICAgfVxuICB9IGNhdGNoIHtcbiAgICAvL2ZhaWwgc2lsZW50bHlcbiAgfVxuXG4gIGN3ZCA9IGF0b20ucHJvamVjdC5nZXRQYXRocygpWzBdXG4gIC8vIG5vIHByb2plY3QgcGF0aHNcbiAgcmV0dXJuIGN3ZFxufVxuIiwiaW1wb3J0IHsgVGV4dEVkaXRvciwgVGV4dEVkaXRvckNvbXBvbmVudCwgVGV4dEJ1ZmZlciwgUmFuZ2UsIFBvaW50IH0gZnJvbSBcImF0b21cIlxuaW1wb3J0IGludmFyaWFudCBmcm9tIFwiYXNzZXJ0XCJcblxuLyoqXG4gKiBGaW5kcyB0aGUgd29yZCBhdCB0aGUgcG9zaXRpb24uIFlvdSBjYW4gZWl0aGVyIHByb3ZpZGUgYSB3b3JkIHJlZ2V4IHlvdXJzZWxmLCBvciBoYXZlIEF0b20gdXNlIHRoZSB3b3JkIHJlZ2V4IGluXG4gKiBmb3JjZSBhdCB0aGUgc2NvcGVzIGF0IHRoYXQgcG9zaXRpb24sIGluIHdoaWNoIGNhc2UgaXQgdXNlcyB0aGUgb3B0aW9uYWwgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzLCBkZWZhdWx0IHRydWUuIChJXG4gKiBrbm93IHRoYXQncyBhIHdlaXJkIGRlZmF1bHQgYnV0IGl0IGZvbGxvd3MgQXRvbSdzIGNvbnZlbnRpb24uLi4pXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB3b3JkQXRQb3NpdGlvbihcbiAgZWRpdG9yOiBUZXh0RWRpdG9yLFxuICBwb3NpdGlvbjogUG9pbnQsXG4gIHdvcmRSZWdleD86IFJlZ0V4cCB8IHsgaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzOiBib29sZWFuIH1cbik6IHsgd29yZE1hdGNoOiBBcnJheTxzdHJpbmc+OyByYW5nZTogUmFuZ2UgfSB8IG51bGwge1xuICBsZXQgd29yZFJlZ2V4X1xuICBpZiAod29yZFJlZ2V4IGluc3RhbmNlb2YgUmVnRXhwKSB7XG4gICAgd29yZFJlZ2V4XyA9IHdvcmRSZWdleFxuICB9IGVsc2Uge1xuICAgIC8vIFdoYXQgaXMgdGhlIHdvcmQgcmVnZXggYXNzb2NpYXRlZCB3aXRoIHRoZSBwb3NpdGlvbj8gV2UnZCBsaWtlIHRvIHVzZVxuICAgIC8vIEN1cnNvci53b3JkUmVnRXhwLCBleGNlcHQgdGhhdCBmdW5jdGlvbiBnZXRzIHRoZSByZWdleCBhc3NvY2lhdGVkXG4gICAgLy8gd2l0aCB0aGUgZWRpdG9yJ3MgY3VycmVudCBjdXJzb3Igd2hpbGUgd2Ugd2FudCB0aGUgcmVnZXggYXNzb2NpYXRlZCB3aXRoXG4gICAgLy8gdGhlIHNwZWNpZmljIHBvc2l0aW9uLiBTbyB3ZSByZS1pbXBsZW1lbnQgaXQgb3Vyc2VsdmVzLi4uXG4gICAgLy8gQHRzLWlnbm9yZTogaHR0cHM6Ly9naXRodWIuY29tL2F0b20vYXRvbS9ibG9iL2FhM2MzNGJlZGIzNjFlMDlhNTA2OGRjZTk2MjBiNDYwYTIwY2EzZmIvc3JjL3RleHQtZWRpdG9yLmpzI0w1MDMyXG4gICAgY29uc3Qgbm9uV29yZENoYXJzOiBzdHJpbmcgPSBlZGl0b3IuZ2V0Tm9uV29yZENoYXJhY3RlcnMocG9zaXRpb24pXG4gICAgY29uc3QgZXNjYXBlZCA9IG5vbldvcmRDaGFycy5yZXBsYWNlKC9bLS9cXFxcXiQqKz8uKCl8W1xcXXt9XS9nLCBcIlxcXFwkJlwiKVxuICAgIC8vIFdlIGNvcGllZCB0aGlzIGVzY2FwaW5nIHJlZ2V4IGZyb20gQ3Vyc29yLndvcmRSZWdleHAsIHJhdGhlciB0aGFuXG4gICAgLy8gdXNpbmcgdGhlIGxpYnJhcnkgZnVuY3Rpb24gJ2VzY2FwZVN0cmluZ1JlZ0V4cCcuIFRoYXQncyBiZWNhdXNlIHRoZVxuICAgIC8vIGxpYnJhcnkgZnVuY3Rpb24gZG9lc24ndCBlc2NhcGUgdGhlIGh5cGhlbiBjaGFyYWN0ZXIgYW5kIHNvIGlzXG4gICAgLy8gdW5zdWl0YWJsZSBmb3IgdXNlIGluc2lkZSBhIHJhbmdlLlxuICAgIGxldCByID0gYF5bXFx0IF0qJHxbXlxcXFxzJHtlc2NhcGVkfV0rYFxuICAgIGlmICh3b3JkUmVnZXggPT0gbnVsbCB8fCB3b3JkUmVnZXguaW5jbHVkZU5vbldvcmRDaGFyYWN0ZXJzKSB7XG4gICAgICByICs9IGB8WyR7ZXNjYXBlZH1dK2BcbiAgICB9XG4gICAgd29yZFJlZ2V4XyA9IG5ldyBSZWdFeHAociwgXCJnXCIpXG4gIH1cbiAgcmV0dXJuIHdvcmRBdFBvc2l0aW9uRnJvbUJ1ZmZlcihlZGl0b3IuZ2V0QnVmZmVyKCksIHBvc2l0aW9uLCB3b3JkUmVnZXhfKVxufVxuXG4vKipcbiAqIEdldHMgdGhlIHRyaW1tZWQgcmFuZ2UgZnJvbSBhIGdpdmVuIHJhbmdlLCBpLmUuIG1vdmVzIHRoZSBzdGFydCBhbmQgZW5kIHBvaW50cyB0byB0aGUgZmlyc3QgYW5kIGxhc3Qgbm9uLXdoaXRlc3BhY2VcbiAqIGNoYXJhY3RlcnMgKG9yIHNwZWNpZmllZCByZWdleCkgd2l0aGluIHRoZSByYW5nZSByZXNwZWN0aXZlbHkuXG4gKlxuICogQHBhcmFtIGVkaXRvciBUaGUgZWRpdG9yIGNvbnRhaW5pbmcgdGhlIHJhbmdlXG4gKiBAcGFyYW0gcmFuZ2VUb1RyaW0gVGhlIHJhbmdlIHRvIHRyaW1cbiAqIEBwYXJhbSBzdG9wUmVnZXggU3RvcCB0cmltbWluZyB3aGVuIHRoZSBmaXJzdCBtYXRjaCBpcyBmb3VuZCBmb3IgdGhpcyByZWdleCwgZGVmYXVsdHMgdG8gZmlyc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyXG4gKiBAcmV0dXJucyBSYW5nZSB0aGUgdHJpbW1lZCByYW5nZVxuICovXG5leHBvcnQgZnVuY3Rpb24gdHJpbVJhbmdlKGVkaXRvcjogVGV4dEVkaXRvciwgcmFuZ2VUb1RyaW06IFJhbmdlLCBzdG9wUmVnZXg6IFJlZ0V4cCA9IC9cXFMvKTogUmFuZ2Uge1xuICBjb25zdCBidWZmZXIgPSBlZGl0b3IuZ2V0QnVmZmVyKClcbiAgbGV0IHsgc3RhcnQsIGVuZCB9ID0gcmFuZ2VUb1RyaW1cbiAgYnVmZmVyLnNjYW5JblJhbmdlKHN0b3BSZWdleCwgcmFuZ2VUb1RyaW0sICh7IHJhbmdlLCBzdG9wIH0pID0+IHtcbiAgICBzdGFydCA9IHJhbmdlLnN0YXJ0XG4gICAgc3RvcCgpXG4gIH0pXG4gIGJ1ZmZlci5iYWNrd2FyZHNTY2FuSW5SYW5nZShzdG9wUmVnZXgsIHJhbmdlVG9UcmltLCAoeyByYW5nZSwgc3RvcCB9KSA9PiB7XG4gICAgZW5kID0gcmFuZ2UuZW5kXG4gICAgc3RvcCgpXG4gIH0pXG4gIHJldHVybiBuZXcgUmFuZ2Uoc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gZ2V0U2luZ2xlV29yZEF0UG9zaXRpb24oZWRpdG9yOiBUZXh0RWRpdG9yLCBwb3NpdGlvbjogUG9pbnQpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgbWF0Y2ggPSB3b3JkQXRQb3NpdGlvbihlZGl0b3IsIHBvc2l0aW9uKVxuICAvLyBXZSBzaG91bGQgb25seSByZWNlaXZlIGEgc2luZ2xlIGlkZW50aWZpZXIgZnJvbSBhIHNpbmdsZSBwb2ludC5cbiAgaWYgKG1hdGNoID09IG51bGwgfHwgbWF0Y2gud29yZE1hdGNoLmxlbmd0aCAhPT0gMSkge1xuICAgIHJldHVybiBudWxsXG4gIH1cblxuICByZXR1cm4gbWF0Y2gud29yZE1hdGNoWzBdXG59XG5cbi8qKlxuICogR2V0cyB0aGUgd29yZCBiZWluZyByaWdodC1jbGlja2VkIG9uIGluIGEgTW91c2VFdmVudC4gQSBnb29kIHVzZSBjYXNlIGZvciB0aGlzIGlzIHBlcmZvcm1pbmcgYW4gYWN0aW9uIG9uIGEgd29yZCBmcm9tXG4gKiBhIGNvbnRleHQgbWVudS5cbiAqXG4gKiBAcGFyYW0gZWRpdG9yIFRoZSBlZGl0b3IgY29udGFpbmluZyB0aGUgd29yZCB3aGVyZSB0aGUgTW91c2VFdmVudCBvY2N1cnJlZCBmcm9tXG4gKiBAcGFyYW0gZXZlbnQgVGhlIE1vdXNlRXZlbnQgY29udGFpbmluZyB0aGUgc2NyZWVuIHBvc2l0aW9uIG9mIHRoZSBjbGlja1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0V29yZEZyb21Nb3VzZUV2ZW50KGVkaXRvcjogVGV4dEVkaXRvciwgZXZlbnQ6IE1vdXNlRXZlbnQpOiBzdHJpbmcgfCBudWxsIHtcbiAgLy8gV2UgY2FuJ3QgaW1tZWRpYXRlbHkgZ2V0IHRoZSBpZGVudGlmaWVyIHJpZ2h0LWNsaWNrZWQgb24gZnJvbVxuICAvLyB0aGUgTW91c2VFdmVudC4gVXNpbmcgaXRzIHRhcmdldCBlbGVtZW50IGNvbnRlbnQgd291bGQgd29yayBpblxuICAvLyBzb21lIGNhc2VzIGJ1dCB3b3VsZG4ndCB3b3JrIGlmIHRoZXJlIHdhcyBhZGRpdGlvbmFsIGNvbnRlbnRcbiAgLy8gaW4gdGhlIHNhbWUgZWxlbWVudCwgc3VjaCBhcyBpbiBhIGNvbW1lbnQuXG4gIC8vIEB0cy1pZ25vcmU6IGh0dHBzOi8vZ2l0aHViLmNvbS9hdG9tL2F0b20vYmxvYi9hYTNjMzRiZWRiMzYxZTA5YTUwNjhkY2U5NjIwYjQ2MGEyMGNhM2ZiL3NyYy90ZXh0LWVkaXRvci5qcyNMNTA3NVxuICBjb25zdCBjb21wb25lbnQ6IFRleHRFZGl0b3JDb21wb25lbnQgPSBlZGl0b3IuZ2V0RWxlbWVudCgpLmNvbXBvbmVudFxuICBpbnZhcmlhbnQoY29tcG9uZW50KVxuICAvLyBUaGlzIHNvbHV0aW9uIGRvZXNuJ3QgZmVlbCBpZGVhbCBidXQgaXQgaXMgdGhlIHdheSBoeXBlcmNsaWNrIGRvZXMgaXQuXG4gIGNvbnN0IHBvaW50ID0gY29tcG9uZW50LnNjcmVlblBvc2l0aW9uRm9yTW91c2VFdmVudChldmVudClcbiAgcmV0dXJuIGdldFNpbmdsZVdvcmRBdFBvc2l0aW9uKGVkaXRvciwgcG9pbnQpXG59XG5cbi8qKlxuICogQXR0ZW1wdHMgdG8gZ2V0IGEgd29yZCBmcm9tIHRoZSBsYXN0IHNlbGVjdGlvbiBvciBjdXJzb3IuIEEgZ29vZCB1c2UgY2FzZSBmb3IgdGhpcyBpcyBwZXJmb3JtaW5nIGFuIGFjdGlvbiBvbiBhblxuICogJ2FjdGl2ZScgd29yZCBhZnRlciBhIGNvbW1hbmQgaXMgdHJpZ2dlcmVkIHZpYSBhIGtleWJpbmRpbmcuXG4gKlxuICogQHBhcmFtIGVkaXRvciBUaGUgZWRpdG9yIGNvbnRhaW5pbmcgdGhlICdhY3RpdmUnIHdvcmQgd2hlbiB0aGUga2V5YmluZGluZyBpcyB0cmlnZ2VyZWRcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFdvcmRGcm9tQ3Vyc29yT3JTZWxlY3Rpb24oZWRpdG9yOiBUZXh0RWRpdG9yKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IHNlbGVjdGlvbiA9IGVkaXRvci5nZXRTZWxlY3RlZFRleHQoKVxuICBpZiAoc2VsZWN0aW9uICYmIHNlbGVjdGlvbi5sZW5ndGggPiAwKSB7XG4gICAgcmV0dXJuIHNlbGVjdGlvblxuICB9XG5cbiAgLy8gVGhlcmUgd2FzIG5vIHNlbGVjdGlvbiBzbyB3ZSBjYW4gZ28gYWhlYWQgYW5kIHRyeSB0aGUgY3Vyc29yIHBvc2l0aW9uLlxuICBjb25zdCBwb2ludCA9IGVkaXRvci5nZXRDdXJzb3JTY3JlZW5Qb3NpdGlvbigpXG4gIHJldHVybiBnZXRTaW5nbGVXb3JkQXRQb3NpdGlvbihlZGl0b3IsIHBvaW50KVxufVxuXG5leHBvcnQgZnVuY3Rpb24gd29yZEF0UG9zaXRpb25Gcm9tQnVmZmVyKFxuICBidWZmZXI6IFRleHRCdWZmZXIsXG4gIHBvc2l0aW9uOiBQb2ludCxcbiAgd29yZFJlZ2V4OiBSZWdFeHBcbik6IHsgd29yZE1hdGNoOiBBcnJheTxzdHJpbmc+OyByYW5nZTogUmFuZ2UgfSB8IG51bGwge1xuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwb3NpdGlvblxuICBjb25zdCByb3dSYW5nZSA9IGJ1ZmZlci5yYW5nZUZvclJvdyhyb3cpXG4gIGxldCBtYXRjaERhdGE6IHsgbWF0Y2g6IEFycmF5PHN0cmluZz47IHJhbmdlOiBSYW5nZSB9IHwgbnVsbFxuICAvLyBFeHRyYWN0IHRoZSBleHByZXNzaW9uIGZyb20gdGhlIHJvdyB0ZXh0LlxuICBidWZmZXIuc2NhbkluUmFuZ2Uod29yZFJlZ2V4LCByb3dSYW5nZSwgKGRhdGEpID0+IHtcbiAgICBjb25zdCB7IHJhbmdlIH0gPSBkYXRhXG4gICAgaWYgKHJhbmdlLnN0YXJ0LmlzTGVzc1RoYW5PckVxdWFsKHBvc2l0aW9uKSAmJiByYW5nZS5lbmQuaXNHcmVhdGVyVGhhbihwb3NpdGlvbikpIHtcbiAgICAgIG1hdGNoRGF0YSA9IGRhdGFcbiAgICB9XG4gICAgLy8gU3RvcCB0aGUgc2NhbiBpZiB0aGUgc2Nhbm5lciBoYXMgcGFzc2VkIG91ciBwb3NpdGlvbi5cbiAgICBpZiAocmFuZ2UuZW5kLmNvbHVtbiA+IGNvbHVtbikge1xuICAgICAgZGF0YS5zdG9wKClcbiAgICB9XG4gIH0pXG4gIC8vIEB0cy1pZ25vcmUgKGl0IGlzIGFzc2lnbmVkIGFib3ZlKVxuICBpZiAobWF0Y2hEYXRhKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIHdvcmRNYXRjaDogbWF0Y2hEYXRhLm1hdGNoLFxuICAgICAgcmFuZ2U6IG1hdGNoRGF0YS5yYW5nZSxcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG51bGxcbiAgfVxufVxuXG4vLyBNYXRjaGVzIGEgcmVnZXggb24gdGhlIHRleHQgb2YgdGhlIGxpbmUgZW5kaW5nIGF0IGVuZFBvc2l0aW9uLlxuLy8gcmVnZXggc2hvdWxkIGVuZCB3aXRoIGEgJyQnLlxuLy8gVXNlZnVsIGZvciBhdXRvY29tcGxldGUuXG5leHBvcnQgZnVuY3Rpb24gbWF0Y2hSZWdleEVuZGluZ0F0KGJ1ZmZlcjogVGV4dEJ1ZmZlciwgZW5kUG9zaXRpb246IFBvaW50LCByZWdleDogUmVnRXhwKTogc3RyaW5nIHwgbnVsbCB7XG4gIGNvbnN0IGxpbmUgPSBidWZmZXIuZ2V0VGV4dEluUmFuZ2UoW1tlbmRQb3NpdGlvbi5yb3csIDBdLCBlbmRQb3NpdGlvbl0pXG4gIGNvbnN0IG1hdGNoID0gcmVnZXguZXhlYyhsaW5lKVxuICByZXR1cm4gbWF0Y2ggPT0gbnVsbCA/IG51bGwgOiBtYXRjaFswXVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNQb3NpdGlvbkluUmFuZ2UocG9zaXRpb246IFBvaW50LCByYW5nZTogUmFuZ2UgfCBBcnJheTxSYW5nZT4pOiBib29sZWFuIHtcbiAgcmV0dXJuIEFycmF5LmlzQXJyYXkocmFuZ2UpID8gcmFuZ2Uuc29tZSgocikgPT4gci5jb250YWluc1BvaW50KHBvc2l0aW9uKSkgOiByYW5nZS5jb250YWluc1BvaW50KHBvc2l0aW9uKVxufVxuIiwiLyoqIFNob3cgYSBKYXZhU2NyaXB0IEVycm9yIGFzIGFuIGF0b20gbm90aWZpY2F0aW9ucyAqL1xuZXhwb3J0IGZ1bmN0aW9uIG5vdGlmeUVycm9yKGU6IEVycm9yKSB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihlLm5hbWUsIHtcbiAgICBzdGFjazogZS5zdGFjayxcbiAgICBkZXRhaWw6IGUubWVzc2FnZSxcbiAgfSlcbn1cbiIsImltcG9ydCB7IFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiXG5cbi8qKlxuICogRmluZCBpZiBhbiBlZGl0b3IncyBsYXJnZW5lc3MgYmFzZWQgb24gdGhlIGdpdmVuIHRocmVhc2hvbGRcbiAqXG4gKiBAcGFyYW0gZWRpdG9yXG4gKiBAcGFyYW0gbGFyZ2VMaW5lQ291bnQgTGluZUNvdW50SWZMYXJnZSB0aHJlYXNob2xkXG4gKiBAcGFyYW0gbG9uZ0xpbmVMZW5ndGggTGluZUxlbmd0aElmTG9uZyB0aHJlYXNob2xkXG4gKiBAcmV0dXJucyBUaGUgbGFyZ25lc3Mgc2NvcmUgaWYgZWRpdG9yIGlzIGxhcmdlLiBPdGhlcndpc2UgaXQgcmV0dXJucyAwIChhIHNtYWxsIGZpbGUpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBsYXJnZW5lc3MoXG4gIGVkaXRvcjogVGV4dEVkaXRvcixcbiAgbGFyZ2VMaW5lQ291bnQ6IG51bWJlciA9IGF0b20uY29uZmlnLmdldChcImF0b20taWRlLWJhc2UubGFyZ2VMaW5lQ291bnRcIikgfHwgNDAwMCxcbiAgbG9uZ0xpbmVMZW5ndGg6IG51bWJlciA9IGF0b20uY29uZmlnLmdldChcImF0b20taWRlLWJhc2UubG9uZ0xpbmVMZW5ndGhcIikgfHwgNDAwMFxuKSB7XG4gIGNvbnN0IGxpbmVDb3VudCA9IGxpbmVDb3VudElmTGFyZ2UoZWRpdG9yLCBsYXJnZUxpbmVDb3VudClcbiAgaWYgKGxpbmVDb3VudCAhPT0gMCkge1xuICAgIHJldHVybiBsaW5lQ291bnRcbiAgfVxuICBjb25zdCBsb25nTGluZSA9IGxpbmVMZW5ndGhJZkxvbmcoZWRpdG9yLCBsb25nTGluZUxlbmd0aClcbiAgaWYgKGxvbmdMaW5lICE9PSAwKSB7XG4gICAgcmV0dXJuIGxvbmdMaW5lXG4gIH1cbiAgcmV0dXJuIDAgLy8gc21hbGwgZmlsZVxufVxuXG4vKipcbiAqIEZpbmQgaWYgYW4gZWRpdG9yIGhhcyBhIGxpbmUgdGhhdCBpcyBsb25nZXIgdGhhbiB0aGUgZ2l2ZW4gdGhyZWFzaG9sZFxuICpcbiAqIEBwYXJhbSBlZGl0b3JcbiAqIEBwYXJhbSB0aHJlYXNob2xkIExhcmdlTGluZUNvdW50IHRocmVhc2hvbGRcbiAqIEByZXR1cm5zIFRoZSBsaW5lIGNvdW50IGlmIGl0IGlzIGxhcmdlciB0aGFuIHRocmVhc2hvbGQuIE90aGVyd2lzZSBpdCByZXR1cm5zIDAgKGEgc21hbGwgZmlsZSlcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGxpbmVDb3VudElmTGFyZ2UoZWRpdG9yOiBUZXh0RWRpdG9yLCB0aHJlYXNob2xkOiBudW1iZXIpIHtcbiAgLy8gQHRzLWlnbm9yZVxuICBpZiAoZWRpdG9yLmxhcmdlRmlsZU1vZGUpIHtcbiAgICByZXR1cm4gMTAwMDAwXG4gIH1cbiAgY29uc3QgbGluZUNvdW50ID0gZWRpdG9yLmdldExpbmVDb3VudCgpXG4gIGlmIChsaW5lQ291bnQgPj0gdGhyZWFzaG9sZCkge1xuICAgIHJldHVybiBsaW5lQ291bnRcbiAgfVxuICByZXR1cm4gMCAvLyBzbWFsbCBmaWxlXG59XG5cbi8qKlxuICogRmluZCBpZiBhbiBlZGl0b3IgaGFzIGEgbGluZSB0aGF0IGlzIGxvbmdlciB0aGFuIHRoZSBnaXZlbiB0aHJlYXNob2xkXG4gKlxuICogQHBhcmFtIGVkaXRvclxuICogQHBhcmFtIHRocmVhc2hvbGQgTGluZUxlbmd0aEZvclJvdyB0aHJlYXNob2xkXG4gKiBAcGFyYW0gbGluZUNvdW50IENvdW50IHVwIHRvIHRoaXMgbGluZS4gRGVmYXVsdCBpcyB7ZWRpdG9yLmdldExpbmVDb3VudCgpfVxuICogQHJldHVybnMgVGhlIGZpcnN0IGxpbmUgbGVuZ3RoIHRoYXQgaGFzIGEgbGVuZ3RoIGxhcmdlciB0aGFuIHRocmVhc2hvbGQuIElmIG5vIGxpbmUgaXMgZm91bmQsIGl0IHJldHVybnMgMFxuICovXG5leHBvcnQgZnVuY3Rpb24gbGluZUxlbmd0aElmTG9uZyhlZGl0b3I6IFRleHRFZGl0b3IsIHRocmVhc2hvbGQ6IG51bWJlciwgbGluZUNvdW50OiBudW1iZXIgPSBlZGl0b3IuZ2V0TGluZUNvdW50KCkpIHtcbiAgY29uc3QgYnVmZmVyID0gZWRpdG9yLmdldEJ1ZmZlcigpXG4gIGZvciAobGV0IGkgPSAwLCBsZW4gPSBsaW5lQ291bnQ7IGkgPCBsZW47IGkrKykge1xuICAgIGNvbnN0IGxpbmVMZW5ndGggPSBidWZmZXIubGluZUxlbmd0aEZvclJvdyhpKVxuICAgIGlmIChsaW5lTGVuZ3RoID4gdGhyZWFzaG9sZCkge1xuICAgICAgcmV0dXJuIGxpbmVMZW5ndGhcbiAgICB9XG4gIH1cbiAgcmV0dXJuIDAgLy8gc21hbGwgZmlsZVxufVxuIiwiZXhwb3J0ICogZnJvbSBcIi4vZ2V0Q3dkXCJcbmV4cG9ydCAqIGZyb20gXCIuL1Byb3ZpZGVyUmVnaXN0cnlcIlxuZXhwb3J0ICogZnJvbSBcIi4vcmFuZ2VcIlxuZXhwb3J0ICogZnJvbSBcIi4vZXJyb3JzXCJcbmV4cG9ydCAqIGZyb20gXCIuL2VkaXRvci1sYXJnZW5lc3NcIlxuIiwiZXhwb3J0IGNvbnN0IHN0YXR1c2VzID0ge1xyXG4gIG5vRWRpdG9yOiB7XHJcbiAgICB0aXRsZTogXCJPdXRsaW5lIGlzIHVuYXZhaWxhYmxlLlwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiT3BlbiBhIHRleHQgZWRpdG9yLlwiLFxyXG4gIH0sXHJcbiAgbm9Qcm92aWRlcjoge1xyXG4gICAgdGl0bGU6IFwiUHJvdmlkZXIgaXMgdW5hdmFpbGFibGVcIixcclxuICAgIGRlc2NyaXB0aW9uOlxyXG4gICAgICBcIkxvb2tzIGxpa2UgYSBwcm92aWRlciBmb3IgdGhpcyB0eXBlIG9mIGZpbGUgaXMgbm90IGF2YWlsYWJsZS4gQ2hlY2sgaWYgYSByZWxldmFudCBJREUgbGFuZ3VhZ2UgcGFja2FnZSBpcyBpbnN0YWxsZWQgYW5kIGhhcyBvdXRsaW5lIHN1cHBvcnQsIG9yIHRyeSBhZGRpbmcgb25lIGZyb20gQXRvbSdzIHBhY2thZ2UgcmVnaXN0cnkgKGUuZy46IGF0b20taWRlLWphdmFzY3JpcHQsIGF0b20tdHlwZXNjcmlwdCwgaWRlLXB5dGhvbiwgaWRlLXJ1c3QsIGlkZS1jc3MsIGlkZS1qc29uKS5cIixcclxuICB9LFxyXG4gIG5vUmVzdWx0OiB7XHJcbiAgICB0aXRsZTogXCJObyByZXN1bHQgd2FzIGZvdW5kLlwiLFxyXG4gICAgZGVzY3JpcHRpb246IFwiVGhlIE91dGxpbmUgY291bGQgbm90IGZvdW5kIHRoZSB0ZXh0IHlvdSBlbnRlcmVkIGluIHRoZSBmaWx0ZXIgYmFyLlwiLFxyXG4gIH0sXHJcbn1cclxuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyB0aGVcbiAqIFtsYW5ndWFnZSB0eXBlXShodHRwOi8vd3d3LmVjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtZWNtYXNjcmlwdC1sYW5ndWFnZS10eXBlcylcbiAqIG9mIGBPYmplY3RgLiAoZS5nLiBhcnJheXMsIGZ1bmN0aW9ucywgb2JqZWN0cywgcmVnZXhlcywgYG5ldyBOdW1iZXIoMClgLCBhbmQgYG5ldyBTdHJpbmcoJycpYClcbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDAuMS4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBhbiBvYmplY3QsIGVsc2UgYGZhbHNlYC5cbiAqIEBleGFtcGxlXG4gKlxuICogXy5pc09iamVjdCh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdChbMSwgMiwgM10pO1xuICogLy8gPT4gdHJ1ZVxuICpcbiAqIF8uaXNPYmplY3QoXy5ub29wKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0KG51bGwpO1xuICogLy8gPT4gZmFsc2VcbiAqL1xuZnVuY3Rpb24gaXNPYmplY3QodmFsdWUpIHtcbiAgdmFyIHR5cGUgPSB0eXBlb2YgdmFsdWU7XG4gIHJldHVybiB2YWx1ZSAhPSBudWxsICYmICh0eXBlID09ICdvYmplY3QnIHx8IHR5cGUgPT0gJ2Z1bmN0aW9uJyk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3Q7XG4iLCIvKiogRGV0ZWN0IGZyZWUgdmFyaWFibGUgYGdsb2JhbGAgZnJvbSBOb2RlLmpzLiAqL1xudmFyIGZyZWVHbG9iYWwgPSB0eXBlb2YgZ2xvYmFsID09ICdvYmplY3QnICYmIGdsb2JhbCAmJiBnbG9iYWwuT2JqZWN0ID09PSBPYmplY3QgJiYgZ2xvYmFsO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZyZWVHbG9iYWw7XG4iLCJ2YXIgZnJlZUdsb2JhbCA9IHJlcXVpcmUoJy4vX2ZyZWVHbG9iYWwnKTtcblxuLyoqIERldGVjdCBmcmVlIHZhcmlhYmxlIGBzZWxmYC4gKi9cbnZhciBmcmVlU2VsZiA9IHR5cGVvZiBzZWxmID09ICdvYmplY3QnICYmIHNlbGYgJiYgc2VsZi5PYmplY3QgPT09IE9iamVjdCAmJiBzZWxmO1xuXG4vKiogVXNlZCBhcyBhIHJlZmVyZW5jZSB0byB0aGUgZ2xvYmFsIG9iamVjdC4gKi9cbnZhciByb290ID0gZnJlZUdsb2JhbCB8fCBmcmVlU2VsZiB8fCBGdW5jdGlvbigncmV0dXJuIHRoaXMnKSgpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJvb3Q7XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqXG4gKiBHZXRzIHRoZSB0aW1lc3RhbXAgb2YgdGhlIG51bWJlciBvZiBtaWxsaXNlY29uZHMgdGhhdCBoYXZlIGVsYXBzZWQgc2luY2VcbiAqIHRoZSBVbml4IGVwb2NoICgxIEphbnVhcnkgMTk3MCAwMDowMDowMCBVVEMpLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgMi40LjBcbiAqIEBjYXRlZ29yeSBEYXRlXG4gKiBAcmV0dXJucyB7bnVtYmVyfSBSZXR1cm5zIHRoZSB0aW1lc3RhbXAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uZGVmZXIoZnVuY3Rpb24oc3RhbXApIHtcbiAqICAgY29uc29sZS5sb2coXy5ub3coKSAtIHN0YW1wKTtcbiAqIH0sIF8ubm93KCkpO1xuICogLy8gPT4gTG9ncyB0aGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyBpdCB0b29rIGZvciB0aGUgZGVmZXJyZWQgaW52b2NhdGlvbi5cbiAqL1xudmFyIG5vdyA9IGZ1bmN0aW9uKCkge1xuICByZXR1cm4gcm9vdC5EYXRlLm5vdygpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBub3c7XG4iLCIvKiogVXNlZCB0byBtYXRjaCBhIHNpbmdsZSB3aGl0ZXNwYWNlIGNoYXJhY3Rlci4gKi9cbnZhciByZVdoaXRlc3BhY2UgPSAvXFxzLztcblxuLyoqXG4gKiBVc2VkIGJ5IGBfLnRyaW1gIGFuZCBgXy50cmltRW5kYCB0byBnZXQgdGhlIGluZGV4IG9mIHRoZSBsYXN0IG5vbi13aGl0ZXNwYWNlXG4gKiBjaGFyYWN0ZXIgb2YgYHN0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmcgVGhlIHN0cmluZyB0byBpbnNwZWN0LlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgaW5kZXggb2YgdGhlIGxhc3Qgbm9uLXdoaXRlc3BhY2UgY2hhcmFjdGVyLlxuICovXG5mdW5jdGlvbiB0cmltbWVkRW5kSW5kZXgoc3RyaW5nKSB7XG4gIHZhciBpbmRleCA9IHN0cmluZy5sZW5ndGg7XG5cbiAgd2hpbGUgKGluZGV4LS0gJiYgcmVXaGl0ZXNwYWNlLnRlc3Qoc3RyaW5nLmNoYXJBdChpbmRleCkpKSB7fVxuICByZXR1cm4gaW5kZXg7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJpbW1lZEVuZEluZGV4O1xuIiwidmFyIHRyaW1tZWRFbmRJbmRleCA9IHJlcXVpcmUoJy4vX3RyaW1tZWRFbmRJbmRleCcpO1xuXG4vKiogVXNlZCB0byBtYXRjaCBsZWFkaW5nIHdoaXRlc3BhY2UuICovXG52YXIgcmVUcmltU3RhcnQgPSAvXlxccysvO1xuXG4vKipcbiAqIFRoZSBiYXNlIGltcGxlbWVudGF0aW9uIG9mIGBfLnRyaW1gLlxuICpcbiAqIEBwcml2YXRlXG4gKiBAcGFyYW0ge3N0cmluZ30gc3RyaW5nIFRoZSBzdHJpbmcgdG8gdHJpbS5cbiAqIEByZXR1cm5zIHtzdHJpbmd9IFJldHVybnMgdGhlIHRyaW1tZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBiYXNlVHJpbShzdHJpbmcpIHtcbiAgcmV0dXJuIHN0cmluZ1xuICAgID8gc3RyaW5nLnNsaWNlKDAsIHRyaW1tZWRFbmRJbmRleChzdHJpbmcpICsgMSkucmVwbGFjZShyZVRyaW1TdGFydCwgJycpXG4gICAgOiBzdHJpbmc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gYmFzZVRyaW07XG4iLCJ2YXIgcm9vdCA9IHJlcXVpcmUoJy4vX3Jvb3QnKTtcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgU3ltYm9sID0gcm9vdC5TeW1ib2w7XG5cbm1vZHVsZS5leHBvcnRzID0gU3ltYm9sO1xuIiwidmFyIFN5bWJvbCA9IHJlcXVpcmUoJy4vX1N5bWJvbCcpO1xuXG4vKiogVXNlZCBmb3IgYnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMuICovXG52YXIgb2JqZWN0UHJvdG8gPSBPYmplY3QucHJvdG90eXBlO1xuXG4vKiogVXNlZCB0byBjaGVjayBvYmplY3RzIGZvciBvd24gcHJvcGVydGllcy4gKi9cbnZhciBoYXNPd25Qcm9wZXJ0eSA9IG9iamVjdFByb3RvLmhhc093blByb3BlcnR5O1xuXG4vKipcbiAqIFVzZWQgdG8gcmVzb2x2ZSB0aGVcbiAqIFtgdG9TdHJpbmdUYWdgXShodHRwOi8vZWNtYS1pbnRlcm5hdGlvbmFsLm9yZy9lY21hLTI2Mi83LjAvI3NlYy1vYmplY3QucHJvdG90eXBlLnRvc3RyaW5nKVxuICogb2YgdmFsdWVzLlxuICovXG52YXIgbmF0aXZlT2JqZWN0VG9TdHJpbmcgPSBvYmplY3RQcm90by50b1N0cmluZztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogQSBzcGVjaWFsaXplZCB2ZXJzaW9uIG9mIGBiYXNlR2V0VGFnYCB3aGljaCBpZ25vcmVzIGBTeW1ib2wudG9TdHJpbmdUYWdgIHZhbHVlcy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSByYXcgYHRvU3RyaW5nVGFnYC5cbiAqL1xuZnVuY3Rpb24gZ2V0UmF3VGFnKHZhbHVlKSB7XG4gIHZhciBpc093biA9IGhhc093blByb3BlcnR5LmNhbGwodmFsdWUsIHN5bVRvU3RyaW5nVGFnKSxcbiAgICAgIHRhZyA9IHZhbHVlW3N5bVRvU3RyaW5nVGFnXTtcblxuICB0cnkge1xuICAgIHZhbHVlW3N5bVRvU3RyaW5nVGFnXSA9IHVuZGVmaW5lZDtcbiAgICB2YXIgdW5tYXNrZWQgPSB0cnVlO1xuICB9IGNhdGNoIChlKSB7fVxuXG4gIHZhciByZXN1bHQgPSBuYXRpdmVPYmplY3RUb1N0cmluZy5jYWxsKHZhbHVlKTtcbiAgaWYgKHVubWFza2VkKSB7XG4gICAgaWYgKGlzT3duKSB7XG4gICAgICB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ10gPSB0YWc7XG4gICAgfSBlbHNlIHtcbiAgICAgIGRlbGV0ZSB2YWx1ZVtzeW1Ub1N0cmluZ1RhZ107XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0UmF3VGFnO1xuIiwiLyoqIFVzZWQgZm9yIGJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzLiAqL1xudmFyIG9iamVjdFByb3RvID0gT2JqZWN0LnByb3RvdHlwZTtcblxuLyoqXG4gKiBVc2VkIHRvIHJlc29sdmUgdGhlXG4gKiBbYHRvU3RyaW5nVGFnYF0oaHR0cDovL2VjbWEtaW50ZXJuYXRpb25hbC5vcmcvZWNtYS0yNjIvNy4wLyNzZWMtb2JqZWN0LnByb3RvdHlwZS50b3N0cmluZylcbiAqIG9mIHZhbHVlcy5cbiAqL1xudmFyIG5hdGl2ZU9iamVjdFRvU3RyaW5nID0gb2JqZWN0UHJvdG8udG9TdHJpbmc7XG5cbi8qKlxuICogQ29udmVydHMgYHZhbHVlYCB0byBhIHN0cmluZyB1c2luZyBgT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZ2AuXG4gKlxuICogQHByaXZhdGVcbiAqIEBwYXJhbSB7Kn0gdmFsdWUgVGhlIHZhbHVlIHRvIGNvbnZlcnQuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBjb252ZXJ0ZWQgc3RyaW5nLlxuICovXG5mdW5jdGlvbiBvYmplY3RUb1N0cmluZyh2YWx1ZSkge1xuICByZXR1cm4gbmF0aXZlT2JqZWN0VG9TdHJpbmcuY2FsbCh2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gb2JqZWN0VG9TdHJpbmc7XG4iLCJ2YXIgU3ltYm9sID0gcmVxdWlyZSgnLi9fU3ltYm9sJyksXG4gICAgZ2V0UmF3VGFnID0gcmVxdWlyZSgnLi9fZ2V0UmF3VGFnJyksXG4gICAgb2JqZWN0VG9TdHJpbmcgPSByZXF1aXJlKCcuL19vYmplY3RUb1N0cmluZycpO1xuXG4vKiogYE9iamVjdCN0b1N0cmluZ2AgcmVzdWx0IHJlZmVyZW5jZXMuICovXG52YXIgbnVsbFRhZyA9ICdbb2JqZWN0IE51bGxdJyxcbiAgICB1bmRlZmluZWRUYWcgPSAnW29iamVjdCBVbmRlZmluZWRdJztcblxuLyoqIEJ1aWx0LWluIHZhbHVlIHJlZmVyZW5jZXMuICovXG52YXIgc3ltVG9TdHJpbmdUYWcgPSBTeW1ib2wgPyBTeW1ib2wudG9TdHJpbmdUYWcgOiB1bmRlZmluZWQ7XG5cbi8qKlxuICogVGhlIGJhc2UgaW1wbGVtZW50YXRpb24gb2YgYGdldFRhZ2Agd2l0aG91dCBmYWxsYmFja3MgZm9yIGJ1Z2d5IGVudmlyb25tZW50cy5cbiAqXG4gKiBAcHJpdmF0ZVxuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gcXVlcnkuXG4gKiBAcmV0dXJucyB7c3RyaW5nfSBSZXR1cm5zIHRoZSBgdG9TdHJpbmdUYWdgLlxuICovXG5mdW5jdGlvbiBiYXNlR2V0VGFnKHZhbHVlKSB7XG4gIGlmICh2YWx1ZSA9PSBudWxsKSB7XG4gICAgcmV0dXJuIHZhbHVlID09PSB1bmRlZmluZWQgPyB1bmRlZmluZWRUYWcgOiBudWxsVGFnO1xuICB9XG4gIHJldHVybiAoc3ltVG9TdHJpbmdUYWcgJiYgc3ltVG9TdHJpbmdUYWcgaW4gT2JqZWN0KHZhbHVlKSlcbiAgICA/IGdldFJhd1RhZyh2YWx1ZSlcbiAgICA6IG9iamVjdFRvU3RyaW5nKHZhbHVlKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBiYXNlR2V0VGFnO1xuIiwiLyoqXG4gKiBDaGVja3MgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZS4gQSB2YWx1ZSBpcyBvYmplY3QtbGlrZSBpZiBpdCdzIG5vdCBgbnVsbGBcbiAqIGFuZCBoYXMgYSBgdHlwZW9mYCByZXN1bHQgb2YgXCJvYmplY3RcIi5cbiAqXG4gKiBAc3RhdGljXG4gKiBAbWVtYmVyT2YgX1xuICogQHNpbmNlIDQuMC4wXG4gKiBAY2F0ZWdvcnkgTGFuZ1xuICogQHBhcmFtIHsqfSB2YWx1ZSBUaGUgdmFsdWUgdG8gY2hlY2suXG4gKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgYHZhbHVlYCBpcyBvYmplY3QtbGlrZSwgZWxzZSBgZmFsc2VgLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZSh7fSk7XG4gKiAvLyA9PiB0cnVlXG4gKlxuICogXy5pc09iamVjdExpa2UoWzEsIDIsIDNdKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShfLm5vb3ApO1xuICogLy8gPT4gZmFsc2VcbiAqXG4gKiBfLmlzT2JqZWN0TGlrZShudWxsKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzT2JqZWN0TGlrZSh2YWx1ZSkge1xuICByZXR1cm4gdmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgdmFsdWUgPT0gJ29iamVjdCc7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gaXNPYmplY3RMaWtlO1xuIiwidmFyIGJhc2VHZXRUYWcgPSByZXF1aXJlKCcuL19iYXNlR2V0VGFnJyksXG4gICAgaXNPYmplY3RMaWtlID0gcmVxdWlyZSgnLi9pc09iamVjdExpa2UnKTtcblxuLyoqIGBPYmplY3QjdG9TdHJpbmdgIHJlc3VsdCByZWZlcmVuY2VzLiAqL1xudmFyIHN5bWJvbFRhZyA9ICdbb2JqZWN0IFN5bWJvbF0nO1xuXG4vKipcbiAqIENoZWNrcyBpZiBgdmFsdWVgIGlzIGNsYXNzaWZpZWQgYXMgYSBgU3ltYm9sYCBwcmltaXRpdmUgb3Igb2JqZWN0LlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBjaGVjay5cbiAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiBgdmFsdWVgIGlzIGEgc3ltYm9sLCBlbHNlIGBmYWxzZWAuXG4gKiBAZXhhbXBsZVxuICpcbiAqIF8uaXNTeW1ib2woU3ltYm9sLml0ZXJhdG9yKTtcbiAqIC8vID0+IHRydWVcbiAqXG4gKiBfLmlzU3ltYm9sKCdhYmMnKTtcbiAqIC8vID0+IGZhbHNlXG4gKi9cbmZ1bmN0aW9uIGlzU3ltYm9sKHZhbHVlKSB7XG4gIHJldHVybiB0eXBlb2YgdmFsdWUgPT0gJ3N5bWJvbCcgfHxcbiAgICAoaXNPYmplY3RMaWtlKHZhbHVlKSAmJiBiYXNlR2V0VGFnKHZhbHVlKSA9PSBzeW1ib2xUYWcpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGlzU3ltYm9sO1xuIiwidmFyIGJhc2VUcmltID0gcmVxdWlyZSgnLi9fYmFzZVRyaW0nKSxcbiAgICBpc09iamVjdCA9IHJlcXVpcmUoJy4vaXNPYmplY3QnKSxcbiAgICBpc1N5bWJvbCA9IHJlcXVpcmUoJy4vaXNTeW1ib2wnKTtcblxuLyoqIFVzZWQgYXMgcmVmZXJlbmNlcyBmb3IgdmFyaW91cyBgTnVtYmVyYCBjb25zdGFudHMuICovXG52YXIgTkFOID0gMCAvIDA7XG5cbi8qKiBVc2VkIHRvIGRldGVjdCBiYWQgc2lnbmVkIGhleGFkZWNpbWFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JhZEhleCA9IC9eWy0rXTB4WzAtOWEtZl0rJC9pO1xuXG4vKiogVXNlZCB0byBkZXRlY3QgYmluYXJ5IHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc0JpbmFyeSA9IC9eMGJbMDFdKyQvaTtcblxuLyoqIFVzZWQgdG8gZGV0ZWN0IG9jdGFsIHN0cmluZyB2YWx1ZXMuICovXG52YXIgcmVJc09jdGFsID0gL14wb1swLTddKyQvaTtcblxuLyoqIEJ1aWx0LWluIG1ldGhvZCByZWZlcmVuY2VzIHdpdGhvdXQgYSBkZXBlbmRlbmN5IG9uIGByb290YC4gKi9cbnZhciBmcmVlUGFyc2VJbnQgPSBwYXJzZUludDtcblxuLyoqXG4gKiBDb252ZXJ0cyBgdmFsdWVgIHRvIGEgbnVtYmVyLlxuICpcbiAqIEBzdGF0aWNcbiAqIEBtZW1iZXJPZiBfXG4gKiBAc2luY2UgNC4wLjBcbiAqIEBjYXRlZ29yeSBMYW5nXG4gKiBAcGFyYW0geyp9IHZhbHVlIFRoZSB2YWx1ZSB0byBwcm9jZXNzLlxuICogQHJldHVybnMge251bWJlcn0gUmV0dXJucyB0aGUgbnVtYmVyLlxuICogQGV4YW1wbGVcbiAqXG4gKiBfLnRvTnVtYmVyKDMuMik7XG4gKiAvLyA9PiAzLjJcbiAqXG4gKiBfLnRvTnVtYmVyKE51bWJlci5NSU5fVkFMVUUpO1xuICogLy8gPT4gNWUtMzI0XG4gKlxuICogXy50b051bWJlcihJbmZpbml0eSk7XG4gKiAvLyA9PiBJbmZpbml0eVxuICpcbiAqIF8udG9OdW1iZXIoJzMuMicpO1xuICogLy8gPT4gMy4yXG4gKi9cbmZ1bmN0aW9uIHRvTnVtYmVyKHZhbHVlKSB7XG4gIGlmICh0eXBlb2YgdmFsdWUgPT0gJ251bWJlcicpIHtcbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cbiAgaWYgKGlzU3ltYm9sKHZhbHVlKSkge1xuICAgIHJldHVybiBOQU47XG4gIH1cbiAgaWYgKGlzT2JqZWN0KHZhbHVlKSkge1xuICAgIHZhciBvdGhlciA9IHR5cGVvZiB2YWx1ZS52YWx1ZU9mID09ICdmdW5jdGlvbicgPyB2YWx1ZS52YWx1ZU9mKCkgOiB2YWx1ZTtcbiAgICB2YWx1ZSA9IGlzT2JqZWN0KG90aGVyKSA/IChvdGhlciArICcnKSA6IG90aGVyO1xuICB9XG4gIGlmICh0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gdmFsdWUgPT09IDAgPyB2YWx1ZSA6ICt2YWx1ZTtcbiAgfVxuICB2YWx1ZSA9IGJhc2VUcmltKHZhbHVlKTtcbiAgdmFyIGlzQmluYXJ5ID0gcmVJc0JpbmFyeS50ZXN0KHZhbHVlKTtcbiAgcmV0dXJuIChpc0JpbmFyeSB8fCByZUlzT2N0YWwudGVzdCh2YWx1ZSkpXG4gICAgPyBmcmVlUGFyc2VJbnQodmFsdWUuc2xpY2UoMiksIGlzQmluYXJ5ID8gMiA6IDgpXG4gICAgOiAocmVJc0JhZEhleC50ZXN0KHZhbHVlKSA/IE5BTiA6ICt2YWx1ZSk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdG9OdW1iZXI7XG4iLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL2lzT2JqZWN0JyksXG4gICAgbm93ID0gcmVxdWlyZSgnLi9ub3cnKSxcbiAgICB0b051bWJlciA9IHJlcXVpcmUoJy4vdG9OdW1iZXInKTtcblxuLyoqIEVycm9yIG1lc3NhZ2UgY29uc3RhbnRzLiAqL1xudmFyIEZVTkNfRVJST1JfVEVYVCA9ICdFeHBlY3RlZCBhIGZ1bmN0aW9uJztcblxuLyogQnVpbHQtaW4gbWV0aG9kIHJlZmVyZW5jZXMgZm9yIHRob3NlIHdpdGggdGhlIHNhbWUgbmFtZSBhcyBvdGhlciBgbG9kYXNoYCBtZXRob2RzLiAqL1xudmFyIG5hdGl2ZU1heCA9IE1hdGgubWF4LFxuICAgIG5hdGl2ZU1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIENyZWF0ZXMgYSBkZWJvdW5jZWQgZnVuY3Rpb24gdGhhdCBkZWxheXMgaW52b2tpbmcgYGZ1bmNgIHVudGlsIGFmdGVyIGB3YWl0YFxuICogbWlsbGlzZWNvbmRzIGhhdmUgZWxhcHNlZCBzaW5jZSB0aGUgbGFzdCB0aW1lIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb24gd2FzXG4gKiBpbnZva2VkLiBUaGUgZGVib3VuY2VkIGZ1bmN0aW9uIGNvbWVzIHdpdGggYSBgY2FuY2VsYCBtZXRob2QgdG8gY2FuY2VsXG4gKiBkZWxheWVkIGBmdW5jYCBpbnZvY2F0aW9ucyBhbmQgYSBgZmx1c2hgIG1ldGhvZCB0byBpbW1lZGlhdGVseSBpbnZva2UgdGhlbS5cbiAqIFByb3ZpZGUgYG9wdGlvbnNgIHRvIGluZGljYXRlIHdoZXRoZXIgYGZ1bmNgIHNob3VsZCBiZSBpbnZva2VkIG9uIHRoZVxuICogbGVhZGluZyBhbmQvb3IgdHJhaWxpbmcgZWRnZSBvZiB0aGUgYHdhaXRgIHRpbWVvdXQuIFRoZSBgZnVuY2AgaXMgaW52b2tlZFxuICogd2l0aCB0aGUgbGFzdCBhcmd1bWVudHMgcHJvdmlkZWQgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbi4gU3Vic2VxdWVudFxuICogY2FsbHMgdG8gdGhlIGRlYm91bmNlZCBmdW5jdGlvbiByZXR1cm4gdGhlIHJlc3VsdCBvZiB0aGUgbGFzdCBgZnVuY2BcbiAqIGludm9jYXRpb24uXG4gKlxuICogKipOb3RlOioqIElmIGBsZWFkaW5nYCBhbmQgYHRyYWlsaW5nYCBvcHRpb25zIGFyZSBgdHJ1ZWAsIGBmdW5jYCBpc1xuICogaW52b2tlZCBvbiB0aGUgdHJhaWxpbmcgZWRnZSBvZiB0aGUgdGltZW91dCBvbmx5IGlmIHRoZSBkZWJvdW5jZWQgZnVuY3Rpb25cbiAqIGlzIGludm9rZWQgbW9yZSB0aGFuIG9uY2UgZHVyaW5nIHRoZSBgd2FpdGAgdGltZW91dC5cbiAqXG4gKiBJZiBgd2FpdGAgaXMgYDBgIGFuZCBgbGVhZGluZ2AgaXMgYGZhbHNlYCwgYGZ1bmNgIGludm9jYXRpb24gaXMgZGVmZXJyZWRcbiAqIHVudGlsIHRvIHRoZSBuZXh0IHRpY2ssIHNpbWlsYXIgdG8gYHNldFRpbWVvdXRgIHdpdGggYSB0aW1lb3V0IG9mIGAwYC5cbiAqXG4gKiBTZWUgW0RhdmlkIENvcmJhY2hvJ3MgYXJ0aWNsZV0oaHR0cHM6Ly9jc3MtdHJpY2tzLmNvbS9kZWJvdW5jaW5nLXRocm90dGxpbmctZXhwbGFpbmVkLWV4YW1wbGVzLylcbiAqIGZvciBkZXRhaWxzIG92ZXIgdGhlIGRpZmZlcmVuY2VzIGJldHdlZW4gYF8uZGVib3VuY2VgIGFuZCBgXy50aHJvdHRsZWAuXG4gKlxuICogQHN0YXRpY1xuICogQG1lbWJlck9mIF9cbiAqIEBzaW5jZSAwLjEuMFxuICogQGNhdGVnb3J5IEZ1bmN0aW9uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBmdW5jIFRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZS5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbd2FpdD0wXSBUaGUgbnVtYmVyIG9mIG1pbGxpc2Vjb25kcyB0byBkZWxheS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucz17fV0gVGhlIG9wdGlvbnMgb2JqZWN0LlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy5sZWFkaW5nPWZhbHNlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIGxlYWRpbmcgZWRnZSBvZiB0aGUgdGltZW91dC5cbiAqIEBwYXJhbSB7bnVtYmVyfSBbb3B0aW9ucy5tYXhXYWl0XVxuICogIFRoZSBtYXhpbXVtIHRpbWUgYGZ1bmNgIGlzIGFsbG93ZWQgdG8gYmUgZGVsYXllZCBiZWZvcmUgaXQncyBpbnZva2VkLlxuICogQHBhcmFtIHtib29sZWFufSBbb3B0aW9ucy50cmFpbGluZz10cnVlXVxuICogIFNwZWNpZnkgaW52b2tpbmcgb24gdGhlIHRyYWlsaW5nIGVkZ2Ugb2YgdGhlIHRpbWVvdXQuXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IFJldHVybnMgdGhlIG5ldyBkZWJvdW5jZWQgZnVuY3Rpb24uXG4gKiBAZXhhbXBsZVxuICpcbiAqIC8vIEF2b2lkIGNvc3RseSBjYWxjdWxhdGlvbnMgd2hpbGUgdGhlIHdpbmRvdyBzaXplIGlzIGluIGZsdXguXG4gKiBqUXVlcnkod2luZG93KS5vbigncmVzaXplJywgXy5kZWJvdW5jZShjYWxjdWxhdGVMYXlvdXQsIDE1MCkpO1xuICpcbiAqIC8vIEludm9rZSBgc2VuZE1haWxgIHdoZW4gY2xpY2tlZCwgZGVib3VuY2luZyBzdWJzZXF1ZW50IGNhbGxzLlxuICogalF1ZXJ5KGVsZW1lbnQpLm9uKCdjbGljaycsIF8uZGVib3VuY2Uoc2VuZE1haWwsIDMwMCwge1xuICogICAnbGVhZGluZyc6IHRydWUsXG4gKiAgICd0cmFpbGluZyc6IGZhbHNlXG4gKiB9KSk7XG4gKlxuICogLy8gRW5zdXJlIGBiYXRjaExvZ2AgaXMgaW52b2tlZCBvbmNlIGFmdGVyIDEgc2Vjb25kIG9mIGRlYm91bmNlZCBjYWxscy5cbiAqIHZhciBkZWJvdW5jZWQgPSBfLmRlYm91bmNlKGJhdGNoTG9nLCAyNTAsIHsgJ21heFdhaXQnOiAxMDAwIH0pO1xuICogdmFyIHNvdXJjZSA9IG5ldyBFdmVudFNvdXJjZSgnL3N0cmVhbScpO1xuICogalF1ZXJ5KHNvdXJjZSkub24oJ21lc3NhZ2UnLCBkZWJvdW5jZWQpO1xuICpcbiAqIC8vIENhbmNlbCB0aGUgdHJhaWxpbmcgZGVib3VuY2VkIGludm9jYXRpb24uXG4gKiBqUXVlcnkod2luZG93KS5vbigncG9wc3RhdGUnLCBkZWJvdW5jZWQuY2FuY2VsKTtcbiAqL1xuZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCwgb3B0aW9ucykge1xuICB2YXIgbGFzdEFyZ3MsXG4gICAgICBsYXN0VGhpcyxcbiAgICAgIG1heFdhaXQsXG4gICAgICByZXN1bHQsXG4gICAgICB0aW1lcklkLFxuICAgICAgbGFzdENhbGxUaW1lLFxuICAgICAgbGFzdEludm9rZVRpbWUgPSAwLFxuICAgICAgbGVhZGluZyA9IGZhbHNlLFxuICAgICAgbWF4aW5nID0gZmFsc2UsXG4gICAgICB0cmFpbGluZyA9IHRydWU7XG5cbiAgaWYgKHR5cGVvZiBmdW5jICE9ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKEZVTkNfRVJST1JfVEVYVCk7XG4gIH1cbiAgd2FpdCA9IHRvTnVtYmVyKHdhaXQpIHx8IDA7XG4gIGlmIChpc09iamVjdChvcHRpb25zKSkge1xuICAgIGxlYWRpbmcgPSAhIW9wdGlvbnMubGVhZGluZztcbiAgICBtYXhpbmcgPSAnbWF4V2FpdCcgaW4gb3B0aW9ucztcbiAgICBtYXhXYWl0ID0gbWF4aW5nID8gbmF0aXZlTWF4KHRvTnVtYmVyKG9wdGlvbnMubWF4V2FpdCkgfHwgMCwgd2FpdCkgOiBtYXhXYWl0O1xuICAgIHRyYWlsaW5nID0gJ3RyYWlsaW5nJyBpbiBvcHRpb25zID8gISFvcHRpb25zLnRyYWlsaW5nIDogdHJhaWxpbmc7XG4gIH1cblxuICBmdW5jdGlvbiBpbnZva2VGdW5jKHRpbWUpIHtcbiAgICB2YXIgYXJncyA9IGxhc3RBcmdzLFxuICAgICAgICB0aGlzQXJnID0gbGFzdFRoaXM7XG5cbiAgICBsYXN0QXJncyA9IGxhc3RUaGlzID0gdW5kZWZpbmVkO1xuICAgIGxhc3RJbnZva2VUaW1lID0gdGltZTtcbiAgICByZXN1bHQgPSBmdW5jLmFwcGx5KHRoaXNBcmcsIGFyZ3MpO1xuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cblxuICBmdW5jdGlvbiBsZWFkaW5nRWRnZSh0aW1lKSB7XG4gICAgLy8gUmVzZXQgYW55IGBtYXhXYWl0YCB0aW1lci5cbiAgICBsYXN0SW52b2tlVGltZSA9IHRpbWU7XG4gICAgLy8gU3RhcnQgdGhlIHRpbWVyIGZvciB0aGUgdHJhaWxpbmcgZWRnZS5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHdhaXQpO1xuICAgIC8vIEludm9rZSB0aGUgbGVhZGluZyBlZGdlLlxuICAgIHJldHVybiBsZWFkaW5nID8gaW52b2tlRnVuYyh0aW1lKSA6IHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlbWFpbmluZ1dhaXQodGltZSkge1xuICAgIHZhciB0aW1lU2luY2VMYXN0Q2FsbCA9IHRpbWUgLSBsYXN0Q2FsbFRpbWUsXG4gICAgICAgIHRpbWVTaW5jZUxhc3RJbnZva2UgPSB0aW1lIC0gbGFzdEludm9rZVRpbWUsXG4gICAgICAgIHRpbWVXYWl0aW5nID0gd2FpdCAtIHRpbWVTaW5jZUxhc3RDYWxsO1xuXG4gICAgcmV0dXJuIG1heGluZ1xuICAgICAgPyBuYXRpdmVNaW4odGltZVdhaXRpbmcsIG1heFdhaXQgLSB0aW1lU2luY2VMYXN0SW52b2tlKVxuICAgICAgOiB0aW1lV2FpdGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZEludm9rZSh0aW1lKSB7XG4gICAgdmFyIHRpbWVTaW5jZUxhc3RDYWxsID0gdGltZSAtIGxhc3RDYWxsVGltZSxcbiAgICAgICAgdGltZVNpbmNlTGFzdEludm9rZSA9IHRpbWUgLSBsYXN0SW52b2tlVGltZTtcblxuICAgIC8vIEVpdGhlciB0aGlzIGlzIHRoZSBmaXJzdCBjYWxsLCBhY3Rpdml0eSBoYXMgc3RvcHBlZCBhbmQgd2UncmUgYXQgdGhlXG4gICAgLy8gdHJhaWxpbmcgZWRnZSwgdGhlIHN5c3RlbSB0aW1lIGhhcyBnb25lIGJhY2t3YXJkcyBhbmQgd2UncmUgdHJlYXRpbmdcbiAgICAvLyBpdCBhcyB0aGUgdHJhaWxpbmcgZWRnZSwgb3Igd2UndmUgaGl0IHRoZSBgbWF4V2FpdGAgbGltaXQuXG4gICAgcmV0dXJuIChsYXN0Q2FsbFRpbWUgPT09IHVuZGVmaW5lZCB8fCAodGltZVNpbmNlTGFzdENhbGwgPj0gd2FpdCkgfHxcbiAgICAgICh0aW1lU2luY2VMYXN0Q2FsbCA8IDApIHx8IChtYXhpbmcgJiYgdGltZVNpbmNlTGFzdEludm9rZSA+PSBtYXhXYWl0KSk7XG4gIH1cblxuICBmdW5jdGlvbiB0aW1lckV4cGlyZWQoKSB7XG4gICAgdmFyIHRpbWUgPSBub3coKTtcbiAgICBpZiAoc2hvdWxkSW52b2tlKHRpbWUpKSB7XG4gICAgICByZXR1cm4gdHJhaWxpbmdFZGdlKHRpbWUpO1xuICAgIH1cbiAgICAvLyBSZXN0YXJ0IHRoZSB0aW1lci5cbiAgICB0aW1lcklkID0gc2V0VGltZW91dCh0aW1lckV4cGlyZWQsIHJlbWFpbmluZ1dhaXQodGltZSkpO1xuICB9XG5cbiAgZnVuY3Rpb24gdHJhaWxpbmdFZGdlKHRpbWUpIHtcbiAgICB0aW1lcklkID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gT25seSBpbnZva2UgaWYgd2UgaGF2ZSBgbGFzdEFyZ3NgIHdoaWNoIG1lYW5zIGBmdW5jYCBoYXMgYmVlblxuICAgIC8vIGRlYm91bmNlZCBhdCBsZWFzdCBvbmNlLlxuICAgIGlmICh0cmFpbGluZyAmJiBsYXN0QXJncykge1xuICAgICAgcmV0dXJuIGludm9rZUZ1bmModGltZSk7XG4gICAgfVxuICAgIGxhc3RBcmdzID0gbGFzdFRoaXMgPSB1bmRlZmluZWQ7XG4gICAgcmV0dXJuIHJlc3VsdDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGNhbmNlbCgpIHtcbiAgICBpZiAodGltZXJJZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgfVxuICAgIGxhc3RJbnZva2VUaW1lID0gMDtcbiAgICBsYXN0QXJncyA9IGxhc3RDYWxsVGltZSA9IGxhc3RUaGlzID0gdGltZXJJZCA9IHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZsdXNoKCkge1xuICAgIHJldHVybiB0aW1lcklkID09PSB1bmRlZmluZWQgPyByZXN1bHQgOiB0cmFpbGluZ0VkZ2Uobm93KCkpO1xuICB9XG5cbiAgZnVuY3Rpb24gZGVib3VuY2VkKCkge1xuICAgIHZhciB0aW1lID0gbm93KCksXG4gICAgICAgIGlzSW52b2tpbmcgPSBzaG91bGRJbnZva2UodGltZSk7XG5cbiAgICBsYXN0QXJncyA9IGFyZ3VtZW50cztcbiAgICBsYXN0VGhpcyA9IHRoaXM7XG4gICAgbGFzdENhbGxUaW1lID0gdGltZTtcblxuICAgIGlmIChpc0ludm9raW5nKSB7XG4gICAgICBpZiAodGltZXJJZCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHJldHVybiBsZWFkaW5nRWRnZShsYXN0Q2FsbFRpbWUpO1xuICAgICAgfVxuICAgICAgaWYgKG1heGluZykge1xuICAgICAgICAvLyBIYW5kbGUgaW52b2NhdGlvbnMgaW4gYSB0aWdodCBsb29wLlxuICAgICAgICBjbGVhclRpbWVvdXQodGltZXJJZCk7XG4gICAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgICAgIHJldHVybiBpbnZva2VGdW5jKGxhc3RDYWxsVGltZSk7XG4gICAgICB9XG4gICAgfVxuICAgIGlmICh0aW1lcklkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHRpbWVySWQgPSBzZXRUaW1lb3V0KHRpbWVyRXhwaXJlZCwgd2FpdCk7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG4gIH1cbiAgZGVib3VuY2VkLmNhbmNlbCA9IGNhbmNlbDtcbiAgZGVib3VuY2VkLmZsdXNoID0gZmx1c2g7XG4gIHJldHVybiBkZWJvdW5jZWQ7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZGVib3VuY2U7XG4iLCIvKiEgKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcclxuQ29weXJpZ2h0IChjKSBNaWNyb3NvZnQgQ29ycG9yYXRpb24uXHJcblxyXG5QZXJtaXNzaW9uIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBhbmQvb3IgZGlzdHJpYnV0ZSB0aGlzIHNvZnR3YXJlIGZvciBhbnlcclxucHVycG9zZSB3aXRoIG9yIHdpdGhvdXQgZmVlIGlzIGhlcmVieSBncmFudGVkLlxyXG5cclxuVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiBBTkQgVEhFIEFVVEhPUiBESVNDTEFJTVMgQUxMIFdBUlJBTlRJRVMgV0lUSFxyXG5SRUdBUkQgVE8gVEhJUyBTT0ZUV0FSRSBJTkNMVURJTkcgQUxMIElNUExJRUQgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFlcclxuQU5EIEZJVE5FU1MuIElOIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1IgQkUgTElBQkxFIEZPUiBBTlkgU1BFQ0lBTCwgRElSRUNULFxyXG5JTkRJUkVDVCwgT1IgQ09OU0VRVUVOVElBTCBEQU1BR0VTIE9SIEFOWSBEQU1BR0VTIFdIQVRTT0VWRVIgUkVTVUxUSU5HIEZST01cclxuTE9TUyBPRiBVU0UsIERBVEEgT1IgUFJPRklUUywgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIE5FR0xJR0VOQ0UgT1JcclxuT1RIRVIgVE9SVElPVVMgQUNUSU9OLCBBUklTSU5HIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFVTRSBPUlxyXG5QRVJGT1JNQU5DRSBPRiBUSElTIFNPRlRXQVJFLlxyXG4qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiAqL1xyXG4vKiBnbG9iYWwgUmVmbGVjdCwgUHJvbWlzZSAqL1xyXG5cclxudmFyIGV4dGVuZFN0YXRpY3MgPSBmdW5jdGlvbihkLCBiKSB7XHJcbiAgICBleHRlbmRTdGF0aWNzID0gT2JqZWN0LnNldFByb3RvdHlwZU9mIHx8XHJcbiAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxyXG4gICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChiLCBwKSkgZFtwXSA9IGJbcF07IH07XHJcbiAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcclxufTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2V4dGVuZHMoZCwgYikge1xyXG4gICAgaWYgKHR5cGVvZiBiICE9PSBcImZ1bmN0aW9uXCIgJiYgYiAhPT0gbnVsbClcclxuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2xhc3MgZXh0ZW5kcyB2YWx1ZSBcIiArIFN0cmluZyhiKSArIFwiIGlzIG5vdCBhIGNvbnN0cnVjdG9yIG9yIG51bGxcIik7XHJcbiAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xyXG4gICAgZnVuY3Rpb24gX18oKSB7IHRoaXMuY29uc3RydWN0b3IgPSBkOyB9XHJcbiAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XHJcbn1cclxuXHJcbmV4cG9ydCB2YXIgX19hc3NpZ24gPSBmdW5jdGlvbigpIHtcclxuICAgIF9fYXNzaWduID0gT2JqZWN0LmFzc2lnbiB8fCBmdW5jdGlvbiBfX2Fzc2lnbih0KSB7XHJcbiAgICAgICAgZm9yICh2YXIgcywgaSA9IDEsIG4gPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgbjsgaSsrKSB7XHJcbiAgICAgICAgICAgIHMgPSBhcmd1bWVudHNbaV07XHJcbiAgICAgICAgICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSkgdFtwXSA9IHNbcF07XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIF9fYXNzaWduLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3Jlc3QocywgZSkge1xyXG4gICAgdmFyIHQgPSB7fTtcclxuICAgIGZvciAodmFyIHAgaW4gcykgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzLCBwKSAmJiBlLmluZGV4T2YocCkgPCAwKVxyXG4gICAgICAgIHRbcF0gPSBzW3BdO1xyXG4gICAgaWYgKHMgIT0gbnVsbCAmJiB0eXBlb2YgT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyA9PT0gXCJmdW5jdGlvblwiKVxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBwID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhzKTsgaSA8IHAubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgaWYgKGUuaW5kZXhPZihwW2ldKSA8IDAgJiYgT2JqZWN0LnByb3RvdHlwZS5wcm9wZXJ0eUlzRW51bWVyYWJsZS5jYWxsKHMsIHBbaV0pKVxyXG4gICAgICAgICAgICAgICAgdFtwW2ldXSA9IHNbcFtpXV07XHJcbiAgICAgICAgfVxyXG4gICAgcmV0dXJuIHQ7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2RlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKSB7XHJcbiAgICB2YXIgYyA9IGFyZ3VtZW50cy5sZW5ndGgsIHIgPSBjIDwgMyA/IHRhcmdldCA6IGRlc2MgPT09IG51bGwgPyBkZXNjID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0YXJnZXQsIGtleSkgOiBkZXNjLCBkO1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0LmRlY29yYXRlID09PSBcImZ1bmN0aW9uXCIpIHIgPSBSZWZsZWN0LmRlY29yYXRlKGRlY29yYXRvcnMsIHRhcmdldCwga2V5LCBkZXNjKTtcclxuICAgIGVsc2UgZm9yICh2YXIgaSA9IGRlY29yYXRvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIGlmIChkID0gZGVjb3JhdG9yc1tpXSkgciA9IChjIDwgMyA/IGQocikgOiBjID4gMyA/IGQodGFyZ2V0LCBrZXksIHIpIDogZCh0YXJnZXQsIGtleSkpIHx8IHI7XHJcbiAgICByZXR1cm4gYyA+IDMgJiYgciAmJiBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHIpLCByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19wYXJhbShwYXJhbUluZGV4LCBkZWNvcmF0b3IpIHtcclxuICAgIHJldHVybiBmdW5jdGlvbiAodGFyZ2V0LCBrZXkpIHsgZGVjb3JhdG9yKHRhcmdldCwga2V5LCBwYXJhbUluZGV4KTsgfVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19tZXRhZGF0YShtZXRhZGF0YUtleSwgbWV0YWRhdGFWYWx1ZSkge1xyXG4gICAgaWYgKHR5cGVvZiBSZWZsZWN0ID09PSBcIm9iamVjdFwiICYmIHR5cGVvZiBSZWZsZWN0Lm1ldGFkYXRhID09PSBcImZ1bmN0aW9uXCIpIHJldHVybiBSZWZsZWN0Lm1ldGFkYXRhKG1ldGFkYXRhS2V5LCBtZXRhZGF0YVZhbHVlKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXdhaXRlcih0aGlzQXJnLCBfYXJndW1lbnRzLCBQLCBnZW5lcmF0b3IpIHtcclxuICAgIGZ1bmN0aW9uIGFkb3B0KHZhbHVlKSB7IHJldHVybiB2YWx1ZSBpbnN0YW5jZW9mIFAgPyB2YWx1ZSA6IG5ldyBQKGZ1bmN0aW9uIChyZXNvbHZlKSB7IHJlc29sdmUodmFsdWUpOyB9KTsgfVxyXG4gICAgcmV0dXJuIG5ldyAoUCB8fCAoUCA9IFByb21pc2UpKShmdW5jdGlvbiAocmVzb2x2ZSwgcmVqZWN0KSB7XHJcbiAgICAgICAgZnVuY3Rpb24gZnVsZmlsbGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yLm5leHQodmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHJlamVjdGVkKHZhbHVlKSB7IHRyeSB7IHN0ZXAoZ2VuZXJhdG9yW1widGhyb3dcIl0odmFsdWUpKTsgfSBjYXRjaCAoZSkgeyByZWplY3QoZSk7IH0gfVxyXG4gICAgICAgIGZ1bmN0aW9uIHN0ZXAocmVzdWx0KSB7IHJlc3VsdC5kb25lID8gcmVzb2x2ZShyZXN1bHQudmFsdWUpIDogYWRvcHQocmVzdWx0LnZhbHVlKS50aGVuKGZ1bGZpbGxlZCwgcmVqZWN0ZWQpOyB9XHJcbiAgICAgICAgc3RlcCgoZ2VuZXJhdG9yID0gZ2VuZXJhdG9yLmFwcGx5KHRoaXNBcmcsIF9hcmd1bWVudHMgfHwgW10pKS5uZXh0KCkpO1xyXG4gICAgfSk7XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2dlbmVyYXRvcih0aGlzQXJnLCBib2R5KSB7XHJcbiAgICB2YXIgXyA9IHsgbGFiZWw6IDAsIHNlbnQ6IGZ1bmN0aW9uKCkgeyBpZiAodFswXSAmIDEpIHRocm93IHRbMV07IHJldHVybiB0WzFdOyB9LCB0cnlzOiBbXSwgb3BzOiBbXSB9LCBmLCB5LCB0LCBnO1xyXG4gICAgcmV0dXJuIGcgPSB7IG5leHQ6IHZlcmIoMCksIFwidGhyb3dcIjogdmVyYigxKSwgXCJyZXR1cm5cIjogdmVyYigyKSB9LCB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgKGdbU3ltYm9sLml0ZXJhdG9yXSA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpczsgfSksIGc7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgcmV0dXJuIGZ1bmN0aW9uICh2KSB7IHJldHVybiBzdGVwKFtuLCB2XSk7IH07IH1cclxuICAgIGZ1bmN0aW9uIHN0ZXAob3ApIHtcclxuICAgICAgICBpZiAoZikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkdlbmVyYXRvciBpcyBhbHJlYWR5IGV4ZWN1dGluZy5cIik7XHJcbiAgICAgICAgd2hpbGUgKF8pIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChmID0gMSwgeSAmJiAodCA9IG9wWzBdICYgMiA/IHlbXCJyZXR1cm5cIl0gOiBvcFswXSA/IHlbXCJ0aHJvd1wiXSB8fCAoKHQgPSB5W1wicmV0dXJuXCJdKSAmJiB0LmNhbGwoeSksIDApIDogeS5uZXh0KSAmJiAhKHQgPSB0LmNhbGwoeSwgb3BbMV0pKS5kb25lKSByZXR1cm4gdDtcclxuICAgICAgICAgICAgaWYgKHkgPSAwLCB0KSBvcCA9IFtvcFswXSAmIDIsIHQudmFsdWVdO1xyXG4gICAgICAgICAgICBzd2l0Y2ggKG9wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDA6IGNhc2UgMTogdCA9IG9wOyBicmVhaztcclxuICAgICAgICAgICAgICAgIGNhc2UgNDogXy5sYWJlbCsrOyByZXR1cm4geyB2YWx1ZTogb3BbMV0sIGRvbmU6IGZhbHNlIH07XHJcbiAgICAgICAgICAgICAgICBjYXNlIDU6IF8ubGFiZWwrKzsgeSA9IG9wWzFdOyBvcCA9IFswXTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBjYXNlIDc6IG9wID0gXy5vcHMucG9wKCk7IF8udHJ5cy5wb3AoKTsgY29udGludWU7XHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICAgICAgICAgIGlmICghKHQgPSBfLnRyeXMsIHQgPSB0Lmxlbmd0aCA+IDAgJiYgdFt0Lmxlbmd0aCAtIDFdKSAmJiAob3BbMF0gPT09IDYgfHwgb3BbMF0gPT09IDIpKSB7IF8gPSAwOyBjb250aW51ZTsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmIChvcFswXSA9PT0gMyAmJiAoIXQgfHwgKG9wWzFdID4gdFswXSAmJiBvcFsxXSA8IHRbM10pKSkgeyBfLmxhYmVsID0gb3BbMV07IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG9wWzBdID09PSA2ICYmIF8ubGFiZWwgPCB0WzFdKSB7IF8ubGFiZWwgPSB0WzFdOyB0ID0gb3A7IGJyZWFrOyB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHQgJiYgXy5sYWJlbCA8IHRbMl0pIHsgXy5sYWJlbCA9IHRbMl07IF8ub3BzLnB1c2gob3ApOyBicmVhazsgfVxyXG4gICAgICAgICAgICAgICAgICAgIGlmICh0WzJdKSBfLm9wcy5wb3AoKTtcclxuICAgICAgICAgICAgICAgICAgICBfLnRyeXMucG9wKCk7IGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIG9wID0gYm9keS5jYWxsKHRoaXNBcmcsIF8pO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHsgb3AgPSBbNiwgZV07IHkgPSAwOyB9IGZpbmFsbHkgeyBmID0gdCA9IDA7IH1cclxuICAgICAgICBpZiAob3BbMF0gJiA1KSB0aHJvdyBvcFsxXTsgcmV0dXJuIHsgdmFsdWU6IG9wWzBdID8gb3BbMV0gOiB2b2lkIDAsIGRvbmU6IHRydWUgfTtcclxuICAgIH1cclxufVxyXG5cclxuZXhwb3J0IHZhciBfX2NyZWF0ZUJpbmRpbmcgPSBPYmplY3QuY3JlYXRlID8gKGZ1bmN0aW9uKG8sIG0sIGssIGsyKSB7XHJcbiAgICBpZiAoazIgPT09IHVuZGVmaW5lZCkgazIgPSBrO1xyXG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG8sIGsyLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZnVuY3Rpb24oKSB7IHJldHVybiBtW2tdOyB9IH0pO1xyXG59KSA6IChmdW5jdGlvbihvLCBtLCBrLCBrMikge1xyXG4gICAgaWYgKGsyID09PSB1bmRlZmluZWQpIGsyID0gaztcclxuICAgIG9bazJdID0gbVtrXTtcclxufSk7XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19leHBvcnRTdGFyKG0sIG8pIHtcclxuICAgIGZvciAodmFyIHAgaW4gbSkgaWYgKHAgIT09IFwiZGVmYXVsdFwiICYmICFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwobywgcCkpIF9fY3JlYXRlQmluZGluZyhvLCBtLCBwKTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fdmFsdWVzKG8pIHtcclxuICAgIHZhciBzID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIFN5bWJvbC5pdGVyYXRvciwgbSA9IHMgJiYgb1tzXSwgaSA9IDA7XHJcbiAgICBpZiAobSkgcmV0dXJuIG0uY2FsbChvKTtcclxuICAgIGlmIChvICYmIHR5cGVvZiBvLmxlbmd0aCA9PT0gXCJudW1iZXJcIikgcmV0dXJuIHtcclxuICAgICAgICBuZXh0OiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIGlmIChvICYmIGkgPj0gby5sZW5ndGgpIG8gPSB2b2lkIDA7XHJcbiAgICAgICAgICAgIHJldHVybiB7IHZhbHVlOiBvICYmIG9baSsrXSwgZG9uZTogIW8gfTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihzID8gXCJPYmplY3QgaXMgbm90IGl0ZXJhYmxlLlwiIDogXCJTeW1ib2wuaXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19yZWFkKG8sIG4pIHtcclxuICAgIHZhciBtID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9bU3ltYm9sLml0ZXJhdG9yXTtcclxuICAgIGlmICghbSkgcmV0dXJuIG87XHJcbiAgICB2YXIgaSA9IG0uY2FsbChvKSwgciwgYXIgPSBbXSwgZTtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgd2hpbGUgKChuID09PSB2b2lkIDAgfHwgbi0tID4gMCkgJiYgIShyID0gaS5uZXh0KCkpLmRvbmUpIGFyLnB1c2goci52YWx1ZSk7XHJcbiAgICB9XHJcbiAgICBjYXRjaCAoZXJyb3IpIHsgZSA9IHsgZXJyb3I6IGVycm9yIH07IH1cclxuICAgIGZpbmFsbHkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICAgIGlmIChyICYmICFyLmRvbmUgJiYgKG0gPSBpW1wicmV0dXJuXCJdKSkgbS5jYWxsKGkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmaW5hbGx5IHsgaWYgKGUpIHRocm93IGUuZXJyb3I7IH1cclxuICAgIH1cclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZCgpIHtcclxuICAgIGZvciAodmFyIGFyID0gW10sIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKVxyXG4gICAgICAgIGFyID0gYXIuY29uY2F0KF9fcmVhZChhcmd1bWVudHNbaV0pKTtcclxuICAgIHJldHVybiBhcjtcclxufVxyXG5cclxuLyoqIEBkZXByZWNhdGVkICovXHJcbmV4cG9ydCBmdW5jdGlvbiBfX3NwcmVhZEFycmF5cygpIHtcclxuICAgIGZvciAodmFyIHMgPSAwLCBpID0gMCwgaWwgPSBhcmd1bWVudHMubGVuZ3RoOyBpIDwgaWw7IGkrKykgcyArPSBhcmd1bWVudHNbaV0ubGVuZ3RoO1xyXG4gICAgZm9yICh2YXIgciA9IEFycmF5KHMpLCBrID0gMCwgaSA9IDA7IGkgPCBpbDsgaSsrKVxyXG4gICAgICAgIGZvciAodmFyIGEgPSBhcmd1bWVudHNbaV0sIGogPSAwLCBqbCA9IGEubGVuZ3RoOyBqIDwgamw7IGorKywgaysrKVxyXG4gICAgICAgICAgICByW2tdID0gYVtqXTtcclxuICAgIHJldHVybiByO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19zcHJlYWRBcnJheSh0bywgZnJvbSwgcGFjaykge1xyXG4gICAgaWYgKHBhY2sgfHwgYXJndW1lbnRzLmxlbmd0aCA9PT0gMikgZm9yICh2YXIgaSA9IDAsIGwgPSBmcm9tLmxlbmd0aCwgYXI7IGkgPCBsOyBpKyspIHtcclxuICAgICAgICBpZiAoYXIgfHwgIShpIGluIGZyb20pKSB7XHJcbiAgICAgICAgICAgIGlmICghYXIpIGFyID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoZnJvbSwgMCwgaSk7XHJcbiAgICAgICAgICAgIGFyW2ldID0gZnJvbVtpXTtcclxuICAgICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG8uY29uY2F0KGFyIHx8IGZyb20pO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19hd2FpdCh2KSB7XHJcbiAgICByZXR1cm4gdGhpcyBpbnN0YW5jZW9mIF9fYXdhaXQgPyAodGhpcy52ID0gdiwgdGhpcykgOiBuZXcgX19hd2FpdCh2KTtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNHZW5lcmF0b3IodGhpc0FyZywgX2FyZ3VtZW50cywgZ2VuZXJhdG9yKSB7XHJcbiAgICBpZiAoIVN5bWJvbC5hc3luY0l0ZXJhdG9yKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3ltYm9sLmFzeW5jSXRlcmF0b3IgaXMgbm90IGRlZmluZWQuXCIpO1xyXG4gICAgdmFyIGcgPSBnZW5lcmF0b3IuYXBwbHkodGhpc0FyZywgX2FyZ3VtZW50cyB8fCBbXSksIGksIHEgPSBbXTtcclxuICAgIHJldHVybiBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobikgeyBpZiAoZ1tuXSkgaVtuXSA9IGZ1bmN0aW9uICh2KSB7IHJldHVybiBuZXcgUHJvbWlzZShmdW5jdGlvbiAoYSwgYikgeyBxLnB1c2goW24sIHYsIGEsIGJdKSA+IDEgfHwgcmVzdW1lKG4sIHYpOyB9KTsgfTsgfVxyXG4gICAgZnVuY3Rpb24gcmVzdW1lKG4sIHYpIHsgdHJ5IHsgc3RlcChnW25dKHYpKTsgfSBjYXRjaCAoZSkgeyBzZXR0bGUocVswXVszXSwgZSk7IH0gfVxyXG4gICAgZnVuY3Rpb24gc3RlcChyKSB7IHIudmFsdWUgaW5zdGFuY2VvZiBfX2F3YWl0ID8gUHJvbWlzZS5yZXNvbHZlKHIudmFsdWUudikudGhlbihmdWxmaWxsLCByZWplY3QpIDogc2V0dGxlKHFbMF1bMl0sIHIpOyB9XHJcbiAgICBmdW5jdGlvbiBmdWxmaWxsKHZhbHVlKSB7IHJlc3VtZShcIm5leHRcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiByZWplY3QodmFsdWUpIHsgcmVzdW1lKFwidGhyb3dcIiwgdmFsdWUpOyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUoZiwgdikgeyBpZiAoZih2KSwgcS5zaGlmdCgpLCBxLmxlbmd0aCkgcmVzdW1lKHFbMF1bMF0sIHFbMF1bMV0pOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2FzeW5jRGVsZWdhdG9yKG8pIHtcclxuICAgIHZhciBpLCBwO1xyXG4gICAgcmV0dXJuIGkgPSB7fSwgdmVyYihcIm5leHRcIiksIHZlcmIoXCJ0aHJvd1wiLCBmdW5jdGlvbiAoZSkgeyB0aHJvdyBlOyB9KSwgdmVyYihcInJldHVyblwiKSwgaVtTeW1ib2wuaXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaTtcclxuICAgIGZ1bmN0aW9uIHZlcmIobiwgZikgeyBpW25dID0gb1tuXSA/IGZ1bmN0aW9uICh2KSB7IHJldHVybiAocCA9ICFwKSA/IHsgdmFsdWU6IF9fYXdhaXQob1tuXSh2KSksIGRvbmU6IG4gPT09IFwicmV0dXJuXCIgfSA6IGYgPyBmKHYpIDogdjsgfSA6IGY7IH1cclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9fYXN5bmNWYWx1ZXMobykge1xyXG4gICAgaWYgKCFTeW1ib2wuYXN5bmNJdGVyYXRvcikgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN5bWJvbC5hc3luY0l0ZXJhdG9yIGlzIG5vdCBkZWZpbmVkLlwiKTtcclxuICAgIHZhciBtID0gb1tTeW1ib2wuYXN5bmNJdGVyYXRvcl0sIGk7XHJcbiAgICByZXR1cm4gbSA/IG0uY2FsbChvKSA6IChvID0gdHlwZW9mIF9fdmFsdWVzID09PSBcImZ1bmN0aW9uXCIgPyBfX3ZhbHVlcyhvKSA6IG9bU3ltYm9sLml0ZXJhdG9yXSgpLCBpID0ge30sIHZlcmIoXCJuZXh0XCIpLCB2ZXJiKFwidGhyb3dcIiksIHZlcmIoXCJyZXR1cm5cIiksIGlbU3ltYm9sLmFzeW5jSXRlcmF0b3JdID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gdGhpczsgfSwgaSk7XHJcbiAgICBmdW5jdGlvbiB2ZXJiKG4pIHsgaVtuXSA9IG9bbl0gJiYgZnVuY3Rpb24gKHYpIHsgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHsgdiA9IG9bbl0odiksIHNldHRsZShyZXNvbHZlLCByZWplY3QsIHYuZG9uZSwgdi52YWx1ZSk7IH0pOyB9OyB9XHJcbiAgICBmdW5jdGlvbiBzZXR0bGUocmVzb2x2ZSwgcmVqZWN0LCBkLCB2KSB7IFByb21pc2UucmVzb2x2ZSh2KS50aGVuKGZ1bmN0aW9uKHYpIHsgcmVzb2x2ZSh7IHZhbHVlOiB2LCBkb25lOiBkIH0pOyB9LCByZWplY3QpOyB9XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX21ha2VUZW1wbGF0ZU9iamVjdChjb29rZWQsIHJhdykge1xyXG4gICAgaWYgKE9iamVjdC5kZWZpbmVQcm9wZXJ0eSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkoY29va2VkLCBcInJhd1wiLCB7IHZhbHVlOiByYXcgfSk7IH0gZWxzZSB7IGNvb2tlZC5yYXcgPSByYXc7IH1cclxuICAgIHJldHVybiBjb29rZWQ7XHJcbn07XHJcblxyXG52YXIgX19zZXRNb2R1bGVEZWZhdWx0ID0gT2JqZWN0LmNyZWF0ZSA/IChmdW5jdGlvbihvLCB2KSB7XHJcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkobywgXCJkZWZhdWx0XCIsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHYgfSk7XHJcbn0pIDogZnVuY3Rpb24obywgdikge1xyXG4gICAgb1tcImRlZmF1bHRcIl0gPSB2O1xyXG59O1xyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0U3Rhcihtb2QpIHtcclxuICAgIGlmIChtb2QgJiYgbW9kLl9fZXNNb2R1bGUpIHJldHVybiBtb2Q7XHJcbiAgICB2YXIgcmVzdWx0ID0ge307XHJcbiAgICBpZiAobW9kICE9IG51bGwpIGZvciAodmFyIGsgaW4gbW9kKSBpZiAoayAhPT0gXCJkZWZhdWx0XCIgJiYgT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG1vZCwgaykpIF9fY3JlYXRlQmluZGluZyhyZXN1bHQsIG1vZCwgayk7XHJcbiAgICBfX3NldE1vZHVsZURlZmF1bHQocmVzdWx0LCBtb2QpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIF9faW1wb3J0RGVmYXVsdChtb2QpIHtcclxuICAgIHJldHVybiAobW9kICYmIG1vZC5fX2VzTW9kdWxlKSA/IG1vZCA6IHsgZGVmYXVsdDogbW9kIH07XHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBfX2NsYXNzUHJpdmF0ZUZpZWxkR2V0KHJlY2VpdmVyLCBzdGF0ZSwga2luZCwgZikge1xyXG4gICAgaWYgKGtpbmQgPT09IFwiYVwiICYmICFmKSB0aHJvdyBuZXcgVHlwZUVycm9yKFwiUHJpdmF0ZSBhY2Nlc3NvciB3YXMgZGVmaW5lZCB3aXRob3V0IGEgZ2V0dGVyXCIpO1xyXG4gICAgaWYgKHR5cGVvZiBzdGF0ZSA9PT0gXCJmdW5jdGlvblwiID8gcmVjZWl2ZXIgIT09IHN0YXRlIHx8ICFmIDogIXN0YXRlLmhhcyhyZWNlaXZlcikpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgcmVhZCBwcml2YXRlIG1lbWJlciBmcm9tIGFuIG9iamVjdCB3aG9zZSBjbGFzcyBkaWQgbm90IGRlY2xhcmUgaXRcIik7XHJcbiAgICByZXR1cm4ga2luZCA9PT0gXCJtXCIgPyBmIDoga2luZCA9PT0gXCJhXCIgPyBmLmNhbGwocmVjZWl2ZXIpIDogZiA/IGYudmFsdWUgOiBzdGF0ZS5nZXQocmVjZWl2ZXIpO1xyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gX19jbGFzc1ByaXZhdGVGaWVsZFNldChyZWNlaXZlciwgc3RhdGUsIHZhbHVlLCBraW5kLCBmKSB7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJtXCIpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIG1ldGhvZCBpcyBub3Qgd3JpdGFibGVcIik7XHJcbiAgICBpZiAoa2luZCA9PT0gXCJhXCIgJiYgIWYpIHRocm93IG5ldyBUeXBlRXJyb3IoXCJQcml2YXRlIGFjY2Vzc29yIHdhcyBkZWZpbmVkIHdpdGhvdXQgYSBzZXR0ZXJcIik7XHJcbiAgICBpZiAodHlwZW9mIHN0YXRlID09PSBcImZ1bmN0aW9uXCIgPyByZWNlaXZlciAhPT0gc3RhdGUgfHwgIWYgOiAhc3RhdGUuaGFzKHJlY2VpdmVyKSkgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCB3cml0ZSBwcml2YXRlIG1lbWJlciB0byBhbiBvYmplY3Qgd2hvc2UgY2xhc3MgZGlkIG5vdCBkZWNsYXJlIGl0XCIpO1xyXG4gICAgcmV0dXJuIChraW5kID09PSBcImFcIiA/IGYuY2FsbChyZWNlaXZlciwgdmFsdWUpIDogZiA/IGYudmFsdWUgPSB2YWx1ZSA6IHN0YXRlLnNldChyZWNlaXZlciwgdmFsdWUpKSwgdmFsdWU7XHJcbn1cclxuIiwiLy8gRGVmaW5lIHRoZSBQYW5lIGl0ZW0gdXNlZCBmb3IgQ2FsbEhpZXJhcmNoeVxyXG5cclxuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCJcclxuaW1wb3J0IHR5cGUgeyBEaXNwb3NhYmxlLCBQb2ludCwgUmFuZ2UsIFRleHRFZGl0b3IgfSBmcm9tIFwiYXRvbVwiXHJcbmltcG9ydCB0eXBlIHsgUHJvdmlkZXJSZWdpc3RyeSB9IGZyb20gXCJhdG9tLWlkZS1iYXNlL2NvbW1vbnMtYXRvbS9Qcm92aWRlclJlZ2lzdHJ5XCJcclxuaW1wb3J0IHR5cGUgeyBDYWxsSGllcmFyY2h5LCBDYWxsSGllcmFyY2h5UHJvdmlkZXIsIENhbGxIaWVyYXJjaHlUeXBlIH0gZnJvbSBcImF0b20taWRlLWJhc2VcIlxyXG5pbXBvcnQgZGVib3VuY2UgZnJvbSBcImxvZGFzaC9kZWJvdW5jZVwiXHJcbmltcG9ydCBzdGF0dXNlcyBmcm9tIFwiLi9zdGF0dXNlcy5qc29uXCJcclxuaW1wb3J0IHsgZ2V0SWNvbiB9IGZyb20gXCIuLi91dGlsc1wiXHJcblxyXG50eXBlIHN0YXR1c0tleSA9IGtleW9mIHR5cGVvZiBzdGF0dXNlc1xyXG5cclxuLyoqIEhUTUxFbGVtZW50IGZvciB0aGUgY2FsbC1oaWVyYXJjaHkgdGFiICovXHJcbmV4cG9ydCBjbGFzcyBDYWxsSGllcmFyY2h5VmlldyBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICAjc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcclxuICAvKiogU3Vic2NyaXB0aW9uIHRvIG9ic2VydmUgZWRpdG9yIGN1cnNvciBtb3ZlbWVudCAqL1xyXG4gICNlZGl0b3JTdWJzY3JpcHRpb25zOiBEaXNwb3NhYmxlIHwgdW5kZWZpbmVkXHJcbiAgI3Byb3ZpZGVyUmVnaXN0cnk6IFByb3ZpZGVyUmVnaXN0cnk8Q2FsbEhpZXJhcmNoeVByb3ZpZGVyPlxyXG4gIC8qKiBFbGVtZW50IGZvciBvdXRwdXR0aW5nIHJlc3VsdHMgKi9cclxuICAjb3V0cHV0RWxlbWVudDogSFRNTERpdkVsZW1lbnRcclxuICAvKiogV2hldGhlciB0byBkaXNwbGF5IGluY29taW5nIG9yIG91dGdvaW5nICovXHJcbiAgI2N1cnJlbnRUeXBlOiBDYWxsSGllcmFyY2h5VHlwZVxyXG4gIC8qKiBUaW1lIHRvIGRlYm91bmNlIHRoZSB0aW1pbmcgb2YgZGlzcGxheSB1cGRhdGVzICovXHJcbiAgI2RlYm91bmNlV2FpdFRpbWUgPSAzMDBcclxuICAvKipcclxuICAgKiBTdGF0dXMgb2YgY3VycmVudGx5IGRpc3BsYXllZCBjb250ZW50XHJcbiAgICpcclxuICAgKiAtIFZhbGlkOiB0aGVyZSBpcyBkYXRhIG9idGFpbmVkIGZyb20gdGhlIHByb3ZpZGVyXHJcbiAgICogLSBOb0VkaXRvcjogZWRpdG9yIG5vdCBmb3VuZFxyXG4gICAqIC0gTm9Qcm92aWRlcjogcHJvdmlkZXIgbm90IGZvdW5kXHJcbiAgICogLSBOb1Jlc3VsdDogcHJvdmlkZXIgcmV0dXJucyBudWxsIG9yIGVtcHR5IGFycmF5IChjdXJzb3IgaXMgYWJvdmUgc29tZXRoaW5nIG90aGVyIHRoYW4gZnVuY3Rpb24pXHJcbiAgICovXHJcbiAgI3N0YXR1czogc3RhdHVzS2V5IHwgXCJ2YWxpZFwiIHwgdW5kZWZpbmVkXHJcbiAgLyoqIFdoZXRoZXIgdGhlIHRhYiBoYXMgYWxyZWFkeSBiZWVuIGNsb3NlZCAqL1xyXG4gIGRlc3Ryb3llZCA9IGZhbHNlXHJcbiAgLyoqIE5lZWRlZCBmb3IgQXRvbSAqL1xyXG4gIGdldFRpdGxlID0gKCkgPT4gXCJDYWxsIEhpZXJhcmNoeVwiXHJcbiAgLyoqIE5lZWRlZCBmb3IgQXRvbSAqL1xyXG4gIGdldEljb25OYW1lID0gKCkgPT4gXCJsaW5rXCJcclxuICAvKiogRGV0ZXJtaW5lIHRoZSB0eXBlIG9mIGRhdGEgdG8gZGlzcGxheSAqL1xyXG4gIHN0YXRpYyBnZXRTdGF0dXMoZGF0YTogQ2FsbEhpZXJhcmNoeTxDYWxsSGllcmFyY2h5VHlwZT4gfCBzdGF0dXNLZXkgfCBudWxsIHwgdW5kZWZpbmVkKTogc3RhdHVzS2V5IHwgXCJ2YWxpZFwiIHtcclxuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gXCJzdHJpbmdcIikge1xyXG4gICAgICByZXR1cm4gZGF0YVxyXG4gICAgfVxyXG4gICAgaWYgKCFkYXRhIHx8IGRhdGEuZGF0YS5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuIFwibm9SZXN1bHRcIlxyXG4gICAgfVxyXG4gICAgcmV0dXJuIFwidmFsaWRcIlxyXG4gIH1cclxuICAvKiogQ2FsbGVkIHdoZW4gdGhlIGNhbGwtaGllcmFyY2h5IHRhYiBpcyBvcGVuZWQgKi9cclxuICBjb25zdHJ1Y3Rvcih7IHByb3ZpZGVyUmVnaXN0cnkgfTogeyBwcm92aWRlclJlZ2lzdHJ5OiBQcm92aWRlclJlZ2lzdHJ5PENhbGxIaWVyYXJjaHlQcm92aWRlcj4gfSkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy4jcHJvdmlkZXJSZWdpc3RyeSA9IHByb3ZpZGVyUmVnaXN0cnlcclxuICAgIGNvbnN0IGhlYWRlckVsZW1lbnQgPSB0aGlzLmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpXHJcbiAgICBoZWFkZXJFbGVtZW50LmlubmVySFRNTCA9IGBcclxuICAgICAgPGRpdiBjbGFzcz1cImljb24gaWNvbi1hbGlnbm1lbnQtYWxpZ25cIj5JbmNvbWluZzwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBpY29uLWFsaWdubWVudC1hbGlnbmVkLXRvXCI+T3V0Z29pbmc8L2Rpdj5cclxuICAgIGBcclxuICAgIGhlYWRlckVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHRoaXMuI3RvZ2dsZUN1cnJlbnRUeXBlKCkpXHJcbiAgICB0aGlzLiNvdXRwdXRFbGVtZW50ID0gdGhpcy5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKVxyXG4gICAgdGhpcy4jY3VycmVudFR5cGUgPSBcImluY29taW5nXCJcclxuICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiY3VycmVudC10eXBlXCIsIFwiaW5jb21pbmdcIilcclxuICAgIC8vIHNob3cgY2FsbCBoaWVyYXJjaHkgd2hlbiBjdXJzb3IgcG9zaXRpb24gY2hhbmdlc1xyXG4gICAgY29uc3QgZGVib3VuY2VkU2hvd0NhbGxIaWVyYXJjaHkgPSBkZWJvdW5jZSh0aGlzLnNob3dDYWxsSGllcmFyY2h5LmJpbmQodGhpcyksIHRoaXMuI2RlYm91bmNlV2FpdFRpbWUpXHJcbiAgICB0aGlzLiNzdWJzY3JpcHRpb25zLmFkZChcclxuICAgICAgYXRvbS53b3Jrc3BhY2Uub2JzZXJ2ZUFjdGl2ZVRleHRFZGl0b3IoKGVkaXRvcikgPT4ge1xyXG4gICAgICAgIHRoaXMuI2VkaXRvclN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxyXG4gICAgICAgIHRoaXMuI2VkaXRvclN1YnNjcmlwdGlvbnMgPSBlZGl0b3I/Lm9uRGlkQ2hhbmdlQ3Vyc29yUG9zaXRpb24oKGV2ZW50KSA9PiB7XHJcbiAgICAgICAgICBkZWJvdW5jZWRTaG93Q2FsbEhpZXJhcmNoeShlZGl0b3IsIGV2ZW50Lm5ld0J1ZmZlclBvc2l0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgdGhpcy5zaG93Q2FsbEhpZXJhcmNoeShlZGl0b3IpXHJcbiAgICAgIH0pXHJcbiAgICApXHJcbiAgfVxyXG4gIC8qKiBUb29nbGUgYmV0d2VlbiBpbmNvbWluZyBhbmQgb3V0Z29pbmcgZGlzcGxheXMgKi9cclxuICAjdG9nZ2xlQ3VycmVudFR5cGUgPSAoKSA9PiB7XHJcbiAgICB0aGlzLiNjdXJyZW50VHlwZSA9IHRoaXMuI2N1cnJlbnRUeXBlID09PSBcImluY29taW5nXCIgPyBcIm91dGdvaW5nXCIgOiBcImluY29taW5nXCJcclxuICAgIHRoaXMuc2V0QXR0cmlidXRlKFwiY3VycmVudC10eXBlXCIsIHRoaXMuI2N1cnJlbnRUeXBlKVxyXG4gICAgdGhpcy5zaG93Q2FsbEhpZXJhcmNoeSgpXHJcbiAgfVxyXG4gIC8qKiBTaG93IGNhbGwgaGllcmFyY2h5IGZvciB7ZWRpdG9yfSBhbmQge3BvaW50fSAqL1xyXG4gIGFzeW5jIHNob3dDYWxsSGllcmFyY2h5KGVkaXRvcj86IFRleHRFZGl0b3IsIHBvaW50PzogUG9pbnQpIHtcclxuICAgIGlmICh0aGlzLmRlc3Ryb3llZCkge1xyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIGNvbnN0IHRhcmdldEVkaXRvciA9IGVkaXRvciA/PyBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcclxuICAgIGlmICghdGFyZ2V0RWRpdG9yKSB7XHJcbiAgICAgIC8vIGRpc3BsYXkgYSBtZXNzYWdlIGZvciB3aGVuIHRoZXJlIGlzIG5vIGVkaXRvclxyXG4gICAgICBhd2FpdCB0aGlzLiN1cGRhdGVDYWxsSGllcmFyY2h5VmlldyhcIm5vRWRpdG9yXCIpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgY29uc3QgdGFyZ2V0UG9pbnQgPSBwb2ludCA/PyB0YXJnZXRFZGl0b3IuZ2V0Q3Vyc29yQnVmZmVyUG9zaXRpb24oKVxyXG4gICAgY29uc3QgcHJvdmlkZXIgPSB0aGlzLiNwcm92aWRlclJlZ2lzdHJ5LmdldFByb3ZpZGVyRm9yRWRpdG9yKHRhcmdldEVkaXRvcilcclxuICAgIGlmICghcHJvdmlkZXIpIHtcclxuICAgICAgLy8gZGlzcGxheSBhIG1lc3NhZ2UgZm9yIHdoZW4gdGhlcmUgaXMgbm8gcHJvdmlkZXJcclxuICAgICAgYXdhaXQgdGhpcy4jdXBkYXRlQ2FsbEhpZXJhcmNoeVZpZXcoXCJub1Byb3ZpZGVyXCIpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy8gdXBkYXRlIGRpc3BsYXkgd2l0aCBuZXcgZGF0YVxyXG4gICAgYXdhaXQgdGhpcy4jdXBkYXRlQ2FsbEhpZXJhcmNoeVZpZXcoXHJcbiAgICAgIGF3YWl0ICh0aGlzLiNjdXJyZW50VHlwZSA9PT0gXCJpbmNvbWluZ1wiXHJcbiAgICAgICAgPyBwcm92aWRlci5nZXRJbmNvbWluZ0NhbGxIaWVyYXJjaHkodGFyZ2V0RWRpdG9yLCB0YXJnZXRQb2ludClcclxuICAgICAgICA6IHByb3ZpZGVyLmdldE91dGdvaW5nQ2FsbEhpZXJhcmNoeSh0YXJnZXRFZGl0b3IsIHRhcmdldFBvaW50KSlcclxuICAgIClcclxuICB9XHJcbiAgLyoqIFNob3cgY2FsbCBoaWVyYXJjaHkgZm9yIHtuZXdEYXRhfSAqL1xyXG4gICN1cGRhdGVDYWxsSGllcmFyY2h5VmlldyA9IGFzeW5jIChuZXdEYXRhOiBDYWxsSGllcmFyY2h5PENhbGxIaWVyYXJjaHlUeXBlPiB8IHN0YXR1c0tleSB8IG51bGwgfCB1bmRlZmluZWQpID0+IHtcclxuICAgIGNvbnN0IHByZXZTdGF0dXMgPSB0aGlzLiNzdGF0dXNcclxuICAgIGNvbnN0IGN1cnJlbnRTdGF0dXMgPSAodGhpcy4jc3RhdHVzID0gQ2FsbEhpZXJhcmNoeVZpZXcuZ2V0U3RhdHVzKG5ld0RhdGEpKVxyXG4gICAgaWYgKGN1cnJlbnRTdGF0dXMgPT09IFwidmFsaWRcIikge1xyXG4gICAgICAvLyB1cGRhdGUgZGlzcGxheSB3aGVuIHRoZXJlIGlzIG5ldyBkYXRhXHJcbiAgICAgIHRoaXMuI291dHB1dEVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgICAvLyB0eXBlIG9mIGBuZXdEYXRhYCBtdXN0IGJlIGBDYWxsSGllcmFyY2h5YCBiZWNhdXNlIHN0YXR1cyBpcyB2YWxpZFxyXG4gICAgICBjb25zdCBpdGVtID0gbmV3IENhbGxIaWVyYXJjaHlWaWV3SXRlbShuZXdEYXRhIGFzIENhbGxIaWVyYXJjaHk8Q2FsbEhpZXJhcmNoeVR5cGU+KVxyXG4gICAgICB0aGlzLiNvdXRwdXRFbGVtZW50LmFwcGVuZENoaWxkKGl0ZW0pXHJcbiAgICAgIC8vIHVuZm9sZCB0aGUgZmlyc3QgaGllcmFyY2h5XHJcbiAgICAgIGF3YWl0IGl0ZW0udG9nZ2xlQWxsSXRlbSgpXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgaWYgKHByZXZTdGF0dXMgPT09IGN1cnJlbnRTdGF0dXMpIHtcclxuICAgICAgLy8gRG8gbm90IHVwZGF0ZSBpZiB0aGUgZGlzcGxheWVkIGNvbnRlbnQgZG9lcyBub3QgY2hhbmdlXHJcbiAgICAgIHJldHVyblxyXG4gICAgfVxyXG4gICAgLy8gdXBkYXRlIGRpc3BsYXkgd2l0aCBuZXcgc3RhdHVzIG1lc3NhZ2Ugd2hlbiBzdGF0dXMgaXMgbm9FZGl0b3IsIG5vUHJvdmlkZXIgb3Igbm9SZXN1bHRcclxuICAgIHRoaXMuI291dHB1dEVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIlxyXG4gICAgY29uc3QgaXRlbSA9IG5ldyBDYWxsSGllcmFyY2h5Vmlld1N0YXR1c0l0ZW0oc3RhdHVzZXNbY3VycmVudFN0YXR1c10pXHJcbiAgICB0aGlzLiNvdXRwdXRFbGVtZW50LmFwcGVuZENoaWxkKGl0ZW0pXHJcbiAgfVxyXG4gIC8qKiBDYWxsZWQgd2hlbiB0aGUgY2FsbC1oaWVyYXJjaHkgdGFiIGlzIGNsb3NlZCAqL1xyXG4gIGRlc3Ryb3koKSB7XHJcbiAgICB0aGlzLmlubmVySFRNTCA9IFwiXCJcclxuICAgIHRoaXMuI2VkaXRvclN1YnNjcmlwdGlvbnM/LmRpc3Bvc2UoKVxyXG4gICAgdGhpcy4jc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcclxuICAgIHRoaXMuZGVzdHJveWVkID0gdHJ1ZVxyXG4gIH1cclxufVxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdG9tLWlkZS1vdXRsaW5lLWNhbGwtaGllcmFyY2h5LXZpZXdcIiwgQ2FsbEhpZXJhcmNoeVZpZXcpXHJcblxyXG4vKiogSFRNTEVsZW1lbnQgZm9yIHRoZSBjYWxsLWhpZXJhcmNoeSBpdGVtICovXHJcbmNsYXNzIENhbGxIaWVyYXJjaHlWaWV3SXRlbTxUIGV4dGVuZHMgQ2FsbEhpZXJhcmNoeVR5cGU+IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xyXG4gICNjYWxsSGllcmFyY2h5OiBDYWxsSGllcmFyY2h5PFQ+IHwgdW5kZWZpbmVkXHJcbiAgI2RibGNsaWNrV2FpdFRpbWUgPSAzMDBcclxuICAvKiogV2hldGhlciB7Y2FsbEhpZXJhcmNoeX0gZGF0YSBpcyB1bmRlZmluZWQgb3IgZW1wdHkgYXJyYXkgKi9cclxuICBzdGF0aWMgaXNFbXB0eShjYWxsSGllcmFyY2h5OiBDYWxsSGllcmFyY2h5PENhbGxIaWVyYXJjaHlUeXBlPiB8IHVuZGVmaW5lZCk6IGNhbGxIaWVyYXJjaHkgaXMgdW5kZWZpbmVkIHtcclxuICAgIHJldHVybiAhY2FsbEhpZXJhcmNoeSB8fCBjYWxsSGllcmFyY2h5LmRhdGEubGVuZ3RoID09IDBcclxuICB9XHJcbiAgY29uc3RydWN0b3IoY2FsbEhpZXJhcmNoeTogQ2FsbEhpZXJhcmNoeTxUPiB8IHVuZGVmaW5lZCkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy4jY2FsbEhpZXJhcmNoeSA9IGNhbGxIaWVyYXJjaHlcclxuICAgIGlmIChDYWxsSGllcmFyY2h5Vmlld0l0ZW0uaXNFbXB0eSh0aGlzLiNjYWxsSGllcmFyY2h5KSkge1xyXG4gICAgICB0aGlzLmlubmVySFRNTCA9IGA8ZGl2IGNsYXNzPVwiY2FsbC1oaWVyYXJjaHktbm8tZGF0YVwiPk5vIHJlc3VsdCB3YXMgZm91bmQuPC9kaXY+YFxyXG4gICAgICByZXR1cm5cclxuICAgIH1cclxuICAgIHRoaXMuYXBwZW5kKFxyXG4gICAgICAuLi50aGlzLiNjYWxsSGllcmFyY2h5LmRhdGEubWFwKChpdGVtLCBpKSA9PiB7XHJcbiAgICAgICAgY29uc3QgaXRlbUVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKVxyXG4gICAgICAgIGl0ZW1FbC5zZXRBdHRyaWJ1dGUoXCJ0aXRsZVwiLCBpdGVtLnBhdGgpXHJcbiAgICAgICAgaXRlbUVsLmlubmVySFRNTCA9IGBcclxuICAgICAgICA8ZGl2IGNsYXNzPVwiaWNvbiBpY29uLWNoZXZyb24tcmlnaHRcIj5cclxuICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgIDxzcGFuPiR7ZXNjYXBlSFRNTChpdGVtLm5hbWUpfTwvc3Bhbj5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJkZXRhaWxcIj4ke2VzY2FwZUhUTUwoaXRlbS5kZXRhaWwgPyBgIC0gJHtpdGVtLmRldGFpbH1gIDogXCJcIil9PC9zcGFuPlxyXG4gICAgICAgICAgICAke2l0ZW0udGFncy5tYXAoKHN0cikgPT4gYDxzcGFuIGNsYXNzPVwidGFnLSR7ZXNjYXBlSFRNTChzdHIpfVwiPiR7ZXNjYXBlSFRNTChzdHIpfTwvc3Bhbj5gKS5qb2luKFwiXCIpfVxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgYFxyXG4gICAgICAgIGl0ZW1FbFxyXG4gICAgICAgICAgLnF1ZXJ5U2VsZWN0b3IoXCI6c2NvcGU+ZGl2PmRpdlwiKVxyXG4gICAgICAgICAgPy5pbnNlcnRBZGphY2VudEVsZW1lbnQoXCJhZnRlcmJlZ2luXCIsIGdldEljb24oaXRlbS5pY29uID8/IHVuZGVmaW5lZCwgdW5kZWZpbmVkKSlcclxuICAgICAgICAvLyBjbGljayB0byBmb2xkIG9yIHVuZm9sZCBjaGlsZCBpdGVtc1xyXG4gICAgICAgIGxldCBpc0RibGNsaWNrID0gZmFsc2VcclxuICAgICAgICBpdGVtRWwucXVlcnlTZWxlY3RvcihcIjpzY29wZT5kaXZcIik/LmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICBcImNsaWNrXCIsXHJcbiAgICAgICAgICAoZSkgPT4ge1xyXG4gICAgICAgICAgICBlLnN0b3BQcm9wYWdhdGlvbigpXHJcbiAgICAgICAgICAgIGlmIChpc0RibGNsaWNrICYmIHRoaXMuI2NhbGxIaWVyYXJjaHkpIHtcclxuICAgICAgICAgICAgICAvLyBkb3VibGUtY2xpY2sgdG8ganVtcCB0byB0aGUgZG9jdW1lbnRcclxuICAgICAgICAgICAgICB0aGlzLiNzaG93RG9jdW1lbnQodGhpcy4jY2FsbEhpZXJhcmNoeS5kYXRhW2ldKVxyXG4gICAgICAgICAgICAgIHJldHVyblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIC8vIHNpbmdsZS1jbGljayB0byB0b2dnbGUgdGhlIGRpc3BsYXkgb2YgaXRlbVxyXG4gICAgICAgICAgICB0aGlzLnRvZ2dsZUl0ZW1BdChpKVxyXG4gICAgICAgICAgICAvLyBlbmFibGUgZG91YmxlIGNsaWNrXHJcbiAgICAgICAgICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IChpc0RibGNsaWNrID0gZmFsc2UpLCB0aGlzLiNkYmxjbGlja1dhaXRUaW1lKVxyXG4gICAgICAgICAgICBpc0RibGNsaWNrID0gdHJ1ZVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIGZhbHNlXHJcbiAgICAgICAgKVxyXG4gICAgICAgIHJldHVybiBpdGVtRWxcclxuICAgICAgfSlcclxuICAgIClcclxuICB9XHJcbiAgLyoqIFRvZ2dsZSB0aGUgZGlzcGxheSBvZiB0aGUge2l9LXRoIGl0ZW0gKi9cclxuICBhc3luYyB0b2dnbGVJdGVtQXQoaTogbnVtYmVyKSB7XHJcbiAgICBjb25zdCBpdGVtRWwgPSB0aGlzLnF1ZXJ5U2VsZWN0b3JBbGw8SFRNTExJRWxlbWVudD4oXCI6c2NvcGU+ZGl2XCIpW2ldXHJcbiAgICBjb25zdCB0aXRsZUVsID0gaXRlbUVsLnF1ZXJ5U2VsZWN0b3I8SFRNTERpdkVsZW1lbnQ+KFwiOnNjb3BlPmRpdlwiKVxyXG4gICAgY29uc3QgY2hpbGRFbCA9IGl0ZW1FbC5xdWVyeVNlbGVjdG9yPENhbGxIaWVyYXJjaHlWaWV3SXRlbTxUPj4oXCJhdG9tLWlkZS1vdXRsaW5lLWNhbGwtaGllcmFyY2h5LWl0ZW1cIilcclxuICAgIGlmIChjaGlsZEVsKSB7XHJcbiAgICAgIGlmIChjaGlsZEVsLnN0eWxlLmRpc3BsYXkgIT09IFwibm9uZVwiKSB7XHJcbiAgICAgICAgLy8gaGlkZSBpZiB2aXNpYmxlXHJcbiAgICAgICAgY2hpbGRFbC5zdHlsZS5kaXNwbGF5ID0gXCJub25lXCJcclxuICAgICAgICB0aXRsZUVsPy5jbGFzc0xpc3QucmVwbGFjZShcImljb24tY2hldnJvbi1kb3duXCIsIFwiaWNvbi1jaGV2cm9uLXJpZ2h0XCIpXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gc2hvdyBpZiBoaWRkZW5cclxuICAgICAgICBjaGlsZEVsLnN0eWxlLmRpc3BsYXkgPSBcIlwiXHJcbiAgICAgICAgdGl0bGVFbD8uY2xhc3NMaXN0LnJlcGxhY2UoXCJpY29uLWNoZXZyb24tcmlnaHRcIiwgXCJpY29uLWNoZXZyb24tZG93blwiKVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBjcmVhdGUgZWxlbWVudCBpZiB0aGVyZSBpcyBubyBkYXRhXHJcbiAgICAgIGl0ZW1FbC5hcHBlbmRDaGlsZChuZXcgQ2FsbEhpZXJhcmNoeVZpZXdJdGVtKGF3YWl0IHRoaXMuI2NhbGxIaWVyYXJjaHk/Lml0ZW1BdChpKSkpXHJcbiAgICAgIHRpdGxlRWw/LmNsYXNzTGlzdC5yZXBsYWNlKFwiaWNvbi1jaGV2cm9uLXJpZ2h0XCIsIFwiaWNvbi1jaGV2cm9uLWRvd25cIilcclxuICAgIH1cclxuICB9XHJcbiAgLyoqIFRvZ2dsZSB0aGUgZGlzcGxheSBvZiBhbGwgaXRlbSAqL1xyXG4gIGFzeW5jIHRvZ2dsZUFsbEl0ZW0oKSB7XHJcbiAgICBjb25zdCBkYXRhTGVuID0gdGhpcy4jY2FsbEhpZXJhcmNoeT8uZGF0YS5sZW5ndGggPz8gMFxyXG4gICAgYXdhaXQgUHJvbWlzZS5hbGwoWy4uLkFycmF5KGRhdGFMZW4pLmtleXMoKV0ubWFwKChpKSA9PiB0aGlzLnRvZ2dsZUl0ZW1BdChpKSkpXHJcbiAgfVxyXG4gIC8qKiBTaG93IGRvY3VtZW50IGZvciB7cmFuZ2V9IGFuZCB7cGF0aH0sIGFuZCBzZWxlY3Qge3NlbGVjdGlvblJhbmdlfSAqL1xyXG4gICNzaG93RG9jdW1lbnQgPSAoe1xyXG4gICAgcGF0aCxcclxuICAgIHJhbmdlOiB7XHJcbiAgICAgIHN0YXJ0OiB7IHJvdywgY29sdW1uIH0sXHJcbiAgICB9LFxyXG4gICAgc2VsZWN0aW9uUmFuZ2UsXHJcbiAgfToge1xyXG4gICAgcGF0aDogc3RyaW5nXHJcbiAgICByYW5nZTogUmFuZ2VcclxuICAgIHNlbGVjdGlvblJhbmdlOiBSYW5nZVxyXG4gIH0pID0+IHtcclxuICAgIGNvbnN0IGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxyXG4gICAgaWYgKGVkaXRvcj8uZ2V0UGF0aCgpID09PSBwYXRoKSB7XHJcbiAgICAgIGVkaXRvci5zZXRDdXJzb3JCdWZmZXJQb3NpdGlvbihbcm93LCBjb2x1bW5dKVxyXG4gICAgICBlZGl0b3Iuc2Nyb2xsVG9CdWZmZXJQb3NpdGlvbihbcm93LCBjb2x1bW5dLCB7IGNlbnRlcjogdHJ1ZSB9KVxyXG4gICAgICBlZGl0b3Iuc2V0U2VsZWN0ZWRCdWZmZXJSYW5nZShzZWxlY3Rpb25SYW5nZSlcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGF0b20ud29ya3NwYWNlXHJcbiAgICAgICAgLm9wZW4ocGF0aCwge1xyXG4gICAgICAgICAgaW5pdGlhbExpbmU6IHJvdyxcclxuICAgICAgICAgIGluaXRpYWxDb2x1bW46IGNvbHVtbixcclxuICAgICAgICAgIHNlYXJjaEFsbFBhbmVzOiB0cnVlLFxyXG4gICAgICAgICAgYWN0aXZhdGVQYW5lOiB0cnVlLFxyXG4gICAgICAgICAgYWN0aXZhdGVJdGVtOiB0cnVlLFxyXG4gICAgICAgIH0pXHJcbiAgICAgICAgLnRoZW4oKGVkaXRvcjogYW55KSA9PiBlZGl0b3I/LnNldFNlbGVjdGVkQnVmZmVyUmFuZ2Uoc2VsZWN0aW9uUmFuZ2UpKVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdG9tLWlkZS1vdXRsaW5lLWNhbGwtaGllcmFyY2h5LWl0ZW1cIiwgQ2FsbEhpZXJhcmNoeVZpZXdJdGVtKVxyXG5cclxuLyoqIENyZWF0ZSBhIG1lc3NhZ2Ugd2hlbiB0aGVyZSBpcyBub3RoaW5nIHRvIGRpc3BsYXkuICovXHJcbmNsYXNzIENhbGxIaWVyYXJjaHlWaWV3U3RhdHVzSXRlbSBleHRlbmRzIEhUTUxFbGVtZW50IHtcclxuICBjb25zdHJ1Y3Rvcih7IHRpdGxlLCBkZXNjcmlwdGlvbiB9OiB7IHRpdGxlOiBzdHJpbmc7IGRlc2NyaXB0aW9uOiBzdHJpbmcgfSkge1xyXG4gICAgc3VwZXIoKVxyXG4gICAgdGhpcy5pbm5lckhUTUwgPSBgXHJcbiAgICAgIDxoMT4ke2VzY2FwZUhUTUwodGl0bGUpfTwvaDE+XHJcbiAgICAgIDxzcGFuPiR7ZXNjYXBlSFRNTChkZXNjcmlwdGlvbil9PC9zcGFuPlxyXG4gICAgYFxyXG4gIH1cclxufVxyXG5jdXN0b21FbGVtZW50cy5kZWZpbmUoXCJhdG9tLWlkZS1vdXRsaW5lLWNhbGwtaGllcmFyY2h5LXN0YXR1cy1pdGVtXCIsIENhbGxIaWVyYXJjaHlWaWV3U3RhdHVzSXRlbSlcclxuXHJcbmZ1bmN0aW9uIGVzY2FwZUhUTUwoc3RyOiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBzdHIucmVwbGFjZShcclxuICAgIC9bXCImJzw+YF0vZyxcclxuICAgIChtYXRjaCkgPT5cclxuICAgICAgKHtcclxuICAgICAgICBcIiZcIjogXCImYW1wO1wiLFxyXG4gICAgICAgIFwiJ1wiOiBcIiYjeDI3O1wiLFxyXG4gICAgICAgIFwiYFwiOiBcIiYjeDYwO1wiLFxyXG4gICAgICAgICdcIic6IFwiJnF1b3Q7XCIsXHJcbiAgICAgICAgXCI8XCI6IFwiJmx0O1wiLFxyXG4gICAgICAgIFwiPlwiOiBcIiZndDtcIixcclxuICAgICAgfVttYXRjaF0gYXMgc3RyaW5nKVxyXG4gIClcclxufVxyXG4iLCJpbXBvcnQgdHlwZSB7IFBhbmUgfSBmcm9tIFwiYXRvbVwiXHJcblxyXG4vKiogSGFuZGxlcyB0aGUgb3BlcmF0aW9uIG9mIG9wZW5pbmcgYW5kIGNsb3NpbmcgdGFicy4gKi9cclxuZXhwb3J0IGNsYXNzIFRhYkhhbmRsZXI8VCBleHRlbmRzIG9iamVjdD4ge1xyXG4gIC8qKiBSZXR1cm5zIHRoZSBkb2NrIHdoZXJlIHRoZSB0YWIgc2hvdWxkIGJlIGNyZWF0ZWQuICovXHJcbiAgc3RhdGljICNnZXREZWZhdWx0RG9jaygpIHtcclxuICAgIC8vIElmIHdhbnQgdG8gY2hhbmdlIHRoZSBsb2NhdGlvbiBvZiB0aGUgbmV3IHRhYiwgY2hhbmdlIHRoZSBjb2RlIGhlcmUuXHJcbiAgICByZXR1cm4gYXRvbS53b3Jrc3BhY2UuZ2V0UmlnaHREb2NrKClcclxuICB9XHJcbiAgLyoqIEl0IGlzIHBvc3NpYmxlIHRoYXQgdGhlIHRhYiBkb2VzIG5vdCBleGlzdCBldmVuIGlmIHRoZSBpdGVtIGlzIG5vdCB1bmRlZmluZWQsIGFzIHRoZSB0YWIgbWF5IGJlIGNsb3NlZCBtYW51YWxseS4gKi9cclxuICBpdGVtOiBUIHwgdW5kZWZpbmVkXHJcbiAgI2NyZWF0ZUl0ZW06ICgpID0+IFRcclxuICBjb25zdHJ1Y3Rvcih7XHJcbiAgICBjcmVhdGVJdGVtLFxyXG4gIH06IHtcclxuICAgIC8qKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBjcmVhdGluZyBhIHRhYi4gU2hvdWxkIHJldHVybiB0aGUgcGFuZSBpdGVtIHlvdSB3YW50IHRvIGFkZCB0byB0aGUgdGFiLiAqL1xyXG4gICAgY3JlYXRlSXRlbTogKCkgPT4gVFxyXG4gIH0pIHtcclxuICAgIHRoaXMuI2NyZWF0ZUl0ZW0gPSBjcmVhdGVJdGVtXHJcbiAgfVxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZSB0aGUgdGFiLiBJZiB0aGUgdGFiIGV4aXN0cywgaXQgd2lsbCBiZSBkZWxldGVkLiBJZiB0aGUgdGFiIGlzIG9wZW4gYnV0IGhpZGRlbiwgdGhlIHRhYiB3aWxsIGJlIGJyb3VnaHQgdG9cclxuICAgKiB0aGUgZnJvbnQuIElmIHRoZSB0YWIgZG9lcyBub3QgZXhpc3QsIGl0IHdpbGwgYmUgY3JlYXRlZC5cclxuICAgKi9cclxuICB0b2dnbGUoKSB7XHJcbiAgICBjb25zdCB7IHN0YXRlLCB0YXJnZXRQYW5lIH0gPSB0aGlzLiNnZXRTdGF0ZSgpXHJcbiAgICBpZiAoc3RhdGUgPT09IFwiaGlkZGVuXCIpIHtcclxuICAgICAgdGhpcy4jZGlzcGxheSh7IHRhcmdldFBhbmUgfSlcclxuICAgIH0gZWxzZSBpZiAoc3RhdGUgPT09IFwibm9JdGVtXCIpIHtcclxuICAgICAgdGhpcy4jY3JlYXRlKHsgdGFyZ2V0UGFuZSB9KVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy4jZGVzdHJveSh7IHRhcmdldFBhbmUgfSlcclxuICAgIH1cclxuICB9XHJcbiAgLyoqXHJcbiAgICogU2hvdyB0aGUgdGFiLiBJZiB0aGUgdGFiIGlzIG9wZW4gYnV0IGhpZGRlbiwgdGhlIHRhYiB3aWxsIGJlIGJyb3VnaHQgdG8gdGhlIGZyb250LiBJZiB0aGUgdGFiIGRvZXMgbm90IGV4aXN0LCBpdFxyXG4gICAqIHdpbGwgYmUgY3JlYXRlZC5cclxuICAgKi9cclxuICBzaG93KCkge1xyXG4gICAgY29uc3QgeyBzdGF0ZSwgdGFyZ2V0UGFuZSB9ID0gdGhpcy4jZ2V0U3RhdGUoKVxyXG4gICAgaWYgKHN0YXRlID09PSBcImhpZGRlblwiKSB7XHJcbiAgICAgIHRoaXMuI2Rpc3BsYXkoeyB0YXJnZXRQYW5lIH0pXHJcbiAgICB9IGVsc2UgaWYgKHN0YXRlID09PSBcIm5vSXRlbVwiKSB7XHJcbiAgICAgIHRoaXMuI2NyZWF0ZSh7IHRhcmdldFBhbmUgfSlcclxuICAgIH1cclxuICB9XHJcbiAgLyoqIERlbGV0ZSB0aGUgdGFiLiBJZiB0aGUgdGFiIGV4aXN0cywgaXQgd2lsbCBiZSBkZWxldGVkLiAqL1xyXG4gIGRlbGV0ZSgpIHtcclxuICAgIGNvbnN0IHRhcmdldFBhbmUgPSB0aGlzLml0ZW0gJiYgYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odGhpcy5pdGVtKVxyXG4gICAgaWYgKHRhcmdldFBhbmUpIHtcclxuICAgICAgdGhpcy4jZGVzdHJveSh7IHRhcmdldFBhbmUgfSlcclxuICAgIH1cclxuICB9XHJcbiAgLyoqIERpc3BsYXkgdGhlIGhpZGRlbiB0YWIgYXQgdGFyZ2V0IHBhbmUuICovXHJcbiAgI2Rpc3BsYXkoeyB0YXJnZXRQYW5lIH06IHsgdGFyZ2V0UGFuZTogUGFuZSB9KSB7XHJcbiAgICBpZiAodGhpcy5pdGVtKSB7XHJcbiAgICAgIHRhcmdldFBhbmUuYWN0aXZhdGVJdGVtKHRoaXMuaXRlbSlcclxuICAgIH1cclxuICAgIGNvbnN0IGRvY2sgPSBhdG9tLndvcmtzcGFjZS5nZXRQYW5lQ29udGFpbmVycygpLmZpbmQoKHYpID0+IHYuZ2V0UGFuZXMoKS5pbmNsdWRlcyh0YXJnZXRQYW5lKSlcclxuICAgIGlmIChkb2NrICYmIFwic2hvd1wiIGluIGRvY2spIHtcclxuICAgICAgZG9jay5zaG93KClcclxuICAgIH1cclxuICB9XHJcbiAgLyoqIENyZWF0ZSB0aGUgbmV3IHRhYiBhdCB0YXJnZXQgcGFuZS4gKi9cclxuICAjY3JlYXRlKHsgdGFyZ2V0UGFuZSB9OiB7IHRhcmdldFBhbmU6IFBhbmUgfSkge1xyXG4gICAgdGhpcy5pdGVtID0gdGhpcy4jY3JlYXRlSXRlbSgpXHJcbiAgICB0YXJnZXRQYW5lLmFkZEl0ZW0odGhpcy5pdGVtKVxyXG4gICAgdGFyZ2V0UGFuZS5hY3RpdmF0ZUl0ZW0odGhpcy5pdGVtKVxyXG4gICAgVGFiSGFuZGxlci4jZ2V0RGVmYXVsdERvY2soKS5zaG93KClcclxuICB9XHJcbiAgLyoqIERlc3Ryb3kgdGhlIHRhYiBmcm9tIHRhcmdldCBwYW5lLiAqL1xyXG4gICNkZXN0cm95KHsgdGFyZ2V0UGFuZSB9OiB7IHRhcmdldFBhbmU6IFBhbmUgfSkge1xyXG4gICAgaWYgKHRoaXMuaXRlbSkge1xyXG4gICAgICB0YXJnZXRQYW5lLmRlc3Ryb3lJdGVtKHRoaXMuaXRlbSlcclxuICAgIH1cclxuICB9XHJcbiAgLyoqIEdldCB0aGUgc3RhdGUgb2YgdGhlIHRhYi4gKi9cclxuICAjZ2V0U3RhdGUoKSB7XHJcbiAgICBjb25zdCBwYW5lID0gdGhpcy5pdGVtICYmIGF0b20ud29ya3NwYWNlLnBhbmVGb3JJdGVtKHRoaXMuaXRlbSlcclxuICAgIGlmIChwYW5lKSB7XHJcbiAgICAgIGlmIChcclxuICAgICAgICBwYW5lLmdldEFjdGl2ZUl0ZW0oKSA9PT0gdGhpcy5pdGVtICYmXHJcbiAgICAgICAgLy8gQHRzLWlnbm9yZSAoZ2V0VmlzaWJsZVBhbmVzIGlzIG5vdCBpbmNsdWRlcyB0eXBlZGVmKVxyXG4gICAgICAgIGF0b20ud29ya3NwYWNlLmdldFZpc2libGVQYW5lcygpLmluY2x1ZGVzKHBhbmUpXHJcbiAgICAgICkge1xyXG4gICAgICAgIHJldHVybiB7IHN0YXRlOiBcInZpc2libGVcIiwgdGFyZ2V0UGFuZTogcGFuZSB9IGFzIGNvbnN0XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuIHsgc3RhdGU6IFwiaGlkZGVuXCIsIHRhcmdldFBhbmU6IHBhbmUgfSBhcyBjb25zdFxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHN0YXRlOiBcIm5vSXRlbVwiLFxyXG4gICAgICAgIHRhcmdldFBhbmU6IFRhYkhhbmRsZXIuI2dldERlZmF1bHREb2NrKCkuZ2V0QWN0aXZlUGFuZSgpLFxyXG4gICAgICB9IGFzIGNvbnN0XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiIsImltcG9ydCB7IENvbXBvc2l0ZURpc3Bvc2FibGUgfSBmcm9tIFwiYXRvbVwiXHJcbmltcG9ydCB0eXBlIHsgRGlzcG9zYWJsZSB9IGZyb20gXCJhdG9tXCJcclxuaW1wb3J0IHsgUHJvdmlkZXJSZWdpc3RyeSB9IGZyb20gXCJhdG9tLWlkZS1iYXNlL2NvbW1vbnMtYXRvbS9Qcm92aWRlclJlZ2lzdHJ5XCJcclxuaW1wb3J0IHR5cGUgeyBDYWxsSGllcmFyY2h5UHJvdmlkZXIgfSBmcm9tIFwiYXRvbS1pZGUtYmFzZVwiXHJcblxyXG5pbXBvcnQgeyBDYWxsSGllcmFyY2h5VmlldyB9IGZyb20gXCIuL2NhbGwtaGllcmFyY2h5LXZpZXdcIlxyXG5pbXBvcnQgeyBUYWJIYW5kbGVyIH0gZnJvbSBcIi4vdGFiLWhhbmRsZXJcIlxyXG5cclxuY29uc3QgcHJvdmlkZXJSZWdpc3RyeSA9IG5ldyBQcm92aWRlclJlZ2lzdHJ5PENhbGxIaWVyYXJjaHlQcm92aWRlcj4oKVxyXG5jb25zdCBzdWJzY3JpcHRpb25zID0gbmV3IENvbXBvc2l0ZURpc3Bvc2FibGUoKVxyXG5jb25zdCBjYWxsSGllcmFyY2h5VGFiID0gbmV3IFRhYkhhbmRsZXIoe1xyXG4gIGNyZWF0ZUl0ZW06ICgpID0+IG5ldyBDYWxsSGllcmFyY2h5Vmlldyh7IHByb3ZpZGVyUmVnaXN0cnkgfSksXHJcbn0pXHJcblxyXG5leHBvcnQgZnVuY3Rpb24gYWN0aXZhdGUoKSB7XHJcbiAgc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICBhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIFwib3V0bGluZTp0b2dnbGUtY2FsbC1oaWVyYXJjaHlcIiwgKCkgPT4gY2FsbEhpZXJhcmNoeVRhYi50b2dnbGUoKSksXHJcbiAgICBhdG9tLmNvbW1hbmRzLmFkZChcImF0b20td29ya3NwYWNlXCIsIFwib3V0bGluZTpzaG93LWNhbGwtaGllcmFyY2h5XCIsICgpID0+IGNhbGxIaWVyYXJjaHlUYWIuc2hvdygpKVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIGRlYWN0aXZhdGUoKSB7XHJcbiAgc3Vic2NyaXB0aW9ucy5kaXNwb3NlKClcclxuICBjYWxsSGllcmFyY2h5VGFiLmRlbGV0ZSgpXHJcbn1cclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBjb25zdW1lQ2FsbEhpZXJhcmNoeVByb3ZpZGVyKHByb3ZpZGVyOiBDYWxsSGllcmFyY2h5UHJvdmlkZXIpOiBEaXNwb3NhYmxlIHtcclxuICBjb25zdCBwcm92aWRlckRpc3Bvc2VyID0gcHJvdmlkZXJSZWdpc3RyeS5hZGRQcm92aWRlcihwcm92aWRlcilcclxuICBzdWJzY3JpcHRpb25zLmFkZChwcm92aWRlckRpc3Bvc2VyKVxyXG4gIGNhbGxIaWVyYXJjaHlUYWIuaXRlbT8uc2hvd0NhbGxIaWVyYXJjaHkoKVxyXG4gIHJldHVybiBwcm92aWRlckRpc3Bvc2VyXHJcbn1cclxuIiwiaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSwgVGV4dEVkaXRvciB9IGZyb20gXCJhdG9tXCJcclxuaW1wb3J0IHsgT3V0bGluZVZpZXcgfSBmcm9tIFwiLi9vdXRsaW5lVmlld1wiXHJcbmltcG9ydCB0eXBlIHsgT3V0bGluZVByb3ZpZGVyIH0gZnJvbSBcImF0b20taWRlLWJhc2VcIlxyXG5pbXBvcnQgeyBQcm92aWRlclJlZ2lzdHJ5IH0gZnJvbSBcImF0b20taWRlLWJhc2UvY29tbW9ucy1hdG9tL1Byb3ZpZGVyUmVnaXN0cnlcIlxyXG5pbXBvcnQgeyBub3RpZnlFcnJvciwgbGFyZ2VuZXNzIGFzIGVkaXRvckxhcmdlbmVzcyB9IGZyb20gXCJhdG9tLWlkZS1iYXNlL2NvbW1vbnMtYXRvbVwiXHJcbmltcG9ydCB7IGlzSXRlbVZpc2libGUgfSBmcm9tIFwiYXRvbS1pZGUtYmFzZS9jb21tb25zLXVpL2l0ZW1zXCJcclxuXHJcbmV4cG9ydCB7IHN0YXR1c2VzIH0gZnJvbSBcIi4vc3RhdHVzZXNcIiAvLyBmb3Igc3BlY1xyXG5pbXBvcnQgeyBzdGF0dXNlcyB9IGZyb20gXCIuL3N0YXR1c2VzXCJcclxuaW1wb3J0IGRlYm91bmNlIGZyb20gXCJsb2Rhc2gvZGVib3VuY2VcIlxyXG5cclxuZXhwb3J0IHsgY29uc3VtZUNhbGxIaWVyYXJjaHlQcm92aWRlciB9IGZyb20gXCIuL2NhbGwtaGllcmFyY2h5L21haW5cIlxyXG5pbXBvcnQgKiBhcyBDYWxsSGllcmFyY2h5IGZyb20gXCIuL2NhbGwtaGllcmFyY2h5L21haW5cIlxyXG5cclxuY29uc3Qgc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKClcclxuXHJcbmxldCB2aWV3OiBPdXRsaW5lVmlldyB8IHVuZGVmaW5lZFxyXG5leHBvcnQgY29uc3Qgb3V0bGluZVByb3ZpZGVyUmVnaXN0cnkgPSBuZXcgUHJvdmlkZXJSZWdpc3RyeTxPdXRsaW5lUHJvdmlkZXI+KClcclxuXHJcbi8vIGxldCBidXN5U2lnbmFsUHJvdmlkZXI6IEJ1c3lTaWduYWxQcm92aWRlciB8IHVuZGVmaW5lZCAvLyBzZXJ2aWNlIG1pZ2h0IGJlIGNvbnN1bWVkIGxhdGVcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBhY3RpdmF0ZSgpIHtcclxuICBDYWxsSGllcmFyY2h5LmFjdGl2YXRlKClcclxuICBhZGRDb21tYW5kcygpXHJcbiAgYWRkT2JzZXJ2ZXJzKClcclxuICBpZiAoYXRvbS5jb25maWcuZ2V0KFwiYXRvbS1pZGUtb3V0bGluZS5pbml0aWFsRGlzcGxheVwiKSBhcyBib29sZWFuKSB7XHJcbiAgICAvLyBpbml0aWFsbHkgc2hvdyBvdXRsaW5lIHBhbmVcclxuICAgIHRvZ2dsZU91dGxpbmVWaWV3KCkuY2F0Y2goKGU6IEVycm9yKSA9PiB7XHJcbiAgICAgIG5vdGlmeUVycm9yKGUpXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gYWRkQ29tbWFuZHMoKSB7XHJcbiAgc3Vic2NyaXB0aW9ucy5hZGQoXHJcbiAgICAvKiBvdXRsaW5lVG9nZ2xlICovIGF0b20uY29tbWFuZHMuYWRkKFwiYXRvbS13b3Jrc3BhY2VcIiwgXCJvdXRsaW5lOnRvZ2dsZVwiLCB0b2dnbGVPdXRsaW5lVmlldyksXHJcbiAgICAvKiByZXZlYWxDdXJzb3IgKi8gYXRvbS5jb21tYW5kcy5hZGQoXCJhdG9tLXdvcmtzcGFjZVwiLCBcIm91dGxpbmU6cmV2ZWFsLWN1cnNvclwiLCByZXZlYWxDdXJzb3IpXHJcbiAgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBhZGRPYnNlcnZlcnMoKSB7XHJcbiAgLy8gaWYgdGhlIGFjdGl2ZSB0ZXh0IGVkaXRvciBjaGFuZ2VkIChzd2l0Y2hlZCB0byBhbm90aGVyIGVkaXRvciksIHRoZW4gY2FsbCBlZGl0b3JDaGFuZ2VkIGZ1bmN0aW9uXHJcbiAgc3Vic2NyaXB0aW9ucy5hZGQoYXRvbS53b3Jrc3BhY2Uub25EaWRDaGFuZ2VBY3RpdmVUZXh0RWRpdG9yKGVkaXRvckNoYW5nZWQpKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gZGVhY3RpdmF0ZSgpIHtcclxuICBDYWxsSGllcmFyY2h5LmRlYWN0aXZhdGUoKVxyXG4gIG9uRWRpdG9yQ2hhbmdlZERpc3Bvc2FibGU/LmRpc3Bvc2UoKVxyXG4gIHN1YnNjcmlwdGlvbnMuZGlzcG9zZSgpXHJcbiAgdmlldz8uZGVzdHJveSgpXHJcbiAgdmlldyA9IHVuZGVmaW5lZFxyXG59XHJcblxyXG4vLyBleHBvcnQgZnVuY3Rpb24gY29uc3VtZVNpZ25hbChyZWdpc3RyeTogQnVzeVNpZ25hbFJlZ2lzdHJ5KSB7XHJcbi8vICAgYnVzeVNpZ25hbFByb3ZpZGVyID0gcmVnaXN0cnkuY3JlYXRlKClcclxuLy8gICBzdWJzY3JpcHRpb25zLmFkZChidXN5U2lnbmFsUHJvdmlkZXIpXHJcbi8vIH1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjb25zdW1lT3V0bGluZVByb3ZpZGVyKHByb3ZpZGVyOiBPdXRsaW5lUHJvdmlkZXIpIHtcclxuICBzdWJzY3JpcHRpb25zLmFkZCgvKiAgcHJvdmlkZXJSZWdpc3RyeUVudHJ5ICovIG91dGxpbmVQcm92aWRlclJlZ2lzdHJ5LmFkZFByb3ZpZGVyKHByb3ZpZGVyKSlcclxuXHJcbiAgLy8gTk9URSBHZW5lcmF0ZSAodHJ5KSBhbiBvdXRsaW5lIGFmdGVyIG9idGFpbmluZyBhIHByb3ZpZGVyIGZvciB0aGUgY3VycmVudCBhY3RpdmUgZWRpdG9yXHJcbiAgLy8gdGhpcyBpbml0aWFsIG91dGxpbmUgaXMgYWx3YXlzIHJlbmRlcmVkIG5vIG1hdHRlciBpZiBpdCBpcyB2aXNpYmxlIG9yIG5vdCxcclxuICAvLyB0aGlzIGlzIGJlY2F1c2Ugd2UgY2FuJ3QgdHJhY2sgaWYgdGhlIG91dGxpbmUgdGFiIGJlY29tZXMgdmlzaWJsZSBzdWRkZW5seSBsYXRlcixcclxuICAvLyBvciBpZiB0aGUgZWRpdG9yIGNoYW5nZXMgbGF0ZXIgb25jZSBvdXRsaW5lIGlzIHZpc2libGVcclxuICAvLyBzbyB3ZSBuZWVkIHRvIGhhdmUgYW4gb3V0bGluZSBmb3IgdGhlIGN1cnJlbnQgZWRpdG9yXHJcbiAgLy8gdGhlIGZvbGxvd2luZyB1cGRhdGVzIHJlbHkgb24gdGhlIHZpc2liaWxpdHlcclxuICBhd2FpdCBnZXRPdXRsaW5lKClcclxufVxyXG5cclxuLy8gZGlzcG9zYWJsZXMgcmV0dXJuZWQgaW5zaWRlIG9uRWRpdG9yQ2hhbmdlZERpc3Bvc2FibGVcclxubGV0IG9uRWRpdG9yQ2hhbmdlZERpc3Bvc2FibGU6IENvbXBvc2l0ZURpc3Bvc2FibGUgfCB1bmRlZmluZWQgPSB1bmRlZmluZWRcclxuXHJcbmFzeW5jIGZ1bmN0aW9uIGVkaXRvckNoYW5nZWQoZWRpdG9yPzogVGV4dEVkaXRvcikge1xyXG4gIGlmIChlZGl0b3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgcmV0dXJuXHJcbiAgfVxyXG4gIC8vIGRpc3Bvc2UgdGhlIG9sZCBzdWJzY3JpcHRpb25zXHJcbiAgb25FZGl0b3JDaGFuZ2VkRGlzcG9zYWJsZT8uZGlzcG9zZSgpXHJcbiAgb25FZGl0b3JDaGFuZ2VkRGlzcG9zYWJsZSA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCkgLy8gd2UgY2FuJ3QgcmV1c2UgdGhlIENvbXBvc2l0ZURpc3Bvc2FibGUhXHJcblxyXG4gIC8vIE5PVEUgaW5pdGlhbCBvdXRsaW5lIGlzIGFsd2F5cyByZW5kZXJlZCBubyBtYXR0ZXIgaWYgaXQgaXMgdmlzaWJsZSBvciBub3QsXHJcbiAgLy8gdGhpcyBpcyBiZWNhdXNlIHdlIGNhbid0IHRyYWNrIGlmIHRoZSBvdXRsaW5lIHRhYiBiZWNvbWVzIHZpc2libGUgc3VkZGVubHksXHJcbiAgLy8gc28gd2UgYWx3YXlzIG5lZWQgdG8gc2hvdyB0aGUgb3V0bGluZSBmb3IgdGhlIGNvcnJlY3QgZmlsZVxyXG4gIC8vIHRoZSBmb2xsb3dpbmcgdXBkYXRlcyByZWx5IG9uIHRoZSB2aXNpYmlsaXR5XHJcbiAgYXdhaXQgZ2V0T3V0bGluZShlZGl0b3IpXHJcblxyXG4gIGNvbnN0IGxhcmdlbmVzcyA9IGVkaXRvckxhcmdlbmVzcyhlZGl0b3IgYXMgVGV4dEVkaXRvcilcclxuICAvLyBIb3cgbG9uZyB0byB3YWl0IGZvciB0aGUgbmV3IGNoYW5nZXMgYmVmb3JlIHVwZGF0aW5nIHRoZSBvdXRsaW5lLlxyXG4gIC8vIEEgaGlnaCBudW1iZXIgd2lsbCBpbmNyZWFzZSB0aGUgcmVzcG9uc2l2ZW5lc3Mgb2YgdGhlIHRleHQgZWRpdG9yIGluIGxhcmdlIGZpbGVzLlxyXG4gIGNvbnN0IHVwZGF0ZURlYm91bmNlVGltZSA9IE1hdGgubWF4KGxhcmdlbmVzcyAvIDQsIDMwMCkgLy8gMS80IG9mIHRoZSBsaW5lIGNvdW50XHJcblxyXG4gIGNvbnN0IGRvdWJvdW5jZWRHZXRPdXRsaW5lID0gZGVib3VuY2UoXHJcbiAgICBnZXRPdXRsaW50SWZWaXNpYmxlIGFzICh0ZXh0RWRpdG9yOiBUZXh0RWRpdG9yKSA9PiBQcm9taXNlPHZvaWQ+LFxyXG4gICAgdXBkYXRlRGVib3VuY2VUaW1lXHJcbiAgKVxyXG5cclxuICBvbkVkaXRvckNoYW5nZWREaXNwb3NhYmxlLmFkZChcclxuICAgIC8vIHVwZGF0ZSB0aGUgb3V0bGluZSBpZiBlZGl0b3Igc3RvcHMgY2hhbmdpbmdcclxuICAgIGVkaXRvci5vbkRpZFN0b3BDaGFuZ2luZyhhc3luYyAoKSA9PiB7XHJcbiAgICAgIGF3YWl0IGRvdWJvdW5jZWRHZXRPdXRsaW5lKGVkaXRvcilcclxuICAgIH0pLFxyXG5cclxuICAgIC8vIGNsZWFuIHVwIGlmIHRoZSBlZGl0b3IgZWRpdG9yIGlzIGNsb3NlZFxyXG4gICAgZWRpdG9yLm9uRGlkRGVzdHJveSgoKSA9PiB7XHJcbiAgICAgIHNldFN0YXR1cyhcIm5vRWRpdG9yXCIpXHJcbiAgICB9KVxyXG4gIClcclxufVxyXG5cclxuZXhwb3J0IGZ1bmN0aW9uIHJldmVhbEN1cnNvcigpIHtcclxuICBjb25zdCBlZGl0b3IgPSBhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKClcclxuICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuXHJcbiAgLy8gZm9sbG93aW5nIGN1cnNvciBkaXNwb3NhYmxlXHJcbiAgaWYgKHZpZXcgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgdmlldy5zZWxlY3RBdEN1cnNvckxpbmUoZWRpdG9yKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIHRvZ2dsZU91dGxpbmVWaWV3KCkge1xyXG4gIGlmICh2aWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZpZXcgPSBuZXcgT3V0bGluZVZpZXcoKSAvLyBjcmVhdGUgb3V0bGluZSBwYW5lXHJcbiAgfVxyXG4gIGNvbnN0IG91dGxpbmVQYW5lID0gYXRvbS53b3Jrc3BhY2UucGFuZUZvckl0ZW0odmlldylcclxuICBpZiAob3V0bGluZVBhbmUpIHtcclxuICAgIGF3YWl0IG91dGxpbmVQYW5lLmRlc3Ryb3lJdGVtKHZpZXcpXHJcbiAgICByZXR1cm5cclxuICB9XHJcblxyXG4gIGNvbnN0IHJpZ2h0RG9jayA9IGF0b20ud29ya3NwYWNlLmdldFJpZ2h0RG9jaygpXHJcbiAgY29uc3QgW3BhbmVdID0gcmlnaHREb2NrLmdldFBhbmVzKClcclxuXHJcbiAgcGFuZS5hZGRJdGVtKHZpZXcpXHJcbiAgcGFuZS5hY3RpdmF0ZUl0ZW0odmlldylcclxuXHJcbiAgcmlnaHREb2NrLnNob3coKVxyXG5cclxuICAvLyBUcmlnZ2VyIGFuIGVkaXRvciBjaGFuZ2Ugd2hlbmV2ZXIgYW4gb3V0bGluZSBpcyB0b2dnZWxlZC5cclxuICB0cnkge1xyXG4gICAgYXdhaXQgZWRpdG9yQ2hhbmdlZChhdG9tLndvcmtzcGFjZS5nZXRBY3RpdmVUZXh0RWRpdG9yKCkpXHJcbiAgfSBjYXRjaCAoZSkge1xyXG4gICAgbm90aWZ5RXJyb3IoZSBhcyBFcnJvcilcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE91dGxpbnRJZlZpc2libGUoZWRpdG9yID0gYXRvbS53b3Jrc3BhY2UuZ2V0QWN0aXZlVGV4dEVkaXRvcigpKSB7XHJcbiAgLy8gaWYgb3V0bGluZSBpcyBub3QgdmlzaWJsZSByZXR1cm5cclxuICBpZiAoIWlzSXRlbVZpc2libGUodmlldykpIHtcclxuICAgIHJldHVyblxyXG4gIH1cclxuICByZXR1cm4gZ2V0T3V0bGluZShlZGl0b3IpXHJcbn1cclxuXHJcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRPdXRsaW5lKGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKSkge1xyXG4gIGlmICh2aWV3ID09PSB1bmRlZmluZWQpIHtcclxuICAgIHZpZXcgPSBuZXcgT3V0bGluZVZpZXcoKSAvLyBjcmVhdGUgb3V0bGluZSBwYW5lXHJcbiAgfSBlbHNlIHtcclxuICAgIHZpZXcucmVzZXQoKVxyXG4gIH1cclxuICAvLyBlZGl0b3JcclxuICBpZiAoZWRpdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgIHJldHVybiBzZXRTdGF0dXMoXCJub0VkaXRvclwiKVxyXG4gIH1cclxuXHJcbiAgLy8gcHJvdmlkZXJcclxuICBjb25zdCBwcm92aWRlciA9IG91dGxpbmVQcm92aWRlclJlZ2lzdHJ5LmdldFByb3ZpZGVyRm9yRWRpdG9yKGVkaXRvcilcclxuXHJcbiAgaWYgKCFwcm92aWRlcikge1xyXG4gICAgcmV0dXJuIHNldFN0YXR1cyhcIm5vUHJvdmlkZXJcIilcclxuICB9XHJcblxyXG4gIC8vIGNvbnN0IGJ1c3lTaWduYWxJRCA9IGBPdXRsaW5lOiAke2VkaXRvci5nZXRQYXRoKCl9YFxyXG4gIC8vIGJ1c3lTaWduYWxQcm92aWRlcj8uYWRkKGJ1c3lTaWduYWxJRClcclxuXHJcbiAgY29uc3Qgb3V0bGluZSA9IGF3YWl0IHByb3ZpZGVyLmdldE91dGxpbmUoZWRpdG9yKVxyXG4gIHZpZXcuc2V0T3V0bGluZShvdXRsaW5lPy5vdXRsaW5lVHJlZXMgPz8gW10sIGVkaXRvciwgQm9vbGVhbihlZGl0b3JMYXJnZW5lc3MoZWRpdG9yIGFzIFRleHRFZGl0b3IpKSlcclxuXHJcbiAgLy8gYnVzeVNpZ25hbFByb3ZpZGVyPy5yZW1vdmUoYnVzeVNpZ25hbElEKVxyXG59XHJcblxyXG5leHBvcnQgZnVuY3Rpb24gc2V0U3RhdHVzKGlkOiBcIm5vRWRpdG9yXCIgfCBcIm5vUHJvdmlkZXJcIiB8IFwibm9SZXN1bHRcIikge1xyXG4gIHZpZXc/LnByZXNlbnRTdGF0dXMoc3RhdHVzZXNbaWRdKVxyXG59XHJcblxyXG5leHBvcnQgeyBkZWZhdWx0IGFzIGNvbmZpZyB9IGZyb20gXCIuL2NvbmZpZy5qc29uXCJcclxuIl0sIm5hbWVzIjpbInNjcm9sbEludG9WaWV3IiwiZWwiLCJhbGlnblRvVG9wIiwic2Nyb2xsVG9wcyIsImdldFNjcm9sbFRvcHMiLCJyZXN0b3JlT3ZlcmZsb3dIaWRkZW5TY3JvbGxUb3BzIiwic2Nyb2xsSW50b1ZpZXdJZk5lZWRlZCIsImNlbnRlciIsImVsXyIsIk1hcCIsInNldCIsInNjcm9sbFRvcCIsInBhcmVudEVsZW1lbnQiLCJmb3JFYWNoIiwiaXNPdmVyZmxvd0hpZGRlbiIsIm92ZXJmbG93U3R5bGUiLCJzdHlsZSIsIm92ZXJmbG93IiwiZ2V0Q29tcHV0ZWRTdHlsZSIsImlzSXRlbVZpc2libGUiLCJpdGVtIiwidW5kZWZpbmVkIiwiZWxlbWVudCIsImdldEl0ZW1FbGVtZW50IiwiaXNFbGVtZW50VmlzaWJsZSIsInBhbmVDb250YWluZXIiLCJhdG9tIiwid29ya3NwYWNlIiwicGFuZUNvbnRhaW5lckZvckl0ZW0iLCJpc1Zpc2libGUiLCJIVE1MRWxlbWVudCIsImRpc3BsYXkiLCJoaWRkZW4iLCJvZmZzZXRIZWlnaHQiLCJnZXRFbGVtZW50IiwiaGFzT3duUHJvcGVydHkiLCJUcmVlRmlsdGVyZXIiLCJUZXh0RWRpdG9yIiwic29ydEVudHJpZXMiLCJhdG9tXzEiLCJzdGF0dXNlcyIsImlzT2JqZWN0IiwiZnJlZUdsb2JhbCIsImdsb2JhbCIsInJlcXVpcmUkJDAiLCJyb290Iiwibm93IiwidHJpbW1lZEVuZEluZGV4IiwiYmFzZVRyaW0iLCJTeW1ib2wiLCJvYmplY3RQcm90byIsIm5hdGl2ZU9iamVjdFRvU3RyaW5nIiwic3ltVG9TdHJpbmdUYWciLCJnZXRSYXdUYWciLCJvYmplY3RUb1N0cmluZyIsInJlcXVpcmUkJDEiLCJyZXF1aXJlJCQyIiwiYmFzZUdldFRhZyIsImlzT2JqZWN0TGlrZSIsImlzU3ltYm9sIiwidG9OdW1iZXIiLCJDb21wb3NpdGVEaXNwb3NhYmxlIiwiZGVib3VuY2UiLCJQcm92aWRlclJlZ2lzdHJ5Iiwic3Vic2NyaXB0aW9ucyIsImFjdGl2YXRlIiwiZGVhY3RpdmF0ZSIsIkNhbGxIaWVyYXJjaHkuYWN0aXZhdGUiLCJub3RpZnlFcnJvciIsIkNhbGxIaWVyYXJjaHkuZGVhY3RpdmF0ZSIsImVkaXRvckxhcmdlbmVzcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRU8sU0FBU0EsY0FBVCxDQUF3QkMsRUFBeEIsRUFBcUNDLFVBQXJDLEVBQWlFO0FBQ3RFLFFBQU1DLFVBQVUsR0FBR0MsYUFBYSxDQUFDSCxFQUFELENBQWhDO0FBQ0FBLEVBQUFBLEVBQUUsQ0FBQ0QsY0FBSCxDQUFrQkUsVUFBbEI7QUFDQUcsRUFBQUEsK0JBQStCLENBQUNGLFVBQUQsQ0FBL0I7QUFDRDs7QUFJTSxTQUFTRyxzQkFBVCxDQUFnQ0wsRUFBaEMsRUFBNkNNLE1BQWUsR0FBRyxJQUEvRCxFQUEyRTtBQUFBOztBQUNoRixRQUFNSixVQUFVLEdBQUdDLGFBQWEsQ0FBQ0gsRUFBRCxDQUFoQztBQUFBO0FBRUMsNkRBQUNBLEVBQUQsRUFBd0JLLHNCQUF4Qiw2RkFBaURDLE1BQWpELDBFQUE0RE4sRUFBRSxDQUFDRCxjQUFILENBQWtCTyxNQUFsQixDQUE1RDtBQUNE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
