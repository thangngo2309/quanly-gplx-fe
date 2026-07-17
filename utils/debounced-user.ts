import { uniqueUsername, uniqueCitizenId, uniqueTeacherCertificateNumber, uniqueHealthCertificateNumber, uniqueContractNumber, uniquePhoneNumber, uniqueEmail } from '@/api/user';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export const debouncedUniqueUsername = AwesomeDebouncePromise(
    async (value: string) => (await uniqueUsername(value, undefined)).isUnique, 500
);

export const debouncedUniqueCitizenId = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniqueCitizenId(value, userId);
        return res.isUnique;
    }, 500
);

export const debouncedUniqueTeacherCert = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniqueTeacherCertificateNumber(value, userId);
        return res.isUnique;
    }, 500
);

export const debouncedUniqueHealthCert = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniqueHealthCertificateNumber(value, userId);
        return res.isUnique;
    }, 500
);

export const debouncedUniqueContract = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniqueContractNumber(value, userId);
        return res.isUnique;
    }, 500
);

export const debouncedUniquePhoneNumber = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniquePhoneNumber(value, userId);
        return res.isUnique;
    }, 500
);

export const debouncedUniqueEmail = AwesomeDebouncePromise(
    async (value: string, userId?: number) => {
        const res = await uniqueEmail(value, userId);
        return res.isUnique;
    }, 500
);