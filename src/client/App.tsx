import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import store from './store/store';
import AuthProvider from 'react-auth-kit';
import { authStore } from './auth/createStore';

function App() {
    return (
        <AuthProvider store={authStore}>
            <Provider store={store}>
                <>
                    {/* <Sidebar /> */}
                    <main className="layout">
                        <RouterProvider router={router} />
                    </main>
                </>
            </Provider>
        </AuthProvider>
    );
}

export default App;
