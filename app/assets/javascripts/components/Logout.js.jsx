class Logout extends React.Component {
  render() {
    Alerts.add('info', 'Logging out...');

    $.auth.signOut()
      .then(function(resp){
        Alerts.add('success', 'Logged out.').update();
      })
      .fail(function(resp) {
        Alerts.add('danger', 'Logout Failed.').update();
      });

    window.location.assign('/#/');

    return (
      <div></div>
    );
  }
};