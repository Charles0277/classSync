import axios from 'axios';
import createRefresh from 'react-auth-kit/createRefresh';

export const refresh = createRefresh({
    interval: 1500,
    refreshApiCallback: async (param) => {
        try {
            const response = await axios.post('/refresh', param, {
                headers: { Authorization: `Bearer ${param.authToken}` }
            });
            console.log('Refreshing Access Token');
            return {
                isSuccess: true,
                newAuthToken: response.data.token,
                newAuthTokenExpireIn: 1800,
                newRefreshTokenExpiresIn: 604800
            };
        } catch (error) {
            console.error(error);
            return {
                isSuccess: false,
                newAuthToken: '',
                newAuthTokenExpireIn: 0,
                newRefreshTokenExpiresIn: 0
            };
        }
    }
});
