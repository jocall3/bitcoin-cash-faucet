#!/usr/bin/env -S npx ts-node --esm

import {Cli, Command, Builtins, Option} from 'clipanion';
import { isOptionSymbol } from 'clipanion/lib/advanced/options';
import {drip, getContract} from "./index.ts";


class SayHello extends Command {
  static paths = [Command.Default];

  
  isTestnet = Option.Boolean('--testnet',false )

  address = Option.String('--address', {required: false, description: "receiving address to send coins to, i.e. your address"});
  fee = Option.String('--fee', {required: false, description: "a custom fee, if mutliple inputs"});
  period = Option.String('--period', {required: false, description: "how often (in blocks) the contract can pay"});
  payout = Option.String('--payout', {required: false, description: "how much the contract pays (satoshi)"});
  index = Option.String('--index', {required: false, description: "a nonce to force uniqueness with identical parameters"});

  async execute() {
    let periodInt = !this.period ? 1: parseInt(this.period) ;
    let payoutInt = !this.payout ? 1000: parseInt(this.payout) ;
    let indexInt = !this.index ? 1: parseInt(this.index) ;
    let feeOverride = !this.fee ? undefined : parseInt(this.fee) ;
    if(this.address){
       await drip(this.isTestnet, this.address, periodInt, payoutInt, indexInt, feeOverride)
    }else{
        await getContract(this.isTestnet, periodInt, payoutInt, indexInt)
    }
  }
}

const cli = new Cli({
  binaryName: 'bitcoin-cash-faucet',
  binaryLabel: 'bitcoin-cash-faucet',
  binaryVersion: '1.0.9'
});

cli.register(SayHello);
cli.register(Builtins.VersionCommand);
cli.register(Builtins.HelpCommand);

cli.runExit(process.argv.slice(2));