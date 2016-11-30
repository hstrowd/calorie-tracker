class MealPreview extends React.Component {
  render() {
    return (
      <div className="meal-preview col-md-5">
        <div className="description"><h4>{this.props.meal.description}</h4></div>
        <div className="attrs">
          <div className="time col-md-5">
            <div><strong>Time</strong></div>
            <span className="value">{this.props.meal.time}</span>
          </div>
          <div className="calories col-md-5">
            <div><strong>Calories</strong></div>
            <span className="value">{this.props.meal.calories}</span>
          </div>
        </div>
      </div>
    );
  }
};