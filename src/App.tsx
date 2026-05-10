import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "@/pages/Home";
import LevelSelect from "@/pages/LevelSelect";
import Battle from "@/pages/Battle";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/select/:mode" element={<LevelSelect />} />
        <Route path="/battle/:mode/:level" element={<Battle />} />
      </Routes>
    </Router>
  );
}
