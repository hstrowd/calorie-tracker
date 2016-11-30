class Dashboard extends React.Component {
  render() {
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