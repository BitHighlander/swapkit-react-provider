/*
    SwapKit Provider

    Serve SwapKit into a react provider
*/
import { AssetAmount } from '@pioneer-platform/swapkit-entities';
// import { getSwapKitClient } from './client';

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
  SET_USERNAME = "SET_USERNAME",
  SET_API = "SET_API",
  SET_APP = "SET_APP",
  SET_WALLET = "SET_WALLET",
  SET_WALLET_DESCRIPTIONS = "SET_WALLET_DESCRIPTIONS",
  SET_CONTEXT = "SET_CONTEXT",
  SET_ASSET_CONTEXT = "SET_ASSET_CONTEXT",
  SET_BLOCKCHAIN_CONTEXT = "SET_BLOCKCHAIN_CONTEXT",
  SET_PUBKEY_CONTEXT = "SET_PUBKEY_CONTEXT",
  ADD_WALLET = "ADD_WALLET",
  RESET_STATE = "RESET_STATE",
}

export interface InitialState {
  // keyring: Keyring;
  status: any;
  username: string;
  serviceKey: string;
  queryKey: string;
  context: string;
  assetContext: string;
  blockchainContext: string;
  pubkeyContext: string;
  walletDescriptions: any[];
  totalValueUsd: number;
  app: any;
  api: any;
}

const initialState: InitialState = {
  status: "disconnected",
  username: "",
  serviceKey: "",
  queryKey: "",
  context: "",
  assetContext: "",
  blockchainContext: "",
  pubkeyContext: "",
  walletDescriptions: [],
  totalValueUsd: 0,
  app: null,
  api: null,
};

export interface ISwapContext {
  state: InitialState;
  username: string | null;
  context: string | null;
  status: string | null;
  totalValueUsd: number | null;
  assetContext: string | null;
  blockchainContext: string | null;
  pubkeyContext: string | null;
  app: any;
  api: any;
}

export type ActionTypes =
  | { type: WalletActions.SET_STATUS; payload: any }
  | { type: WalletActions.SET_USERNAME; payload: string }
  | { type: WalletActions.SET_APP; payload: any }
  | { type: WalletActions.SET_API; payload: any }
  | { type: WalletActions.SET_CONTEXT; payload: any }
  | { type: WalletActions.SET_ASSET_CONTEXT; payload: any }
  | { type: WalletActions.SET_BLOCKCHAIN_CONTEXT; payload: any }
  | { type: WalletActions.SET_PUBKEY_CONTEXT; payload: any }
  | { type: WalletActions.ADD_WALLET; payload: any }
  | { type: WalletActions.RESET_STATE };

const reducer = (state: InitialState, action: ActionTypes) => {
  switch (action.type) {
    case WalletActions.SET_STATUS:
      eventEmitter.emit("SET_STATUS", action.payload);
      return { ...state, status: action.payload };
    case WalletActions.SET_CONTEXT:
      //eventEmitter.emit("SET_CONTEXT", action.payload);
      return { ...state, context: action.payload };
    case WalletActions.SET_ASSET_CONTEXT:
      //eventEmitter.emit("SET_ASSET_CONTEXT", action.payload);
      return { ...state, assetContext: action.payload };
    case WalletActions.SET_BLOCKCHAIN_CONTEXT:
      //eventEmitter.emit("SET_BLOCKCHAIN_CONTEXT", action.payload);
      return { ...state, blockchainContext: action.payload };
    case WalletActions.SET_PUBKEY_CONTEXT:
      //eventEmitter.emit("SET_PUBKEY_CONTEXT", action.payload);
      return { ...state, pubkeyContext: action.payload };
    case WalletActions.SET_USERNAME:
      //eventEmitter.emit("SET_USERNAME", action.payload);
      return { ...state, username: action.payload };
    case WalletActions.SET_APP:
      return { ...state, app: action.payload };
    case WalletActions.SET_API:
      return { ...state, api: action.payload };
    case WalletActions.RESET_STATE:
      return {
        ...state,
        api: null,
        user: null,
        username: null,
        context: null,
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
  const [{ inputAsset, outputAsset }, setSwapAssets] = useState<{
    inputAsset?: AssetAmount;
    outputAsset?: AssetAmount;
  }>({});

  const onStart = async function () {
    try {
      // eslint-disable-next-line no-console
      console.log("onStart***** ");
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
