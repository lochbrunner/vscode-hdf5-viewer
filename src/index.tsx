const ReactDOM = require('react-dom');
import React from 'react';

import { Client } from './requester';
import { Group } from './group';

import './index.scss';


interface Props {
    client: Client;
}

function Page(props: Props) {
    const item = {
        path: '/',
        name: 'root',
        isGroup: true,
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