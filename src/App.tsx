import PatientHistory from "./pages/PatientHistory";
import React, { Fragment } from "react";

import { Route, Routes } from "react-router-dom";

const App: React.FC = () => {
  return (
    <Fragment>
      <Routes>
        <Route path="/*" element={<PatientHistory />} />
      </Routes>
    </Fragment>
  );
};

export default App;
