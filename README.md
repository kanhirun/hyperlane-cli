hyperlane-cli
=================

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ cd ./cli && npm link
$ cli COMMAND
running command...
$ cli (--version)
cli/0.0.0 darwin-arm64 node-v18.7.0
$ cli --help [COMMAND]
USAGE
  $ cli COMMAND
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
