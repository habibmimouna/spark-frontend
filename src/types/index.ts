export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    state: string;
    medicalSpecialty: string;
}

export interface UserSignupData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    state: string;
    medicalSpecialty: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface Patient {
    _id: string;
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    dateOfBirth: string;
    gender: string;
    phoneNumber: string;
    address: string;
    medicalHistory: string;
    assignedDoctor: string;
}

export interface PatientSignupData extends Omit<Patient, 'id'> {
    password: string;
}

export interface PatientResponse {
    token: string;
    patient: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    };
}

export interface MessageResponse {
    message: string;
}

export interface PatientCreationResponse {
    message: string;
    patient: Patient;
}

export interface ApiError {
    message: string;
    status?: number;
}