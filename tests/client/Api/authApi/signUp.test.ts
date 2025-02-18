import axios from 'axios';
import { describe, expect, it, vi, type Mocked } from 'vitest';
import { signUpApi } from '../../../../src/client/api/authApi.ts';

vi.mock('axios');
const mockedAxios = axios as Mocked<typeof axios>;

describe('signUpApi', () => {
    const mockUserData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        role: 'student',
        yearOfStudy: 2,
        course: 'Computer Science',
        courseUnits: 'CS101,CS102'
    };

    const {
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        role,
        yearOfStudy,
        course,
        courseUnits
    } = mockUserData;

    const mockUserResponse = {
        id: '1',
        ...mockUserData,
        token: 'mock-token'
    };

    it('should make successful signup request', async () => {
        // Mock successful response
        mockedAxios.post.mockResolvedValueOnce({
            data: mockUserResponse,
            status: 201
        });

        const result = await signUpApi(
            firstName,
            lastName,
            email,
            password,
            confirmPassword,
            role,
            yearOfStudy,
            course,
            courseUnits
        );

        expect(mockedAxios.post).toHaveBeenCalledWith(
            'http://localhost:3000/auth/signup',
            mockUserData
        );
        expect(result.data).toEqual(mockUserResponse);
    });

    it('should handle signup error', async () => {
        // Mock error response
        const errorMessage = 'Network Error';
        mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

        try {
            await signUpApi(
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                role,
                yearOfStudy,
                course,
                courseUnits
            );
            expect(true).toBe(false); // Fail test if no error thrown
        } catch (error) {
            expect(error).toBeInstanceOf(Error);
            expect((error as Error).message).toBe(errorMessage);
        }
    });
});
