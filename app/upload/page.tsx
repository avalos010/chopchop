"use client";
import { useState } from "react";
import axios from "axios";
import chopVideo from "./chopVideo";

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post("/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const data = res.data;
      setUploading(false);

      if (res.status === 200) {
        chopVideo(data.url);
        setUploadedUrl(data.url);
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert("Upload failed");
    }
  };
  return (
    <div className="p-4">
      <input
        type="file"
        accept="video/mp4"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={!file || uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>

      {uploadedUrl && (
        <div>
          <p>Uploaded Video:</p>
          <video controls src={uploadedUrl} className="w-full max-w-lg"></video>
        </div>
      )}
    </div>
  );
}
