import { useEffect, useState } from "react"
import type { FAQEdition } from "../../models/editionSection/FAQEditionType"
import { createFaq, deleteFaq, fetchFaqs, updateFaq } from "../../services/EditionSection/FAQService"

export function useFaqManager() {
  const [faqs, setFaqs] = useState<FAQEdition[]>([])
  const [selectedFaqId, setSelectedFaqId] = useState<number | null>(null)

  useEffect(() => {
    fetchFaqs().then(setFaqs)
  }, [])

  const selectedFaq = faqs.find((faq) => faq.id === selectedFaqId) || null

  const handleCreate = async (faq: Omit<FAQEdition, "id">) => {
    await createFaq(faq)
    const updated = await fetchFaqs()
    setFaqs(updated)
  }

  const handleUpdate = async (faq: FAQEdition) => {
    await updateFaq(faq.id, faq)
    const updated = await fetchFaqs()
    setFaqs(updated)
  }

  const handleDelete = async (id: number) => {
    await deleteFaq(id)
    const updated = await fetchFaqs()
    setFaqs(updated)
    setSelectedFaqId(null)
  }

  return {
    faqs,
    selectedFaqId,
    selectedFaq,
    setSelectedFaqId,
    handleCreate,
    handleUpdate,
    handleDelete,
  }
}
