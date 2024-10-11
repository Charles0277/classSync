import { useEffect } from 'react';
import PageContainer from '../../components/Common/PageContainer/PageContainer';
import { useDispatch, useSelector } from 'react-redux';
import { getUsersRequest } from '../../store/slices/userSlice';
import { useAuth0 } from '@auth0/auth0-react';
import { RootState } from '../../store/store';

const Home = () => {
    const { getAccessTokenSilently } = useAuth0();
    const dispatch = useDispatch();
    const { users } = useSelector((state: RootState) => state.users);
    console.log('🚀 ~ Home ~ users:', users);

    useEffect(() => {
        const fetchTokenAndDispatch = async () => {
            try {
                const token = await getAccessTokenSilently({
                    authorizationParams: {
                        audience:
                            'https://dev-fysr0p33y7g0ih1i.us.auth0.com/api/v2/',
                        scope: 'openid profile email offline_access'
                    }
                });
                dispatch(getUsersRequest({ token: token }));
            } catch (error) {
                console.error('Failed to get token', error);
            }
        };

        fetchTokenAndDispatch();
    }, [getAccessTokenSilently, dispatch]);

    return <PageContainer>Hello World</PageContainer>;
};

export default Home;
