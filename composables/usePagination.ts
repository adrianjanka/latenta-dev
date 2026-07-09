export function usePagination<T>(items: Ref<T[]>, perPage = 12) {
  const page = ref(1)

  const totalPages = computed(() =>
    Math.max(1, Math.ceil(items.value.length / perPage)),
  )

  const paginatedItems = computed(() => {
    const start = (page.value - 1) * perPage
    return items.value.slice(start, start + perPage)
  })

  const rangeLabel = computed(() => {
    if (items.value.length === 0) return '0 Filme'
    const start = (page.value - 1) * perPage + 1
    const end = Math.min(page.value * perPage, items.value.length)
    return `${start}–${end} von ${items.value.length}`
  })

  watch(items, () => {
    page.value = 1
  })

  watch(totalPages, (total) => {
    if (page.value > total) {
      page.value = total
    }
  })

  function goToPage(nextPage: number) {
    page.value = Math.min(Math.max(1, nextPage), totalPages.value)
  }

  function nextPage() {
    goToPage(page.value + 1)
  }

  function prevPage() {
    goToPage(page.value - 1)
  }

  return {
    page,
    totalPages,
    paginatedItems,
    rangeLabel,
    goToPage,
    nextPage,
    prevPage,
  }
}
