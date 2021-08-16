import type { Disposable } from "atom";
import type { CallHierarchyProvider } from "atom-ide-base";
export declare function activate(): void;
export declare function deactivate(): void;
export declare function consumeCallHierarchyProvider(provider: CallHierarchyProvider): Disposable;
