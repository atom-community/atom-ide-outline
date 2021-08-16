export declare class TabHandler<T extends object> {
    #private;
    item: T | undefined;
    constructor({ createItem, }: {
        createItem: () => T;
    });
    toggle(): void;
    show(): void;
    delete(): void;
}
