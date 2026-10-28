import { defineEventHandler, getRequestURL, setHeader, type EventHandlerRequest, type H3Event } from 'h3'
import { createPublicDataCache } from '../lib/public-data-cache'

const publicData = createPublicDataCache()

export function definePublicContentHandler<T>(handler: (event: H3Event<EventHandlerRequest>) => Promise<T>) {
  return defineEventHandler(async event => {
    // Browser/CDN caches must revalidate so publication invalidates immediately.
    setHeader(event, 'Cache-Control', 'no-store')
    return publicData.read(getRequestURL(event).pathname, () => handler(event))
  })
}

export function defineContentMutationHandler<T>(handler: (event: H3Event<EventHandlerRequest>) => Promise<T>) {
  return defineEventHandler(async event => {
    setHeader(event, 'Cache-Control', 'no-store')
    const result = await handler(event)
    // Content dependencies span multiple endpoints (services, objects, galleries).
    // Invalidate the bounded public cache only after the mutation succeeds.
    publicData.invalidate()
    return result
  })
}
