#!/usr/bin/env -S npx ts-node --esm

import {Cli, Command, Builtins, Option} from 'clipanion';
import {drip, getContract} from "./index.ts";


class SayHello extends Command {
  static paths = [Command.Default];

  nonce = Option.String('--nonce', {required: false});

  isTestnet = Option.Boolean('--testnet',false )
  
  address = Option.String('--address', {required: false});

  async execute() {
    let nonceInt = !this.nonce ? 1: parseInt(this.nonce) ;
    if(this.address){
       await drip(this.isTestnet, this.address, nonceInt)
    }else{
        await getContract(this.isTestnet, nonceInt)
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