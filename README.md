# tlog

 Simple logger with some extra features to help your life.

## Install

```bash
$ npm install tlog
```

## Usage

 Basic usage of `tlog` is very simple, but it also has some cool features to make developers life easier.

 Planned features include log levels from enviroment variables, other log writers (files).

### Simple usage

 Create default logger instance with 'default' tag name.

```js
var tlog = require('tlog');

// create loggers

var logA = tlog('logA');
var logB = tlog('logB');

logB.level = tlog.Level.WARNING; // aka. 30

logA.d('Hello, Debug!');
logA.i('Hello, Info!');
logA.w('Hello, Warning!');
logA.e('Hello, Error!');

tlog.level = tlog

logB.d('Hello, Debug!');
logB.i('Hello, Info!');
logB.w('Hello, Warning!');
logB.e('Hello, Error!');

// silence messages from logA
logA.level = tlog.Level.SILENT; // aka. 9999

logA.e('This wont log print');
```

### Log levels

 You can use any integer value as a logging level. Here are predefined values.

```
tlog.Level.DEBUG = 10;
tlog.Level.INFO = 20;
tlog.Level.WARNING = 30;
tlog.Level.ERROR = 40;
tlog.Level.SILENCE = 9999;
```

### Log level options

 `tlog.Level.options` contains the console printing options for each log level.

```
// create new log level
var PRE_WARNING = 25;
tlog.Level.options[PRE_WARNING] = {
	name: 'pre-warning',
	color: {
		text: 'red',
		background: 'yellow'
	}
};
```

## Writers
 **TODO**
