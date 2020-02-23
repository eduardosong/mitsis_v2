import React from "react";
import "./SelectedTerm.css";

class SelectedTerm extends React.Component {
  state = {
    def: null
  };

  componentDidUpdate = (prevProps, prevState) => {
    if (prevProps.termData !== this.props.termData) {
      if (Object.keys(this.props.termData).length !== 0) {
        let def = this.props.termData.def.map((defCont, index) => {
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
        });
        this.setState({ def });
      } else {
        this.setState({ def: null });
      }
    }
  };

  render() {
    return (
      <div className="selected-term-container">
        <h1>{this.props.termData.term}</h1>
        {this.state.def}
      </div>
    );
  }
}

export default SelectedTerm;
