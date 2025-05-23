import { uuidv4 } from 'lib/helpers'
import type { SupaResponse } from 'types/base'
import { constructHeaders, handleError, handleResponse, handleResponseError } from './base'

/**
 * @deprecated Please use post method from data/fetchers instead
 *
 * Exception for bucket-object-download-mutation as openapi-fetch doesn't support octet-stream responses
 */
export async function post<T = any>(
  url: string,
  data: { [prop: string]: any },
  options?: { [prop: string]: any }
): Promise<SupaResponse<T>> {
  const requestId = uuidv4()
  try {
    const { headers: optionHeaders, abortSignal, ...otherOptions } = options ?? {}
    const headers = await constructHeaders(requestId, optionHeaders)
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      referrerPolicy: 'no-referrer-when-downgrade',
      headers,
      ...otherOptions,
      signal: abortSignal,
    })
    if (!response.ok) return handleResponseError(response, requestId)
    return handleResponse(response, requestId)
  } catch (error) {
    return handleError(error, requestId)
  }
}
