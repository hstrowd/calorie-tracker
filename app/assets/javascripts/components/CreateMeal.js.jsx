class CreateMeal extends React.Component {
  constructor(props) {
    super(props);
  }

  handleFormSubmit(formValues) {
    Alerts.add('info', 'Recording meal....').update();

    var mealAttrs = {
      user_id: this.props.params.userID,
      description: formValues.description,
      calories: formValues.calories,
      occurred_at: moment(formValues.date + ' ' + formValues.time,
                          MealForm.DATE_FORMAT + ' ' + MealForm.TIME_FORMAT).format()
    };
    this.recordMeal(mealAttrs);
  }

  recordMeal(mealAttrs) {
    var self = this;

    var path = '/api/v1/meals'
    $.ajax({
      type: "POST",
      url: path,
      data: mealAttrs
    })
    .done(function() {
      self.handleSuccess();
    })
    .fail(function() {
      self.handleFailure();
    });
  }

  handleSuccess() {
    Alerts.add('success', 'Successfully recorded new meal.');
    window.location.assign('/#/dashboard');
  }
  handleFailure() {
    Alerts.add('danger', 'Unable to record the meal. Please try again.').update();
  }

  render() {
    return (
      <div>
        <div className="intro">
          Record a new meal using the form below:
        </div>
        <MealForm handleFormSubmit={this.handleFormSubmit.bind(this)}
                  userID={this.props.userID}
                  meal={{}}
                  submitAction={'Create'} />
    </div>
    );
  }
};