import { Client, GroupItem, Item } from './requester';
import React, { useState } from 'react';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Attributes } from './attributes';

import './group.scss';
import { Dataset } from './dataset';


export interface Props {
    client: Client;
    item: GroupItem;
}

export function Group(props: Props) {
    const [items, changeItems] = useState<Item[] | null>(null);
    const [isLoading, startLoading] = useState<boolean>(false);
    const [isCollapsed, collapse] = useState<boolean>(false);
    const load = () => {
        props.client.list(props.item.path).then(d => { startLoading(false); changeItems(d); });
        startLoading(true);
    }
    if (!items) {
        if (isLoading) {
            return (
                <div className="group">
                    <AutorenewIcon />
                    <span>{props.item.name}</span>
                    <Attributes attributes={props.item.attributes} />
                </div>
            );
        }
        else {
            return (
                <div className="group">
                    <KeyboardArrowRightIcon onClick={load} className="load-button" />
                    <span>{props.item.name}</span>
                    <Attributes attributes={props.item.attributes} />
                </div>
            );
        }
    }
    else {
        const tree = items.map((data, i) => {
            if (data.type == 'group') {
                return (
                    <li key={i}>
                        <Group client={props.client} item={data} />
                    </li>
                );
            } else if (data.type === 'dataset') {
                return (
                    <li className="dataset" key={i}>
                        <Dataset client={props.client} item={data} />
                    </li>
                );
            } else {
                return <li>
                    Unknown type {data.type}
                </li>
            }
        });
        if (isCollapsed) {
            return (
                <div className="group">
                    <KeyboardArrowRightIcon className="open-button" onClick={() => collapse(false)} />
                    <span> {props.item.name}</span>
                    <Attributes attributes={props.item.attributes} />
                </div>
            );
        } else {
            return (
                <div className="group">
                    <KeyboardArrowDownIcon className="collapse-button" onClick={() => collapse(true)} />
                    <span>{props.item.name}</span>
                    <Attributes attributes={props.item.attributes} />
                    <ul >
                        {tree}
                    </ul>
                </div>
            );
        }
    }
}