

import { Contract, ElectrumNetworkProvider } from 'cashscript';
import { compileString } from "cashc";
import { TransactionDetails } from 'cashscript/dist/module/interfaces';

import { faucetContract } from "./faucet.ts"


export async function getContract(isTestnet:boolean, period: number, payout:number, index:number): Promise<Contract> {
  

  // Compile the Faucet contract
  let script = compileString(faucetContract)

  // Initialise a network provider for network operations

  const provider = isTestnet ? new ElectrumNetworkProvider('staging') : new ElectrumNetworkProvider('mainnet');

  let contract =  new Contract(script, [period, payout, index], provider);

  console.log('# contract index     #', index);
  console.log('contract address:     ', contract.address);
  console.log('contract balance:     ', await contract.getBalance());
  return contract

}

export async function drip(isTestnet:boolean, address:string, period: number, payout: number, index:number, feeOverride?:number): Promise<TransactionDetails> {

  let contract = await getContract(isTestnet, period, payout, index);
  let balance = await contract.getBalance();
  let fn = contract.functions['drip'];
  
  let newPrincipal = balance - payout

  let minerFee = feeOverride ? feeOverride : 152;
  
  let sendAmout = payout - minerFee
  console.log("payout:              -", sendAmout )
  console.log("fee paid:            -", minerFee )
  console.log("===================================" )
  console.log("new contract balance: ", newPrincipal)
  try{
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
  }catch(e){
      throw(e)
  }

}



