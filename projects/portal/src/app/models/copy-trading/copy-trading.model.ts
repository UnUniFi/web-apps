export type CreateExemplaryTraderRequest = {
  sender: string;
  name: string;
  description: string;
  profitCommissionRate: number;
};

export type UpdateExemplaryTraderRequest = {
  sender: string;
  name: string;
  description: string;
  profitCommissionRate: number;
};

export type DeleteExemplaryTraderRequest = {
  sender: string;
};

export type CreateTracingRequest = {
  sender: string;
  exemplaryTrader: string;
  sizeCoef: number;
  leverageCoef: number;
  reverse: boolean;
};

export type DeleteTracingRequest = {
  sender: string;
};
