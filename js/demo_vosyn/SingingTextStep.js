const syllable = require('syllable');

@autobind
@observer
class SingingTextStep extends React.Component {
  @observable inputs = [];

  @action
  addInput(input) {
    this.inputs.push(input);
  }

  @computed
  get correct() {
    return this.inputs.reduce((correct, input) => correct && input.correct, true);
  }

  @action
  onCancel() {
    this.inputs.forEach(input => input.clearText());
  }

  @action
  onConfirm() {
    state.setStep(2);
  }

  render () {
    return (
      <div id="singing-text-step">
        <StepHeader number={1} text="STEP ONE" title="Your words"/>
        <div>{state.textInputs.map((_, i) => <SingingTextInput key={i} index={i} ref={this.addInput}/>)}</div>
        <StepButtons enabled={this.correct} onConfirm={this.onConfirm} onCancel={this.onCancel} />
      </div>
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

  @action
  clearText() {
    this.text = '';
  }

  @computed
  get correct() {
    return this.syllables === this.totalSyllables;
  }

  onChange(event) {
    const text = event.target.value;
    // Allow only to input letters and some symbols,
    let char, key, cleanText = '';
    for(let i=0; i < text.length; i++) {
      char = text.slice(i, i + 1);
      key = char.charCodeAt(0);
      console.log(key);
      if ((key >= 65 && key <= 90) || (key >= 97 && key <= 122) ||
        [' ', ',', '.', "'", '-'].includes(char))
        cleanText += char;
    }
    this.text = cleanText;
  }

  @computed
  get syllables() {
    return syllable(this.text);
  }

  get text() {
    return this.textInput.text;
  }

  set text(value) {
    this.textInput.text = value;
  }

  get textInput() {
    return state.textInputs[this.props.index];
  }

  get totalSyllables() {
    return this.textInput.totalSyllables;
  }

  render() {
    return (
      <div className="row">
        <div className={classNames('form-group', {disabled: !this.correct})}>
          <input className="form-control vosyn-sentence" type="text"
                 placeholder="Type here" value={this.text} onChange={this.onChange}/>
          <span ref={this.addTooltip} className="num-syllabes"
                data-toggle="tooltip" data-placement="right" title="Syllables">
            {this.correct?
              <span className="glyphicon glyphicon-ok"/> :
              `${this.syllables}/${this.totalSyllables}`
            }
          </span>
        </div>
      </div>
    );
  }

}