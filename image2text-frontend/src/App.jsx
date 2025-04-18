import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import OCRTool from "./pages/OCRTool";
import Navbar from "./components/Navbar";
import { Analytics } from '@vercel/analytics/react';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/ocr" element={<OCRTool />} />
      </Routes>
      <Analytics />
    </Router>
  );
}

export default App;
