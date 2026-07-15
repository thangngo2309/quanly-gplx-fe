import { uniqueChassisNumber, uniqueEngineNumber, uniqueImeiDat, uniqueRegistrationNumber, uniqueSerialNumber } from '@/api/car';
import AwesomeDebouncePromise from 'awesome-debounce-promise';

export const debounceUniqueRegistrationNumber = AwesomeDebouncePromise(
    async (value: string, car_id?: number) => {
        const res = await uniqueRegistrationNumber(value, car_id);
        return res.isUnique;
    }, 500
);

export const debounceUniqueImeiDat = AwesomeDebouncePromise(
    async (value: string, car_id?: number) => {
        const res = await uniqueImeiDat(value, car_id);
        return res.isUnique;
    }, 500
);

export const debounceUniqueSerialNumber = AwesomeDebouncePromise(
    async (value: string, car_id?: number) => {
        const res = await uniqueSerialNumber(value, car_id);
        return res.isUnique;
    }, 500
);

export const debounceUniqueChassisNumber = AwesomeDebouncePromise(
    async (value: string, car_id?: number) => {
        const res = await uniqueChassisNumber(value, car_id);
        return res.isUnique;
    }, 500
);

export const debounceUniqueEngineNumber = AwesomeDebouncePromise(
    async (value: string, car_id?: number) => {
        const res = await uniqueEngineNumber(value, car_id);
        return res.isUnique;
    }, 500
);