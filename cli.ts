#!/usr/bin/env -S npx ts-node --esm

import {Cli, Command, Builtins, Option} from 'clipanion';
import {drip, getContract} from "./index.ts";


class SayHello extends Command {
  static paths = [Command.Default];

  index = Option.String('--index', {required: false, description: "recieving address to send coins to"});

  isTestnet = Option.Boolean('--testnet',false )
  
  address = Option.String('--address', {required: false, description: "recieving address to send coins to"});
  fee = Option.String('--fee', {required: false});

  async execute() {
    let indexInt = !this.index ? 1: parseInt(this.index) ;
    let feeOverride = !this.fee ? undefined : parseInt(this.fee) ;
    if(this.address){
       await drip(this.isTestnet, this.address, indexInt, feeOverride)
    }else{
        await getContract(this.isTestnet, indexInt)
    }
  }
}

const cli = new Cli({
  binaryName: 'bitcoin-cash-faucet',
  binaryLabel: 'bitcoin-cash-faucet',
  binaryVersion: '1.0.0'
});

cli.register(SayHello);
cli.register(Builtins.VersionCommand);
cli.register(Builtins.HelpCommand);

cli.runExit(process.argv.slice(2));