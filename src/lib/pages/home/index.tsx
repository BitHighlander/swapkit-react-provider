import React, { useEffect, useState, useMemo, useCallback } from "react";

import { useSwap } from "lib/context/SwapKit";

const Home = () => {
  const { state } = useSwap();
  const { swapKit } = state;

  const onStart = async function () {
    try {
      console.log("swapKit: ", swapKit);
      if (swapKit) {
        // console.log("swapKit.connectWallets: ", swapKit.connectedWallets);
        // console.log("swapKit.connectWallets: ", swapKit.connectWallets);
        const chains = Object.keys(swapKit.connectedWallets);
        console.log("chains", chains);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    onStart();
  }, [swapKit && swapKit.connectWallets]);

  return <div></div>;
};

export default Home;
