import React, { createContext , useState } from "react";
import PropTypes from "prop-types";

const Context = createContext();

const ContextProvider = ({ children }) => {
    const [state, setState] = useState(0)
    const changeData = (data) => {
        setState(data)
    }
  return (
    <Context.Provider value={{ state , changeData}}>
      {children}
    </Context.Provider>
  );
};

ContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { Context, ContextProvider };