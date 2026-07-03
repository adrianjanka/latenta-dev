export default defineEventHandler(() => {
  throw createError({
    statusCode: 501,
    statusMessage: 'KI-Bildanalyse (Weg B) noch nicht implementiert',
  })
})
