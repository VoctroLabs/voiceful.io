@observer
class DemoVosyn extends React.Component {
  render() {
    return (
      <div>
        <FadeIn><Header/></FadeIn>
        {state.step.step}
      </div>
    );
  }
}

ReactDOM.render(<DemoVosyn/>, document.getElementById('root'));
