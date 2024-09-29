import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import store from './store/store';
import AppRouter from './routes';
import { useAuth0 } from '@auth0/auth0-react';

function App() {
    const { isAuthenticated } = useAuth0();

    return (
        <Provider store={store}>
            <>
                {isAuthenticated && <Sidebar />}
                <main className="layout">
                    <AppRouter />
                </main>
            </>
        </Provider>
    );
}

export default App;
