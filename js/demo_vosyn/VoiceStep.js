@autobind
@observer
class VoiceStep extends React.Component {

  static voices = [
    {value: 'randy', text: 'Male'},
    {value: 'ayesha', text: 'Female'},
  ];

  onCancel() {
    state.setVoice(undefined);
  }

  onConfirm() {
    state.setStep(3);
  }

  onVoiceClick(event) {
    state.setVoice(event.target.dataset.voice);
  }

  render () {
    return (
      <div id="voice-step">
        <StepHeader number={2} text="STEP TWO" title="Your voice"/>
        <div id="voices">
          {this.constructor.voices.map(({value, text}) => {
            const selected = value === state.voice;
            const disabled = state.voice && value !== state.voice;
            return (
              <div key={value} className="row">
                <a className={classNames('btn btn-default btn-lg', {selected, disabled})}
                   data-voice={value} onClick={this.onVoiceClick}>{text}</a>
              </div>
            );
          })}
        </div>
        <StepButtons enabled={!!state.voice} onConfirm={this.onConfirm} onCancel={this.onCancel} />
      </div>
    );
  }
}