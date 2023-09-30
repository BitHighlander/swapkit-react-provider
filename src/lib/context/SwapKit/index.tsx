/*
    SwapKit Provider

    Serve SwapKit into a react provider
*/
import { AssetAmount } from "@pioneer-platform/swapkit-entities";
// import { getSwapKitClient } from './client';
import { Chain, EVMChainList, WalletOption } from "@pioneer-platform/types";

import {
  createContext,
  useReducer,
  useContext,
  useMemo,
  useEffect,
  useState,
} from "react";
import { EventEmitter } from "events"; // Import EventEmitter from events module

const config: any = {
  covalentApiKey:
    // @ts-ignore
    import.meta.env.VITE_COVALENT_API_KEY || "cqt_rQ6333MVWCVJFVX3DbCCGMVqRH4q",
  ethplorerApiKey:
    // @ts-ignore
    import.meta.env.VITE_ETHPLORER_API_KEY || "EK-xs8Hj-qG4HbLY-LoAu7",
  utxoApiKey:
    // @ts-ignore
    import.meta.env.VITE_BLOCKCHAIR_API_KEY ||
    "A___Tcn5B16iC3mMj7QrzZCb2Ho1QBUf",
  // @ts-ignore
  walletConnectProjectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || "",
};

const eventEmitter = new EventEmitter();

export enum WalletActions {
  SET_STATUS = "SET_STATUS",
  SET_SWAPKIT = "SET_SWAPKIT",
  SET_WALLET_DATA = "SET_WALLET_DATA",
  RESET_STATE = "RESET_STATE",
}

export interface InitialState {
  // keyring: Keyring;
  status: any;
  walletData: any;
  swapKit: any;
}

const initialState: InitialState = {
  status: "disconnected",
  walletData: [],
  swapKit: null,
};

export interface ISwapContext {
  state: InitialState;
  swapKit: any | null;
  walletData: any;
  status: string | null;
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.SET_SWAPKIT; payload: any }
  | { type: WalletActions.SET_WALLET_DATA; payload: any }
  | { type: WalletActions.RESET_STATE };

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      eventEmitter.emit("SET_STATUS", action.payload);
      return { ...state, status: action.payload };
    case WalletActions.SET_SWAPKIT:
      eventEmitter.emit("SET_SWAPKIT", action.payload);
      return { ...state, swapKit: action.payload };
    case WalletActions.SET_WALLET_DATA:
      eventEmitter.emit("SET_WALLET_DATA", action.payload);
      return { ...state, walletData: action.payload };
    case WalletActions.RESET_STATE:
      return {
        ...state,
        swapKit: null,
        status: null,
      };
    default:
      return state;
  }
};

const SwapContext = createContext(initialState);

export const SwapProvider = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [state, dispatch] = useReducer(reducer, initialState);
  const [keys, setKeys] = useState(config);
  const [swapKit, setSwapKit] = useState(config);
  const [{ inputAsset, outputAsset }, setSwapAssets] = useState<{
    inputAsset?: AssetAmount;
    outputAsset?: AssetAmount;
  }>({});

  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log("onStart***** ");

      let walletDataCache = localStorage.getItem("walletData");
      if (walletDataCache) {
        walletDataCache = JSON.parse(walletDataCache);
        dispatch({
          type: WalletActions.SET_WALLET_DATA,
          payload: walletDataCache,
        });
      }

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
      const { SwapKitCore } = await import("@pioneer-platform/swapkit-core");
      const { keystoreWallet } = await import("@pioneer-platform/keystore");
      const { keepkeyWallet } = await import("@pioneer-platform/keepkey");
      const { metamaskWallet } = await import("@pioneer-platform/metamask");
      const { walletconnectWallet } = await import(
        "@pioneer-platform/walletconnect"
      );
      const client = new SwapKitCore();
      client.extend({
        config,
        wallets: [
          keystoreWallet,
          keepkeyWallet,
          walletconnectWallet,
          metamaskWallet,
        ],
      });

      const AllChainsSupported = [
        Chain.Arbitrum,
        Chain.Avalanche,
        Chain.Binance,
        Chain.BinanceSmartChain,
        Chain.Bitcoin,
        Chain.BitcoinCash,
        Chain.Cosmos,
        Chain.Dogecoin,
        Chain.Ethereum,
        Chain.Litecoin,
        Chain.Optimism,
        Chain.Polygon,
        Chain.THORChain,
      ] as Chain[];

      const MetaMaskChainsSupported = [
        Chain.Arbitrum,
        Chain.Avalanche,
        Chain.BinanceSmartChain,
        Chain.Bitcoin,
        Chain.BitcoinCash,
        Chain.Cosmos,
        Chain.Dogecoin,
        Chain.Ethereum,
        Chain.Litecoin,
        Chain.Optimism,
        Chain.Polygon,
        Chain.THORChain,
      ] as Chain[];

      console.log("client: ", client);
      // @ts-ignore
      const resultKeepKey = await client.connectKeepKey(AllChainsSupported);
      console.log("resultKeepKey: ", resultKeepKey);
      console.log("client: ", client);
      // @ts-ignore
      // const resultMetamask = await client.connectMetaMask(
      //   MetaMaskChainsSupported
      // );
      // console.log("resultMetamask: ", resultMetamask);

      setSwapKit(client);
      dispatch({
        type: WalletActions.SET_STATUS,
        payload: "keepkey connected!",
      });
      // @ts-ignore
      dispatch({
        type: WalletActions.SET_SWAPKIT,
        payload: client,
      });
      const chains = Object.keys(client.connectedWallets);
      //calculate walletDaa
      const walletDataArray = await Promise.all(
        // @ts-ignore
        chains.map(client.getWalletByChain)
      );
      if (walletDataArray) {
        dispatch({
          type: WalletActions.SET_WALLET_DATA,
          payload: walletDataArray,
        });
        localStorage.setItem("walletData", JSON.stringify(walletDataArray));
      }
      //if walletconnect connect to walletconnect
    } catch (e) {
      console.error("e: ", e);
    }
  };

  // onstart get data
  useEffect(() => {
    onStart();
  }, []);

  // end
  const value: any = useMemo(() => ({ state, dispatch }), [state]);

  return <SwapContext.Provider value={value}>{children}</SwapContext.Provider>;
};

export const useSwap = (): any =>
  useContext(SwapContext as unknown as React.Context<ISwapContext>);
