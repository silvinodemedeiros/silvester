export interface Cell {
    row: number;
    col: number;
    item?: string;
}

export interface MenuWidget {
    item: {
        id: string;
        label: string;
        width: number;
        height: number;
    };
    data: MenuWidgetData;
}

export interface MenuWidgetData {
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