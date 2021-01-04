/*
 * Welcome to your app's main JavaScript file!
 *
 * We recommend including the built version of this JavaScript file
 * (and its CSS file) in your base layout (base.html.twig).
 */

// any CSS you import will output into a single css file (app.css in this case)

import React from 'react';
import ReactDOM from 'react-dom';

import './styles/app.css';

// start the Stimulus application
import './bootstrap';
import Navbar from "./scripts/components/Navbar";
import HomePage from "./scripts/pages/HomePage";
import { HashRouter, Switch, Route } from "react-router-dom";
import CustomersPage from "./scripts/pages/CustomersPage";
import InvoicesPage from "./scripts/pages/InvoicesPage";

// Need jQuery? Install it with "yarn add jquery", then uncomment to import it.
// import $ from 'jquery';

// console.log('Hello Webpack Encore df!! Edit me in assets/app.js');

const App = () => {
    return (
        <HashRouter>
            <Navbar/>

            <main className="container pt-5">
                <Switch>
                    <Route path="/invoices" component={InvoicesPage} />
                    <Route path="/customers" component={CustomersPage} />
                    <Route path="/" component={HomePage} />
                </Switch>
                {/*<HomePage />*/}
            </main>
        </HashRouter>
    );
};

const rootElement = document.querySelector('#app')
ReactDOM.render(<App />, rootElement)
