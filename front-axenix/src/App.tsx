import "./App.css";

import { Routes, Route, Link } from "react-router-dom";
import { HomePage } from "./render/pages/HomePage/HomePage";
import { ForkliftersPage } from "./render/pages/ForksliftersPage/ForkliftersPage";
import { WarehousePage } from "./render/pages/WarehousePage/Warehouse";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/test" element={<WarehousePage />} />
        <Route path="/forkslist" element={<ForkliftersPage />} />
      </Routes>
    </>
  );
}

export default App;
