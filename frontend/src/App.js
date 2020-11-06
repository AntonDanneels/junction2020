import "./App.css";
import React from "react";
import Quagga from "quagga";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthScore: 50,
    };
  }
  componentDidMount() {
    this.setState({ error: "test" });
  }
  openCamera() {}
  onHealthScoreChange(evt) {
    this.setState({ healthScore: evt.target.value });
  }
  render() {
    return (
      <div className="container">
        <h1 className="title is-1">Welcome to Nutrieat</h1>
        <h3 className="subtitle">
          Let's get started by defining your shopping preferences
        </h3>
        <form>
          <input
            className="slider is-success is-large"
            step="20"
            min="0"
            max="100"
            type="range"
            value={this.state.healthScore}
            onChange={(e) => {
              this.setState({ healthScore: e.target.value });
            }}
          />
        </form>
        <button onClick={this.openCamera}>Scan</button>
        <div id="camera"></div>
        <p>Error: {this.state.error}</p>
      </div>
    );
  }
}

export default App;
