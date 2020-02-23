import React from "react";
import "./ListedTerm.css";

class ListedTerm extends React.Component {
  selectTerm = () => {
    this.props.selectTerm(this.props.termData.id);
  };

  removeTerm = () => {
    this.props.delTerm(this.props.index);
  };

  render() {
    return (
      <div
        className={`listed-term-container ${
          this.props.selected ? "selected" : ""
        }`}
      >
        <div className="listed-term-heading">
          <div className="term-and-arrow" onClick={this.selectTerm}>
            <i className="select-arrow ion-ios-arrow-thin-left"></i>
            <h1>{this.props.termData.term}</h1>
          </div>

          <button onClick={this.removeTerm} className="btn del-term-btn">
            <i className="ion-android-close"></i>
          </button>
        </div>

        <div
          className={`listed-term-content ${
            this.props.selected ? "visible-element " : ""
          }`}
        >
          {this.props.termData.def.map((defCont, index) => {
            return (
              <div className={`def-container`} key={defCont.meta.uuid}>
                <h2>{defCont.fl}</h2>
                {defCont.shortdef.map((def, index) => {
                  return (
                    <p className="indiv-def" key={index + 1}>
                      {index + 1}. {def}
                    </p>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default ListedTerm;
