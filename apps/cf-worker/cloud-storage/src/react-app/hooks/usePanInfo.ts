import { useQuery } from '@tanstack/react-query'
import { PanInfoResponseBody } from '../../shared/types/types'
import { fetchPanInfoData } from '../requests/fetchPanInfoData'

export default function usePanInfo(code: string) {
  return useQuery<PanInfoResponseBody, Error>({
    queryKey: ['pan', code],
    queryFn: () => {
      if (!code) {
        return Promise.resolve({ data: [] } as any as PanInfoResponseBody)
      }
      return fetchPanInfoData(code)
    },
    enabled: true,
    retry: false,
  })
}
