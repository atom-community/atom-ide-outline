import { TextEditor } from "atom";
import { OutlineTree } from "atom-ide-base";
export declare class OutlineView {
    element: HTMLDivElement;
    outlineContent: HTMLDivElement;
    private outlineList;
    private pointToElementsMap;
    private focusedElms;
    lastEntries: OutlineTree[] | undefined;
    constructor();
    destroy(): void;
    getElement(): HTMLDivElement;
    getTitle(): string;
    getIconName(): string;
    setOutline(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean): void;
    clearContent(): void;
    presentStatus(status: {
        title: string;
        description: string;
    }): void;
    selectAtCursorLine(editor: TextEditor): void;
}
