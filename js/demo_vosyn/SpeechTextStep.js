@autobind
@observer
class SpeechTextStep extends React.Component {

  onChange(event) {
    state.speechText.setText(event.target.value);
  }

  render () {
    const disabled = state.speechText.text.length === 0;
    return (
      <Step title="Your words" complete={!disabled} onCancel={state.speechText.clearText}>
        <div className="row">
          <div className={classNames('form-group', {disabled})}>
            <textarea className="form-control vosyn-sentence" autoFocus={true} rows={2}
                      placeholder="Type here" maxLength={100} wrap="soft"
                      value={state.speechText.text} onChange={this.onChange}/>
          </div>
        </div>
        <div className="row">
          <h4>{state.speechText.text.length}/{state.speechText.maxChars}</h4>
        </div>
      </Step>
    );
  }
}

@autobind
@observer
class SingingTextInput2 extends React.Component {

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
    this.textInput.singingText = value;
  }

  get textInput() {
    return state.singingTexts[this.props.index];
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