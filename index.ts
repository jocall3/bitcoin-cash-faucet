

import { Contract, ElectrumNetworkProvider } from 'cashscript';
import { compileFile } from "cashc";
import path from 'path';

import { TransactionDetails } from 'cashscript/dist/module/interfaces';
require("dotenv").config({ path: ".env" });

const feePerByte = 1;

// blocks between payouts
let period = 1;

// the faucet payout
let payout = 1000;


(async () => {
  let args = process.argv.slice(); // remove ts-node
  args.shift(); // remove ts-node
  args.shift(); // remove index.ts
  let command = args.shift();

      
  const nonce = !process.env.NONCE ? 1 :  parseInt(process.env.NONCE!);   

  switch (command) {
    case "balance":
      let contract = await getContract(nonce!);
      // Get contract balance & output address + balance
      console.log('contract address:', contract.address);
      console.log('contract balance:', await contract.getBalance());
      break;
    case "drip":
      if(!process.env.ADDRESS){
        throw Error("could not find payout cashaddr")
        }
      const address = process.env.ADDRESS!;   
      let tx = await drip(address, nonce);
      console.log(tx.hex);
      break;
    default:
      console.log(`${command} not implemented`);
  }
})();

async function getContract(nonce:number): Promise<Contract> {
  

  // Compile the TransferWithTimeout contract
  const artifact = compileFile(path.join(__dirname, 'faucet.cash'));

  // Initialise a network provider for network operations on Testnet
  const provider = new ElectrumNetworkProvider('staging');

  return new Contract(artifact, [period, payout, nonce], provider);

}

async function drip(address:string, nonce:number): Promise<TransactionDetails> {

  let contract = await getContract(nonce);
  let balance = await contract.getBalance();
  let fn = contract.functions.drip;
  
  let newPrincipal = balance - payout
  console.log("returned: ", newPrincipal)
  let minerFee = 152;
  let sendAmout = payout - minerFee
  console.log("payout: ", sendAmout )

  let payTx = await fn()
  .to([
    {
      to: contract.address,
      amount: newPrincipal,
    },
    { 
      to: address,
      amount: sendAmout
    },
  ])
  .withAge(period)
  .withoutChange()
  .send();

  return payTx
}



