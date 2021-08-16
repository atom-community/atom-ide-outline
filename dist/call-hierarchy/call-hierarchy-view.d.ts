import type { Point, TextEditor } from "atom";
import type { ProviderRegistry } from "atom-ide-base/commons-atom/ProviderRegistry";
import type { CallHierarchy, CallHierarchyProvider, CallHierarchyType } from "atom-ide-base";
import statuses from "./statuses.json";
declare type statusKey = keyof typeof statuses;
export declare class CallHierarchyView extends HTMLElement {
    #private;
    destroyed: boolean;
    getTitle: () => string;
    getIconName: () => string;
    static getStatus(data: CallHierarchy<CallHierarchyType> | statusKey | null | undefined): statusKey | "valid";
    constructor({ providerRegistry }: {
        providerRegistry: ProviderRegistry<CallHierarchyProvider>;
    });
    showCallHierarchy(editor?: TextEditor, point?: Point): Promise<void>;
    destroy(): void;
}
export {};
