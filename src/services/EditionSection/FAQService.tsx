import type { FAQEdition } from "../../models/editionSection/FAQEditionType"

const API_URL = "http://localhost:3000/api/faqs"

export async function fetchFaqs(): Promise<FAQEdition[]> {
  const res = await fetch(API_URL)
  return res.json()
}

export async function createFaq(faq: Omit<FAQEdition, "id">) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  })
}

export async function updateFaq(id: number, faq: Omit<FAQEdition, "id">) {
  return fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(faq),
  })
}

export async function deleteFaq(id: number) {
  return fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  })
}
