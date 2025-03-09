import { jwtDecode } from 'jwt-decode';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { LoadingScreen } from './components/LoadingScreen/LoadingScreen';
import Sidebar from './components/Sidebar/Sidebar';
import Configuration from './containers/Configurations/Configuration';
import { Feedback } from './containers/Feedback/Feedback';
import Home from './containers/Home/Home';
import { ManageFriends } from './containers/ManageFriends/ManageFriends';
import Welcome from './containers/Welcome/Welcome';
import { RESET_STATE } from './store/rootReducer';
import { checkAuthenticationRequest, logOut } from './store/slices/authSlice';
import { RootState } from './store/store';

function MainContent() {
    const { isAuthenticated, isLoading, user } = useSelector(
        (state: RootState) => state.auth
    );
    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            return;
        }
        const decodedToken: any = jwtDecode(token);
        if (decodedToken.exp * 1000 < Date.now()) {
            dispatch(logOut());
            dispatch({ type: RESET_STATE });
        } else if (decodedToken.userEmail) {
            dispatch(
                checkAuthenticationRequest({
                    email: decodedToken.userEmail
                })
            );
        }
    }, [dispatch]);

    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <BrowserRouter>
            {isAuthenticated && <Sidebar />}
            <main className="layout">
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Home /> : <Welcome />}
                    />
                    <Route
                        path="/manage-friends"
                        element={
                            isAuthenticated ? <ManageFriends /> : <Welcome />
                        }
                    />
                    <Route
                        path="/feedback"
                        element={isAuthenticated ? <Feedback /> : <Welcome />}
                    />
                    <Route
                        path="/configurations"
                        element={
                            isAuthenticated && user?.role === 'admin' ? (
                                <Configuration />
                            ) : (
                                <Home />
                            )
                        }
                    />
                </Routes>
            </main>
        </BrowserRouter>
    );
}

export default MainContent;
