import React, { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "../firebase";
import Slider, { Settings } from "react-slick";
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

const sliderSettings: Settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToScroll: 1,
  arrows: true,
  slidesToShow: 4, // Fixed number per screen size
  responsive: [
    { breakpoint: 1200, settings: { slidesToShow: 3 } },
    { breakpoint: 768, settings: { slidesToShow: 2 } },
    { breakpoint: 480, settings: { slidesToShow: 1 } },
  ],
};

const shuffleArray = (array: Book[]): Book[] => {
  return array
    .map((item) => ({ ...item, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map((item) => {
      const copy = { ...item };
      delete (copy as { sort?: number }).sort;
      return copy as Book;
    });
};

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

const BookExplore: React.FC = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("Romance");
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
  const [loadingCategory, setLoadingCategory] = useState(true);

  const categories = ["Romance", "Horror", "Translation", "Short stories", "Adventure"];

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "books"), (snapshot) => {
      const booksData = snapshot.docs.map((doc) => {
        const data = doc.data();
        const ratings = (data.ratings || []) as { score: number }[];
        const average =
          ratings.length > 0 ? ratings.reduce((a, b) => a + b.score, 0) / ratings.length : 0;
        return { id: doc.id, ...data, averageRating: average } as Book;
      });
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoadingCategory(true);
    const unsubscribe = onSnapshot(
      query(collection(db, "books"), where("category", "==", selectedCategory)),
      (snapshot) => {
        const booksData = snapshot.docs.map((doc) => {
          const data = doc.data();
          const ratings = (data.ratings || []) as { score: number }[];
          const average =
            ratings.length > 0 ? ratings.reduce((a, b) => a + b.score, 0) / ratings.length : 0;
          return { id: doc.id, ...data, averageRating: average } as Book;
        });
        setCategoryBooks(booksData);
        setLoadingCategory(false);
      }
    );
    return () => unsubscribe();
  }, [selectedCategory]);

  if (loading)
    return (
      <div className="text-center mt-5 py-5">
        <div className="spinner-border text-primary" role="status" />
        <div>Loading books...</div>
      </div>
    );

  const trendingBooks = [...books]
    .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
    .slice(0, 10);

  const recommendedBooks = shuffleArray(books).slice(0, 10);

  return (
    <div className="mt-4">
      <div className="container px-0">
        <div
          className="rounded-4 shadow-sm p-4"
          style={{
            background: "rgba(255,255,255,0.1)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <h2 className="mb-4 text-center fw-bold text-dark" style={{ fontSize: "2rem" }}>
            Explore Books
          </h2>

          {/* Trending Section */}
          <section className="mb-5">
            <h5 className="fw-bold small mb-3">🔥 Trending Books</h5>
            {trendingBooks.length === 0 ? (
              <p className="text-muted">No trending books available yet.</p>
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

          {/* Recommended Section */}
          <section>
            <h5 className="fw-bold small mb-3">✨ Recommended for You</h5>
            {recommendedBooks.length === 0 ? (
              <p className="text-muted">No recommendations available yet.</p>
            ) : (
              <Slider {...sliderSettings}>
                {recommendedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </Slider>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default BookExplore;
