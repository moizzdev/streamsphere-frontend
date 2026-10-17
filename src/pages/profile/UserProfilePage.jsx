import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import Navbar from "../Navbar";
import Footer from "../Footer";
import api from "../../services/api";
import { getAllProducts } from "../../features/productSlice/productSlice";
import { ImagePlus, ArrowLeft, User, MessageCircle, ArrowUpRight } from "lucide-react";
import "./UserProfilePage.css";

export default function UserProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [profileUser, setProfileUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const { list: allProducts } = useSelector((state) => state.products.products);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setNotFound(false);

    api.get(`/users/${id}`)
      .then((res) => {
        if (!cancelled) {
          setProfileUser(res.data.data);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.log(err, "Failed to load user profile");
        if (!cancelled) {
          setNotFound(true);
          setLoading(false);
        }
      });

    dispatch(getAllProducts());

    return () => {
      cancelled = true;
    };
  }, [id, dispatch]);

  const userProducts = (allProducts || []).filter(
    (p) => p.userId === id
  );

  if (loading) {
    return (
      <div className="user-profile-page">
        <Navbar />
        <main className="profile-state">
          <div className="profile-loader" />
          <span>Loading profile...</span>
        </main>
        <Footer />
      </div>
    );
  }

  if (notFound || !profileUser) {
    return (
      <div className="user-profile-page">
        <Navbar />
        <main className="profile-state">
          <div className="profile-error-code">404 / PROFILE</div>
          <h2>This user couldn't be found.</h2>
          <button className="profile-back-btn" onClick={() => navigate(-1)}>
            <ArrowLeft size={15} />
            Go Back
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="user-profile-page">
      <Navbar />

      <main className="user-profile-main">
        <button className="profile-back-link" onClick={() => navigate(-1)}>
          <ArrowLeft size={14} />
          BACK
        </button>

        {/* Profile Hero */}
        <section className="profile-hero">
          <div className="profile-hero-grid" />
          <div className="profile-glow profile-glow-one" />
          <div className="profile-glow profile-glow-two" />

          <div className="profile-hero-inner">
            <div className="profile-avatar-wrap">
              <div
                className="profile-avatar"
                style={
                  profileUser.avatar
                    ? { backgroundImage: `url(${profileUser.avatar})` }
                    : undefined
                }
              >
                {!profileUser.avatar && <User size={34} />}
              </div>
              <span className="profile-online-dot" />
            </div>

            <div className="profile-main-info">
              <div className="profile-eyebrow">
                STREAMSPHERE / USER PROFILE
              </div>

              <h1>{profileUser.name}</h1>

              <div className="profile-meta">
                <span className="profile-role">{profileUser.role}</span>
                <span className="profile-divider">/</span>
                <span>{userProducts.length} PRODUCTS</span>
              </div>
            </div>

            <button
              className="profile-message-btn"
              onClick={() => navigate(`/messages?user=${id}`)}
            >
              <MessageCircle size={17} />
              <span>Message</span>
              <ArrowUpRight className="message-arrow" size={14} />
            </button>
          </div>
        </section>

        {/* Products */}
        <section className="profile-products-section">
          <div className="profile-section-heading">
            <div>
              <div className="profile-section-label">
                STOREFRONT / INVENTORY
              </div>
              <h2>{profileUser.name}'s Products</h2>
            </div>

            <div className="profile-product-count">
              {String(userProducts.length).padStart(2, "0")}
            </div>
          </div>

          {userProducts.length === 0 ? (
            <div className="profile-empty">
              <div className="profile-empty-icon">
                <PackageIcon />
              </div>
              <h3>No products listed yet</h3>
              <p>This user hasn't listed any products on StreamSphere.</p>
            </div>
          ) : (
            <div className="profile-products-grid">
              {userProducts.map((p) => (
                <div
                  key={p.id}
                  className="profile-product-card"
                  onClick={() => navigate(`/products/${p.id}`)}
                >
                  <div
                    className="profile-product-image"
                    style={
                      p.coverImage
                        ? { backgroundImage: `url(${p.coverImage})` }
                        : undefined
                    }
                  >
                    {!p.coverImage && <ImagePlus size={22} />}

                    <div className="profile-product-overlay">
                      <span>VIEW</span>
                      <ArrowUpRight size={14} />
                    </div>
                  </div>

                  <div className="profile-product-info">
                    <div className="profile-product-title">
                      {p.title}
                    </div>

                    <div className="profile-product-bottom">
                      <span className="profile-product-price">
                        ${p.price}
                      </span>

                      <span className="profile-product-icon">
                        <ArrowUpRight size={13} />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

function PackageIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
    >
      <path d="m16.5 9.4-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
      <path d="m3.27 6.96 8.73 5.05 8.73-5.05M12 22.08V12" />
    </svg>
  );
}
