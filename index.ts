import nodeFetch from "node-fetch";
import { BaseProvider } from "@ethersproject/providers";
import {
  downloadContractsBlob,
  ContractsBlob,
} from "@generationsoftware/pt-v5-utils-js";
import {
  getProvider,
  instantiateRelayerAccount,
  loadDrawAuctionEnvVars,
  runDrawAuction,
  DrawAuctionEnvVars,
  DrawAuctionConfig,
  RelayerAccount,
} from "@generationsoftware/pt-v5-autotasks-library";

const main = async () => {
  const envVars: DrawAuctionEnvVars = loadDrawAuctionEnvVars();

  const provider: BaseProvider = getProvider(envVars);
  console.log("provider");
  console.log(provider);

  const relayerAccount: RelayerAccount = await instantiateRelayerAccount(
    provider,
    envVars.CUSTOM_RELAYER_PRIVATE_KEY
  );
  console.log("relayerAccount");
  console.log(relayerAccount);

  const drawAuctionConfig: DrawAuctionConfig = {
    chainId: Number(envVars.CHAIN_ID),
    provider,
    covalentApiKey: envVars.COVALENT_API_KEY,
    rewardRecipient: envVars.REWARD_RECIPIENT,
    minProfitThresholdUsd: Number(envVars.MIN_PROFIT_THRESHOLD_USD),
    signer: relayerAccount.signer,
    wallet: relayerAccount.wallet,
    relayerAddress: relayerAccount.relayerAddress,
  };

  try {
    const rngContracts: ContractsBlob = await downloadContractsBlob(
      drawAuctionConfig.chainId,
      nodeFetch
    );

    await runDrawAuction(rngContracts, drawAuctionConfig);
  } catch (e) {
    console.error(e);
  }
};

main();
