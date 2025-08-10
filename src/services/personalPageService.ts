import { personalPages, type PersonalPageType } from "../models/PersonalPageType"

export const getPersonalPageList = (): PersonalPageType[] => {
  return personalPages
}
