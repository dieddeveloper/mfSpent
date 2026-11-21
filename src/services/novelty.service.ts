import { spentApi } from "@/api/spent.api";
import { SpentFormData } from "@/models/spentForm.model";
import { CreateNoveltyBody, GetFinancialSummaryResponse, SpentResponse } from "@/models/spentResponse.model";


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

export async function GetFinancialSummary(userId: number, startDate: string, endDate: string, token?: string): Promise<SpentResponse<GetFinancialSummaryResponse>> {
  try {
    const { data } = await spentApi.get<SpentResponse<GetFinancialSummaryResponse>>('/Novelty/GetFinancialSummary/' + userId + `?startDate=${startDate}&endDate=${endDate}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return data;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Error fetching financial summary.");
  }
}