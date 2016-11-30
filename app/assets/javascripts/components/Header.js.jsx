class Header extends React.Component{

  renderNav() {
    var currentUser = $.auth.user;
    if (currentUser == null || currentUser.id == null) {
      return this.renderNavForNoUser();
    } else {
      return this.renderNavForActiveUser();
    }
  }

  renderNavForActiveUser() {
    return (
      <ul className="nav navbar-nav">
        <li>
            <Link to='/dashboard'>Dashboard</Link>
        </li>
        <li>
            <Link to='/logout'>Logout</Link>
        </li>
      </ul>
    );
  }

  renderNavForNoUser() {
    return (
      <ul className="nav navbar-nav">
        <li>
            <Link to='/login'>Login</Link>
        </li>
      </ul>
    );
  }

  render() {
    return (
      <nav className="navbar navbar-inverse navbar-fixed-top" role="navigation">
        <div className="container">
          <div className="navbar-header">
              <button className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
                  <span className="sr-only">Toggle navigation</span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
                  <span className="icon-bar"></span>
              </button>
              <Link to='/' className="navbar-brand">Calorie Tracker</Link>
          </div>
          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
              { this.renderNav() }
          </div>
        </div>
      </nav>
    );
  }

};
