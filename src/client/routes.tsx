import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './containers/Home/Home';
import Welcome from './containers/welcome/Welcome';

import { useAuth0 } from '@auth0/auth0-react';
import Loading from './containers/Loading/Loading';

const AppRouter = () => {
    const { isAuthenticated, isLoading } = useAuth0();
    const router = createBrowserRouter([
        {
            path: '/',
            element: isLoading ? (
                <Loading />
            ) : isAuthenticated ? (
                <Home />
            ) : (
                <Welcome />
            )
        }
    ]);

    return <RouterProvider router={router} />;
};

export default AppRouter;
