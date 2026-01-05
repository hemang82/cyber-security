

export const PRODUCTION = false;

const CONSTENT = {

    APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    API_KEY: process.env.NEXT_PUBLIC_API_KEY,
    CONTENT_TYPE: process.env.NEXT_PUBLIC_CONTENT_TYPE || 'Application/json',
    IS_ENCREPT: false,

    // # ----------------------------- API URLS --------------------------------------

    API_BASE_URL: PRODUCTION ? process.env.NEXT_PUBLIC_LIVE_API_BASE_URL : process.env.NEXT_PUBLIC_LOCAL_API_BASE_URL,

    // # ----------------------------- Encreption keys --------------------------------------

    KEY: process.env.NEXT_PUBLIC_CRYPTO_KEY,
    IV: process.env.NEXT_PUBLIC_CRYPTO_IV,

    // --------------------------local storage creandtials-----------------------------------------

    LOGIN_KEY: "CYBER_is_login",
    AUTH_KEY: 'CYBER_auth',
    ACCESS_TOKEN_KEY: 'CYBER_access_token',
    REFRESH_TOKEN_KEY: 'CYBER_refresh_token',
    LANGUAGE_KEY: 'CYBER_language',
    ROLE_KEY: 'CYBER_role',
    THEME_KEY: 'CYBER_theme',

}

// # ----------------------------- S3 bucket keys --------------------------------------

export const PUBLIC_URL = process.env.PUBLIC_URL;
export const AWS_STORAGE_BUCKET_NAME = process.env.REACT_APP_AWS_STORAGE_BUCKET_NAME;
export const AWS_ACCESS_KEY_ID = process.env.REACT_APP_AWS_ACCESS_KEY_ID;
export const AWS_SECRET_ACCESS_KEY = process.env.REACT_APP_AWS_SECRET_ACCESS_KEY;
export const AWS_S3_REGION_NAME = process.env.REACT_APP_AWS_S3_REGION_NAME;

// # ----------------------------- API Codes --------------------------------------

export const CODES = {
    SUCCESS: 200,
    VALIDATION_ERROR: 400,
    ACCESS_TOKEN_EXPIRE: 403,
    INACTIVE: 423,
    NOT_FOUND: 404,
    ERROR: 550,
    INTERNAL_ERROR: 500,
    UNAUTHORIZED: 401,
    REFRESH_TOKEN_EXPIRED: 410,
    CREATED: 201
} as const;

export default CONSTENT;
