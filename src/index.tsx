const ReactDOM = require('react-dom');
import React from 'react';

import { Client } from './requester';
import { Group } from './group';


interface Props {
    client: Client;
}

function Page(props: Props) {
    return (
        <div>
            <Group root="/" client={props.client} name="root" />
        </div>
    );
}

const client = new Client();

ReactDOM.render(
    <Page client={client} />,
    document.getElementById('root')
);