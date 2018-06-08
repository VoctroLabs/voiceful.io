class Step extends React.Component {

  static propTypes ={
    buttons: PropTypes.object,
    complete: PropTypes.bool,
    onCancel: PropTypes.func,
    title: PropTypes.string.isRequired,
  };

  render() {
    const {buttons, children, complete, onCancel, title} = this.props;
    return (
      <FadeIn>
        <div className="center-box">
          <div className="container-fluid">
            <StepHeader number={state.stepNumber} title={title}/>
            {children}
            {buttons ?
              buttons : <StepButtons enabled={complete} onCancel={onCancel} onConfirm={state.nextStep}/>
            }
          </div>
        </div>
      </FadeIn>
    );
  }

}

class StepHeader extends React.Component {

  static propTypes ={
    number: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
  };

  @computed
  get text() {
    const number = numberToWords.toWords(this.props.number).toUpperCase();
    return `STEP ${number}`;
  }

  render() {
    return (
      <div>
        <div className="row step-number">
          <span className="center-block">{this.props.number}</span>
        </div>
        <div className="row step-text">
          {this.text}
        </div>
        <div className="row step-title">
          <h1>{this.props.title}</h1>
        </div>
      </div>
    );
  }

}

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

class FadeIn extends React.Component {

  static propTypes = {
    show: PropTypes.bool,
  };

  static defaultProps = {
    show: true,
  };

  render() {
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{enter: 1000}}
        classNames="FadeIn"
        appear={true}
        mountOnEnter
        unmountOnExit
      >
        {this.props.children}
      </CSSTransition>
    );
  }
}