class Header extends React.Component {
  render() {
    return (
      <div id="header" className="container-fluid">
        <a href="index.html">
          <img className="logo" alt="logo" src="img/logo-white.png" srcSet="img/logo-white-big.png 2x"/>
        </a>
        <a className="close-demo" href="demos.html">
          <span className="close-text">CLOSE</span>
          <span className="glyphicon glyphicon-remove" aria-hidden="true"/>
        </a>
      </div>
    );
  }
}