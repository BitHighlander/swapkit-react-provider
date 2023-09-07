import React, { useEffect, useState, useMemo, useCallback } from "react";
import { SwapKitCore } from "@thorswap-lib/swapkit-core";
import { useSwap } from "lib/context/SwapKit";

import Loan from "lib/components/Loan";
import Send from "lib/components/Send";
import Swap from "lib/components/Swap";
import { getSwapKitClient } from "lib/components/client";
import TNS from "lib/components/TNS";
import { Wallet } from "./components/Wallet";
import { WalletPicker } from "./components/WalletPicker";

type WalletDataType = Awaited<
  ReturnType<InstanceType<typeof SwapKitCore>["getWalletByChain"]>
>;

const apiKeys = ["walletConnectProjectId"] as const;

const Home = () => {
  const { state } = useSwap();

  const [widgetType, setWidgetType] = useState<"swap" | "loan" | "earn">(
    "swap"
  );
  const [wallet, setWallet] = useState<WalletDataType | WalletDataType[]>(null);
  const [stagenet, setStagenet] = useState(true);

  /**
   * NOTE: Test API keys - please use your own API keys in app as those will timeout, reach limits, etc.
   */
  const config = {
    covalentApiKey:
      // @ts-ignore
      import.meta.env.VITE_COVALENT_API_KEY ||
      "cqt_rQ6333MVWCVJFVX3DbCCGMVqRH4q",
    ethplorerApiKey:
      // @ts-ignore
      import.meta.env.VITE_ETHPLORER_API_KEY || "EK-xs8Hj-qG4HbLY-LoAu7",
    utxoApiKey:
      // @ts-ignore
      import.meta.env.VITE_BLOCKCHAIR_API_KEY ||
      "A___Tcn5B16iC3mMj7QrzZCb2Ho1QBUf",
    walletConnectProjectId:
      // @ts-ignore
      import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "",
  };
  console.log("config: ", config);
  const [keys, setKeys] = useState(config);
  const [{ inputAsset, outputAsset }, setSwapAssets] = useState<{
    inputAsset?: any;
    outputAsset?: any;
  }>({});

  const skClient = useMemo(
    () => getSwapKitClient({ ...keys, stagenet }),
    [keys, stagenet]
  );

  const setAsset = useCallback(
    (asset: any) => {
      if (!inputAsset) {
        setSwapAssets({ inputAsset: asset });
      } else if (!outputAsset) {
        setSwapAssets({ inputAsset, outputAsset: asset });
      } else {
        setSwapAssets({ inputAsset: asset, outputAsset: undefined });
      }
    },
    [inputAsset, outputAsset]
  );

  const Widgets = useMemo(
    () => ({
      swap: (
        <Swap
          inputAsset={inputAsset}
          outputAsset={outputAsset}
          skClient={skClient}
        />
      ),
      loan: (
        <Loan
          inputAsset={inputAsset}
          outputAsset={outputAsset}
          skClient={skClient}
        />
      ),
      send: <Send inputAsset={inputAsset} skClient={skClient} />,
      tns: <TNS skClient={skClient} />,
      earn: <div>Earn</div>,
    }),
    [inputAsset, outputAsset, skClient]
  );

  return (
    <div>
      <h3>
        SwapKit Playground
        <div>
          {apiKeys.map((key) => (
            <input
              key={key}
              onChange={(e) =>
                setKeys((k) => ({ ...k, [key]: e.target.value }))
              }
              placeholder={key}
              value={keys[key]}
            />
          ))}
        </div>
        <button onClick={() => setStagenet((v) => !v)} type="button">
          Toggle Stagenet - Currently = {`${stagenet}`.toUpperCase()}
        </button>
      </h3>

      <div style={{ cursor: skClient ? "default" : "not-allowed" }}>
        <div
          style={{
            pointerEvents: skClient ? "all" : "none",
            opacity: skClient ? 1 : 0.5,
          }}
        >
          <div style={{ display: "flex", flex: 1, flexDirection: "row" }}>
            <WalletPicker setWallet={setWallet} skClient={skClient} />

            <div>
              <select
                onChange={(e) => setWidgetType(e.target.value as "loan")}
                style={{ marginBottom: 10 }}
              >
                {Object.keys(Widgets).map((widget) => (
                  <option key={widget} value={widget}>
                    {widget}
                  </option>
                ))}
              </select>

              {Widgets[widgetType]}
            </div>
          </div>

          {Array.isArray(wallet) ? (
            wallet.map((walletData) => (
              <Wallet
                key={walletData?.address}
                setAsset={setAsset}
                walletData={walletData}
              />
            ))
          ) : (
            <Wallet
              key={wallet?.address}
              setAsset={setAsset}
              walletData={wallet}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;