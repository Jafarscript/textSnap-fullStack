import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center text-center px-6">
      <h1 className="text-5xl font-bold mb-4 text-blue-700">Welcome to TextSnap</h1>
      <p className="text-lg mb-6 text-gray-700 max-w-xl">
        Extract text from images with ease. Convert them to PDFs or Word documents in just a few clicks.
      </p>
      <Link
        to="/ocr"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
      >
        Try the Tool
      </Link>
    </div>
  );
};

export default Landing;
