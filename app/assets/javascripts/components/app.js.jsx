var RouteHandler = ReactRouter.RouteHandler,
    Link = ReactRouter.Link;

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = { authLoaded: false };
  }

  componentWillMount() {
    var self = this;
    $.auth.configure({
      apiUrl:                '/api/v1',
      signOutPath:           '/auth/sign_out',
      emailSignInPath:       '/auth/sign_in',
      tokenValidationPath:   '/auth/validate_token',
      storage:               'cookies',

      tokenFormat: {
        "access-token": "{{ access-token }}",
        "token-type":   "Bearer",
        client:         "{{ client }}",
        expiry:         "{{ expiry }}",
        uid:            "{{ uid }}"
      },

      parseExpiry: function(headers){
        // convert from ruby time (seconds) to js time (millis)
        return (parseInt(headers['expiry'], 10) * 1000) || null;
      },

      handleLoginResponse: function(resp) {
        return resp.data;
      },

      handleTokenValidationResponse: function(resp) {
        return resp.data;
      }

    })
    .then(function() {
      self.forceUpdate();
    })
    .fail(function() {
      self.forceUpdate();
    });
  }

  render() {
    return (
      <div>
        <Header />
        <div className="container header-spacer">
          <Alerts />
          <RouteHandler {...this.props} />
        </div>
      </div>
    );
  }

};