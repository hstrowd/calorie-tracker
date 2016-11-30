class UserShow extends React.Component {

  render() {
    return (
      <div>
        <div>Welcome, { $.auth.user.name }. Start tracking your calories and monitoring your progress here.</div>
      </div>
    );
  }

};