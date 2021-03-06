export type FaucetRequest = {
  address: string;
  coins: {
    amount: number;
    denom: string;
  }[];
};

export type FaucetResult = {
  isSuccess: boolean;
  errorMessage: string;
};
