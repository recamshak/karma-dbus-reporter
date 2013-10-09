# karma-dbus-reporter

> Report test results using D-Bus.

## Installation

The easiest way is to keep `karma-dbus-reporter` as a devDependency in your `package.json`.
```json
{
  "devDependencies": {
    "karma": "~0.10",
    "karma-dbus-reporter": "~0.1"
  }
}
```

You can simple do it by:
```bash
npm install karma-dbus-reporter --save-dev
```

###

## Configuration
```js
// karma.conf.js
module.exports = function(config) {
  config.set({
    reporters: ['progress', 'dbus'],

    // this is optional
    dbusReporter: {
      prefix: 'My project',
      notifyOnlyFailures: true,
      timeout: 10
    }
  });
};
```

You can pass list of reporters as a CLI argument too:
```bash
karma start --reporters dbus,dots
```

----

For more information on Karma see the [homepage].


[homepage]: http://karma-runner.github.com
