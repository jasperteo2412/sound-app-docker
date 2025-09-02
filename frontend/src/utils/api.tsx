const BASE = "http://localhost:4000";

interface ApiParams {
  method?: string;
  body?: any;
}
export async function Api(path: any, params: ApiParams) {
  const { method = "GET", body } = params;
  const response = await fetch(BASE + path, {
    method,
    headers:
      body instanceof FormData
        ? undefined
        : { "Content-Type": "application/json" },
    body:
      body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(
      (await response.json().catch(() => {})).error || response.statusText
    );
  }
  return response.json().catch(() => {});
}

export const authApi = {
  me: () => Api("/api/auth/me", {}),
  login: (username: string, password: string) =>
    Api("/api/auth/login", { method: "POST", body: { username, password } }),
  logout: () => Api("/api/auth/logout", { method: "POST" }),
};

export const usersApi = {
  list: () => Api("/api/users", {}),
  create: (u: any) => Api("/api/users", { method: "POST", body: u }),
  update: (id: string, u: any) =>
    Api(`/api/users/${id}`, { method: "PUT", body: u }),
  remove: (id: string) => Api(`/api/users/${id}`, { method: "DELETE" }),
};

export const filesApi = {
  list: () => Api("/api/audio", {}),
  upload: (form: any) => Api("/api/audio", { method: "POST", body: form }),
  uploadUrl: () => `${BASE}/api/audio`,
  streamUrl: (id: string) => `${BASE}/api/audio/${id}/play`,
};
