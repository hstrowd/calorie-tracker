class MealList extends React.Component {
  constructor(props) {
    super(props);

    this.state = { meals: [] };
  }

  componentWillMount() {
    var self = this;
    var mealSearchPath = '/api/v1/meals';
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

      $.each(dates, function(dateStr, meals) {
        var dateMeals = [];
        var calorieTotal = 0;
        var date = moment(meals[0].occurred_at);
        meals.forEach(function(meal) {
          dateMeals.push(<MealPreview key={meal.id} meal={meal} />);
          calorieTotal += meal.calories;
        });

        var dailyLimitClass = '';
        if (calorieTotal > self.props.dailyCalorieTarget) {
          dailyLimitClass = 'bg-danger'
        } else {
          if ( moment().startOf('day') < date ) {
            dailyLimitClass = 'bg-info'
          } else {
            dailyLimitClass = 'bg-success'
          }
        }

        var listDateClasses = 'meal-date ' + dailyLimitClass;
        mealList.push(
          <div className={listDateClasses}>
            <div className="date-title">
              <div className="pull-left"><h3>{dateStr}</h3></div>
              <div className="badge pull-right">{calorieTotal} Calories</div>
              <div className="clearfix"></div>
            </div>
            {dateMeals}
            <div className="clearfix"></div>
          </div>
        );
      });
    } else {
      meals = (
        <div className="alert alert-info">
          No meals recorded yet. <Link to={`/user/${this.props.userID}/meals/new`}>Click here</Link> to record your first meal.
        </div>
      );
    }

    return (
      <div className="meals">
        {mealList}
      </div>
    );
  }

};

