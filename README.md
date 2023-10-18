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
$ cd ./cli && npm install && npm link sdk && npm build
$ npm link

$ cli
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`cli send PERSON`](#cli-hello-person)
* [`cli search world`](#cli-hello-world)

## `cli send`

Say hello

```
USAGE
  $ cli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [src/commands/hello/index.ts](https://github.com/kanhirun/cli/blob/v0.0.0/src/commands/hello/index.ts)_

## `cli search`

Say hello world

```
USAGE
  $ cli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ cli hello world
  hello world! (./src/commands/hello/world.ts)
```

_See code: [src/commands/hello/world.ts](https://github.com/kanhirun/cli/blob/v0.0.0/src/commands/hello/world.ts)_
<!-- commandsstop -->
