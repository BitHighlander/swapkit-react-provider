import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
} from "@chakra-ui/react";
import { useSwap } from "lib/context/SwapKit";
// @ts-ignore
import { COIN_MAP_LONG } from "@pioneer-platform/pioneer-coins";

const Home = () => {
  const { state } = useSwap();
  const { swapKit, walletData } = state;
  const [chains, setChains] = useState([]);

  const onStart = async function () {
    try {
      console.log("swapKit: ", swapKit);
      if (swapKit) {
        const chains = Object.keys(swapKit.connectedWallets);
        console.log("chains", chains);
        // @ts-ignore
        setChains(chains);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [swapKit && swapKit.connectWallets]);

  return (
    <div>
      chains: {JSON.stringify(chains)}
      <br />
      wallets: {JSON.stringify(swapKit && swapKit.connectedWallets)}
      <br />
      <Box p={5}>
        {walletData.map(
          (
            wallet: {
              address:
                | string
                | number
                | boolean
                | React.ReactElement<
                    any,
                    string | React.JSXElementConstructor<any>
                  >
                | React.ReactFragment
                | React.ReactPortal
                | null
                | undefined;
              balance: any[];
            },
            index: React.Key | null | undefined
          ) => (
            <Box key={index} mb={5}>
              <Text fontWeight="bold" mb={4}>
                Address: {wallet.address}
              </Text>
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Asset</Th>
                    <Th isNumeric>Amount</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {wallet.balance.map((balance, balanceIndex) => (
                    <Tr key={balanceIndex}>
                      <Td>{balance.asset.symbol}</Td>
                      {/*{'https://pioneers.dev/coins/'+COIN_MAP_LONG[balance.asset.network]+'.png'}*/}
                      <Avatar
                        src={
                          "https://pioneers.dev/coins/" +
                          COIN_MAP_LONG[balance.asset.network] +
                          ".png"
                        }
                      ></Avatar>
                      <Td isNumeric>{balance.assetAmount.toString()}</Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          )
        )}
      </Box>
    </div>
  );
};

export default Home;
