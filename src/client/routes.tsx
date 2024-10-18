import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './containers/Home/Home';
import Welcome from './containers/welcome/Welcome';
import { RootState } from './store/store';
import { useSelector } from 'react-redux';
import Configuration from './containers/Configurations/Configuration';

const AppRouter = () => {
    const { user, token, isAuthenticated, isLoading } = useSelector(
        (state: RootState) => state.auth
    );
    const router = createBrowserRouter([
        {
            path: '/',
            element: isLoading ? (
                <Home />
            ) : isAuthenticated ? (
                <Home />
            ) : (
                <Welcome />
            )
        },
        {
            path: '/configurations',
            element: <Configuration />
        }
    ]);

    return <RouterProvider router={router} />;
};

export default AppRouter;
