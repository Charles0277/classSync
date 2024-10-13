import { useDispatch, useSelector } from 'react-redux';
import { RootState } from './store/store';
import Sidebar from './components/Sidebar/Sidebar';
import AppRouter from './routes';
import { useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { checkAuthenticationRequest, logOut } from './store/slices/authSlice';

function MainContent() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            const decodedToken: any = jwtDecode(token);
            if (decodedToken.exp * 1000 < Date.now()) {
                dispatch(logOut());
            } else if (decodedToken.userEmail) {
                dispatch(
                    checkAuthenticationRequest({
                        email: decodedToken.userEmail
                    })
                );
            }
        }
    }, []);

    return (
        <>
            {isAuthenticated && <Sidebar />}
            <main className="layout">
                <AppRouter />
            </main>
        </>
    );
}

export default MainContent;
