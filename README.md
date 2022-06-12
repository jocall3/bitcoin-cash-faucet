# bitcoin-cash-faucet

A simple on-chain bitcoin cash testnet faucet.

This tool uses a [bitcoin script contract written with CashScript](./faucet.cash), which uses introspection to return the whole value of a contract back to itself in the first output, minus some available payout. 

Relative timelocks are used to prevent paying out more times than once per given interval (one block by default).

It is a contract anyone can spend to send a set amount of coins to an address for free, without work.


## Usage

Install the package in your prefereed node environment

    npm i bitcoin-cash-faucet # -g
    
To see the faucet balance:

    npx bitcoin-cash-faucet --testnet

which returns:

    # contract index     # 1
    contract address:      bchtest:pq75zmtt8d84nqnxv8vx3wj06mmzlhjnwu2n8uh89l
    contract balance:      10797

The above indicates the contract number, deposit address and a balance of 10797 sats. 

### Getting a payout of testnet coins

To use the faucet, drop your address with the `--address` flag:  

    npx bitcoin-cash-faucet --testnet --address bchtest:qzz0tq2rg2xjgswchsvdrqzudsle8vje9g0zyhnap8


which returns: 

    # contract index     # 1
    contract address:      bchtest:pq75zmtt8d84nqnxv8vx3wj06mmzlhjnwu2n8uh89l
    contract balance:      4002
    payout:              - 848
    fee paid:            - 152
    ===================================
    new contract balance:  3002

Indicating 848 was paid, 152 was given as a fee, and 3002 was returned to the contract.

## Abusing

Let's get more coins by hitting the faucet again:

    npx bitcoin-cash-faucet --testnet --address bchtest:qzz0tq2rg2xjgswchsvdrqzudsle8vje9g0zyhnap8

It throws an error indicating the transaction was rejected by [BIP68 (timelock) rules](https://en.bitcoin.it/wiki/BIP_0068), 

    # contract index     # 1
    contract address:      bchtest:pq75zmtt8d84nqnxv8vx3wj06mmzlhjnwu2n8uh89l
    contract balance:      2002
    payout:              - 848
    fee paid:            - 152
    ===================================
    new contract balance:  1002
    Internal Error: Transaction failed with reason: the transaction was rejected by network rules.

    non-BIP68-final (code 64)

    meep debug --tx=0200000001adcfc4865e56e6d1c8fe3b1543bcc9e5f7adcd1e4ae8fb1bda9465ae14da8eb6000000001f1e5102e80351b2757c00a26900cd02a914c1a97e01877e88c0c67c9400cca10100000002ea0300000000000017a9143d416d6b3b4f59826661d868ba4fd6f62fde53778750030000000000001976a91484f58143428d2441d8bc18d1805c6c3f93b2592a88ac41840100 --idx=0 --amt=2002 --pkscript=a9143d416d6b3b4f59826661d868ba4fd6f62fde537787

    non-BIP68-final (code 64)

## More faucets

The contract includes a index, or parameter to make the contract unique.  If the first faucet is busy (already used that block), it should be possible to fire up another contract and fund it by changing this parameter:

    npx bitcoin-cash-faucet --testnet --index 2
    # contract index     # 2
    contract address:      bchtest:pzvv2yhpsq2twj3kxgmsd76de4y785d3evmwavdl69
    contract balance:      0

    npx bitcoin-cash-faucet --testnet --index 3
    # contract index     # 3
    contract address:      bchtest:pzpzxvw8kluds32v3lpa9mq43l2rdpny656agju0lt
    contract balance:      0

    npx bitcoin-cash-faucet --testnet --index 1231232134
    # contract index     # 1231232134
    contract address:      bchtest:prgdau8978p7sg5prxy2ggsdcj859wzzayg7nf2e20
    contract balance:      0

Obviously each new contract would need funding, and it would be fairly trivial for one party to collect all tBCH from every contract with little work every block.