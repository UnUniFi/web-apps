export type CreateExemplaryTraderRequest = {
  name: string;
  description: string;
  profitCommissionRate: number;
};

export type UpdateExemplaryTraderRequest = {
  name: string;
  description: string;
  profitCommissionRate: number;
};

export type CreateTracingRequest = {
  exemplaryTrader: string;
  sizeCoef: number;
  leverageCoef: number;
  reverse: boolean;
};
