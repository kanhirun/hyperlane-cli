hyperlane-cli
=================

<!-- toc -->
* [Getting Started](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Getting Started
<!-- usage -->
This repo contains two local modules, `cli` and `sdk`, which needs to be installed and
built before using the cli. 

```sh-session
$ cd ./sdk && npm install && npm link && cd ../
$ cd ./cli && npm install && npm link sdk && npm run build
$ npm link

$ cli
...
```

## Sending your first message

As an example, we can send a message from sepolia to goerli using infura as a provider.

```sh-session
$ cli send --help

$ export API_KEY='your-infura-api-key'
$ export PRIVATE_KEY='your-private-key'

$ cli send 11155111 https://sepolia.infura.io/v3/$API_KEY "my first message" 5 https://goerli.infura.io/v3/$API_KEY 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35
...
```

## Searching for your message

To find our message, we can filter `eth_getLogs` for our message.

```sh-session
$ cli search --help

$ export ADDRESS='your-address'

$ cli search '[{ "sender": "$ADDRESS" }]' --chainId 11155111 --rpcUrl https://sepolia.infura.io/v3/$API_KEY
```
