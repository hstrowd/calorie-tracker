class Dashboard extends React.Component {
  render() {
    if (!$.auth.user.id) {
      Alerts.add('warning', 'Login required.');
      window.location.assign('/#/');
      return null;
    }

    return (
      <div>
        <div>
          <h2>Welcome, { $.auth.user.name }</h2>
        </div>
        <UserOverview userID={$.auth.user.id} />
      </div>
    );
  }
};