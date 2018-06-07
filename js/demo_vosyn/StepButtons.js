class StepButtons extends React.Component {

  static propTypes = {
    enabled: PropTypes.bool,
    onCancel: PropTypes.func,
    onConfirm: PropTypes.func,
  };

  static defaultProps = {
    enabled: true,
  };

  render() {
    return (
      <div className="row btns-circle">
        <a className={classNames('btn-circle btn-cancel', {disabled: !this.props.enabled})}
           onClick={this.props.onCancel}>
          <div className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
          </div>
          <div className="btn-circle-text">CANCEL</div>
        </a>
        <a className={classNames('btn-circle btn-confirm', {disabled: !this.props.enabled})}
           onClick={this.props.onConfirm}>
          <div className="btn btn-default btn-lg">
            <span className="glyphicon glyphicon-ok" aria-hidden="true"/>
          </div>
          <div className="btn-circle-text">CONFIRM</div>
        </a>
      </div>
    );
  }

}