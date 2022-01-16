import React from 'react';

import './attributes.scss';

export interface Props {
    attributes?: { [name: string]: string };
}

export function Attributes(props: Props) {
    const items = Object.entries(props.attributes || []).map(([name, value], i) => <span key={i}>{`${name}: ${value}`}</span>)
    return (
        <div className="attributes">
            {items}
        </div>
    );
}
