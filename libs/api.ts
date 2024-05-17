const BASE_URL = "/api/v1";

const api = (uri: string, init?: RequestInit) =>
  fetch(`${BASE_URL}${uri}`, init);

export default api;
