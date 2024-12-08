export function isValidEmail(email: string) {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    return emailRegex.test(email);
}

export const MANCHESTER_EMAIL_REGEX =
    /^[^@\s]+@(student\.)?manchester\.ac\.uk$/;

export const MANCHESTER_EMAIL_ERROR =
    'Please use your @manchester.ac.uk or @student.manchester.ac.uk email address';
