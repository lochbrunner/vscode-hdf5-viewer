const ReactDOM = require('react-dom');
import React from 'react';

import { Client, GroupItem } from './requester';
import { Group } from './group';

import './index.scss';


interface Props {
    client: Client;
}

function Page(props: Props) {
    const item: GroupItem = {
        path: '/',
        name: 'root',
        type: 'group',
        attributes: {}
    }
    return (
        <div>
            <Group item={item} client={props.client} />
        </div>
    );
}

const client = new Client();

ReactDOM.render(
    <Page client={client} />,
    document.getElementById('root')
);