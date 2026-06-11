export interface TransactionFilters {
  customerPhone?: string;
  type?: "PURCHASE" | "REDEMPTION";
  startDate?: Date;
  endDate?: Date;
}

export interface CustomerReturnRate {
  visit1Time: number;
  visit2Times: number;
  visit3To5Times: number;
  visit6PlusTimes: number;
}