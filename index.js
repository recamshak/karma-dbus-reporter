var dbus = require('dbus-native');
var sprintf = require("sprintf-js").sprintf;

var notifications = {
  success: {
    title: 'PASSED - %(browser.name)s',
    body: '%(results.success)d tests passed in %(time)s.',
    icon: 'dialog-information'
  },
  failed: {
    title: 'FAILED - %(browser.name)s',
    body: '%(results.failed)d/%(results.total)d tests failed in %(time)s.',
    icon: 'dialog-warning'
  },
  error: {
    title: 'ERROR - %(browser.name)s',
    body: '',
    icon: 'dialog-error'
  }
};

var DBusReporter = function(helper, logger, config) {
  var log = logger.create('reporter.dbus'),
      // temporary notification function that will be
      // overriden when DBus is initialized
      notify = function() { log.warn("D-Bus has not been initialized yet."); },

      prefix = config && config.prefix || '',
      timeout = config && config.timeout || 5,
      notifyOnlyFailures = config && config.notifyOnlyFailures || false;

  dbus.sessionBus()
    .getService('org.freedesktop.Notifications')
    .getInterface(
      '/org/freedesktop/Notifications',
      'org.freedesktop.Notifications',
      function(err, bus) {
        notify = function(title, body, icon) {
          if (prefix) {
            title = prefix + ' - ' + title;
          }

          bus.Notify('Karma D-Bus reporter', 0, icon, title, body, [], [],  timeout);
        };
      });

  this.adapters = [];

  this.onBrowserComplete = function(browser) {
    var results = browser.lastResult,
        data = {
          browser: browser,
          results: results,
          time: helper.formatTimeInterval(results.totalTime)
        },
        message;

    if (results.disconnected || results.error) {
      message = notifications.error;
    } else if (results.failed) {
      message = notifications.failed;
    } else {
      if (notifyOnlyFailures) {
        return;
      }

      message = notifications.success;
    }

    notify(
      sprintf(message.title, data),
      sprintf(message.body, data),
      message.icon);
  };
};

DBusReporter.$inject = ['helper', 'logger', 'config.dbusReporter'];

module.exports = {
  'reporter:dbus': ['type', DBusReporter]
};
