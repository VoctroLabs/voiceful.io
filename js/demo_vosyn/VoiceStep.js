@autobind
@observer
class VoiceStep extends React.Component {

  onCancel() {
    state.setSelectedVoice(undefined);
  }

  onVoiceClick(event) {
    state.setSelectedVoice(event.target.dataset.voice);
  }

  render () {
    return (
      <Step title="Your voice" complete={!!state.selectedVoice} onCancel={this.onCancel}>
        <div id="voices">
          {state.voices.map(({value, text}) => {
            const selected = value === state.selectedVoice;
            const disabled = state.selectedVoice && value !== state.selectedVoice;
            return (
              <div key={value} className="row">
                <a className={classNames('btn btn-default btn-lg', {selected, disabled})}
                   data-voice={value} onClick={this.onVoiceClick}>{text}</a>
              </div>
            );
          })}
        </div>
      </Step>
    );
  }
}