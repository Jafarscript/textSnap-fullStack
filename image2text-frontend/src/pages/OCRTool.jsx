import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { BsUpload } from "react-icons/bs";

const OCRTool = () => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState("");
  const [progress, setProgress] = useState(0);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type.startsWith("image/")) {
      setFile(droppedFile);
      setError("");
    } else {
      setError("Please drop a valid image file.");
    }
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setText("");
    setProgress(0);
    setError("");
  };

  const handleOCR = async () => {
    if (!file) return setError("Please select or drop an image file.");

    const formData = new FormData();
    formData.append("image", file);
    formData.append("language", language);

    try {
      setLoading(true);
      setProgress(0);
      setError("");

      const res = await axios.post("http://localhost:8000/api/ocr/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => {
          setProgress(Math.round((e.loaded * 100) / e.total));
        },
      });

      setText(res.data.text);
    } catch (err) {
      setError(err.response?.data?.error || "OCR failed. Try again.");
      setText("");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (format) => {
    if (!text) return alert("No text to download.");

    const endpoint = format === "pdf" ? "pdf" : "word";

    const response = await axios.post(
      `http://localhost:8000/api/${endpoint}/`,
      { text, language },
      { responseType: "blob" }
    );

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `TextSnap_output.${format}`);
    document.body.appendChild(link);
    link.click();
  };

  const handleCopyText = () => {
    if (text) {
      navigator.clipboard.writeText(text);
      toast.success("Text copied to clipboard!");
    } else {
      toast.error("Nothing to copy!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-blue-700 mb-4">
          📸 OCR Image Tool
        </h2>

        {/* Drag & Drop or File Picker */}
        <div
          onDrop={handleFileDrop}
          onDragOver={handleDragOver}
          className="w-full h-40 border-2 border-dashed border-blue-400 rounded flex items-center justify-center text-gray-600 mb-4 cursor-pointer"
        >
          {file ? (
            <p>{file.name}</p>
          ) : (
            <label className="flex items-center justify-center flex-col w-full cursor-pointer">
              <BsUpload className="text-4xl mb-2 text-blue-400" />
              <p className="font-bold text-black">Drag & Drop Image Here</p>
              <p>or click to select a file</p>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          )}
        </div>

        {/* Language Select */}
        <div className="mb-5">
          <label className="block font-medium text-gray-700 mb-2">🌐 Select Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="en">English</option>
            <option value="fr">French</option>
            <option value="ar">Arabic</option>
            <option value="de">German</option>
          </select>
        </div>

        {/* Error Message */}
        {error && <div className="text-red-600 font-medium mb-2">{error}</div>}

        {/* Start OCR Button */}
        <button
          onClick={handleOCR}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
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
        {text && (
          <>
            <div className="relative mt-6">
              <button
                onClick={handleCopyText}
                className="absolute top-2 right-2 bg-gray-800 text-white px-3 py-1 text-sm rounded hover:bg-gray-700"
              >
                Copy
              </button>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={10}
                className="w-full border p-3 rounded resize-y"
                placeholder="Extracted text will appear here..."
              ></textarea>
            </div>

            {/* Download Buttons */}
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => handleDownload("pdf")}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Download PDF
              </button>
              <button
                onClick={() => handleDownload("docx")}
                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
              >
                Download Word
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OCRTool;
