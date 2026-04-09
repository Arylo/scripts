import axios from 'axios'

export const ADMIN_SESSION_EXPIRED_EVENT = 'admin:session-expired'

export const adminAxios = axios.create({
  withCredentials: true,
})

adminAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      axios.isAxiosError(error) &&
      error.response?.status === 401 &&
      /^\/api\/admin\//.test(error.config?.url ?? '')
    ) {
      window.dispatchEvent(new CustomEvent(ADMIN_SESSION_EXPIRED_EVENT))
    }
    return Promise.reject(error)
  },
)
