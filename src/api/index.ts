import axios from "axios";

export const searchStock = (data: {
  q: string;
}): Promise<{
  data: Array<{
    code: string;
    query: string;
  }>;
}> => {
  return axios.get("/query/v1/suggest_stock.json", {
    params: data,
  });
};

export const getKline = (data: {
  symbol: string;
  begin: number;
  period: string;
  type: string;
  count: number;
  indicator: string;
}): Promise<{
  data: { symbol: string; column: string[]; item: Array<Array<string | null>> };
}> => {
  return axios.get("v5/stock/chart/kline.json", {
    params: data,
  });
};
