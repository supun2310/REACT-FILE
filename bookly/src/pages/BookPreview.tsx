// src/pages/BookPreview.tsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../contexts/AuthContext";

interface Comment {
  id: string;
  text: string;
  user: string;
  createdAt: Timestamp;
}
interface Rating {
  user: string;
  score: number;
}
interface Book {
  id: string;
  title: string;
  author: string;
  publisherEmail: string;
  pdfUrl?: string;
  coverUrl?: string;
  category?: string;
  ratings?: Rating[];
  averageRating?: number;
}

const BookPreview: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [book, setBook] = useState<Book | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState<number | "">("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showPdfModal, setShowPdfModal] = useState(false);

  // Load book data
  useEffect(() => {
    if (!id) return;
    const bookRef = doc(db, "books", id);
    const unsubscribe = onSnapshot(
      bookRef,
      (docSnap) => {
        if (!docSnap.exists()) {
          setErrorMsg("Book not found.");
          setLoading(false);
          return;
        }
        const data = docSnap.data();
        const ratingsArray = (data.ratings || []) as Rating[];
        const average =
          ratingsArray.length > 0
            ? ratingsArray.reduce((sum, r) => sum + r.score, 0) / ratingsArray.length
            : 0;

        setBook({ id: docSnap.id, ...data, averageRating: average } as Book);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching book:", error);
        setErrorMsg("Failed to load book data.");
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [id]);

  // Load comments
  useEffect(() => {
    if (!id) return;
    const commentsQuery = query(
      collection(db, "books", id, "comments"),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(commentsQuery, (snapshot) => {
      const fetched = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Comment, "id">),
      }));
      setComments(fetched);
    });
    return () => unsubscribe();
  }, [id]);

  // Submit comment
  const handleCommentSubmit = async () => {
    if (!newComment.trim() || !user || !id) return;
    try {
      await addDoc(collection(db, "books", id, "comments"), {
        text: newComment.trim(),
        user: user.email || "Anonymous",
        createdAt: Timestamp.now(),
      });
      setNewComment("");
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // Submit rating
  const handleRating = async () => {
    if (!newRating || !user || !id) return;
    const bookRef = doc(db, "books", id);
    try {
      if (book?.ratings) {
        const prevRating = book.ratings.find((r) => r.user === user.email);
        if (prevRating) {
          await updateDoc(bookRef, { ratings: arrayRemove(prevRating) });
        }
      }
      await updateDoc(bookRef, {
        ratings: [...(book?.ratings || []), { user: user.email!, score: newRating }],
      });
      setNewRating("");
    } catch (err) {
      console.error("Error submitting rating:", err);
    }
  };

  if (loading) return <div className="text-center mt-5 text-white">Loading book...</div>;
  if (errorMsg) return <div className="text-center mt-5 text-danger">{errorMsg}</div>;
  if (!book) return <div className="text-center mt-5 text-white">Book not found.</div>;

  return (
    <div className="container my-5 py-5" style={{ fontFamily: "'Inter', sans-serif", color: "#000" }}>
      <div className="row mb-4">
        <div className="col-md-4 mb-3">
          <img
            src={book.coverUrl || "https://via.placeholder.com/300x400?text=No+Cover"}
            alt={book.title}
            className="img-fluid rounded shadow"
            style={{ maxHeight: "400px", objectFit: "cover" }}
          />
        </div>
        <div className="col-md-8">
          <h2 className="fw-bold mb-2" style={{ fontSize: "2.3rem", color: "#000" }}>
            {book.title}
          </h2>
          <p style={{ color: "#111", fontSize: "1.2rem", fontWeight: "bold" }}>✍️ {book.author}</p>
          <p style={{ color: "#222", fontSize: "1.1rem", fontWeight: "bold" }}>👤 {book.publisherEmail}</p>
          {book.averageRating !== undefined && (
            <p className="fw-bold" style={{ color: "#FFD700", fontSize: "1.2rem" }}>
              ⭐ Average Rating: {book.averageRating.toFixed(1)}
            </p>
          )}
          <div className="d-flex gap-3 mt-4">
            {book.pdfUrl && (
              <>
                <button
                  className="btn"
                  onClick={() => setShowPdfModal(true)}
                  style={{
                    background: "rgba(0, 123, 255, 0.9)",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 0.9)")}
                >
                  📖 Read Online
                </button>
                <a
                  href={book.pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn"
                  download
                  style={{
                    background: "rgba(0, 123, 255, 0.9)",
                    color: "#fff",
                    fontWeight: "bold",
                    padding: "10px 20px",
                    borderRadius: "8px",
                    border: "none",
                    textDecoration: "none",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 1)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0, 123, 255, 0.9)")}
                >
                  ⬇️ Download
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Rating Section */}
      <div className="mb-5">
        <h4 className="fw-bold">Rate this Book</h4>
        <div className="d-flex align-items-center gap-2">
          <select
            className="form-select bg-dark text-white border-light w-auto"
            value={newRating}
            onChange={(e) => setNewRating(e.target.value === "" ? "" : Number(e.target.value))}
          >
            <option value="">Select Rating</option>
            {[1, 2, 3, 4, 5].map((r) => (
              <option key={r} value={r} className="bg-dark text-white">
                {r} Star{r > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button className="btn btn-success" onClick={handleRating} disabled={!newRating}>
            Submit
          </button>
        </div>
      </div>

      {/* Comments Section */}
      <div>
        <h4 className="fw-bold">Comments</h4>
        <textarea
          className="form-control bg-dark text-white border-light"
          placeholder="Leave a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          rows={3}
        />
        <button
          className="btn btn-primary mt-2"
          onClick={handleCommentSubmit}
          disabled={!newComment.trim()}
        >
          Submit Comment
        </button>
        <div className="list-group mt-3">
          {comments.map((c) => (
            <div key={c.id} className="list-group-item bg-transparent text-white border-light">
              <strong>{c.user}</strong>
              <p className="mb-1">{c.text}</p>
              <small className="text-muted">{c.createdAt?.toDate().toLocaleString()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* PDF Modal */}
      {showPdfModal && (
        <div
          className="position-fixed top-0 start-0 w-100 h-100 d-flex justify-content-center align-items-center"
          style={{
            backgroundColor: "rgba(0,0,0,0.8)",
            backdropFilter: "blur(12px)",
            zIndex: 5000, // Ensures it is above navbar/sidebar
            pointerEvents: "auto",
          }}
        >
          <div
            className="rounded-4 shadow-lg"
            style={{
              width: "95%",
              height: "95%",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255,255,255,0.3)",
              backdropFilter: "blur(20px)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              zIndex: 5001,
            }}
          >
            <div
              style={{
                padding: "10px 20px",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                fontWeight: "bold",
                borderBottom: "1px solid rgba(255,255,255,0.2)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{book.title}</span>
              <button className="btn-close btn-close-white" onClick={() => setShowPdfModal(false)}></button>
            </div>
            <iframe
              src={`https://docs.google.com/gview?url=${encodeURIComponent(book.pdfUrl!)}&embedded=true`}
              title="PDF Preview"
              style={{ width: "100%", flex: 1, border: "none" }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BookPreview;
