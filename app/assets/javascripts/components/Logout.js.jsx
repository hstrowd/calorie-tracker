class Logout extends React.Component {
  render() {
    Alerts.addAlert('info', 'Logging out...').reload();

    $.auth.signOut()
      .then(function(resp){
        Alerts.addAlert('success', 'Logged out.').reload();
      })
      .fail(function(resp) {
        Alerts.addAlert('danger', 'Logout Failed.').reload();
      });

    window.location.assign('/#/');

    return (
      <div></div>
    );
  }
};