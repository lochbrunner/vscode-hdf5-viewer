import { Client, Item } from './requester';
import React from 'react';

import DataArrayIcon from '@mui/icons-material/DataArray';

import './dataset.scss';
import { Attributes } from './attributes';

export interface Props {
    client: Client;
    item: Item;
}


export function Dataset(props: Props) {
    return (
        <div className="dataset">
            <DataArrayIcon />
            <span>{props.item.name}</span>
            <Attributes attributes={props.item.attributes} />
        </div>
    );
}