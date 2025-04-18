import React, { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText("");
    setProgress(0);
  };

  const handleOCR = async () => {
    if (!file) return alert("Please select an image file first.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", language);

    try {
      setLoading(true);
      setProgress(0);

      const response = await axios.post(
        "http://localhost:8000/api/ocr/",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (e) => {
            setProgress(Math.round((e.loaded * 100) / e.total));
          },
        }
      );

      setText(response.data.text);
    } catch (err) {
      console.error("OCR error:", err);
      alert("Failed to process image.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!text) return alert("No text to download.");

    const response = await axios.post(
      "http://localhost:8000/api/pdf/",
      { text, language },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "extracted_text.pdf");
    document.body.appendChild(link);
    link.click();
  };

  const handleDownloadWord = async () => {
    const response = await axios.post(
      "http://localhost:8000/api/word/",
      { text },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "extracted_text.docx");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100 text-gray-900">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4">🧠 OCR Image to PDF</h1>

        <input type="file" onChange={handleFileChange} className="mb-4" />

        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="mb-4 border p-2 rounded"
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="ar">Arabic</option>
          <option value="de">German</option>
        </select>

        <button
          onClick={handleOCR}
          disabled={loading}
          className="bg-blue-600 ml-2 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Processing..." : "Start OCR"}
        </button>

        {/* Progress Bar */}
        {loading && (
          <div className="w-full bg-gray-300 rounded-full h-4 mt-4 overflow-hidden">
            <div
              className="bg-green-600 h-full transition-all duration-500 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        )}

        {/* Extracted Text */}
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          className="w-full mt-4 border p-2 rounded"
          placeholder="Extracted text will appear here..."
        ></textarea>

        <div>
          <button
            onClick={handleDownloadPDF}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Download PDF
          </button>
          <button
            onClick={handleDownloadWord}
            className="mt-2 ml-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Download Word
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
