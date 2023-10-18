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

You can copy these commands for convenience.

```sh-session
cd ./sdk && npm install && npm link && cd ../
```

```sh-session
cd ./cli && npm install && npm link sdk && npm run build && npm link
```

Your command should now be working.

```sh-session
$ cli

VERSION
  cli/0.0.0 darwin-arm64 node-v18.7.0

USAGE
  $ cli [COMMAND]

TOPICS
  plugins  List installed plugins.

COMMANDS
  help     Display help for cli.
  plugins  List installed plugins.
  search   Searches a specified chain's mailbox for messages based on criteria
  send     Sends an interchain message with Hyperlane.
...
```

## Sending your first message

As an example, we can send a message from sepolia to goerli using infura as a provider.

```sh-session
cli send --help
```

```sh-session
export API_KEY='your-infura-api-key'
export PRIVATE_KEY='your-private-key'
```

```sh-session
cli send 11155111 https://sepolia.infura.io/v3/$API_KEY "my first message" 5 https://goerli.infura.io/v3/$API_KEY 0x36FdA966CfffF8a9Cdc814f546db0e6378bFef35
```

## Searching for your message

To find our message, we can filter `eth_getLogs` for our message.

```sh-session
cli search --help
```

```sh-session
export ADDRESS='your-address'
```

```sh-session
cli search '[{ "sender": "$ADDRESS" }]' --chainId 11155111 --rpcUrl https://sepolia.infura.io/v3/$API_KEY
```
