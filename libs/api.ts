const api = <T>(uri: string, init?: RequestInit): Promise<T> =>
  fetch(process.env.NEXT_PUBLIC_URL + "/api" + uri, init).then((res) =>
    res.json()
  );

export default api;
