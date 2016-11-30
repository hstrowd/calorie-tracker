class Alerts extends React.Component {
  static add(type, body) {
    var alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    alerts.push({ type: type, body: body });
    localStorage.setItem('alerts', JSON.stringify(alerts));

    return this; // Allow chaining.
  }

  static update() {
    window.reloadAlerts();

    return this; // Allow chaining.
  }

  componentDidMount() {
      var self = this;
      window.reloadAlerts = function() {
          self.forceUpdate();
      }
  }

  componentWillUnmount() {
      window.reloadAlerts = null;
  }

  render() {
    var alerts = JSON.parse(localStorage.getItem('alerts') || '[]');
    localStorage.setItem('alerts', '[]');

    var alertMsgs = [];
    alerts.forEach((alert) => {
      var classString = 'alert alert-' + alert.type;
      alertMsgs.push(<div id="status" className={classString} ref="status">
                       {alert.body}
                     </div>);
    });

    return (
      <div className="alerts">
        { alertMsgs }
      </div>
    );
  }
};
