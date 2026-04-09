import axios from 'axios'
import { toast } from 'sonner'
import { STATUS_CODE, STATUS_MAP } from '../../shared/constant/guest'

export const GUEST_REDIRECT_HOME_EVENT = 'guest:redirect-home'

export const guestAxios = axios.create({
  withCredentials: true,
})

guestAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      const response = error.response
      const status = response.status

      if (response.data && typeof response.data === 'object' && 'code' in response.data) {
        const code = response.data.code as any
        // 如果 code 在 STATUS_CODE 中，显示对应的错误信息
        if (Object.values(STATUS_CODE).includes(code)) {
          const message = STATUS_MAP[code as keyof typeof STATUS_MAP]
          toast.error(message, { duration: 5000, position: 'top-center' })
        }
      }

      if (status >= 300) {
        window.dispatchEvent(new CustomEvent(GUEST_REDIRECT_HOME_EVENT))
      }
    }

    return Promise.reject(error)
  },
)
