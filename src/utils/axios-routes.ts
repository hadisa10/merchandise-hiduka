import axios, { AxiosRequestConfig } from 'axios';

import { MAPBOX_HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosRoutesInstance = axios.create({ baseURL: MAPBOX_HOST_API });

axiosRoutesInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong')
);

export default axiosRoutesInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosRoutesInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  driving: '/driving',
  cycling: '/cycling'
};
