// src/api/VaultApi.js

const API = {
  baseURL: import.meta.env.VITE_API_BASE || "https://lucille-unbatted-monica.ngrok-free.dev/",
  endpoints: {
    usage: "/vault/usage",
    folders: "/encryption/vault/folders",
    files: "/encryption/vault/files",
    uploadFolder: "/encryption/upload-folder",
    uploadFile: "/encryption/upload",
    deleteItem: "/vault/item/",
    downloadBase: "/vault/item/",
  },
};

const getToken = () =>
  localStorage.getItem("sv_token") || localStorage.getItem("authToken") || "";

const authHeaders = () => ({
  Authorization: `Bearer ${getToken()}`,
});

async function apiRequest(method, path, { body, isForm = false, expect = "json" } = {}) {
  const url = API.baseURL.replace(/\/$/, "") + path;
  const headers = isForm
    ? { ...authHeaders() }
    : { "Content-Type": "application/json", ...authHeaders() };

  const res = await fetch(url, {
    method,
    headers,
    body: body
      ? isForm
        ? body
        : typeof body === "string"
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  if (!res.ok) {
    const msg = await res.text().catch(() => "");
    throw new Error(msg || `Request failed (${res.status})`);
  }

  if (expect === "blob") return { blob: await res.blob(), headers: res.headers };
  return res.json().catch(() => ({}));
}

export const vaultApi = {
  getUsage() {
    return apiRequest("GET", API.endpoints.usage);
  },

  getFiles() {
    return apiRequest("GET", API.endpoints.files);
  },

  getFolders() {
    return apiRequest("GET", API.endpoints.folders);
  },

  uploadFiles(files) {
    const form = new FormData();
    for (const f of files) form.append("files", f);
    return apiRequest("POST", API.endpoints.uploadFile, { body: form, isForm: true });
  },

  uploadFolder(files) {
    const form = new FormData();
    for (const f of files) form.append("files", f);
    return apiRequest("POST", API.endpoints.uploadFolder, { body: form, isForm: true });
  },
};
