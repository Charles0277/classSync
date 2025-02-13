import MainContent from '@/client/MainContent.tsx';
import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/client/containers/Home/Home', () => ({
    default: () => <div>Home</div>
}));
vi.mock('@/client/containers/Welcome/Welcome', () => ({
    default: () => <div>Welcome</div>
}));
vi.mock('@/client/containers/Configurations/Configuration', () => ({
    default: () => <div>Configuration</div>
}));
vi.mock('@/client/components/Sidebar/Sidebar', () => ({
    default: () => <div>Sidebar</div>
}));

function createTestStore(authState: any, scheduleState?: any) {
    const dummyReducer = (
        state = {
            auth: authState,
            schedule: scheduleState
        },
        action: any
    ) => state;
    return createStore(dummyReducer);
}

describe('MainContent', () => {
    beforeEach(() => {
        cleanup();
        window.history.pushState({}, 'Test page', '/');
        localStorage.clear();
    });

    it('renders Welcome page if not authenticated and not loading', () => {
        const store = createTestStore({
            isAuthenticated: false,
            isLoading: false,
            user: null
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Welcome')).toBeDefined();
        expect(screen.queryByText('Sidebar')).toBeNull();
    });

    it('renders Home and Sidebar when authenticated and not loading on "/"', () => {
        const store = createTestStore({
            isAuthenticated: true,
            isLoading: false,
            user: { role: 'user' }
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Home')).toBeDefined();
        expect(screen.getByText('Sidebar')).toBeDefined();
        expect(screen.queryByText('Welcome')).toBeNull();
    });

    it('renders Home on "/" route when isLoading is true', () => {
        const store = createTestStore({
            isAuthenticated: false,
            isLoading: true,
            user: null
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Home')).toBeDefined();
        expect(screen.queryByText('Sidebar')).toBeNull();
    });

    it('renders Configuration on "/configurations" route for admin user when not loading', () => {
        window.history.pushState({}, 'Configurations', '/configurations');

        const store = createTestStore({
            isAuthenticated: true,
            isLoading: false,
            user: { role: 'admin' }
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Configuration')).toBeDefined();
        expect(screen.getByText('Sidebar')).toBeDefined();
    });

    it('renders Home on "/configurations" route for non-admin user when not loading', () => {
        window.history.pushState(
            {},
            'Non-admin configurations',
            '/configurations'
        );

        const store = createTestStore({
            isAuthenticated: true,
            isLoading: false,
            user: { role: 'user' }
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Home')).toBeDefined();
        expect(screen.queryByText('Configuration')).toBeNull();
    });

    it('renders Configuration on "/configurations" route when isLoading is true', () => {
        window.history.pushState(
            {},
            'Loading configurations',
            '/configurations'
        );

        const store = createTestStore({
            isAuthenticated: false,
            isLoading: true,
            user: null
        });

        render(
            <Provider store={store}>
                <MainContent />
            </Provider>
        );

        expect(screen.getByText('Configuration')).toBeDefined();
    });
});
