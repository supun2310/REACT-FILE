import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, limit, where } from "firebase/firestore";
import { db } from "../firebase";
import Slider from "react-slick";
import { useNavigate } from "react-router-dom";

interface Book {
  id: string;
  title: string;
  author: string;
  publisherEmail: string;
  ratings?: { user: string; score: number }[];
  averageRating?: number;
  pdfUrl: string;
  coverUrl?: string;
  category?: string;
}

// Slider settings with proper responsive config to NOT break desktop view
const sliderSettings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 4,  // Desktop default, no unslick to preserve slider on desktop
  slidesToScroll: 1,
  arrows: true,
  responsive: [
    {
      breakpoint: 1200,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: true,
      },
    },
    {
      breakpoint: 768,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
      },
    },
  ],
};

// BookCard component with hover effect and uniform height
const BookCard: React.FC<{ book: Book }> = ({ book }) => {
  const navigate = useNavigate();

  return (
    <div className="p-2" style={{ height: "100%" }}>
      <div
        className="card border-0 shadow rounded-4 d-flex flex-column"
        style={{
          cursor: "pointer",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          minHeight: "380px",
          transition: "transform 0.2s ease, box-shadow 0.2s ease",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
        onClick={() => navigate(`/book/${book.id}`)}
        onMouseEnter={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1.03)";
          el.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          const el = e.currentTarget;
          el.style.transform = "scale(1)";
          el.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
        }}
      >
        {book.coverUrl ? (
          <div
            style={{
              height: "200px",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              backgroundImage: `url(${book.coverUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            className="bg-secondary d-flex align-items-center justify-content-center text-white"
            style={{
              height: "200px",
              borderTopLeftRadius: "1rem",
              borderTopRightRadius: "1rem",
              fontSize: "1.1rem",
              fontWeight: "600",
            }}
          >
            No Image
          </div>
        )}

        <div className="card-body text-start d-flex flex-column justify-content-between flex-grow-1 small">
          <div>
            <h6 className="card-title fw-semibold text-truncate">{book.title}</h6>
            <p className="text-muted mb-1 text-truncate">✍️ {book.author}</p>
            <p className="text-muted mb-1 text-truncate">👤 {book.publisherEmail}</p>
            {book.averageRating !== undefined && (
              <p className="text-warning mb-2 fw-bold">
                ⭐ {book.averageRating.toFixed(1)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const [trendingBooks, setTrendingBooks] = useState<Book[]>([]);
  const [loadingTrending, setLoadingTrending] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState("Romance");
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const categories = ["Romance", "Horror", "Translation", "Short stories", "Adventure"];

  // Load Trending Books
  useEffect(() => {
    const q = query(collection(db, "books"), limit(50));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const ratings = (data.ratings || []) as { score: number }[];
        const average =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b.score, 0) / ratings.length
            : 0;
        return { id: doc.id, ...data, averageRating: average } as Book;
      });
      const sorted = booksData
        .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
        .slice(0, 8);
      setTrendingBooks(sorted);
      setLoadingTrending(false);
    });
    return () => unsubscribe();
  }, []);

  // Load Books by Category
  useEffect(() => {
    setLoadingCategory(true);
    const q = query(collection(db, "books"), where("category", "==", selectedCategory));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const ratings = (data.ratings || []) as { score: number }[];
        const average =
          ratings.length > 0
            ? ratings.reduce((a, b) => a + b.score, 0) / ratings.length
            : 0;
        return { id: doc.id, ...data, averageRating: average } as Book;
      });
      setCategoryBooks(booksData);
      setLoadingCategory(false);
    });
    return () => unsubscribe();
  }, [selectedCategory]);

  return (
    <div className="mt-4 py-0 px-0">
      <div className="container">
        {/* Hero Section */}
        <div
          className="shadow-sm mb-5 position-relative text-white rounded-4 overflow-hidden"
          style={{
            backgroundImage: `url(/images/hero-image.png)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "300px",
            width: "100%",
          }}
        >
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              background: "rgba(0,0,0,0.55)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            className="position-relative d-flex flex-column justify-content-center h-100"
            style={{
              padding: "2rem",
              maxWidth: "700px",
            }}
          >
            <h1 className="fw-bold mb-2" style={{ fontSize: "2.5rem" }}>
              <img
                src="/images/bookly-logo.png"
                alt="Bookly Logo"
                style={{ height: "50px" }}
                className="me-2"
              />
              Welcome to Bookly
            </h1>
            <p className="lead small">
              Discover, share, and connect with book lovers around the world.
            </p>
            <div className="d-flex gap-3 mt-4">
              <button
                onClick={() => (window.location.href = "/explore")}
                className="btn fw-semibold px-4 py-2"
                style={{
                  background: "rgba(78, 84, 200, 0.6)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  backdropFilter: "blur(6px)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                Explore
              </button>
              <button
                onClick={() => (window.location.href = "/add")}
                className="btn fw-semibold px-4 py-2"
                style={{
                  background: "rgba(143, 148, 251, 0.6)",
                  border: "1px solid rgba(255,255,255,0.4)",
                  color: "#fff",
                  backdropFilter: "blur(6px)",
                  borderRadius: "8px",
                  fontSize: "1rem",
                }}
              >
                Add Book
              </button>
            </div>
          </div>
        </div>

        {/* Trending Books */}
        <section
          className="mb-5 p-3 rounded-4"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h5 className="fw-bold text-dark small mb-3">🔥 Trending Books</h5>
          {loadingTrending ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <div>Loading...</div>
            </div>
          ) : trendingBooks.length === 0 ? (
            <p className="text-center text-muted">No trending books available yet.</p>
          ) : (
            <Slider {...sliderSettings}>
              {trendingBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </Slider>
          )}
        </section>

        {/* Category Filter */}
        <section
          className="mb-5 p-3 rounded-4"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h5 className="fw-bold text-dark small mb-3">📚 Browse by Category</h5>
          <div className="d-flex gap-2 mb-3 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`btn btn-sm ${selectedCategory === cat ? "btn-primary" : "btn-light"}`}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  background:
                    selectedCategory === cat ? "rgba(79,89,250,0.8)" : "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.3)",
                  color: selectedCategory === cat ? "#fff" : "#000",
                  whiteSpace: "nowrap",
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {loadingCategory ? (
            <div className="text-center">
              <div className="spinner-border text-primary" role="status" />
              <div>Loading books...</div>
            </div>
          ) : categoryBooks.length === 0 ? (
            <p className="text-muted text-center">No books found in this category.</p>
          ) : (
            <Slider {...sliderSettings}>
              {categoryBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </Slider>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
