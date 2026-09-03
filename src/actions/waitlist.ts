'use server'

import { joinWaitlistApi, getWaitlistApi } from "@/back/waitlist/service/waitlist.api";
import { WaitlistCreateInput } from "@/commons/models/waitlist";

export async function joinWaitlistAction(input: WaitlistCreateInput) {
  return await joinWaitlistApi(input);
}

export async function getWaitlistAction() {
  return await getWaitlistApi();
}
