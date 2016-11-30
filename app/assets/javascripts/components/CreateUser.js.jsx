class CreateUser extends React.Component {
  constructor(props) {
    super(props);

    var currentDate = new Date();
    this.state = {
      name: (this.props.name || ''),
      email: (this.props.email || ''),
      password: '',
      passwordConfirmation: '',
      dailyCalorieTarget: (this.props.dailyCalorieTarget || '')
    };
  }

  updateName(event) {
    this.setState({ name: event.target.value });
  }
  updateEmail(event) {
    this.setState({ email: event.target.value });
  }
  updatePassword(event) {
    this.setState({ password: event.target.value });
  }
  updatePasswordConfirmation(event) {
    this.setState({ passwordConfirmation: event.target.value });
  }
  updateDailyCalorieTarget(event) {
    this.setState({ dailyCalorieTarget: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    if ( !this.isFormValid() ) {
      return;
    }

    Alerts.add('info', 'Creating account....').update();

    this.recordUser();
  }

  isFormValid() {
    $('input').parent('.form-group').removeClass('has-error');
    if (this.state.password.length < 8) {
      Alerts.add('danger', 'Passwords is too short.').update();
      $('input[name="password"]').parent('.form-group').addClass('has-error');
      return false;
    }
    if (this.state.password.length > 128) {
      Alerts.add('danger', 'Passwords is too long.').update();
      $('input[name="password"]').parent('.form-group').addClass('has-error');
      return false;
    }
    if (this.state.password != this.state.passwordConfirmation) {
      Alerts.add('danger', 'Both passwords must match.').update();
      $('input[name="password-confirmation"]').parent('.form-group').addClass('has-error');
      return false;
    }

    return true;
  }

  recordUser() {
    var self = this;

    var path = '/api/v1/users'
    var data = {
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      daily_calorie_target: this.state.dailyCalorieTarget
    };

    $.ajax({
      type: "POST",
      url: path,
      data: data
    })
    .done(function() {
      $.auth.emailSignIn({ email: data.email, password: data.password })
        .then(function() {
          self.handleSuccess();
        })
        .fail(function() {
          Alerts.add('success', 'Account created. Login to start tracking your calories.');
          window.location.assign('/#/');
        })
    })
    .fail(function() {
      self.handleFailure();
    });
  }

  handleSuccess() {
    Alerts.add('success', 'Account created successfully.');
    window.location.assign('/#/dashboard');
  }
  handleFailure() {
    Alerts.add('danger', 'Unable to create account.').update();
  }

  render() {
    return (
      <div>
        <div className="intro">
          Create a new account by completing the form below:
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label>Name</label>
            <input type="text"
                   name="name"
                   className="form-control"
                   placeholder="John Doe"
                   required={true}
                   value={this.state.name}
                   onChange={this.updateName.bind(this)} />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="text" name="email"
                   className="form-control"
                   placeholder="john.doe@gmail.com"
                   required={true}
                   value={this.state.email}
                   onChange={this.updateEmail.bind(this)} />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password"
                   name="password"
                   className="form-control"
                   required={true}
                   value={this.state.password}
                   onChange={this.updatePassword.bind(this)} />
          </div>
          <div className="form-group">
            <label>Password Confirmation</label>
            <input type="password"
                   name="password-confirmation"
                   className="form-control"
                   required={true}
                   value={this.state.passwordConfirmation}
                   onChange={this.updatePasswordConfirmation.bind(this)} />
          </div>
          <div className="form-group">
            <label>Daily Calorie Target</label>
            <input type="number"
                   name="daily-calorie-target"
                   className="form-control"
                   placeholder="2000"
                   required={true}
                   step="1"
                   min="0"
                   max="9999"
                   value={this.state.dailyCalorieTarget}
                   onChange={this.updateDailyCalorieTarget.bind(this)} />
          </div>
          <div className="actions">
            <input type="submit"
                   className="btn btn-success"
                   value="Create" />
          </div>
        </form>
      </div>
    );
  }
};