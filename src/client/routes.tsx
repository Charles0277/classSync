import { createBrowserRouter } from 'react-router-dom';
import Home from './containers/Home/Home';
import Welcome from './containers/welcome/Welcome';

const router = createBrowserRouter([
    { path: '/', element: <Welcome /> },
    { path: 'home', element: <Home /> }
]);

export default router;
