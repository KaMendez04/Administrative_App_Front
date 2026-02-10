import apiConfig from "../../apiConfig/apiConfig";
import type { InfoPageUpdate, InfoPageVM } from "../../models/editionSection/InfoPageType";

export async function fetchAssociatesPage(): Promise<InfoPageVM> {
  const { data } = await apiConfig.get<InfoPageVM>("/associates-page");
  return data;
}

export async function upsertAssociatesPage(input: InfoPageUpdate): Promise<InfoPageVM> {
  const { data } = await apiConfig.put<InfoPageVM>("/associates-page", input);
  return data;
}
