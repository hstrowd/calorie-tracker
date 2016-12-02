class MealList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filters: (this.props.filters || {}),
      meals: []
    };
  }

  componentWillMount() {
    this.retrieveMeals(this.state.filters);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.filters != this.props.filters) {
      this.retrieveMeals(nextProps.filters);
    }
  }

  retrieveMeals(filters) {
    var self = this;

    var queryParams = [];
    if (filters.startDate) {
      queryParams.push('start_date=' + filters.startDate);
    }
    if (filters.endDate) {
      queryParams.push('end_date=' + filters.endDate);
    }
    // Account for the timezone offset.
    if (filters.startHour || filters.endHour) {
      var utcHourOffset = Math.round(moment().utcOffset() / 60);
      var startHour = (parseInt(filters.startHour) || 0 );
      startHour -= utcHourOffset;
      startHour %= 24;

      var endHour = (parseInt(filters.endHour) || 0 );
      endHour -= utcHourOffset;
      endHour %= 24;

      queryParams.push('start_hour=' + startHour);
      queryParams.push('end_hour=' + endHour);
    }
    queryString = queryParams.join('&')

    var mealSearchPath = '/api/v1/meals?' + queryString;
    $.getJSON(mealSearchPath)
      .then(function( resp ) {
        self.setState({ meals: resp.data })
      })
      .fail(function() {
        Alerts.add('danger', 'Unable to retrieve your meals at this time.').update();
      });
  }

  render() {
    var self = this;
    var mealList = [];
    if ( this.state.meals.length > 0 ) {
      var dates = {};
      this.state.meals.forEach(function (meal) {
        meal.date = moment(meal.occurred_at).format('dddd, MMMM Do YYYY')
        meal.time = moment(meal.occurred_at).format('h:mm a')
        if ( dates[meal.date] == null ) {
          dates[meal.date] = [];
        }
        dates[meal.date].push(meal);
      });

      $.each(dates, function(dateString, meals) {
        mealList.push(self.renderDateContainer(dateString, meals));
      });
    } else {
      var alertStyles = {
        float: 'none',
        margin: '1rem auto'
      };
      mealList = (
        <div className="alert alert-info col-md-7 text-center"
             style={alertStyles}>
          No meals recorded yet. <Link to={`/users/${this.props.userID}/meals/new`}>Click here</Link> to record your first meal.
        </div>
      );
    }

    return (
      <div className="meals">
        {mealList}
      </div>
    );
  }


  renderDateContainer(dateString, meals) {
    var dateMeals = [];
    var calorieTotal = 0;
    var date = moment(meals[0].occurred_at);
    meals.forEach(function(meal) {
      dateMeals.push(<MealPreview key={meal.id} meal={meal} />);
      calorieTotal += meal.calories;
    });

    var dailyLimitClass = '';
    if (calorieTotal > this.props.dailyCalorieTarget) {
      dailyLimitClass = 'bg-danger'
    } else {
      if ( moment().startOf('day') < date ) {
        dailyLimitClass = 'bg-info'
      } else {
        dailyLimitClass = 'bg-success'
      }
    }

    return (
      <div key={'date-meals-' + date.format('YYYY-MM-DD')}
           className={'meal-date ' + dailyLimitClass}>
        <div className="date-title">
          <div className="pull-left"><h3>{dateString}</h3></div>
          <div className="badge pull-right">{calorieTotal} Calories</div>
          <div className="clearfix"></div>
        </div>
        <div>
          {dateMeals}
        </div>
        <div className="clearfix"></div>
      </div>
    );
  }
};

