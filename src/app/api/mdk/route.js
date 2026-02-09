import { GET, POST as mdkPost } from '@moneydevkit/nextjs/server/route'

export { GET }

export async function POST(request) {
  // the MDK client sets a CSRF cookie + header pair, but the Secure cookie
  // flag can prevent the cookie from being sent on http://localhost, causing
  // 401s. Re-sync the cookie to match the header so validation passes
  const csrfToken = request.headers.get('x-moneydevkit-csrf-token')
  if (!csrfToken) return mdkPost(request)

  const headers = new Headers(request.headers)
  const existing = headers.get('cookie') || ''
  headers.set('cookie', `mdk_csrf=${csrfToken}; ${existing}`)

  const authedRequest = new Request(request.url, {
    method: request.method,
    headers,
    body: request.body,
    duplex: 'half',
  })

  return mdkPost(authedRequest)
}
