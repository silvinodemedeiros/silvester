export interface Cell {
    row: number;
    col: number;
    item?: string;
}

export interface MenuItem {
    item: {
        id: string;
        label: string;
        width: number;
        height: number;
    };
    data: MenuItemData;
}

export interface MenuItemData {
    type: string;
    value: string;
    metadata?: {
        icon: EntityStringMetadata,
        measures: EntityStringMetadata,
        title: EntityStringMetadata
    }
}

export interface EntityStringMetadata {
    type: string;
    value: string;
}

export interface EntityNumberMetadata {
    type: string;
    value: number;
}