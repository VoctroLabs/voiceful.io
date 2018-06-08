@autobind
@observer
class EmotionStep extends React.Component {

  onCancel() {
    state.setSelectedEmotion(undefined);
  }

  onEmotionClick(event) {
    state.setSelectedEmotion(event.target.dataset.emotion);
  }

  render () {
    return (
      <Step number={1} title="Your emotion" complete={!!state.selectedEmotion} onCancel={this.onCancel}>
        {state.emotions.map(({value, text}) => {
          const selected = value === state.selectedEmotion;
          const disabled = state.selectedEmotion && value !== state.selectedEmotion;
          return (
            <div key={value} className="row">
              <a className={classNames('btn btn-default btn-lg', {selected, disabled})}
                 data-emotion={value} onClick={this.onEmotionClick}>{text}</a>
            </div>
          );
        })}
      </Step>
    );
  }
}