const BASE_URL = "/api/v1";

const api = <T>(uri: string, init?: RequestInit): Promise<T> =>
  fetch(process.env.NEXT_PUBLIC_URL + BASE_URL + uri, init).then((res) =>
    res.json()
  );

export default api;
