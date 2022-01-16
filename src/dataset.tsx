import { Client, DatasetItem } from './requester';
import React from 'react';

import DataArrayIcon from '@mui/icons-material/DataArray';

import './dataset.scss';
import { Attributes } from './attributes';
import { Dimensions } from './dimensions';

export interface Props {
    client: Client;
    item: DatasetItem;
}


export function Dataset(props: Props) {
    return (
        <div className="dataset">
            <DataArrayIcon />
            <span>{props.item.name}</span>
            <Attributes attributes={props.item.attributes} />
            <Dimensions dimensions={props.item.dimensions} />
        </div>
    );
}