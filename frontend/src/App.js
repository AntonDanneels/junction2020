import "./App.css";
import React from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";

class ScorePicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentVal: "" };
  }
  render() {
    let options = [];
    [
      ["A", "text-a"],
      ["B", "text-b"],
      ["C", "text-c"],
      ["D", "text-d"],
      ["E", "text-e"],
    ].forEach((val) => {
      let value = val[0];
      let css = val[1];
      options.push(
        <label className="radio" key={this.props.name + "_" + value}>
          <input
            type="radio"
            className="radio-score"
            value={value}
            checked={this.state.currentVal === value}
            onChange={(e) => {
              this.setState({ currentVal: e.target.value });
              if (this.props.onUpdate) {
                this.props.onUpdate(e.target.value);
              }
            }}
          />
          <h1 className={"title " + css}>{value}</h1>
        </label>
      );
    });
    return (
      <div className="card">
        <div className="card-content">
          <h3 className="title is-4">{this.props.name}</h3>
          <h3 className="subtitle is-6">{this.props.subtext}</h3>
          <form>
            <div className="control">{options}</div>
          </form>
        </div>
      </div>
    );
  }
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthScore: "",
      planetScore: "",
      priceScore: "",
    };
  }
  updatePicks(key, val) {
    if (
      this.state.healthScore !== "" &&
      this.state.planetScore !== "" &&
      this.state.priceScore !== ""
    ) {
      this.setState({ hasInfo: true });
    }
  }

  renderShoppingList() {
    return (
      <CSSTransition in={true} timeout={200} classNames="fade" appear={true}>
        <div className="container site">
          <div className="content">
            <h1 className="title is-1">Nutreat</h1>
            Your shopping cart looks empty, scan a product to begin.
          </div>
          <div className="sticky-footer">
            <button className="button is-primary is-large">Scan</button>
          </div>
        </div>
      </CSSTransition>
    );
  }

  render() {
    if (this.state.hasInfo) {
      return this.renderShoppingList();
    }
    return (
      <div className="container">
        <h1 className="title is-1">Nutreat</h1>
        <h3 className="subtitle">
          Get started by defining your shopping preferences
        </h3>
        <ScorePicker
          name="Health"
          subtext="How important is eating healthy?"
          onUpdate={(e) => {
            this.setState({ healthScore: e }, () => this.updatePicks());
          }}
        />
        <ScorePicker
          name="Planet"
          subtext="How important is sustainability?"
          onUpdate={(e) => {
            this.setState({ planetScore: e }, () => this.updatePicks());
          }}
        />
        <ScorePicker
          name="Price"
          subtext="How important is the price?"
          onUpdate={(e) => {
            this.setState({ priceScore: e }, () => this.updatePicks());
          }}
        />
      </div>
    );
  }
}

export default App;
