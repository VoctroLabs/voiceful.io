@autobind
@observer
class StyleStep extends React.Component {

  onCancel() {
    state.setSelectedStyle(undefined);
  }

  onStyleClick(event) {
    state.setSelectedStyle(event.target.dataset.style);
  }

  render () {
    return (
      <Step title="Your style" complete={!!state.selectedStyle} onCancel={this.onCancel}>
          {state.styles.map(({value, text}) => {
            const selected = value === state.selectedStyle;
            const disabled = state.selectedStyle && value !== state.selectedStyle;
            return (
              <div key={value} className="row">
                <a className={classNames('btn btn-default btn-lg', {selected, disabled})}
                   data-style={value} onClick={this.onStyleClick}>{text}</a>
              </div>
            );
          })}
      </Step>
    );
  }
}