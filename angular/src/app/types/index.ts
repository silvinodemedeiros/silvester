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
    data: EntityData<string> | EntityData<number> | EntityData<LocationValue>;
}

export interface MenuItemData {
    id: string;
    label: string;
    width: number;
    height: number;
}

export interface LocationValue {lat: number, lng: number}

export interface EntityData<T> {
    type: string;
    value: T;
    metadata?: {
        icon?: EntityMetadata<string>,
        measures?: EntityMetadata<string> | EntityMetadata<number>,
        title?: EntityMetadata<string>,
        weather?: EntityMetadata<string>
    }
}

export interface EntityMetadata<T> {
    type: string;
    value: T;
}

export const EMPTY_WIDGET = {
    item: {
        id: 'empty',
        label: 'empty',
        width: 2,
        height: 2
    },
    data: {
        type: 'EMPTY',
        value: '#',
        metadata: {
            icon: {
                type: 'string',
                value: 'bootstrapQuestion'
            },
            measures: {
                type: 'string',
                value: 'EMPTY'
            },
            title: {
                type: 'string',
                value: 'no title'
            }
        } 
    }
}