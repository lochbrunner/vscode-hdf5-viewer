const ReactDOM = require('react-dom');
import React, { useState } from 'react';

import { Client, Item } from './requester';


interface GroupProps {
    client: Client;
    root: string;
}

function Group(props: GroupProps) {
    const [items, changeItems] = useState<Item[] | null>(null);
    if (!items) {
        props.client.list(props.root).then(changeItems);
        return (
            <p>Loading ...</p>
        );
    }
    else {
        const tree = items.map((data, i) => {
            if (data.isGroup) {
                return (
                    <li key={i}>
                        <span>{data.name}</span>
                        <Group client={props.client} root={data.path} />
                    </li>
                );
            } else {
                return <li key={i}>{data.name}</li>;
            }
        })
        return (
            <ul>
                {tree}
            </ul>
        );
    }
}

interface Props {
    client: Client;
}

function Page(props: Props) {
    return (
        <div>
            <p>Items</p>
            <Group root="/" client={props.client} />
        </div>
    );
}

const client = new Client();

ReactDOM.render(
    <Page client={client} />,
    document.getElementById('root')
);