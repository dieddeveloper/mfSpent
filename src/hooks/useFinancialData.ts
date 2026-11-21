import { GetFinancialSummary } from "@/services/novelty.service";
import { useAccountingSettings } from "./useAccountingSettings";
import { startOfMonth, endOfMonth, subMonths, format } from "date-fns";
import { useState } from "react";

export interface FinancialMetric {
  id: string;
  metric_type: string;
  amount: number;
  period_start: string;
  period_end: string;
  period_type: string;
}

export interface RevenueSource {
  id: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  growth_rate: number;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  category: string;
  amount: number;
  percentage: number;
  growth_rate: number;
  budget_amount: number;
}

export interface RegionalRevenue {
  id: string;
  region: string;
  amount: number;
  percentage: number;
  growth_rate: number;
}

export interface Client {
  id: string;
  name: string;
  revenue: number;
  growth_rate: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  amount: number;
}

export interface KPI {
  id: string;
  kpi_name: string;
  value: number;
  unit: string;
  growth_rate: number;
}

export interface RevenueTrendData {
  period: string;
  dateKey: string;
  accrual: number;
  cash: number;
}

// Hook for financial metrics (overview data)
export function useFinancialMetrics(userId: number, dateRange?: { from?: Date; to?: Date }) {
  const [data, setData] = useState<FinancialMetric[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const executeEndpoint = async () => {

  const financialSummary = GetFinancialSummary(userId, 
    dateRange?.from ? format(dateRange.from, 'yyyy-MM-dd') : '',
    dateRange?.to ? format(dateRange.to, 'yyyy-MM-dd') : '', localStorage.getItem('token') || '');
  console.log('Financial Summary:', financialSummary);
  }
  return { data: [] as FinancialMetric[], isLoading: false, error: null, executeEndpoint };
}

// Hook for expense categories (overview data)
export function useExpenseCategories(dateRange?: { from?: Date; to?: Date }) {
  return { data: [] as ExpenseCategory[], isLoading: false, error: null };
}

// Hook for revenue data from facts table with FX conversion
export function useRevenueSources(dateRange?: { from?: Date; to?: Date }, currency: string = 'USD') {
  return { data: [] as RevenueSource[], isLoading: false, error: null };
}

export function useExpenseTrends(dateRange?: { from?: Date; to?: Date }) {
  return { data: [] as ExpenseCategory[], isLoading: false, error: null };
}

// Hook for regional revenue
export function useRegionalRevenue() {
  return { data: [] as RegionalRevenue[], isLoading: false, error: null };
}

// Hook for top clients
export function useTopClients() {
  return { data: [] as Client[], isLoading: false, error: null };
}

// Hook for vendors
export function useVendors(dateRange?: { from?: Date; to?: Date }) {
  return { data: [] as Vendor[], isLoading: false, error: null };
}

// Hook for revenue trends with dynamic granularity
export function useRevenueTrends(dateRange?: { from?: Date; to?: Date }) {
  return { data: [] as RevenueTrendData[], isLoading: false, error: null };
}

// Helper function to format currency
export function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(2)}M`;
  } else if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(2)}K`;
  }
  return `$${amount.toFixed(2)}`;
}

// Helper function to format percentage
export function formatPercentage(percentage: number): string {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(1)}%`;
}