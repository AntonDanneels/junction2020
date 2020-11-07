import "./App.css";
import React from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import * as ScanditSDK from "scandit-sdk";

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
      <div className="message is-success">
        <div className="message-body">
          <h3 className="title is-4 has-text-success">{this.props.name}</h3>
          <h3 className="subtitle is-6 has-text-grey-light">
            {this.props.subtext}
          </h3>
          <form>
            <div className="control">{options}</div>
          </form>
        </div>
      </div>
    );
  }
}

class ListView extends React.Component {}

class ProposalView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      error: false,
      product: null,
      recommendations: [],
      hasChatBot: false,
    };
  }
  componentDidMount() {
    var people = scoreToNumber(this.props.people);
    var price = scoreToNumber(this.props.price);
    var planet = scoreToNumber(this.props.planet);
    fetch(
      "https://nutreat-backend.azurewebsites.net/api/products/" +
        this.props.code +
        "?people=" +
        people +
        "&price=" +
        price +
        "&planet=" +
        planet
    )
      .then((result) => result.json())
      .then((result) => {
        console.log(result);
        this.setState({
          loading: false,
          product: result.product,
          recommendations: result.recommended.products || [],
        });
      })
      .catch((error) => this.setState({ loading: false, error: true }));
  }

  renderRecommendation(product) {
    return (
      <div>
        <section className="section card">
          <article className="media">
            <figure className="media-left">
              <p className="image is-64x64">
                <img src={product.image_small_url} />
              </p>
            </figure>
            <div className="media-content">
              <div className="content product-text">
                <p>
                  <strong>{product.product_name}</strong>
                  <br />
                  {product.ingredients_text_en}
                </p>
              </div>
              <nav class="level is-mobile">
                <div className="level-left">
                  <a className="level-item">
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fas fa-heart fa-stack-1x has-text-danger"></i>
                      </span>
                      <p className=" has-text-black">
                        {product.score_people.toUpperCase()}
                      </p>
                    </span>
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fab fa-envira fa-stack-1x has-text-success"></i>
                      </span>
                      <p className=" has-text-black">A</p>
                    </span>
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fas fa-euro-sign fa-stack-1x has-text-warning"></i>
                      </span>
                      <p className=" has-text-black">A</p>
                    </span>
                  </a>
                </div>
              </nav>
            </div>
          </article>
        </section>
      </div>
    );
  }

  startChatbot() {
    window.JustWidgetBasePath = "https://bot.jaicp.com";
    var script = document.createElement("script");
    script.type = "text/javascript";
    script.charset = "utf-8";
    window.JustWidgetRawParams = { barcode: this.state.product._id };
    var JustWidgetRawParams = { barcode: this.state.product._id };
    window.JustWidgetAttributes = {
      senderName: "Chat widget",
      options: {
        headline: { text: "", hide: "Свернуть", show: false },
        names: { assistantName: "", userName: "", show: false },
        captions: {
          inputPlaceholder: "",
          loadHistory: "Загрузить историю сообщений",
          errorOccurred: "Возникла ошибка",
          viewLog: "посмотреть лог ошибки",
          errorLog: "Лог ошибки",
          copyLog: "Скопировать лог",
          closeLog: "Закрыть",
          imageDownload: "Закрыть",
          dndLabel: "Перетащите файл сюда",
        },
        showLogo: false,
        logo: "",
        channel: null,
        percentage: 100,
        copySource: null,
        sendBtn: { show: false },
        avatar: {
          show: false,
          assistantAvatarUrl: "",
          userAvatarUrl: "",
          operatorAvatarUrl: "",
          size: 24,
        },
        fileUpload: {
          show: false,
          uploadErrorMessage: "",
          tooBigFileMessage: "",
        },
        position: "right",
        involvement: {
          enabled: true,
          events: [
            { eventType: "website_time", value: 0.2 },
            { eventType: "page_time", value: 0.2 },
          ],
        },
        bubble: {
          show: true,
          delay: "1",
          bubbletext: "Any questions?",
          mobileBubbletext: "",
        },
        sessionByUserMessage: { show: false, welcomemessage: "", delay: 100 },
        positionOffset: { bottom: 24, right: 24 },
        palette: {
          headlineBackgroundColor: "#5A9CED",
          headlineTextColor: "dark",
          chatBackgroundColor: "#FFFFFF",
          chatBackgroundOpacity: 100,
          userMessageBackgroundColor: "#CBDFF8",
          userMessageTextColor: "dark",
          botMessageBackgroundColor: "#F4F5F5",
          botMessageTextColor: "dark",
          formButtonsColor: "#5A9CED",
          formTextColor: "#000",
        },
        font: "Roboto",
        sizes: { font: "small", avatar: "big" },
      },
      theme: "defaultv3",
      position: "right",
      percentage: 100,
    };
    window.JustWidgetName = "250558427-hackjunction2-250558427-KpY-11274527138";
    script.src =
      window.JustWidgetBasePath +
      "/s/" +
      window.JustWidgetAttributes.theme +
      "/js/index.js";
    script.dataset.origin = "justwidget";

    document.body.appendChild(script);

    if (!window.JustWidgetAttributes.options.notUseStyles) {
      var style = document.createElement("link");
      style.rel = "stylesheet";
      style.href =
        window.JustWidgetBasePath +
        "/s/" +
        window.JustWidgetAttributes.theme +
        "/css/index.css";
      style.dataset.origin = "justwidget";

      document.head.appendChild(style);
    }

    const targetNode = document.getElementById("body");
    const config = { attributes: true, childList: true, subtree: true };

    const observer = new MutationObserver((list, observer) => {
      var widget = document.querySelectorAll(".justwidget--close");
      if (widget.length !== 0) {
        widget.forEach((w) => {
          w.addEventListener("click", () => {
            this.removeChatBot();
            observer.disconnect();
          });
        });
      }
    });
    observer.observe(targetNode, config);
  }

  removeChatBot() {
    var widget = document.getElementById("widget-root");
    if (widget) {
      widget.remove();
    }
  }

  renderProduct() {
    let recommendations = [];
    this.state.recommendations.forEach((product) => {
      recommendations.push(this.renderRecommendation(product));
    });
    return (
      <div className="content">
        <section className="section card">
          <article className="media">
            <figure className="media-left">
              <p className="image is-64x64">
                <img
                  src={this.state.product.image_small_url}
                  className="is-rounded"
                />
              </p>
            </figure>
            <div className="media-content">
              <div className="content product-text">
                <p>
                  <strong>{this.state.product.product_name}</strong>
                  <br />
                  {this.state.product.ingredients_text_en}
                </p>
              </div>
              <nav class="level is-mobile">
                <div className="level-left">
                  <a className="level-item">
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fas fa-heart fa-stack-1x has-text-danger"></i>
                      </span>
                      <p className=" has-text-black">
                        {this.state.product.score_people.toUpperCase()}
                      </p>
                    </span>
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fab fa-envira fa-stack-1x has-text-success"></i>
                      </span>
                      <p className=" has-text-black">A</p>
                    </span>
                    <span class="icon is-large">
                      <span class="fa-stack fa-lg">
                        <i class="fas fa-euro-sign fa-stack-1x has-text-warning"></i>
                      </span>
                      <p className=" has-text-black">A</p>
                    </span>
                  </a>
                </div>
              </nav>
              <div class="column has-text-centered is-2">
                <a
                  className="button is-info is-medium is-rounded"
                  href="/scan"
                  onClick={(e) => {
                    e.preventDefault();
                    this.setState({ hasChatBot: true });
                    this.startChatbot();
                  }}
                >
                  More info
                </a>
              </div>
            </div>
          </article>
          {recommendations.length !== 0 && (
            <p className="subtitle is-4">Alternatives</p>
          )}
          {recommendations}
        </section>
      </div>
    );
  }

  renderLoading() {
    return (
      <div className="content hero">
        <div className="hero-body">
          <h1 className="title">Loading your product..</h1>
          <progress class="progress is-large is-info" max="100">
            60%
          </progress>
        </div>
      </div>
    );
  }

  renderError() {
    this.startChatbot();
    return (
      <div className="content hero">
        <div className="hero-body">
          <h1 className="title has-text-danger">
            An error occured, please try again
          </h1>
          <progress class="progress is-large is-danger" max="100" value="100">
            60%
          </progress>
        </div>
      </div>
    );
  }

  render() {
    return (
      <CSSTransition in={true} timeout={200} classNames="fade" appear={true}>
        <div className="site container">
          {renderNavigation()}
          {this.state.loading && this.renderLoading()}
          {!this.state.loading && this.state.error && this.renderError()}
          {!this.state.loading && !this.state.error && this.renderProduct()}
          <footer className="fixed-footer">
            <div className="field has-addons" id="footer">
              <p className="control">
                <button
                  className="button is-success is-large is-rounded"
                  onClick={() => {
                    if (this.props.onSuccess) {
                      this.props.onSuccess(this.state.product);
                    }
                  }}
                >
                  <span className="icon is-large">
                    <span className="fa-stack fa-lg">
                      <i className="fas fa-check fa-stack-1x"></i>
                    </span>
                  </span>
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-info is-large is-rounded"
                  onClick={() => {
                    if (this.props.onRetry) {
                      this.props.onRetry();
                    }
                  }}
                >
                  <span className="icon is-large">
                    <span className="fa-stack fa-lg">
                      <i className="fas fa-redo fa-stack-1x"></i>
                    </span>
                  </span>
                </button>
              </p>
              <p class="control">
                <button
                  class="button is-danger is-large is-rounded"
                  onClick={() => {
                    this.removeChatBot();
                    if (this.props.onCancel) {
                      this.props.onCancel();
                    }
                  }}
                >
                  <span className="icon is-large">
                    <span className="fa-stack fa-lg">
                      <i className="fas fa-times fa-stack-1x"></i>
                    </span>
                  </span>
                </button>
              </p>
            </div>
          </footer>
        </div>
      </CSSTransition>
    );
  }
}

function renderNavigation() {
  return (
    <nav
      className="navbar is-info"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <h1 className="title is-4 has-text-light has-text-weight-bold">
            Nutreat
          </h1>
        </a>
        <a
          role="button"
          className="navbar-burger burger"
          aria-label="menu"
          aria-expanded="false"
          data-target="navbarBasicExample"
          href="/"
          onClick={(e) => e.preventDefault()}
        >
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
          <span aria-hidden="true"></span>
        </a>
      </div>
    </nav>
  );
}

let SCORE_TO_NUMBER = new Map([
  ["A", 1],
  ["B", 2],
  ["C", 3],
  ["D", 4],
  ["E", 5],
]);

function scoreToNumber(score) {
  score = score.toUpperCase();
  if (SCORE_TO_NUMBER.has(score)) {
    return SCORE_TO_NUMBER.get(score);
  }

  return 3;
}

function numberToScore(number) {
  number = Math.round(number);
  var result = "";
  SCORE_TO_NUMBER.forEach((val, key) => {
    if (number === val) {
      result = key;
    }
  });
  if (result.length !== 0) {
    return result;
  }

  return "N/A";
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      healthScore: "",
      planetScore: "",
      priceScore: "",
      hasInfo: false,
      hasScore: false,
      hasCamera: false,
      code: "", //4001724004073
      products: [
        /*
        {
          product_name:
            "this is a very long name because the product has a long name",
          selected_images: {
            front: {
              display: {
                fr:
                  "https://static.openfoodfacts.org/images/products/311/674/003/2342/front_fr.12.400.jpg",
              },
            },
          },
        },
        */
      ],
    };
  }
  updatePicks(key, val) {
    if (
      this.state.healthScore !== "" &&
      this.state.planetScore !== "" &&
      this.state.priceScore !== ""
    ) {
      this.setState({ hasScore: true });
    }
  }

  renderItem(product) {
    return (
      <div className="has-background-light product is-rounded columns is-mobile">
        <div className="column is-2">
          <p className="img is-rounded">
            <img src={product.image_small_url} alt="" className="is-rounded" />
          </p>
        </div>
        <div className="column is-8 product-text">
          <p>
            <strong>{product.product_name}</strong>
          </p>
        </div>
        <div className="column is-2">
          <button
            className="delete"
            onClick={() => {
              this.setState({
                products: this.state.products.filter((p) => p != product),
              });
            }}
          ></button>
        </div>
      </div>
    );
  }

  openCamera() {
    this.setState({ hasCamera: true });

    ScanditSDK.configure(
      "Afv/sljHRzaIQ7ijGAezMPcsV0INIz2oE0F6AUNW54CLIzlK/gm3kdtWZtWSetO5SEsIah5LlIPFd1uiIkuXNNtf2daHNpVMJlrCxethbuvrQzAaYlSL1iB7Ctc5Ps09f1j/CpZ8cYfJQGRycUodUcUHBaBNFt118yoDb18gYVktueB26Wjm5aD2tyrtBjbqCcLwUew1WjJ84yW4WNBBto8UpitsY8iaviaoPFU1JTgky0bK81pmWOEuCgjMcFWX50ApMFZ8V1KLwo0m6pG8ztvODH4dVkFzp4TMsjr2uafimRdAmYSOHXxRRuKw9+QXaO9FrdqzklS1IOa46KC4QiX1FXpSHx9iK8dN7y6E+EssF1j4SKfOGW1O0suxCH/d0WBoO36J4QqgGba10D7iLOvU1Nb5T2ZbUNv51onTN60AnvBTbLN2YLGj3ls4SBqsf0c+/DNe20g8+o51RBNgQo6T+wKQPYcksMSzsjgYtqry36yUk/uQ/ph1D5rr7ybUrh3SPXQa1ZeH9sOWTdyiUq+zR5r4HFLW3ODuNPM8iswFsmRMc3p/NCdJ84rTX8v7KA0D70MYF3zjY0eQadV3kdVpTPKJlIPe3JBrWsAMCf6iwg9tsyGUjJhh50gmuuSSuMNQJUgR3GQjJrcHmfeBsD/obd+H/SimE147JeQ3XNKqJWgzco/I+qUyj0N4Vvwl1nyK4Tnk/UFZtZU/W1FxshQRX0AzAhde8LSSCtE1jOsBlhZDD3ZM9W4KbFNaKOJFULuFzAluyhkP35wZ/Z/7Azzrrg8nL6Y51VqyLGMm5chH7bBTMl6pzKZrLEGdjFfTj4CxCIfsvGv4yRR6IN4=",
      {
        engineLocation: "https://cdn.jsdelivr.net/npm/scandit-sdk@5.x/build/",
      }
    )
      .then(() => {
        return ScanditSDK.BarcodePicker.create(
          document.getElementById("camera_view"),
          {
            playSoundOnScan: true,
            vibrateOnScan: true,
            guiStyle: ScanditSDK.BarcodePicker.GuiStyle.NONE,
            // enable some common symbologies
            scanSettings: new ScanditSDK.ScanSettings({
              enabledSymbologies: ["ean8", "ean13", "upca", "upce"],
            }),
            singleImageModeSettings: {
              desktop: {
                usageStrategy:
                  ScanditSDK.SingleImageModeSettings.UsageStrategy.FALLBACK,
                informationElement: document.createElement("div"),
                // buttonElement: "<SVGElement>",
                containerStyle: { backgroundColor: "#FFFFFF" },
                informationStyle: { color: "#333333" },
                buttonStyle: {
                  borderColor: "#333333",
                  color: "#333333",
                  fill: "#333333",
                },
              },
              mobile: {
                usageStrategy:
                  ScanditSDK.SingleImageModeSettings.UsageStrategy.FALLBACK,
                informationElement: document.createElement("div"),
                // buttonElement: "<SVGElement>",
                containerStyle: { backgroundColor: "#FFFFFF" },
                informationStyle: { color: "#333333" },
                buttonStyle: {
                  borderColor: "#333333",
                  color: "#333333",
                  fill: "#333333",
                },
              },
            },
          }
        );
      })
      .then((barcodePicker) => {
        // barcodePicker is ready here, show a message every time a barcode is scanned
        barcodePicker.on("scan", (scanResult) => {
          //alert(scanResult.barcodes[0].data);
          barcodePicker.destroy();
          this.setState({ hasInfo: true, code: scanResult.barcodes[0].data });
          // initScanner();
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  renderCamera() {
    return (
      <CSSTransition in={true} timeout={200} classNames="fade" appear={true}>
        <div className="site container">
          <div className="content">
            {renderNavigation()}
            <section className="section" id="camera_view"></section>
          </div>
          <footer class="columns is-centered footer">
            <div class="column has-text-centered is-2">
              <a
                className="button is-info is-large is-rounded"
                href="/scan"
                onClick={(e) => {
                  e.preventDefault();
                  this.openCamera();
                }}
              >
                <span class="icon is-large">
                  <span class="fa-stack fa-lg">
                    <i class="fas fa-camera fa-stack-1x"></i>
                  </span>
                </span>
              </a>
            </div>
          </footer>
        </div>
      </CSSTransition>
    );
  }

  renderAggregateData() {
    let aggregateNutri = 0;
    let aggregatePrice = 0;
    let aggregatePlanet = 0;
    this.state.products.forEach((product) => {
      aggregateNutri += scoreToNumber(product.score_people);
      aggregatePlanet += scoreToNumber(product.score_planet);
      aggregatePrice += scoreToNumber(product.score_price) * 2;
    });
    aggregateNutri /= this.state.products.length;
    aggregatePlanet /= this.state.products.length;
    let aggregateNutriText = numberToScore(aggregateNutri.toFixed(0));
    let aggregatePlanetText = numberToScore(aggregatePlanet.toFixed(0));

    return (
      <div className="small-section">
        <nav className="level is-mobile">
          <div classname="level-item has-text-centered">
            <div>
              <p className="heading">Total</p>
              <p className="title is-4">{aggregatePrice} EUR</p>
            </div>
          </div>
          <div classname="level-item has-text-centered">
            <div>
              <p className="heading">Nutri</p>
              <p className="title is-4">{aggregateNutriText}</p>
            </div>
          </div>
          <div classname="level-item has-text-centered">
            <div>
              <p className="heading">Planet</p>
              <p className="title is-4">{aggregatePlanetText}</p>
            </div>
          </div>
        </nav>
        <hr />
      </div>
    );
  }

  renderShoppingList() {
    let items = [];

    this.state.products.forEach((product) => {
      items.push(this.renderItem(product));
    });

    if (this.state.products.length === 0) {
      items.push(
        <div className="content hero">
          <div className="hero-body">
            <h1 className="title has-text-grey-darker">
              Scan a product to get started.
            </h1>
          </div>
        </div>
      );
    }

    return (
      <CSSTransition in={true} timeout={200} classNames="fade" appear={true}>
        <div className="site container">
          <div className="content">
            {renderNavigation()}
            {this.renderAggregateData()}
            <section className="small-section">{items}</section>
          </div>
          <footer className="columns is-centered fixed-footer">
            <div className="column has-text-centered is-2">
              <a
                className="button is-info is-large is-rounded"
                href="/scan"
                onClick={(e) => {
                  e.preventDefault();
                  this.openCamera();
                }}
              >
                <span className="icon is-large">
                  <span className="fa-stack fa-lg">
                    <i className="fas fa-camera fa-stack-1x"></i>
                  </span>
                </span>
              </a>
            </div>
          </footer>
        </div>
      </CSSTransition>
    );
  }

  render() {
    if (this.state.hasScore) {
      if (this.state.hasInfo) {
        return (
          <ProposalView
            people={this.state.healthScore}
            planet={this.state.planetScore}
            price={this.state.priceScore}
            code={this.state.code}
            onRetry={() => {
              this.setState({ code: "", hasInfo: false });
              this.openCamera();
            }}
            onSuccess={(product) =>
              this.setState({
                hasInfo: false,
                hasCamera: false /* TODO:Add product */,
                products: [...this.state.products, product],
              })
            }
            onCancel={() => this.setState({ hasInfo: false, hasCamera: false })}
          />
        );
      } else {
        if (this.state.hasCamera) {
          return this.renderCamera();
        }
        return this.renderShoppingList();
      }
    }
    return (
      <div className="container">
        {renderNavigation()}
        <section className="">
          <p className="is-6 has-text-gray-light" id="small-header">
            Get started by defining your shopping preferences
          </p>
        </section>
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
