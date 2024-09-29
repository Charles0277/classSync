import createStore from 'react-auth-kit/createStore';

interface IUserData {
    name: string;
    uuid: string;
}

export const authStore = createStore<IUserData>({
    authName: '_auth',
    authType: 'cookie',
    cookieDomain: window.location.hostname,
    cookieSecure: window.location.protocol === 'https:'
});
