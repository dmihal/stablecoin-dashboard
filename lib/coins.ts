function _calculateAvgDev(numbers: number[], _mean?: number) {
  const mean = _mean ? _mean : numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.sqrt(
    numbers.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / numbers.length
  );
}

function _calculateMaxDev(numbers: number[], _mean?: number) {
  const mean = _mean ? _mean : numbers.reduce((a, b) => a + b, 0) / numbers.length;
  return Math.sqrt(Math.max(...numbers.map((x) => Math.pow(x - mean, 2))));
}

export enum CoinType {
  Centralized,
  Decentralized,
  Mixed,
  Algorithmic,
  Unknown,
}

export class Coin {
  name: string;
  coingeckoId: string;
  type: CoinType;
  icon: string | undefined;
  targetPrice: number = 1;
  currentPrice: number | undefined = undefined;
  currentMarketCap: number | undefined = undefined;
  historicalPrices: number[] | undefined = undefined;
  avgDev: number | undefined = undefined;
  maxDev: number | undefined = undefined;
  stable: boolean = false;

  constructor(name: string, coingeckoId: string, type: CoinType, icon?: string) {
    this.name = name;
    this.coingeckoId = coingeckoId;
    this.type = type;
    this.icon = icon;
  }

  async fetchData(days: string) {
    console.log(`Attempting to fetch data for ${this.name}...`);

    try {
      const req = await fetch(`https://api.coingecko.com/api/v3/coins/${this.coingeckoId}/market_chart?vs_currency=usd&days=${days}`)
      const data: {
        prices: number[][];
        market_caps: number[][];
      } = await req.json();

      data.prices.sort((a, b) => {
        if (a[0] > b[0]) return -1;
        else return 1;
      });

      data.market_caps.sort((a, b) => {
        if (a[0] > b[0]) return -1;
        else return 1;
      });

      this.currentPrice = data.prices[0][1];
      this.currentMarketCap = data.market_caps[0][1];
      this.historicalPrices = data.prices.map((x) => x[1]);

      // // DEBUG MOD: just generate some random numbers
      // this.currentPrice = Math.random();
      // this.currentMarketCap = Math.random() * 1000000;
      // this.historicalPrices = [Math.random(), Math.random(), Math.random()];

      this.avgDev = _calculateAvgDev(this.historicalPrices, this.targetPrice);
      this.maxDev = _calculateMaxDev(this.historicalPrices, this.targetPrice);

      this.stable =
        this.avgDev <= 0.005 * this.targetPrice &&
        this.maxDev <= 0.015 * this.targetPrice;

      console.log(`Successfully fetched data for ${this.name}!`);
      // console.log(`Historical prices of ${this.name}`, this.historicalPrices);
    } catch (e) {
      console.log(`Failed to fetch data for ${this.name}! Error message: ${e}`);
    }
  }
}
