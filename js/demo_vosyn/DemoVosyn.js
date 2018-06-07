const steps = [
  <SingingTextStep/>,
  <VoiceStep/>,
  <ListenStep/>,
];

@observer
class DemoVosyn extends React.Component {
  render() {
    return (
      <div>
        <Header/>
        {steps.map((step, i) =>
          <Fade show={state.step === i + 1}>
            <div className="center-box">
              <div className="container-fluid">
                {step}
              </div>
            </div>
          </Fade>
        )}
      </div>
    );
  }
}

class Fade extends React.Component {
  render() {
    return (
      <CSSTransition
        in={this.props.show}
        timeout={{enter: 1000, exit: 200}}
        classNames="Fade"
        mountOnEnter
        unmountOnExit
      >
        {this.props.children}
      </CSSTransition>
    );
  }
}