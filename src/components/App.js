import React from "react";
import { toast, ToastContainer } from "react-toastify";
import ListedTerm from "./ListedTerm";
import SelectedTerm from "./SelectedTerm";
import Modal from "./Modal";
import Footer from "./Footer";
import merriam, { baseParams } from "../services/merriam";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

class App extends React.Component {
  state = {
    minView: false,
    termArr: [],
    htmlTermList: [],
    term: "",
    toastId: null,
    selectedTerm: {},
    selectedTermId: null,
    searchDisable: false,
    options: {
      dispClear: false
    }
  };

  componentDidMount() {
    this.getTermFromStorage();
    setTimeout(() => {
      if (this.state.termArr.length > 0) {
        this.setState({ minView: true });
      }
    }, 700);
  }

  componentDidUpdate = (prevProps, prevState) => {
    if (prevState.termArr !== this.state.termArr) {
      this.mapTermArr();
    }
    if (prevState.selectedTermId !== this.state.selectedTermId) {
      this.mapTermArr();
    }
  };

  getTermFromStorage = () => {
    const termArr = JSON.parse(localStorage.getItem("termArr"));
    if (termArr !== null && termArr.length !== 0) {
      this.setState({ termArr }, () =>
        this.setState(
          {
            selectedTermId: this.state.termArr[0].id,
            selectedTerm: this.state.termArr[0]
          },
          this.mapTermArr
        )
      );
    }
  };

  onChangeQuery = e => {
    this.setState({ term: e.target.value });
  };

  submitQuery = async e => {
    if (e !== undefined) {
      e.preventDefault();
    }

    this.setState({ searchDisable: true });

    const term = this.state.term;

    if (term === "") {
      this.setState({ searchDisable: false });
      return;
    }

    await this.getTerm(term)
      .then(r => this.checkTermResponse(r.data))
      .catch(error => {
        if (error.isAxiosError) {
          console.log("there is an error");
        }
        this.setState({ searchDisable: false });
      });
  };

  getTerm = term => {
    return merriam.get(
      `/references/collegiate/json/${term}?key=${baseParams.key}`
    );
  };

  checkTermResponse = respTermArr => {
    if (respTermArr.length !== 0) {
      if (typeof respTermArr[0] === "string") {
        this.noTermWithAlt(respTermArr);
      } else {
        this.termFound(respTermArr);
      }
    } else {
      this.noTermFound();
    }
  };

  noTermWithAlt = respTermArr => {
    const altTerm = [];
    const maxNumAltTerm = 4;

    for (let i = 0; i < maxNumAltTerm; i++) {
      if (respTermArr[i] === undefined) {
        break;
      }
      altTerm[i] = respTermArr[i];
    }

    const altTermHtml = this.mapAltTerm(altTerm);

    let errMsg = (
      <div>
        Word not found. Did you mean:
        <div>{altTermHtml}</div>
        <div className="err-close-btn-cont">
          <button
            className="err-close-btn"
            onClick={() => {
              toast.dismiss(this.state.toastId);
              this.setState({ toastId: null });
            }}
          >
            Exit
          </button>
        </div>
      </div>
    );

    let toastId = this.createToaster(errMsg, "alt-term-err");

    this.setState({ searchDisable: false, toastId });
  };

  mapAltTerm = altTerm => {
    return altTerm.map((singleTerm, index) => {
      if (index !== altTerm.length - 1) {
        return (
          <span key={index + new Date().getTime()}>
            {" "}
            "
            <button
              className="alt-term"
              value={singleTerm}
              onClick={this.onClickAltTerm}
            >
              {singleTerm}
            </button>
            ",
          </span>
        );
      } else {
        return (
          <span key={index + new Date().getTime()}>
            {" or "}"
            <button
              className="alt-term"
              value={singleTerm}
              onClick={this.onClickAltTerm}
            >
              {singleTerm}
            </button>
            "?
          </span>
        );
      }
    });
  };

  onClickAltTerm = e => {
    this.setState({ term: e.target.value }, this.submitQuery);
  };

  termFound = respTermArr => {
    const maxNumTerm = 3;
    const term = this.state.term.toLowerCase();
    const newTerm = [];
    const id = new Date().getTime();
    const termArr = this.state.termArr.slice();
    let oldStoredArr = JSON.parse(localStorage.getItem("termArr"));
    if (!oldStoredArr) {
      oldStoredArr = [];
    }

    for (let i = 0; i < maxNumTerm; i++) {
      if (respTermArr[i] === undefined) {
        break;
      }
      newTerm[i] = respTermArr[i];
    }

    termArr.unshift({
      term,
      id,
      def: newTerm
    });
    oldStoredArr.unshift({
      term,
      id,
      def: newTerm
    });

    localStorage.setItem("termArr", JSON.stringify(termArr));

    this.setState(
      {
        searchDisable: false,
        termArr,
        term: "",
        selectedTermId: id,
        selectedTerm: termArr[0]
      },
      () => {
        if (this.state.minView === false) {
          this.setState({ minView: true });
        }
      }
    );
  };

  noTermFound = () => {
    const errMsg = (
      <div>
        No terms or similar terms found. Please enter a new term.
        <div className="err-close-btn-cont">
          <button
            className="err-close-btn"
            onClick={() => {
              toast.dismiss(this.state.toastId);
              this.setState({ toastId: null });
            }}
          >
            Exit
          </button>
        </div>
      </div>
    );

    let toastId = this.createToaster(errMsg, "no-term-err");

    this.setState({ searchDisable: false, toastId });
  };

  createToaster = (msg, toasterType) => {
    if (this.state.toastId !== null) {
      toast.dismiss(this.state.toastId);
    }

    let toastId;
    setTimeout(() => {
      this.toastId = toast(msg, {
        className: toasterType,
        bodyClassName: "err-body",
        toastId: 1
      });
    }, 250);

    return toastId;
  };

  mapTermArr = () => {
    const htmlTermList = this.state.termArr.map((word, index) => {
      let val = false;
      if (word.id === this.state.selectedTermId) {
        val = true;
      }
      return (
        <ListedTerm
          selected={val}
          termData={word}
          key={word.id}
          index={index}
          selectTerm={this.selectTerm}
          delTerm={this.delTerm}
        />
      );
    });

    this.setState({ htmlTermList });
  };

  selectTerm = id => {
    if (this.state.selectedTermId !== id) {
      let selectedTerm;
      for (let i = 0; i < this.state.termArr.length; i++) {
        if (this.state.termArr[i].id === id) {
          selectedTerm = this.state.termArr[i];
        }
      }

      this.setState({ selectedTermId: id, selectedTerm }, this.mapTermArr);
    } else if (this.state.selectedTermId === id) {
      this.setState({ selectedTermId: null, selectedTerm: {} });
    }
  };

  delTerm = index => {
    const termArr = this.state.termArr.slice();
    const oldTermArr = termArr.slice();
    termArr.splice(index, 1);

    localStorage.setItem("termArr", JSON.stringify(termArr));

    this.setState({ termArr }, () => {
      if (this.state.selectedTermId === oldTermArr[index].id) {
        if (
          oldTermArr[index + 1] === undefined &&
          oldTermArr[index - 1] === undefined
        ) {
          this.setState(
            {
              selectedTerm: {},
              selectedTermId: null
            },
            this.mapTermArr
          );
        } else if (oldTermArr[index + 1] === undefined) {
          this.setState(
            {
              selectedTerm: termArr[index - 1],
              selectedTermId: termArr[index - 1].id
            },
            this.mapTermArr
          );
        } else {
          this.setState(
            {
              selectedTerm: termArr[index],
              selectedTermId: termArr[index].id
            },
            this.mapTermArr
          );
        }
      }
    });
  };

  delAllTerms = () => {
    const termArr = null;
    const options = { ...this.state.options, dispClear: false };

    localStorage.setItem("termArr", termArr);
    this.setState({
      termArr: [],
      htmlTermArr: [],
      options,
      selectedTerm: {},
      selectedTermId: null
    });
  };

  render() {
    return (
      <div className="wrapper">
        <ToastContainer
          autoClose={false}
          closeOnClick={false}
          draggable={false}
        />
        <Modal title="Clear Terms?" display={this.state.options.dispClear}>
          <p>
            Are you sure you want to delete your searched terms? They cannot be
            recovered.
          </p>
          <div className="clear-terms-btn-group">
            <button
              className="btn cancel-btn"
              onClick={() =>
                this.setState({
                  options: {
                    ...this.state.options,
                    dispClear: false
                  }
                })
              }
            >
              Cancel
            </button>
            <button className="btn del-btn" onClick={this.delAllTerms}>
              Delete
            </button>
          </div>
        </Modal>

        <div className="page-content">
          <section
            className={`section-title animated fadeIn ${
              this.state.minView ? "min-view" : ""
            }`}
          >
            <a
              href="#"
              onClick={() => this.setState({ minView: !this.state.minView })}
            >
              <h1>
                M<span className="rest-of-title">itsis</span>
              </h1>
            </a>
            <h4>
              A companion to assist you when you go down the rabbit hole of
              searching terms.
            </h4>
          </section>
          <section
            className={`section-searchbar animated fadeIn ${
              this.state.minView ? "min-view" : ""
            }`}
          >
            <form onSubmit={this.submitQuery}>
              <input
                value={this.state.term}
                onChange={this.onChangeQuery}
                type="text"
                disabled={this.state.searchDisable}
                placeholder="Enter search term here!"
              ></input>
              <button>
                <i className="ion-ios-search"></i>
              </button>
            </form>
          </section>
          <div
            className={`top-border ${this.state.minView ? "min-view" : ""}`}
          ></div>
          <section
            className={`section-term-def ${
              this.state.minView ? "min-view animated fadeIn" : ""
            }`}
          >
            <SelectedTerm termData={this.state.selectedTerm} />
          </section>
          <section
            className={`section-options ${
              this.state.minView ? "min-view" : ""
            }`}
          >
            <ul>
              <li>
                <a
                  className="btn options-btn"
                  onClick={() =>
                    this.setState({
                      options: {
                        ...this.state.options,
                        dispClear: !this.state.options.dispClear
                      }
                    })
                  }
                >
                  Clear Terms
                </a>
              </li>
            </ul>
          </section>
          <section
            className={`section-term-list ${
              this.state.minView ? "min-view" : ""
            }`}
          >
            {this.state.htmlTermList}
          </section>
        </div>
        <Footer />
      </div>
    );
  }
}

export default App;
