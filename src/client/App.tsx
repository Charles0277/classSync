import { Provider } from 'react-redux';
import './App.css';
import MainContent from './MainContent';
import store from './store/store';
import { Toaster } from './components/ui/sonner';

function App() {
    return (
        <Provider store={store}>
            <Toaster position="bottom-right" />
            <MainContent />
        </Provider>
    );
}

export default App;
