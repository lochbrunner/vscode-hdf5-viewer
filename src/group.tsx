import { Client, Item } from './requester';
import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import DataArrayIcon from '@mui/icons-material/DataArray';
import AutorenewIcon from '@mui/icons-material/Autorenew';

import './group.scss'

export interface Props {
    client: Client;
    root: string;
    name: string;
}

export function Group(props: Props) {
    const [items, changeItems] = useState<Item[] | null>(null);
    const [isLoading, startLoading] = useState<boolean>(false);
    const [isCollapsed, collapse] = useState<boolean>(false);
    const load = () => {
        props.client.list(props.root).then(d => { startLoading(false); changeItems(d); });
        startLoading(true);
    }
    if (!items) {
        if (isLoading) {
            return (
                <div className="group">
                    <AutorenewIcon />
                    <span>{props.name}</span>
                </div>
            );
        }
        else {
            return (
                <div className="group">
                    <KeyboardArrowRightIcon onClick={load} className="load-button" />
                    <span>{props.name}</span>
                </div>
            );
        }
    }
    else {
        const tree = items.map((data, i) => {
            if (data.isGroup) {
                return (
                    <li key={i}>
                        <Group client={props.client} root={data.path} name={data.name} />
                    </li>
                );
            } else {
                return (
                    <li className="dataset" key={i}>
                        <DataArrayIcon />
                        <span>{data.name}</span>
                    </li>
                );
            }
        });
        if (isCollapsed) {
            return (
                <div className="group">
                    <KeyboardArrowRightIcon className="open-button" onClick={() => collapse(false)} />
                    <span> {props.name}</span>
                </div>
            );
        } else {
            return (
                <div className="group">
                    <KeyboardArrowDownIcon className="collapse-button" onClick={() => collapse(true)} />
                    <span>{props.name}</span>
                    <ul >
                        {tree}
                    </ul>
                </div>
            );
        }
    }
}