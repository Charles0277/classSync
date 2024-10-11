import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Auth0Provider } from '@auth0/auth0-react';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Auth0Provider
            domain="dev-fysr0p33y7g0ih1i.us.auth0.com"
            clientId="RGblmRaZdQ3RKfRfeXYCeTDnfFs5U3yf"
            authorizationParams={{
                redirect_uri: window.location.origin,
                audience: 'https://dev-fysr0p33y7g0ih1i.us.auth0.com/api/v2/'
            }}
            useRefreshTokens
            cacheLocation="localstorage"
        >
            <App />
        </Auth0Provider>
    </React.StrictMode>
);
