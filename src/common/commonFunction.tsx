
import * as CryptoJS from "crypto-js";
import { toast } from "sonner";
import moment from "moment";


import CONSTENT from './constant';
import { MIDDLEWARE_COOKIE_KEYS } from "./middleware.constants";

// const KEY = CryptoJS.enc.Utf8.parse(CONSTENT.KEY );
// const IV = CryptoJS.enc.Utf8.parse(CONSTENT.IV);

// ------------------------------------------------------- Authentication Function ---------------------------------------------------------------------------

export const loginRedirection = (data: any) => {
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE, 'false');
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE, data?.token?.access_token)
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS.REFRESH_TOKEN_KEY_COOKIE, data?.token?.refresh_token)
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE, JSON.stringify(data))
    localStorage.setItem(MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE, data?.user?.role)
}

export const logoutRedirection = () => {
    localStorage.removeItem(MIDDLEWARE_COOKIE_KEYS.LOGIN_KEY_COOKIE);
    localStorage.removeItem(MIDDLEWARE_COOKIE_KEYS.ROLE_KEY_COOKIE);
    localStorage.removeItem(MIDDLEWARE_COOKIE_KEYS.ACCESS_TOKEN_KEY_COOKIE);
    localStorage.removeItem(MIDDLEWARE_COOKIE_KEYS.REFRESH_TOKEN_KEY_COOKIE);
    localStorage.removeItem(MIDDLEWARE_COOKIE_KEYS.AUTH_KEY_COOKIE);
}
// ------------------------------------------------------- Encryption Decreption ---------------------------------------------------------------------------

// export const Encryption = (request = {}, isStringify: boolean) => {
//     const requestData = isStringify ? JSON.stringify(request) : request;
//     let encrypted = CryptoJS.AES.encrypt(requestData, KEY, { iv: IV }).toString();
//     return encrypted
// }

// export const Decryption = async (response: any) => {
//     // console.log('Decreption response', response);
//     let decrypted = await CryptoJS.AES.decrypt(response.toString(), KEY, { iv: IV });
//     let decryptedData = await JSON.parse(decrypted.toString(CryptoJS.enc.Utf8))
//     if (decryptedData?.code === '0') {
//         TOAST_ERROR(decryptedData?.message);
//     }
//     if (decryptedData?.code === -1) {
//         logoutRedirection();
//     }
//     return decryptedData;
// }

 export  const safeText = (value: any) => value === null || value === undefined || value === "" ? "N/A" : value;

// --------------------------------------------------------- Date Manage Function ---------------------------------------------------------------------------

export const formatDate = (dateString: string, formatPattern: string) => {
    return moment.utc(dateString).local().format(formatPattern);
};

export const TOAST_SUCCESS = (message: any) => {
    return toast.success(message);
};

export const TOAST_INFO = (message: any) => {
    return toast.info(message);
};

export const TOAST_ERROR = (message: any) => {
    console.log('TOAST_ERROR', message);

    return toast.error(message);
};

export const TOAST_WARNING = (message: any) => {
    return toast.warning(message);
};

export function formatIndianPrice(price: any) {
    try {
        let number = 0;

        if (typeof price === "string") {
            number = parseFloat(price) || 0;
        } else if (typeof price === "number") {
            number = price;
        }

        return number.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 2,
        });
    } catch (e) {
        return "₹0";
    }
}

export const truncateWords = (text: any, wordLimit = 3) => {
    if (!text) return '-';
    const words = text.split(' ');
    return words.length > wordLimit
        ? words.slice(0, wordLimit).join(' ') + '...'
        : text;
};

export const convertToBase64 = async (file: any) => {
    if (file.type.includes("video")) return URL.createObjectURL(file);
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onload = () => {
            resolve(fileReader.result);
        };
        fileReader.onerror = reject;
        file && fileReader.readAsDataURL(file);
    });
};

// ----------------------------------- Local storage manage ----------------------------------------------------

type StorageData = { value: any; expiry: number | null; };

export const storage = (key: string, value?: any, expireMinutes?: number): any => {
    try {
        // 👉 GET
        if (value === undefined) {

            const item = localStorage.getItem(key);

            if (!item) return null;

            const data: StorageData = JSON.parse(item);

            // ⏳ expiry check
            if (data.expiry && Date.now() > data.expiry) {
                localStorage.removeItem(key);
                return null;
            }

            return data.value;
        }

        // 👉 REMOVE
        if (value === null) {
            localStorage.removeItem(key);
            return null;
        }

        // 👉 SET
        const storeData: StorageData = {
            value: value,
            expiry: expireMinutes
                ? Date.now() + expireMinutes * 60 * 1000
                : null,
        };

        localStorage.setItem(key, JSON.stringify(storeData));

        return true;

    } catch (error) {
        console.error("LocalStorage error", error);
        return null;
    }
};
