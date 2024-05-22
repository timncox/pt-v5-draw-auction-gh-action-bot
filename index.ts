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

  const relayerAccount: RelayerAccount = await instantiateRelayerAccount(
    provider,
    envVars.CUSTOM_RELAYER_PRIVATE_KEY
  );

  const drawAuctionConfig: DrawAuctionConfig = {
    chainId: Number(envVars.CHAIN_ID),
    provider,
    covalentApiKey: envVars.COVALENT_API_KEY,
    rewardRecipient: envVars.REWARD_RECIPIENT,
    minProfitThresholdUsd: Number(envVars.MIN_PROFIT_THRESHOLD_USD),
    signer: relayerAccount.signer,
    wallet: relayerAccount.wallet,
    relayerAddress: relayerAccount.relayerAddress,
    contractJsonUrl: envVars.CONTRACT_JSON_URL,
  };

  const rngContracts: ContractsBlob = await downloadContractsBlob(
    drawAuctionConfig.contractJsonUrl,
    nodeFetch
  );
  await runDrawAuction(rngContracts, drawAuctionConfig);
};

main();
