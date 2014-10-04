# tlog

 Simple logger with some extra features to help your life.

## Install

```bash
$ npm install tlog
```

## Usage

 Basic usage of `tlog` is very simple, but it also has some cool features to make developers life easier.

### Simple usage

 Create default logger instance with 'default' tag name.

```js
// create default logger
var log = require('tlog')();

log('Hello, Debug!');
log.d('Hello, Debug!');
log.w('Hello, Warning!');
log.e('Hello, Error!');
```

 Create logger for multiple components with different tag names.

```js
// create 'master' logger
var mlog = require('tlog')('master');
mlog('Hello from Master!');

// create 'slave' logger
var slog = require('tlog')('slave');
slog('Hello from Slave!');

// some other place
var slog = require('tlog')('slave');

// slog is the same instance as above

```

### Enabling loggers

 Logging can be enabled/disabled in a global level or in a logger level.
 Enabling or setting logging level will change logging methods to NOOP methods based on the settings.

```js
var tlog = require('tlog');
// only log warning and above
tlog.level = tlog.WARNING

var log_a = tlog('A');
// let's silence logs from A
log_a.enabled = false;

var log_b = tlog('B');
// we wan't to debug B, let it be more verbose
log_b.level = tlog.DEBUG;

```

### Log traces (TODO)
_Not yet implemented!_

 When log tracing is enabled, the log messages will include filename and line number where the log was made. Helps a lot to find to stray messages.


### Configuration (TODO)
_Not yet implemented!_

 Setting config values for `tlog` can be done with environment values or from config file.



## TODO

 - Colorful output
 - Configuration from file and environtment variables
 - Other nice things to have


