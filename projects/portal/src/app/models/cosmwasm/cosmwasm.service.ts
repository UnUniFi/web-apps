import { convertHexStringToUint8Array } from '../../utils/converter';
import { BankService } from '../cosmos/bank.service';
import { Injectable } from '@angular/core';
import cosmwasmclient from '@cosmos-client/cosmwasm';

@Injectable({
  providedIn: 'root',
})
export class CosmwasmService {
  constructor(private readonly bankService: BankService) {}

  buildMsgExecuteContract(
    sender: string,
    contractAddress: string,
    msg: any,
    amounts: { denom: string; readableAmount: number }[],
  ) {
    const coins = amounts.map(
      (amount) =>
        this.bankService.convertDenomReadableAmountMapToCoins({
          [amount.denom]: amount.readableAmount,
        })[0],
    );
    const msgString = JSON.stringify(msg);
    const msgUint8Array = convertHexStringToUint8Array(msgString);
    const ExecuteMsg = new cosmwasmclient.proto.cosmwasm.wasm.v1.MsgExecuteContract({
      sender,
      contract: contractAddress,
      msg: msgUint8Array,
      funds: coins,
    });
    return ExecuteMsg;
  }

  // async broadcast() {
  //   const mnemonic = 'your-mnemonic-here';
  //   const rpcEndpoint = 'http://localhost:26657'; // Replace with your RPC endpoint
  //   const chainId = 'your-chain-id'; // Replace with your chain ID
  //   const senderAddress = 'your-sender-address'; // Replace with your sender address
  //   const contractAddress = 'contract-address'; // Replace with the contract address
  //   const privateKey = 'your-private-key'; // Replace with your private key

  //   const wallet = await DirectSecp256k1HdWallet.fromMnemonic(
  //     mnemonic,
  //     makeCosmoshubPath(0),
  //     rpcEndpoint,
  //   );

  //   // Create a CosmWasm client
  //   const client = new SigningCosmWasmClient(rpcEndpoint, senderAddress, wallet);

  //   // Build and sign the message to execute the contract
  //   const msg: MsgExecuteContract = {
  //     type: 'wasm/MsgExecuteContract',
  //     value: {
  //       sender: senderAddress,
  //       contract: contractAddress,
  //       msg: '{"your-contract-message-field":"your-message-value"}', // Replace with your contract-specific message
  //       sent_funds: Coins.fromData([{ denom: 'uatom', amount: '10000' }]), // Replace with the amount and denomination
  //     },
  //   };

  //   const fee = {
  //     amount: Coins.fromData([{ denom: 'uatom', amount: '2000' }]), // Replace with the fee amount and denomination
  //     gas: '200000', // Replace with the gas limit
  //   };

  //   const memo = 'your-memo'; // Replace with your memo

  //   // Sign and broadcast the transaction
  //   const { accountNumber, sequence } = await client.getAccount(senderAddress);
  //   const signedTx = await wallet.signDirect(senderAddress, {
  //     chain_id: chainId,
  //     account_number: accountNumber,
  //     sequence: sequence,
  //     fee: fee,
  //     msgs: [msg],
  //     memo: memo,
  //   });

  //   const broadcastResult = await client.broadcastTx(signedTx);
  //   if (isBroadcastTxFailure(broadcastResult)) {
  //     console.error('Failed to broadcast transaction:', broadcastResult.rawLog);
  //     process.exit(1);
  //   } else {
  //     console.log('Transaction sent successfully! Tx hash:', broadcastResult.transactionHash);
  //   }
  // }
}
