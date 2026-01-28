import axios, {
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

// ================== TYPES ==================
interface RequestMetadata {
  id: number;
  start: number;
}

// Extend Axios internal config
declare module "axios" {
  export interface InternalAxiosRequestConfig {
    metadata?: RequestMetadata;
  }
}

// ================== AXIOS INSTANCE ==================
let REQ_SEQ = 0;

const AxiosClientApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.example.com",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
    "api-key": "cyber123",
  },
});

// ================== REQUEST INTERCEPTOR ==================
AxiosClientApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    REQ_SEQ += 1;
    config.metadata = {
      id: REQ_SEQ,
      start: Date.now(),
    };

    return config;
  },
  (error) => Promise.reject(error)
);

// ================== RESPONSE INTERCEPTOR ==================
AxiosClientApi.interceptors.response.use(
  (response: AxiosResponse) => {
    logSuccess(response);
    return response.data;
  },
  (error) => {
    logError(error);
    return Promise.reject(error);
  }
);

// ================== HELPERS ==================
function logSuccess(response: AxiosResponse) {
  const meta = response.config.metadata;
  const duration = meta ? Date.now() - meta.start : 0;

  const method = response.config.method?.toUpperCase() || "GET";
  const url = `${response.config.baseURL || ""}${response.config.url || ""}`;
  const status = response.status;

  console.log("\n========================= API CALL START =========================");
  console.log(`[#${meta?.id}] ✅ STATUS : ${status}`);
  console.log(`⚙️ Method : ${method}`);
  console.log(`🔗 URL    : ${url}`);
  console.log(`⏱️ Time   : ${duration} ms`);

  if (response.config.data) {
    console.log("📦 Request Body:", safeJsonParse(response.config.data));
  }

  console.log("========================== API CALL END ==========================\n");
}

function logError(error: any) {
  const config = error?.config;
  const meta = config?.metadata;
  const duration = meta ? Date.now() - meta.start : 0;

  const method = config?.method?.toUpperCase() || "UNKNOWN";
  const url = `${config?.baseURL || ""}${config?.url || ""}`;
  const status = error?.response?.status || "NO RESPONSE";

  console.log("\n========================= API CALL START =========================");
  console.log(`[#${meta?.id}] ❌ STATUS : ${status}`);
  console.log(`⚙️ Method : ${method}`);
  console.log(`🔗 URL    : ${url}`);
  console.log(`⏱️ Time   : ${duration} ms`);

  if (config?.data) {
    console.log("📦 Request Body:", safeJsonParse(config.data));
  }

  if (error?.response?.data) {
    console.log("🧾 Response:", error.response.data);
  }

  console.log("========================== API CALL END ==========================\n");
}

function safeJsonParse(data: any) {
  try {
    return typeof data === "string" ? JSON.parse(data) : data;
  } catch {
    return data;
  }
}

export default AxiosClientApi;
