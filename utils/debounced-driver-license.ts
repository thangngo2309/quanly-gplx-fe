import { uniqueLicenseNumber } from "@/api/driver-license";
import AwesomeDebouncePromise from "awesome-debounce-promise";

export const debounceUniqueLicenseNumber = AwesomeDebouncePromise(
    async (value: string, driver_license_id?: number) => {
        const res = await uniqueLicenseNumber(value, driver_license_id);
        return res.isUnique;
    }, 400
);