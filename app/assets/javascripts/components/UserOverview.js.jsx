class UserOverview extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: null,
      mealFilters: {}
    };
  }

  componentWillMount() {
    var self = this;
    var userLookupPath = '/api/v1/users/' + this.props.userID + '?summary=true';
    $.getJSON(userLookupPath)
      .then(function( resp ) {
        self.setState({ user: resp.data })
      })
      .fail(function() {
        Alerts.add('danger', 'Unable to retrieve your account details at this time. Please try again.').update();
      });
  }

  handleCreateMeal() {
    window.location.assign('/#/users/' + this.props.userID + '/meals/new');
  }

  handleFilterFormSubmit(filterAttrs) {
    this.setState({ mealFilters: filterAttrs });
  }

  render() {
    var dailyCalorieTarget = this.state.user && this.state.user.daily_calorie_target;
    return (
      <div>
        <div className="intro">
          <div>
            <div className="pull-left"
                 style={{margin:'0.6rem'}}>
              You've recorded XX total meals, totalling XX calories.
            </div>
            <span className="pull-right">
              <input type="button" value="Add Meal" className="btn btn-success" onClick={this.handleCreateMeal.bind(this)} />
            </span>
          </div>
          <div className="clearfix"></div>
        </div>
        <div>
          <MealFilterForm handleFormSubmit={this.handleFilterFormSubmit.bind(this)} />
        </div>
        <MealList dailyCalorieTarget={dailyCalorieTarget} filters={this.state.mealFilters} />
      </div>
    );
  }

};