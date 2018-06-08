@autobind
@observer
class SingingTextStep extends React.Component {

  @computed
  get correct() {
    return state.singingTexts.reduce((correct, text) => correct && text.correct, true);
  }

  @action
  onCancel() {
    state.singingTexts.forEach(text => text.clearText());
  }

  render () {
    return (
      <Step title="Your words" complete={this.correct} onCancel={state.speechText.clearText}>
        {state.singingTexts.map((_, i) => <SingingTextInput key={i} index={i} />)}
      </Step>
    );
  }
}

@autobind
@observer
class SingingTextInput extends React.Component {

  static propTypes = {
    index: PropTypes.number.isRequired,
  };

  addTooltip(component) {
    if (component) $(component).tooltip();
  }

  onChange(event) {
    this.text.setText(event.target.value);
  }

  get text() {
    return state.singingTexts[this.props.index];
  }

  render() {
    return (
      <div className="row">
        <div className={classNames('form-group', {disabled: !this.text.correct})}>
          <input className="form-control vosyn-sentence" type="text"
                 placeholder="Type here" value={this.text.text} onChange={this.onChange}/>
          <span ref={this.addTooltip} className="num-syllabes"
                data-toggle="tooltip" data-placement="right" title="Syllables">
            {this.text.correct?
              <span className="glyphicon glyphicon-ok"/> :
              `${this.text.syllables}/${this.text.totalSyllables}`
            }
          </span>
        </div>
      </div>
    );
  }

}