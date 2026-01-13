
// ===============================
// DATE & TIME FORMAT CONSTANTS

// Date only formats
export const DATE_FORMAT = {
    DASH_DD_MM_YYYY: "DD-MM-YYYY",            // 12-06-2024
    SLASH_DD_MM_YYYY: "DD/MM/YYYY",           // 12/06/2024
    DASH_YYYY_MM_DD: "YYYY-MM-DD",            // 2024-06-12
    DOT_DD_MM_YYYY: "DD.MM.YYYY",              // 12.06.2024

    SHORT_DAY_MONTH: "D MMM",                 // 12 Jun
    FULL_DAY_MONTH_YEAR: "DD MMM YYYY hh:mm:ss",       // 12 Jun 2024
    MONTH_DAY_YEAR_LONG: "MMMM D, YYYY",      // June 12, 2024

    WEEKDAY_MONTH_DAY: "ddd, MMMM DD",        // Wed, June 12
};

// Time only formats
export const TIME_FORMAT = {
    TIME_12_HOUR: "hh:mm A",                  // 06:43 PM
    TIME_24_HOUR: "HH:mm",                    // 18:43
    TIME_12_HOUR_WITH_SECONDS: "hh:mm:ss A",  // 06:43:54 PM
    TIME_24_HOUR_WITH_SECONDS: "HH:mm:ss",    // 18:43:54
};

// Date + Time formats
export const DATE_TIME_FORMAT = {
    DATE_TIME_DASH_12H: "D-M-YYYY h:mm A",           // 12-6-2024 3:45 PM
    DATE_TIME_SLASH_12H: "DD/MM/YYYY h:mm A",        // 12/06/2024 3:45 PM

    DATE_TIME_READABLE: "DD MMM YYYY, hh:mm A",     // 12 Jun 2024, 03:45 PM
    DATE_TIME_MONTH_FIRST: "MMM DD YYYY, hh:mm A",  // Jun 12 2024, 03:45 PM

    FULL_DATE_TIME_12H: "dddd, MMMM D, YYYY h:mm A", // Tuesday, June 12, 2024 6:43 PM
    FULL_DATE_TIME_24H: "dddd, MMMM D, YYYY HH:mm",  // Tuesday, June 12, 2024 18:43
};

// ===============================

// INPUT REGEX + VALIDATION MESSAGE
export const INPUT_PATTERN = {
    CHAR_ONLY: {
        pattern: /^[A-Za-z\s]*$/,
        message: "Only alphabets are allowed",
    },
    NAME: {
        pattern: /^[A-Za-z]{2,30}$/,
        message: "Please enter only letters (2–30 chars)",
    },

    EMAIL: {
        pattern: /^[A-Z0-9a-z._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
        message: "Please enter a valid email address",
    },

    EMAIL_ON_CHANGE: {
        pattern: /^[A-Z0-9a-z.@]+$/,
        message: "Invalid email characters",
    },

    MOBILE: {
        pattern: /^\d{10}$/,
        message: "Mobile number must be exactly 10 digits",
    },

    PAN_NUMBER: {
        pattern: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
        message: "Invalid PAN number format (ABCDE1234F)",
    },

    AADHAR_NUMBER: {
        pattern: /^\d{12}$/,
        message: "Aadhar number must be 12 digits",
    },

    PASSWORD: {
        pattern:
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&<>*~:`-]).{8,}$/,
        message:
            "Password must contain uppercase, lowercase, number & special character",
    },

    ADDRESS: {
        pattern: /^[A-Za-z0-9, ]+$/,
        message: "Address contains invalid characters",
    },

    WEBSITE: {
        pattern: /^(https?:\/\/)(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,})(:\d{1,5})?(\/.*)?$/,
        message: "URL must start with http:// or https://",
    },
};

// INPUT TYPES (HTML)

export const INPUT_TYPE = {

    TEXT: "text",
    EMAIL: "email",
    PASSWORD: "password",
    NUMBER: "number",
    TEL: "tel",
    URL: "url",
    SEARCH: "search",

    DATE: "date",
    TIME: "time",
    DATETIME_LOCAL: "datetime-local",
    MONTH: "month",
    WEEK: "week",

    CHECKBOX: "checkbox",
    RADIO: "radio",
    FILE: "file",
    RANGE: "range",
    COLOR: "color",

    HIDDEN: "hidden",

} as const;

export enum TAB_KEY {
    ASSETS_TYPE = "assets_type",
    ASSETS_DETAILS = "assets_details",
    CREDENTIALS = "credentials",
    OWNERS = "owners",
    PREVIEW = "preview",
}