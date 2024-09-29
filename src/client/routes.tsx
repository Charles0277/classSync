import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Home from './containers/Home/Home';
import Welcome from './containers/welcome/Welcome';

import { useAuth0 } from '@auth0/auth0-react';

const AppRouter = () => {
    const { isAuthenticated, isLoading, user } = useAuth0();
    console.log('🚀 ~ AppRouter ~ user:', user);
    console.log('🚀 ~ AppRouter ~ isLoading:', isLoading);
    console.log('🚀 ~ AppRouter ~ isAuthenticated:', isAuthenticated);

    const router = createBrowserRouter([
        {
            path: '/',
            element: isAuthenticated && !isLoading ? <Home /> : <Welcome />
        }
    ]);

    return <RouterProvider router={router} />;
};

export default AppRouter;
