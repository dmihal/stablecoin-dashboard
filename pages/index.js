import Head from 'next/head'
import { useEffect, useState } from 'react';
import "bootstrap/dist/css/bootstrap.min.css";
import { Coin, CoinType } from 'lib/coins'

const COINS = [
  new Coin("USDT", "tether", CoinType.Centralized, "images/usdt.png"),
  new Coin("USDC", "usd-coin", CoinType.Centralized, "images/usdc.png"),
  new Coin("BUSD", "binance-usd", CoinType.Centralized, "images/busd.png"),
  new Coin("DAI", "dai", CoinType.Mixed, "images/dai.png"),
  new Coin("UST", "terrausd", CoinType.Algorithmic, "images/ust.png"),
  new Coin("TUSD", "true-usd", CoinType.Centralized, "images/tusd.png"),
  new Coin("PAX", "paxos-standard", CoinType.Centralized, "images/pax.png"),
  new Coin("LUSD", "liquity-usd", CoinType.Decentralized, "images/lusd.png"),
  new Coin("USDN", "neutrino", CoinType.Algorithmic, "images/usdn.png"),
  new Coin("HUSD", "husd", CoinType.Centralized, "images/husd.png"),
  new Coin("FEI", "fei-protocol", CoinType.Algorithmic, "images/fei.png"),
  new Coin("FRAX", "frax", CoinType.Mixed, "images/frax.png"),
  new Coin("sUSD", "nusd", CoinType.Decentralized, "images/susd.png"),
  new Coin("alUSD", "alchemix-usd", CoinType.Mixed, "images/alusd.png"),
  new Coin("GUSD", "gemini-dollar", CoinType.Centralized, "images/gusd.png"),
  new Coin("VAI", "vai", CoinType.Mixed, "images/vai.png"),
  new Coin("USDX", "usdx", CoinType.Mixed, "images/usdx.png"),
  new Coin("USDP", "usdp", CoinType.Mixed, "images/usdp.png"),
  new Coin("CUSD", "celo-dollar", CoinType.Algorithmic, "images/cusd.png"),
  new Coin("mUSD", "musd", CoinType.Mixed, "images/musd.png"),
];

function _formatInteger(int) {
  return Math.floor(int)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function _formatMoney(amount, denom = "", decPlaces = 2) {
  const dec = amount % 1;
  return (
    denom +
    _formatInteger(amount) +
    (decPlaces > 0 ? dec.toFixed(decPlaces).slice(1) : "")
  );
}

function Tag({ type }) {
  switch (type) {
    case CoinType.Centralized:
      return <span className="tag tag-centralized">centralized</span>;
    case CoinType.Decentralized:
      return <span className="tag tag-decentralized">decentralized</span>;
    case CoinType.Mixed:
      return <span className="tag tag-mixed">mixed</span>;
    case CoinType.Algorithmic:
      return <span className="tag tag-algorithmic">algorithmic</span>;
    case CoinType.Unknown:
      return <span className="tag tag-unknown">unknown</span>;
  }
}

export default function Home() {
  const [coins, setCoins] = useState(COINS)
  const [percentage, setPercentage] = useState(0)
  const [active, setActive] = useState(1)

  const run = async (days) => {
    console.log(`Fetching data for the last ${days} days...`);
  
    let count = 0;
  
    for (const coin of COINS) {
      await coin.fetchData(days);
  
      count += 1;
      const _percentage = ((100 * count) / COINS.length).toFixed(0);
      setPercentage(_percentage)
    }
    setCoins(COINS)
    setPercentage(0)
  }

  useEffect(() => {
    typeof document !== undefined ? require('bootstrap/dist/js/bootstrap') : null

    run(1)
  }, [])

  const sortByMarketCap = () => {
    console.log("Sorting by market cap...");
    
    COINS.sort((a, b) => {
      if (!a.currentMarketCap) return 1;
      if (!b.currentMarketCap) return -1;
      if (a.currentMarketCap > b.currentMarketCap) return -1;
      else return 1;
    });
  
    setCoins([...COINS])
  };
  
  const sortByCurrentPrice = () => {
    console.log("Sorting by current price...");
    
    COINS.sort((a, b) => {
      if (!a.currentPrice) return 1;
      if (!b.currentPrice) return -1;
      if (a.currentPrice > b.currentPrice) return -1;
      else return 1;
    });
  
    setCoins([...COINS])
  };
  
  const sortByAvgDev = () => {
    console.log("Sorting by avg dev...");
    
    COINS.sort((a, b) => {
      if (!a.avgDev) return -1;
      if (!b.avgDev) return 1;
      if (a.avgDev > b.avgDev) return 1;
      else return -1;
    });
  
    setCoins([...COINS])
  };
  
  const sortByMaxDev = () => {
    console.log("Sorting by max dev...");
    
    COINS.sort((a, b) => {
      if (!a.maxDev) return -1;
      if (!b.maxDev) return 1;
      if (a.maxDev > b.maxDev) return 1;
      else return -1;
    });
  
    setCoins([...COINS])
  };
  
  const sortByStable = () => {
    console.log("Sorting by stable...");
  
    tbody.innerHTML = "";
  
    COINS.sort((a, b) => {
      if (a.stable) return -1;
      else if (b.stable) return 1;
      else return 0;
    });
  
    setCoins([...COINS])
  };

  const periodListener = days => () => {
    setActive(days)
    run(days)
  }

  return (
    <div>
      <Head>
        <title>Stablecoins</title>
        <link rel="icon" href="/favicon.ico" />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Dela+Gothic+One&family=Roboto&display=swap"
          rel="stylesheet"
        />
      </Head>

      {percentage > 0 && (
        <div id="overlayContainer">
          <div id="progress" className="progress w-100">
            <div
              id="progressBar"
              className="progress-bar progress-bar-striped progress-bar-animated fs-3"
              role="progressbar"
              style={{ width: `${percentage}%` }}
            ></div>
          </div>
          <div
            id="overlayErrorMsg"
            className="text-center text-danger fs-5 pt-3 pb-3 px-2 mt-3 bg-light d-none"
          >
            If you request price data too frequently, CoinGecko may temporarily ban your IP
            address. Wait a minute and try again.
          </div>
        </div>
      )}

      <div className="container mb-3">
        <div className="title fs-1 me-3">Stablecoin Dashboard</div>
      </div>

      <div className="container mb-3">
        <div role="group" className="btn-group">
          <button type="button" className="btn btn-outline-primary" id="1d" onClick={periodListener(1)}>24h</button>
          <button type="button" className="btn btn-outline-primary" id="7d" onClick={periodListener(7)}>7d</button>
          <button type="button" className="btn btn-outline-primary" id="14d" onClick={periodListener(14)}>14d</button>
          <button type="button" className="btn btn-outline-primary" id="30d" onClick={periodListener(30)}>30d</button>
          <button type="button" className="btn btn-outline-primary" id="90d" onClick={periodListener(90)}>90d</button>
          <button type="button" className="btn btn-outline-primary" id="180d" onClick={periodListener(180)}>180d</button>
          <button type="button" className="btn btn-outline-primary" id="365d" onClick={periodListener(365)}>1y</button>
        </div>
      </div>
      <div className="container mb-3">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">asset</th>
              <th scope="col">type</th>
              <th scope="col" id="sortByMarketCap">market cap ($)</th>
              <th scope="col" id="sortByCurrentPrice">current price ($)</th>
              <th scope="col" id="sortByAvgDev">avg deviation ($)</th>
              <th scope="col" id="sortByMaxDev">max deviation ($)</th>
              <th scope="col" id="sortByStable">stable</th>
            </tr>
          </thead>
          <tbody id="tbody">
            {COINS.map(coin => {
              return (
                <tr className="align-middle" key={coin.name}>
                  <td>
                    <div className="d-flex align-items-center">
                      {coin.icon ? <img className="icon me-3" src={coin.icon} /> : ""}
                      {coin.name}
                    </div>
                  </td>
                  <td>
                    <Tag type={coin.type} />
                  </td>
                  <td>{coin.currentMarketCap ? _formatMoney(coin.currentMarketCap, "", 0) : "?"}</td>
                  <td>${coin.currentPrice ? coin.currentPrice.toPrecision(3) : "?"}</td>
                  <td className={
                    coin.avgDev && coin.avgDev <= 0.005 * coin.targetPrice ? "text-success" : ""
                  }>
                    {coin.avgDev ? coin.avgDev.toPrecision(3) : "?"}
                  </td>
                  <td className={
                    coin.maxDev && coin.maxDev < 0.015 * coin.targetPrice ? "text-success" : ""
                  }>
                    {coin.maxDev ? coin.maxDev.toPrecision(3) : "?"}
                  </td>
                  <td>{coin.stable ? "✅" : ""}</td>
                </tr>
              )
            })}
          </tbody>
          <caption>
            Click table headers to sort<br />
            <i>Mixed</i>
            means the stablecoin is partially collateralized by centralized assets<br />
            <i>Stable</i>
            is arbitrarily defined as having an average deviation of no more than 0.5 cent,
            an a maximum deviation of no more than 1.5 cents, during the selected period<br />
          </caption>
        </table>
      </div>

      <style jsx>{`
        body {
          font-family: "Roboto", sans-serif;
          padding-top: 1.5rem;
          padding-bottom: 1.5rem;
        }
        td {
          padding: 0.3rem 0.5rem !important;
        }
        .title {
          font-family: "Dela Gothic One", cursive;
        }
        .icon {
          width: 32px;
          height: 32px;
        }
        .tag {
          color: black;
          border-radius: 5px;
          padding: 6px 10px;
        }
        .tag-centralized {
          background-color: #fd7e14;
        }
        .tag-mixed {
          background-color: #ffc107;
        }
        .tag-decentralized {
          background-color: #20c997;
        }
        .tag-algorithmic {
          background-color: #0dcaf0;
        }
        .tag-unknown {
          background-color: #adb5bd;
        }
        #overlayContainer {
          display: block;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding-top: 35vh;
          padding-left: 5rem;
          padding-right: 5rem;
          background-color: rgba(245, 245, 245, 0.7);
          z-index: 99999;
          text-align: center;
          transition: all 0.25s;
          opacity: 1;
        }
        #progress {
          height: 5rem;
          box-shadow: rgba(0, 0, 0, 0.56) 0px 20px 70px 4px;
        }
        #progressBar {
          width: 0%;
        }
        #sortByMarketCap:hover,
        #sortByCurrentPrice:hover,
        #sortByAvgDev:hover,
        #sortByMaxDev:hover,
        #sortByStable:hover {
          cursor: pointer;
          color: #0275d8;
          transition: all 0.3s;
        }
      `}</style>
    </div>
  )
}
