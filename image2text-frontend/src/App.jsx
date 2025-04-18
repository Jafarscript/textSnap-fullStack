import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OCRTool from "./pages/OCRTool";
import Navbar from "./components/Navbar";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ocr" element={<OCRTool />} />
      </Routes>
    </Router>
  );
}

export default App;
