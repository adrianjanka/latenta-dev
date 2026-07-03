/**
 * Stub für KI-Bildanalyse (Weg B).
 * Anthropic-Key bleibt ausschliesslich serverseitig.
 */
export function getAnthropicClient() {
  throw createError({
    statusCode: 501,
    statusMessage: 'KI-Bildanalyse noch nicht implementiert',
  })
}
