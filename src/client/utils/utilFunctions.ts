import { useAuth0 } from '@auth0/auth0-react';
import { useCallback } from 'react';

export const useAuthToken = () => {
    const { getAccessTokenSilently } = useAuth0();

    const getToken = useCallback(async () => {
        try {
            const token = await getAccessTokenSilently({
                authorizationParams: {
                    audience:
                        'https://dev-fysr0p33y7g0ih1i.us.auth0.com/api/v2/',
                    scope: 'openid profile email offline_access'
                }
            });
            return token;
        } catch (error) {
            console.error('Failed to get token', error);
            return null;
        }
    }, [getAccessTokenSilently]);

    return getToken;
};
