import "./App.css";

import { Routes, Route, Link } from "react-router-dom";
import { StorePage } from "./render/pages/WarehousePage/StorePage";
import { HomePage } from "./render/pages/HomePage/HomePage";
import { ForkliftersPage } from "./render/pages/ForksliftersPage/ForkliftersPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<StorePage />} />
        <Route path="/forkslist" element={<ForkliftersPage />} />
      </Routes>
    </>
  );
}

export default App;
