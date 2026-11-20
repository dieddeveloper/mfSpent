import { spentApi } from "@/api/spent.api";
import { SpentFormData } from "@/models/spentForm.model";
import { CreateNoveltyBody, SpentResponse } from "@/models/spentResponse.model";


export async function CreateNovelty(
  createNoveltyData: SpentFormData,
  token?: string
): Promise<SpentResponse<number>> {
  try {
    const { data } = await spentApi.post<SpentResponse<number>>('/Novelty/CreateNovelty',  createNoveltyData , {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error creating novelty.");
  }
}