import React from 'react';

import './dimensions.scss';

export interface Props {
    dimensions?: number[];
}

export function Dimensions(props: Props) {
    const dims = (props.dimensions || []).map(s => `${s}`).join(' x ')
    return (
        <div className="dimensions">
            {dims}
        </div>
    );
}
