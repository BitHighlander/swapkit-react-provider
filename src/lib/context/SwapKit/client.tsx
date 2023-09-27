import { evmWallet } from "@pioneer-platform/evm-web3-wallets";
import { keplrWallet } from "@pioneer-platform/keplr";
import { keystoreWallet } from "@pioneer-platform/keystore";
import { ledgerWallet } from "@pioneer-platform/ledger";
import { okxWallet } from "@pioneer-platform/okx";
import { SwapKitCore } from "@pioneer-platform/swapkit-core";
import { trezorWallet } from "@pioneer-platform/trezor";
import { keepkeyWallet } from "@pioneer-platform/keepkey";
import { walletconnectWallet } from "@pioneer-platform/walletconnect";
import { xdefiWallet } from "@pioneer-platform/xdefi";

export const getSwapKitClient = ({
  ethplorerApiKey = "freekey",
  covalentApiKey = "",
  utxoApiKey = "",
  walletConnectProjectId = "",
  stagenet,
}: {
  ethplorerApiKey?: string;
  covalentApiKey?: string;
  utxoApiKey?: string;
  walletConnectProjectId?: string;
  stagenet?: boolean;
} = {}) => {
  const client = new SwapKitCore({ stagenet });

  client.extend({
    config: {
      ethplorerApiKey,
      covalentApiKey,
      utxoApiKey,
      walletConnectProjectId,
      stagenet,
    },
    wallets: [
      xdefiWallet,
      okxWallet,
      ledgerWallet,
      keystoreWallet,
      // @ts-ignore
      keepkeyWallet,
      trezorWallet,
      keplrWallet,
      evmWallet,
      walletconnectWallet,
    ],
  });

  return client;
};
