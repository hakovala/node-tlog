# tlog

 tlog tries to provide a simple logging system with extensive tag system.
 Tags are used for filtering log output. tlog uses hierarchical tags
 to group multiple tags in one.

## Install

```bash
$ npm install tlog
```

## Usage

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

logA.e('This wont log');
```

### Configs

 To use per application configs, put `tlog.json` in application path.
 Config file is searched from all applications parent folders.

 Last best matching tag from config is used. This enables to set configs for
 a set of tags at once.

 Log levels can have the name or the actual numeric value.

#### Example config:

```js
{
	"level": "warning", // global log level
	"tags": { // per tag configs
		"log": { // matches everything starting with 'log'
			"level": "debug"
		},
		"logB": { // matches everything starting with 'logB'
			"level": 10
		}
		"logC": {
			"level": null // use global level
		}
	}
}
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

## Writers and formatters
 **not yet implemented/designed fully**
