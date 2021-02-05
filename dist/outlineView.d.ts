import { TextEditor, CursorPositionChangedEvent } from "atom";
import { OutlineTree } from "atom-ide-base";
export declare class OutlineView {
    element: HTMLDivElement;
    private pointToElementsMap;
    private focusedElms;
    constructor();
    destroy(): void;
    getElement(): HTMLDivElement;
    getTitle(): string;
    getIconName(): string;
    setOutline(outlineTree: OutlineTree[], editor: TextEditor, isLarge: boolean): void;
    clearOutline(): HTMLDivElement;
    presentStatus(status: {
        title: string;
        description: string;
    }): void;
    selectAtCursorLine(newBufferPosition: CursorPositionChangedEvent["newBufferPosition"]): void;
    isVisible(): boolean;
}
