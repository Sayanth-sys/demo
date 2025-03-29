import { useState } from "react";
import "../App.css"; // Ensure correct path
import defaultImage from "./image/image1.jpeg"; // Import default image

function UploadForm() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [result, setResult] = useState(""); // State to hold result

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file); // Create preview URL
      setSelectedImage(imageUrl); // Set image preview
      setResult(""); // Reset result when a new image is uploaded
    }
  };
  

  const handleSubmit = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", document.getElementById("file-upload").files[0]);
  
    try {
      const response = await fetch("http://127.0.0.1:5000/process", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      
      if (data.error) {
        setResult("Error: " + data.error);
      } else {
        setResult(data.result === "Spoiled" ? "❌ Milk is Spoiled" : "✅ Milk is Fresh");
      }
    } catch (error) {
      console.error("Error processing image:", error);
      setResult("Error processing image");
    }
  };
  

  return (
    <div className="container">
      <h1 className="title">SPOILED MILK?</h1>
      <div className="hero">
        <div className="card">
          {/* Default image is shown initially, replaced when an image is selected */}
          <img src={selectedImage || defaultImage} alt="Profile" id="profile" />

          {/* File Input for Image Selection */}
          <input id="file-upload" type="file" accept="image/jpeg,image/png,image/jpg" onChange={handleImageUpload} hidden />

          {/* Single Button - Acts as "Choose Image" initially, then changes to "Submit" */}
          <button className="upload-btn" onClick={selectedImage ? handleSubmit : () => document.getElementById('file-upload').click()}>
            {selectedImage ? "Submit" : "Choose Image"}
          </button>

          {/* Display Result Below */}
          {result && <h2 className={result.includes("Spoiled") ? "spoiled-text" : "fresh-text"}>{result}</h2>}
        </div>
      </div>
    </div>
  );
}

export default UploadForm;
