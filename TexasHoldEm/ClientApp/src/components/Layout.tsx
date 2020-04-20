import * as React from 'react';
import { Container } from 'reactstrap';

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <div id='container-div' style={{ height: '100vH', backgroundColor: 'darkslategray', position: 'relative' }}>
            {props.children}
        </div>
    </React.Fragment>
);
