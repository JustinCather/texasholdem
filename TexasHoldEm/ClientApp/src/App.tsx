import * as React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Table from './components/Table';

import './custom.css'
import GameMenu from './components/GameMenu';
import JoinGame from './components/JoinGame';
import GameSetup from './components/GameSetup';

//export default () => (
//    <Layout>
//        <Route exact path='/' component={Home} />
//        <Route path='/fetch-data/:startDateIndex?' component={FetchData} />
//        <Route path='/texasholdem' component={Poker}/>
//    </Layout>
//);

export default () => (
    <Layout>
        <Route path='/menu' component={GameMenu}/>
        <Route path='/texasholdem' component={Table} />
        <Route path='/join' component={JoinGame} />
        <Route path='/setup' component={GameSetup} />
    </Layout>
);