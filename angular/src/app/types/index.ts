export interface Cell {
    row: number;
    col: number;
    item?: string;
}

export type GridWidgetSource = Record<string, GridWidget>;

export type GridWidget = {
    row: number;
    col: number;
} & MenuItem;

export interface MenuItem {
    item: MenuItemData;
    data: EntityData<string> | EntityData<number>;
}

export interface MenuItemData {
    id: string;
    label: string;
    width: number;
    height: number;
}

export interface EntityData<T> {
    type: string;
    value: T;
    metadata?: {
        icon: EntityMetadata<string>,
        measures: EntityMetadata<string> | EntityMetadata<number>,
        title: EntityMetadata<string>
    }
}

export interface EntityMetadata<T> {
    type: string;
    value: T;
}