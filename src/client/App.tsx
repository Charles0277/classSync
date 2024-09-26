import './App.css';

import Sidebar from './components/Sidebar/Sidebar';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import { Provider } from 'react-redux';
import store from './store/store';

function App() {
    return (
        <Provider store={store}>
            <>
                {/* <Sidebar /> */}
                <main className="layout">
                    <RouterProvider router={router} />
                </main>
            </>
        </Provider>
    );
}

export default App;
