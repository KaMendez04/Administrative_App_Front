import apiConfig from "../../apiConfig/apiConfig";
import type { InfoPageUpdate, InfoPageVM } from "../../models/editionSection/InfoPageType";

export async function fetchVolunteersPage(): Promise<InfoPageVM> {
  const { data } = await apiConfig.get<InfoPageVM>("/volunteers-page");
  return data;
}

export async function upsertVolunteersPage(input: InfoPageUpdate): Promise<InfoPageVM> {
  const { data } = await apiConfig.put<InfoPageVM>("/volunteers-page", input);
  return data;
}
