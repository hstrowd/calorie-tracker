class Welcome extends React.Component {
  render() {
    return (
      <div>
        <h2>Welcome to the World's Best Calorie Tracker</h2>
        <p>
          <Link to='/sign_up'>Sign up</Link> now to start tracking your daily calorie intake and making progress on your weight-loss goals.
        </p>
        <p>
          Already have an account? <Link to='/login'>Login</Link> and record your meals for the day in a few easy clicks.
        </p>
      </div>
    );
  }
};