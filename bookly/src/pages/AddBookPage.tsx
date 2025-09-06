import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { storage } from "../appwrite";
import { ID } from "appwrite";

const AddBookPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Romance");
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  const categories = ["Romance", "Horror", "Translation", "Short stories", "Adventure"];

  const handlePdfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setPdfFile(e.target.files[0]);
    setSuccess(false);
    setError("");
  };

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCoverImage(e.target.files[0]);
    setSuccess(false);
    setError("");
  };

  const uploadToAppwrite = async (file: File) => {
    const bucketId = "6881e24a002f618dcf22";
    try {
      const response = await storage.createFile(bucketId, ID.unique(), file);
      return `https://syd.cloud.appwrite.io/v1/storage/buckets/${bucketId}/files/${response.$id}/view?project=6881e1e60004b624f86d`;
    } catch (err) {
      console.error("Appwrite upload error:", err);
      throw new Error("Failed to upload file to Appwrite");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!pdfFile) {
      setError("Please upload a PDF file.");
      return;
    }
    if (!user) {
      setError("You must be logged in to add a book.");
      return;
    }

    setUploading(true);
    try {
      const pdfUrl = await uploadToAppwrite(pdfFile);
      let coverUrl = "";
      if (coverImage) coverUrl = await uploadToAppwrite(coverImage);

      await addDoc(collection(db, "books"), {
        title,
        author,
        description,
        category,
        pdfUrl,
        coverUrl,
        publisherUid: user.uid,
        publisherEmail: user.email,
        createdAt: Timestamp.now(),
        rating: 0,
        ratings: [],
      });

      setTitle("");
      setAuthor("");
      setDescription("");
      setCategory("Romance");
      setPdfFile(null);
      setCoverImage(null);
      setSuccess(true);
    } catch (err) {
      console.error("Error adding book:", err);
      setError("Failed to add book. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        onClick={() => navigate("/")}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(6px)",
          zIndex: 2100, // higher than sidebar(1500) and navbar(1400)
        }}
      />

      {/* Modal Content */}
      <div
        className="rounded-4 p-4 shadow-lg"
        style={{
          width: "480px",
          maxWidth: "95%",
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.3)",
          backdropFilter: "blur(18px)",
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2200, // above backdrop
          color: "#fff",
          fontFamily: "'Inter', sans-serif",
        }}
      >
        <button
          type="button"
          className="btn-close btn-close-white position-absolute top-0 end-0 m-3"
          onClick={() => navigate("/")}
          aria-label="Close"
        ></button>

        <h3 className="mb-4 text-center fw-bold">Add a New Book</h3>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">Book added successfully!</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="small">Book Name</label>
            <input
              type="text"
              className="form-control bg-transparent text-white border-light"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setSuccess(false);
                setError("");
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="small">Author</label>
            <input
              type="text"
              className="form-control bg-transparent text-white border-light"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                setSuccess(false);
                setError("");
              }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="small">Category</label>
            <select
              className="form-select bg-transparent text-white border-light"
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSuccess(false);
                setError("");
              }}
              required
            >
              {categories.map((cat, idx) => (
                <option key={idx} value={cat} className="bg-dark text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="small">Short Description</label>
            <textarea
              className="form-control bg-transparent text-white border-light"
              rows={3}
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                setSuccess(false);
                setError("");
              }}
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="small">Upload Book PDF</label>
            <input
              type="file"
              accept="application/pdf"
              className="form-control bg-transparent text-white border-light"
              onChange={handlePdfChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="small">Upload Cover Image (optional)</label>
            <input
              type="file"
              accept="image/*"
              className="form-control bg-transparent text-white border-light"
              onChange={handleCoverChange}
            />
          </div>

          <button
            type="submit"
            className="btn w-100 fw-semibold"
            style={{
              background: "rgba(79,89,250,0.85)",
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.3)",
            }}
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Add Book"}
          </button>
        </form>
      </div>
    </>
  );
};

export default AddBookPage;
