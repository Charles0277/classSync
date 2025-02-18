import axios from 'axios';
import { describe, expect, it, vi, type Mocked } from 'vitest';
import { logInApi } from '../../../../src/client/api/authApi.ts';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('logInApi', () => {
    const mockCredentials = {
        email: 'john.doe@example.com',
        password: 'password123'
    };

    const mockUserResponse = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        token: 'mock-token',
        role: 'student',
        yearOfStudy: 2,
        course: 'Computer Science',
        courseUnits: 'CS101,CS102'
    };

    it('should make successful login request', async () => {
        // Mock successful response
        mockedAxios.post.mockResolvedValueOnce({
            data: mockUserResponse,
            status: 200
        });

        const result = await logInApi(
            mockCredentials.email,
            mockCredentials.password
        );

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:3000/auth/login',
            mockCredentials
        );
        expect(result.data).toEqual(mockUserResponse);
    });

    it('should handle login error', async () => {
        // Mock error response
        const errorMessage = 'Invalid credentials';
        mockedAxios.post.mockRejectedValueOnce({
            response: {
                status: 401,
                data: { message: errorMessage }
            }
        });

        try {
            await logInApi(mockCredentials.email, mockCredentials.password);
            expect(true).toBe(false); // Fail test if no error thrown
        } catch (error: unknown) {
            const err = error as {
                response: { status: number; data: { message: string } };
            };
            expect(err).toHaveProperty('response');
            expect(err.response.status).toBe(401);
            expect(err.response.data.message).toBe(errorMessage);
        }
    });
});
