// import { Chain } from "@defillama/sdk/build/general"
// import { FetchResultFees, SimpleAdapter } from "../adapters/types"
// import { getBlock } from "../helpers/getBlock"
// import * as sdk from "@defillama/sdk";
// import { CHAIN } from "../helpers/chains";
// import { getPrices } from "../utils/prices";

import { FetchResultFees, SimpleAdapter } from "../adapters/types";
import { CHAIN } from "../helpers/chains";
import fetchURL from "../utils/fetchURL";

interface Item {
  chain: string;
  total_fees: number;
  total_revenue: number;
}
interface IData {
  datetime: string;
  items: Item[];
}


const _fetchApi = async (from_timestamp: number) => {
  const url = `https://wire2.gamma.xyz/frontend/revenue_status/main_charts?from_timestamp=${from_timestamp}&yearly=false&monthly=false&filter_zero_revenue=false`;
  const data: IData[] = (await fetchURL(url));
  return data;
}

const query: { [key: number]: Promise<IData[]> } = {};

const fetchApi = async (from_timestamp: number) => {
  if (!query[from_timestamp]) {
    query[from_timestamp] = _fetchApi(from_timestamp)
  }
  return query[from_timestamp]
}


const fetchFees = (chain: string) => {
  return async (timestamp: number): Promise<FetchResultFees> => {
    const fromTimestamp = timestamp - 60 * 60 * 24
    const data: IData[] = await fetchApi(fromTimestamp);
    const dateString = new Date(timestamp * 1000).toISOString().split("T")[0];
    const dailyItem: IData | undefined = data.find((e: IData) => e.datetime.split('T')[0] === dateString)
    const result: IData = dailyItem || { datetime: '', items: [] };
    const dailyFees = result.items.filter((e: Item) => e.chain === chain)
      .reduce((a: number, b: Item) => a + b.total_fees, 0);
    const dailyRevenue = result.items.filter((e: Item) => e.chain === chain)
      .reduce((a: number, b: Item) => a + b.total_revenue, 0);
    return {
      dailyFees: `${dailyFees}`,
      dailyRevenue: `${dailyRevenue}`,
      timestamp
    }
  }
}

const adapter: SimpleAdapter = {
  adapter: {
    [CHAIN.ETHEREUM]: {
      fetch: fetchFees("ethereum"),
      start: 1682121600,
    },
    [CHAIN.POLYGON]: {
      fetch: fetchFees("polygon"),
      start: 1682121600,
    },
    [CHAIN.POLYGON_ZKEVM]: {
      fetch: fetchFees("polygon_zkevm"),
      start: 1682121600,
    },
    [CHAIN.OPTIMISM]: {
      fetch: fetchFees("optimism"),
      start: 1682121600,
    },
    [CHAIN.ARBITRUM]: {
      fetch: fetchFees("arbitrum"),
      start: 1682121600,
    },
    [CHAIN.BSC]: {
      fetch: fetchFees("binance"),
      start: 1682121600,
    },
    [CHAIN.MOONBEAM]: {
      fetch: fetchFees("moonbeam"),
      start: 1682121600,
    },
    [CHAIN.CELO]: {
      fetch: fetchFees("celo"),
      start: 1682121600,
    },
    [CHAIN.AVAX]: {
      fetch: fetchFees("avalanche"),
      start: 1682121600,
    },
    [CHAIN.FANTOM]: {
      fetch: fetchFees("fantom"),
      start: 1682121600,
    },
    [CHAIN.MANTLE]: {
      fetch: fetchFees("mantle"),
      start: 1682121600,
    },
    [CHAIN.ROLLUX]: {
      fetch: fetchFees("rollux"),
      start: 1682121600,
    },
    [CHAIN.LINEA]: {
      fetch: fetchFees("linea"),
      start: 1682121600,
    },
    [CHAIN.BASE]: {
      fetch: fetchFees("base"),
      start: 1682121600,
    },
    [CHAIN.KAVA]: {
      fetch: fetchFees("kava"),
      start: 1682121600,
    },
    [CHAIN.OP_BNB]: {
      fetch: fetchFees("op_bnb"),
      start: 1682121600,
    },
    [CHAIN.MANTA]: {
      fetch: fetchFees("manta"),
      start: 1682121600,
    },
    [CHAIN.METIS]: {
      fetch: fetchFees("metis"),
      start: 1682121600,
    },
    [CHAIN.XDAI]: {
      fetch: fetchFees("gnosis"),
      start: 1682121600,
    },
    [CHAIN.ASTRZK]: {
      fetch: fetchFees("astar_zkevm"),
      start: 1682121600,
    },
    [CHAIN.IMX]: {
      fetch: fetchFees("immutable_zkevm"),
      start: 1682121600,
    },
    [CHAIN.SCROLL]: {
      fetch: fetchFees("scroll"),
      start: 1682121600,
    },
    [CHAIN.BLAST]: {
      fetch: fetchFees("blast"),
      start: 1682121600,
    },
    [CHAIN.XLAYER]: {
      fetch: fetchFees("xlayer"),
      start: 1682121600,
    },
    [CHAIN.MODE]: {
      fetch: fetchFees("mode"),
      start: 1682121600,
    },
    [CHAIN.TAIKO]: {
      fetch: fetchFees("taiko"),
      start: 1682121600,
    },
    [CHAIN.RSK]: {
      fetch: fetchFees("rootstock"),
      start: 1682121600,
    },
    [CHAIN.SEI]: {
      fetch: fetchFees("sei"),
      start: 1682121600,
    },
    [CHAIN.IOTAEVM]: {
      fetch: fetchFees("iota_evm"),
      start: 1682121600,
    },
  }
}

export default adapter;
