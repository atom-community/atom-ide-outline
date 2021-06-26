import { TextEditor } from "atom";
import type { OutlineTree } from "atom-ide-base";
export declare class OutlineView {
    element: HTMLDivElement;
    outlineContent: HTMLDivElement;
    private outlineList;
    private pointToElementsMap;
    private focusedElms;
    lastEntries: OutlineTree[] | undefined;
    private treeFilterer;
    searchBarEditor: TextEditor | undefined;
    private searchBarEditorDisposable;
    private selectCursorDisposable;
    constructor();
    reset(): void;
    destroy(): void;
    getElement(): HTMLDivElement;
    getTitle(): string;
    getIconName(): string;
    setOutline(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean): void;
    createOutlineList(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean): void;
    clearContent(): void;
    updateSearchBar(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean): void;
    createSearchBar(): HTMLDivElement;
    renderLastOutlienList(): void;
    filterOutlineTree(editor: TextEditor, isLarge: boolean): void;
    presentStatus(status: {
        title: string;
        description: string;
    }): void;
    selectAtCursorLine(editor: TextEditor): void;
}
