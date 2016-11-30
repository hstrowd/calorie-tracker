var DATE_FORMAT = 'YYYY-MM-DD';
var TIME_FORMAT = 'HH:mm';
class CreateMeal extends React.Component {
  constructor(props) {
    super(props);

    var currentDate = new Date();
    this.state = {
      userID: this.props.userID,
      description: this.props.description,
      calories: this.props.calories,
      date: (this.props.date || moment().format(DATE_FORMAT)),
      time: (this.props.time || moment().format(TIME_FORMAT))
    };
  }

  formatDate(date) {
    return date.getFullYear() + '-' + date.getMonth() + '-' + date.getDate();
  }
  formatTime(date) {
    return date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds();
  }

  updateDescription(event) {
    this.setState({ description: event.target.value });
  }
  updateCalories(event) {
    this.setState({ calories: event.target.value });
  }
  updateDate(event) {
    this.setState({ date: event.target.value });
  }
  updateTime(event) {
    this.setState({ time: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    Alerts.add('info', 'Recording meal....').update();

    this.recordMeal();
  }

  recordMeal() {
    var self = this;

    var path = '/api/v1/meals'
    var data = {
      user_id: this.state.userID,
      description: this.state.description,
      calories: this.state.calories,
      occurred_at: moment(this.state.date + ' ' + this.state.time, DATE_FORMAT + ' ' + TIME_FORMAT).format()
    };

    $.ajax({
      type: "POST",
      url: path,
      data: data
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
    Alerts.add('danger', 'Unable to record meal.').update();
  }

  render() {
    return (
      <div>
        <div className="intro">
          Record a new meal using the form below:
        </div>
        <form onSubmit={this.handleSubmit.bind(this)}>
          <div className="form-group">
            <label for="description">Description</label>
            <input type="text" name="description"
                   className="form-control" placeholder="Describe this meal"
                   value={this.state.description} onChange={this.updateDescription.bind(this)} />
          </div>
          <div className="form-group">
            <label for="calories">Calories</label>
            <input type="number" name="calories"
                   className="form-control" placeholder="500"
                   step="1" min="0" max="2999"
                   value={this.state.calories} onChange={this.updateCalories.bind(this)} />
          </div>
          <div className="form-group">
            <label for="date">Date</label>
            <input type="date" name="date"
                   className="form-control"
                   value={this.state.date} onChange={this.updateDate.bind(this)} />
          </div>
          <div className="form-group">
            <label for="time">Time</label>
            <input type="time" name="time"
                   className="form-control"
                   value={this.state.time} onChange={this.updateTime.bind(this)} />
          </div>
          <div className="actions">
            <input type="submit" className="btn btn-success" value="Create" />
          </div>
        </form>
      </div>
    );
  }
};