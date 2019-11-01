import { Address } from './address';

export interface UserSubmissionData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    location: Address;
}