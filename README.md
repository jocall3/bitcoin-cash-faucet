# bitcoin-cash-faucet

A simple on-chain bitcoin cash testnet faucet.

This tool uses a [bitcoin script contract written with CashScript](./faucet.cash), which uses introspection to return the whole value of a contract back to itself in the first output, minus some available payout. 

Relative timelocks are used to prevent paying out more times than once per given interval (one block by default).

It is a contract anyone can spend to send a set amount of coins to an address for free, without work.

## Setup

To intall the required libraries


    yarn 


 note: was package initally tested with yarn and nodejs v14

## Usage

To see the faucet balance:

    yarn balance

which returns:

    $ ts-node index.ts balance
    contract address: bchtest:pq75zmtt8d84nqnxv8vx3wj06mmzlhjnwu2n8uh89l
    contract balance: 6002
    Done in 3.13s.

The above indicates a contract balance of 6002 sats. Each payout is 1000 sats, the transaction size is about 148 bytes.

### Getting a payout coins

To use the faucet, configure your recieving address as ADDRESS in your enviroment or pass it before the `drip` script: 

    ADDRESS="<insert your bchtest: address>" yarn drip 

which returns: 

    $ ts-node index.ts drip
    returned:  4002
    payout:  848

Indicating 848 was paid, 152 was given as a fee, and 4002 was returned to the contract.

## Abusage

Let's get more coins by hitting the faucet again:

If we use the `drip` script more than once each block, it throws an error indicating the transaction was rejected by BIP68 (timelock) rules, 

    returned:  4002
    payout:  848
    (node:502203) UnhandledPromiseRejectionWarning: Error: Transaction failed with reason: the transaction was rejected by network rules.

    non-BIP68-final (code 64)

    meep debug --tx=02000000010c17e0e168c965326290df724d517ebd252e7b4ccfd3d21221b517315f177d29000000001f1e5102e80351b2757c00a26900cd02a914c1a97e01877e88c0c67c9400cca10100000002a20f00000000000017a9143d416d6b3b4f59826661d868ba4fd6f62fde53778750030000000000001976a91484f58143428d2441d8bc18d1805c6c3f93b2592a88acdb830100 --idx=0 --amt=5002 --pkscript=a9143d416d6b3b4f59826661d868ba4fd6f62fde537787

## More faucets

The contract includes a nonce, or paramater to make the contract unique.  If the first faucet is busy (already used that block), it should be possible to fire up another contract and fund it by changing this parameter:

    NONCE=2 yarn balance
    
    $ ts-node index.ts balance
    contract address: bchtest:pzvv2yhpsq2twj3kxgmsd76de4y785d3evmwavdl69
    contract balance: 0
    Done in 3.17s.

    NONCE=3 yarn balance

    $ ts-node index.ts balance
    contract address: bchtest:pzpzxvw8kluds32v3lpa9mq43l2rdpny656agju0lt
    contract balance: 0

    NONCE=1231232134 yarn balance

    $ ts-node index.ts balance
    contract address: bchtest:prgdau8978p7sg5prxy2ggsdcj859wzzayg7nf2e20
    contract balance: 0

Obviously each new contract would need funding, and it would be fairly trivial for one party to collect all tBCH from every contract with little work every block.