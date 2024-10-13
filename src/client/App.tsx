import './App.css';
import { Provider, useSelector } from 'react-redux';
import store, { RootState } from './store/store';
import AppRouter from './routes';
import Sidebar from './components/Sidebar/Sidebar';
import MainContent from './MainContent';

function App() {
    return (
        <Provider store={store}>
            <MainContent />
        </Provider>
    );
}

export default App;
