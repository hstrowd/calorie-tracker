class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      email: (this.props.email || ''),
      password: (this.props.password || '')
    };
  }

  updateEmail(event) {
    this.setState({ email: event.target.value });
  }
  updatePassword(event) {
    this.setState({ password: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    Alerts.addAlert('info', 'Logging in....').reload();
    this.sendFormData();
  }

  sendFormData() {
    var formData = {
      email: this.state.email,
      password: this.state.password
    };

    var self = this;
    $.auth.emailSignIn(formData)
      .then(function(resp) {
        Alerts.addAlert('success', 'Logged in.');
        window.location.assign('/#/user/' + $.auth.user.id);
      })
      .fail(function(resp) {
        Alerts.addAlert('danger', 'Login Failed.').reload();
      });
  }

  render() {
    return (
      <div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label for="email">Email</label>
            <input type="text" name="email"
                   className="form-control" placeholder="john.doe@gmail.com"
                   value={this.state.email} onChange={this.updateEmail.bind(this)} />
          </div>
          <div className="form-group">
            <label for="password">Password</label>
            <input type="password" name="password"
                   className="form-control" placeholder="Pa$$w0rd"
                   value={this.state.password} onChange={this.updatePassword.bind(this)} />
          </div>
          <div className="actions">
            <input type="submit" className="btn btn-success" value="Login" />
          </div>
        </form>
      </div>
    );
  }

  contextTypes: {
    router: React.PropTypes.func.isRequired
  }
};