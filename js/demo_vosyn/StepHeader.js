class StepHeader extends React.Component {

  static propTypes ={
    number: PropTypes.number.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
  };

  render() {
    return (
      <div>
        <div className="row step-number">
          <span className="center-block">{this.props.number}</span>
        </div>
        <div className="row step-text">
          {this.props.text}
        </div>
        <div className="row step-title">
          <h1>{this.props.title}</h1>
        </div>
      </div>
    );
  }

}