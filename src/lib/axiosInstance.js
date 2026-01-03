import axios from "axios";

let REQ_SEQ = 0;

const axiosInstance = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
    timeout: 60000,
    headers: { "Content-Type": "application/json" },
});

// ====== REQUEST INTERCEPTOR ======
axiosInstance.interceptors.request.use(
    (config) => {
        const id = ++REQ_SEQ;
        config.n = { id, start: new Date() };
        return config;
    },
    (error) => Promise.reject(error)
);

// ====== RESPONSE INTERCEPTOR ======
axiosInstance.interceptors.response.use(
    (response) => {
        const { id, start } = response?.config?.metadata || {};
        const duration = start ? new Date() - start : 0;
        const method = (response?.config?.method || "GET").toUpperCase();
        const fullUrl = `${response?.config?.baseURL || ""}${response?.config?.url || ""}`;
        const status = response?.status;

        console.log("\n========================= API CALL START =========================");
        console.log(`[#${id}] ✅ STATUS  : ${status}`);

        // Request body (if present)
        if (response.config?.data) {
            try {
                const body = JSON.parse(response.config.data);
                console.log(`📦 Request Body: ${JSON.stringify(body, null, 2)}`);
            } catch {
                console.log(`📦 Request Body: ${response.config.data}`);
            }
        }

        // Response data
        console.log(`[#${id}] ⚙️  Method : ${method} 🔗 API URL : ${fullUrl} (✅ STATUS  : ${status}) (⏱️ Duration: ${duration} ms)`);
        console.log("========================== API CALL END ==========================\n");

        return response.data;
    },
    (error) => {
        const { id, start } = error?.config?.metadata || {};
        const duration = start ? new Date() - start : 0;
        const method = (error?.config?.method || "UNKNOWN").toUpperCase();
        const fullUrl = `${error?.config?.baseURL || ""}${error?.config?.url || ""}`;
        const status = error?.response?.status || "No Response";

        console.log("\n========================= API CALL START =========================");
        console.log(`[#${id}] ❌ STATUS   : ${status}`);

        if (error.config?.data) {
            try {
                const body = JSON.parse(error.config.data);
                console.log(`📦 Request Body: ${JSON.stringify(body, null, 2)}`);
            } catch {
                console.log(`📦 Request Body: ${error.config.data}`);
            }
        }

        console.log(
            `[#${id}] ⚙️ Method : ${method} 🔗 API URL : ${fullUrl} (⏱️ Duration: ${duration} ms)`
        );
        if (error.response?.data) {
            console.log("🧾 Response:", error.response.data);
        }

        console.log("========================== API CALL END ==========================\n");

        return Promise.reject(error);
    }
);

export default axiosInstance;
