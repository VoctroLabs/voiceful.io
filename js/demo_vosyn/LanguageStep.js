@autobind
@observer
class LanguageStep extends React.Component {

  onCancel() {
    state.setSelectedLanguage(undefined);
  }

  onLanguageClick(event) {
    state.setSelectedLanguage(event.target.dataset.language);
  }

  render () {
    return (
      <Step title="Your language" complete={!!state.selectedLanguage} onCancel={this.onCancel}>
        {state.languages.map(({value, text}) => {
          const selected = value === state.selectedLanguage;
          const disabled = state.selectedLanguage && value !== state.selectedLanguage;
          return (
            <div key={value} className="row">
              <a className={classNames('btn btn-default btn-lg', {selected, disabled})}
                 data-language={value} onClick={this.onLanguageClick}>{text}</a>
            </div>
          );
        })}
      </Step>
    );
  }
}