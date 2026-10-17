import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import Navbar from "../Navbar";
import Footer from "../Footer";
import {
  logout,
  getMe,
  updateProfile,
  becomeStreamer,
} from "../../features/authentication/authenticationSlice";
import { getMyOrders } from "../../features/productSlice/orderSlice";
import {
  getAllProducts,
  createProduct,
  deleteProduct,
} from "../../features/productSlice/productSlice";
import {
  Activity,
  BarChart3,
  Camera,
  ChevronRight,
  DollarSign,
  Eye,
  ImagePlus,
  LayoutDashboard,
  LogOut,
  Package,
  Plus,
  Settings,
  ShoppingBag,
  Trash2,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import "./ProfilePage.css";

function ProductFormModal({ onClose, onSubmit, submitting }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [coverImage, setCoverImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFilePick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCoverImage(file);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(URL.createObjectURL(file));
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const canSubmit = title.trim() && price.trim() && !submitting;

  const handleSubmit = () => {
    if (!canSubmit) return;

    onSubmit({
      title: title.trim(),
      description: description.trim(),
      price: price.trim(),
      coverImage,
    });
  };

  return (
    <div className="sp-modal-backdrop" onClick={onClose}>
      <div
        className="sp-modal sp-cut-both"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sp-modal-head">
          <div>
            <div className="sp-kicker">Inventory</div>
            <span className="sp-modal-title">List a product</span>
          </div>

          <button className="sp-icon-btn" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="sp-modal-body">
          <div
            className={`sp-drop sp-cut${previewUrl ? " sp-has-image" : ""}`}
            style={
              previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined
            }
            onClick={() => fileInputRef.current?.click()}
          >
            {!previewUrl && (
              <div className="sp-drop-empty">
                <ImagePlus size={22} />
                <span>Add a product photo</span>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handleFilePick}
            />
          </div>

          <input
            className="sp-field sp-cut-sm"
            placeholder="Product title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <textarea
            className="sp-field sp-cut-sm"
            placeholder="Description (optional)"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <input
            className="sp-field sp-cut-sm"
            placeholder="Price (USD)"
            type="number"
            min="0"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />

          <button
            className="sp-btn sp-btn-primary sp-submit sp-cut-sm"
            disabled={!canSubmit}
            onClick={handleSubmit}
          >
            {submitting ? "Creating…" : "Create product"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AvatarCropModal({ image, onClose, onSave, saving }) {
const canvasRef = useRef(null);
const imageRef = useRef(null);
const containerRef = useRef(null);

const [zoom, setZoom] = useState(1);
const [position, setPosition] = useState({ x: 0, y: 0 });
const [dragging, setDragging] = useState(false);

const dragStartRef = useRef({ x: 0, y: 0 });
const positionStartRef = useRef({ x: 0, y: 0 });

const CROP_SIZE = 420;

useEffect(() => {
const img = new Image();

img.onload = () => {
  imageRef.current = img;
  drawCanvas();
};

img.src = image;

}, [image]);

useEffect(() => {
drawCanvas();
}, [zoom, position]);

const drawCanvas = () => {
const canvas = canvasRef.current;
const img = imageRef.current;

if (!canvas || !img) return;

const ctx = canvas.getContext("2d");

canvas.width = CROP_SIZE;
canvas.height = CROP_SIZE;

ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);

/*
 * Cover the square crop area while preserving
 * the original image aspect ratio.
 */
const scale = Math.max(
  CROP_SIZE / img.width,
  CROP_SIZE / img.height
);

const width = img.width * scale * zoom;
const height = img.height * scale * zoom;

const x = (CROP_SIZE - width) / 2 + position.x;
const y = (CROP_SIZE - height) / 2 + position.y;

ctx.drawImage(img, x, y, width, height);

};

const handlePointerDown = (e) => {
e.preventDefault();

setDragging(true);

dragStartRef.current = {
  x: e.clientX,
  y: e.clientY,
};

positionStartRef.current = {
  x: position.x,
  y: position.y,
};

e.currentTarget.setPointerCapture?.(e.pointerId);

};

const handlePointerMove = (e) => {
if (!dragging) return;


const dx = e.clientX - dragStartRef.current.x;
const dy = e.clientY - dragStartRef.current.y;

setPosition({
  x: positionStartRef.current.x + dx,
  y: positionStartRef.current.y + dy,
});

};

const handlePointerUp = () => {
setDragging(false);
};

const handleZoomChange = (e) => {
setZoom(Number(e.target.value));
};

const handleReset = () => {
setZoom(1);
setPosition({ x: 0, y: 0 });
};

const handleSave = () => {
const canvas = canvasRef.current;


if (!canvas) return;

canvas.toBlob(
  (blob) => {
    if (!blob) return;

    const file = new File(
      [blob],
      "profile-avatar.jpg",
      {
        type: "image/jpeg",
        lastModified: Date.now(),
      }
    );

    onSave(file);
  },
  "image/jpeg",
  0.92
);

};

return ( <div
   className="sp-avatar-editor-backdrop"
   onClick={onClose}
 >
<div
className="sp-avatar-editor"
onClick={(e) => e.stopPropagation()}
> <div className="sp-avatar-editor-head"> <div> <div className="sp-kicker">Profile image</div>

        <h3 className="sp-avatar-editor-title">
          Adjust your avatar
        </h3>

        <p className="sp-avatar-editor-subtitle">
          Drag to position your image and use the slider to zoom.
        </p>
      </div>

      <button
        className="sp-icon-btn"
        onClick={onClose}
        aria-label="Close avatar editor"
      >
        <X size={18} />
      </button>
    </div>

    <div className="sp-avatar-editor-content">
      <div className="sp-crop-area" ref={containerRef}>
        <canvas
          ref={canvasRef}
          className={`sp-crop-canvas ${
            dragging ? "is-dragging" : ""
          }`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onPointerLeave={handlePointerUp}
        />

        <div className="sp-crop-overlay">
          <div className="sp-crop-corner sp-crop-tl" />
          <div className="sp-crop-corner sp-crop-tr" />
          <div className="sp-crop-corner sp-crop-bl" />
          <div className="sp-crop-corner sp-crop-br" />
        </div>

        <div className="sp-crop-hint">
          DRAG TO POSITION
        </div>
      </div>

      <div className="sp-avatar-controls">
        <div className="sp-zoom-head">
          <span>ZOOM</span>
          <strong>{Math.round(zoom * 100)}%</strong>
        </div>

        <div className="sp-zoom-row">
          <span>−</span>

          <input
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={handleZoomChange}
          />

          <span>+</span>
        </div>

        <button
          className="sp-reset-btn"
          onClick={handleReset}
          type="button"
        >
          Reset position
        </button>
      </div>
    </div>

    <div className="sp-avatar-editor-footer">
      <button
        className="sp-btn sp-btn-ghost sp-cut-sm"
        onClick={onClose}
        disabled={saving}
      >
        Cancel
      </button>

      <button
        className="sp-btn sp-btn-primary sp-cut-sm"
        onClick={handleSave}
        disabled={saving}
      >
        {saving ? "Saving…" : "Save avatar"}
      </button>
    </div>
  </div>
</div>


);
}


function ProductCard({ p, onDelete, onView }) {
  return (
    <article className="sp-card sp-cut">
      <div
        className="sp-card-thumb"
        style={
          p.coverImage ? { backgroundImage: `url(${p.coverImage})` } : undefined
        }
        onClick={() => onView(p.id)}
      >
        {!p.coverImage && <ImagePlus size={24} />}
        <div className="sp-card-overlay">
          <span>Open product</span>
          <ChevronRight size={14} />
        </div>
      </div>

      <div className="sp-card-body">
        <div className="sp-card-title">{p.title}</div>
        <div className="sp-card-price sp-mono">
          ${Number(p.price || 0).toFixed(2)}
        </div>

        <div className="sp-card-actions">
          <button
            onClick={() => onView(p.id)}
            className="sp-btn sp-btn-ghost sp-cut-sm"
          >
            <Eye size={12} /> View
          </button>

          <button
            onClick={() => onDelete(p.id)}
            className="sp-btn sp-btn-ghost sp-danger-text sp-cut-sm"
          >
            <Trash2 size={12} /> Delete
          </button>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ icon: Icon, title, text, action }) {
  return (
    <div className="sp-empty-state">
      <div className="sp-empty-icon sp-cut-sm">
        <Icon size={22} />
      </div>
      <h3>{title}</h3>
      <p>{text}</p>
      {action}
    </div>
  );
}

function MetricCard({ icon: Icon, label, value, meta }) {
  return (
    <div className="sp-metric sp-cut">
      <div className="sp-metric-top">
        <div className="sp-metric-icon sp-cut-sm">
          <Icon size={17} />
        </div>
        <span className="sp-metric-label">{label}</span>
      </div>

      <div className="sp-metric-value">{value}</div>
      <div className="sp-metric-meta">{meta}</div>
    </div>
  );
}

function DashboardOverview({
  profile,
  myProducts,
  onAddProduct,
  canSell,
  upgrading,
  onUpgrade,
  setActiveSection,
  myOrders,  
}) {
  const totalProductValue = myProducts.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );

  return (
    <>
      <div className="sp-hero sp-cut-lg">
        <div className="sp-hero-copy">
          <div className="sp-kicker">Account dashboard</div>
          <h1 className="sp-h1 sp-display">
            Welcome back, {profile.name.split(" ")[0]}
          </h1>
          <p className="sp-hero-text">
            Manage your storefront, account activity and seller tools from one
            place.
          </p>
        </div>

        <div className="sp-hero-actions">
          {canSell ? (
            <button
              className="sp-btn sp-btn-primary sp-cut-sm"
              onClick={onAddProduct}
            >
              <Plus size={14} />
              Add product
            </button>
          ) : (
            <button
              className="sp-btn sp-btn-primary sp-cut-sm"
              onClick={onUpgrade}
              disabled={upgrading}
            >
              {upgrading ? "Upgrading…" : "Become a streamer"}
            </button>
          )}
        </div>
      </div>

      <div className="sp-metrics-grid">
        <MetricCard
          icon={Package}
          label="Products"
          value={myProducts.length}
          meta="Items currently listed"
        />
        <MetricCard
          icon={ShoppingBag}
          label="Orders"
          value="0"
          meta="Connect your orders API"
        />
        <MetricCard
          icon={DollarSign}
          label="Catalog value"
          value={`$${totalProductValue.toFixed(2)}`}
          meta="Combined product pricing"
        />
        <MetricCard
          icon={TrendingUp}
          label="Seller status"
          value={canSell ? "Active" : "Member"}
          meta={canSell ? "Storefront enabled" : "Upgrade to start selling"}
        />
      </div>

      <div className="sp-dashboard-grid">
        <section className="sp-panel sp-cut">
          <div className="sp-panel-rule" />

          <div className="sp-panel-head">
            <div>
              <div className="sp-panel-title">Recent products</div>
              <div className="sp-panel-subtitle">
                Latest items in your storefront
              </div>
            </div>

            <button
              className="sp-text-btn"
              onClick={() => setActiveSection("products")}
            >
              View all <ChevronRight size={14} />
            </button>
          </div>

          {myProducts.length ? (
            <div className="sp-mini-list">
              {myProducts.slice(0, 4).map((product) => (
                <div className="sp-mini-row" key={product.id}>
                  <div className="sp-mini-thumb sp-cut-sm">
                    {product.coverImage ? (
                      <img src={product.coverImage} alt={product.title} />
                    ) : (
                      <ImagePlus size={16} />
                    )}
                  </div>

                  <div className="sp-mini-copy">
                    <strong>{product.title}</strong>
                    <span>${Number(product.price || 0).toFixed(2)}</span>
                  </div>

                  <span className="sp-status sp-status-live sp-cut-sm">Live</span>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={Package}
              title="No products yet"
              text="Your newest products will appear here."
            />
          )}
        </section>

        <section className="sp-panel sp-cut">
          <div className="sp-panel-rule" />

          <div className="sp-panel-head">
            <div>
              <div className="sp-panel-title">Account health</div>
              <div className="sp-panel-subtitle">
                Quick view of your account setup
              </div>
            </div>
          </div>

          <div className="sp-health-list">
            <div className="sp-health-row">
              <span>Profile</span>
              <strong>Complete</strong>
            </div>
            <div className="sp-progress">
              <span style={{ width: "100%" }} />
            </div>

            <div className="sp-health-row">
              <span>Storefront</span>
              <strong>{canSell ? "Enabled" : "Locked"}</strong>
            </div>
            <div className="sp-progress">
              <span style={{ width: canSell ? "100%" : "35%" }} />
            </div>

            <div className="sp-health-row">
              <span>Products</span>
              <strong>{myProducts.length ? "Active" : "Empty"}</strong>
            </div>
            <div className="sp-progress">
              <span style={{ width: myProducts.length ? "75%" : "10%" }} />
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

function ProductsSection({
  myProducts,
  productsLoading,
  canSell,
  upgrading,
  onUpgrade,
  onAddProduct,
  onDelete,
  onView,
}) {
  return (
    <section className="sp-panel sp-cut">
      <div className="sp-panel-rule" />

      <div className="sp-panel-head">
        <div>
          <div className="sp-panel-title">Products</div>
          <div className="sp-panel-subtitle">
            Manage everything currently listed in your storefront.
          </div>
        </div>

        {canSell ? (
          <button
            className="sp-btn sp-btn-primary sp-cut-sm"
            onClick={onAddProduct}
          >
            <Plus size={14} />
            Add product
          </button>
        ) : (
          <button
            className="sp-btn sp-btn-primary sp-cut-sm"
            onClick={onUpgrade}
            disabled={upgrading}
          >
            {upgrading ? "Upgrading…" : "Become a streamer to sell"}
          </button>
        )}
      </div>

      {productsLoading && myProducts.length === 0 ? (
        <div className="sp-empty">Loading products…</div>
      ) : myProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No products listed"
          text="Create your first product and it will appear here."
          action={
            canSell ? (
              <button
                className="sp-btn sp-btn-primary sp-cut-sm"
                onClick={onAddProduct}
              >
                <Plus size={14} />
                Create product
              </button>
            ) : null
          }
        />
      ) : (
        <div className="sp-grid">
          {myProducts.map((product) => (
            <ProductCard
              key={product.id}
              p={product}
              onDelete={onDelete}
              onView={onView}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function OrdersSection({ myOrders, ordersLoading }) {
  return (
    <section className="sp-panel sp-cut">
      <div className="sp-panel-rule" />

      <div className="sp-panel-head">
        <div>
          <div className="sp-panel-title">Your orders</div>
          <div className="sp-panel-subtitle">
            Everything you've bought through StreamSphere.
          </div>
        </div>
      </div>

      {ordersLoading && myOrders.length === 0 ? (
        <div className="sp-empty">Loading orders…</div>
      ) : myOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          text="Orders you place will show up here once confirmed."
        />
      ) : (
        <div className="sp-mini-list">
          {myOrders.map((order) => (
            <div className="sp-mini-row" key={order.id}>
              <div className="sp-mini-thumb sp-cut-sm">
                {order.PRODUCT?.coverImage ? (
                  <img src={order.PRODUCT.coverImage} alt={order.PRODUCT.title} />
                ) : (
                  <Package size={16} />
                )}
              </div>

              <div className="sp-mini-copy">
                <strong>{order.PRODUCT?.title || "Product removed"}</strong>
                <span>
                  Qty {order.quantity} · ${Number(order.totalPrice).toFixed(2)} ·{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>

              <span
                className={`sp-status sp-cut-sm ${
                  order.status === "confirmed"
                    ? "sp-status-live"
                    : order.status === "cancelled"
                    ? "sp-danger-text"
                    : ""
                }`}
              >
                {order.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function AnalyticsSection({ myProducts, myOrders, canSell }) {
  const totalValue = myProducts.reduce(
    (sum, product) => sum + Number(product.price || 0),
    0
  );
  const averagePrice = myProducts.length ? totalValue / myProducts.length : 0;

  return (
    <>
      <div className="sp-metrics-grid">
        <MetricCard
          icon={Package}
          label="Listed products"
          value={myProducts.length}
          meta="Current inventory count"
        />
        <MetricCard
          icon={DollarSign}
          label="Average price"
          value={`$${averagePrice.toFixed(2)}`}
          meta="Across listed products"
        />
        <MetricCard
          icon={Activity}
          label="Store status"
          value={canSell ? "Online" : "Inactive"}
          meta="Seller account availability"
        />
        <MetricCard
          icon={ShoppingBag}
          label="Orders"
          value={myOrders.length}
          meta={myOrders.length ? "Total orders placed" : "No orders yet"}
        />
      </div>

      <section className="sp-panel sp-cut">
        <div className="sp-panel-rule" />

        <div className="sp-panel-head">
          <div>
            <div className="sp-panel-title">Performance analytics</div>
            <div className="sp-panel-subtitle">
              Product-level information available from your current data.
            </div>
          </div>
        </div>

        {myProducts.length ? (
          <div className="sp-analytics-table-wrap">
            <table className="sp-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Price</th>
                  <th>Status</th>
                  <th>Sales</th>
                </tr>
              </thead>
              <tbody>
                {myProducts.map((product) => (
                  <tr key={product.id}>
                    <td>{product.title}</td>
                    <td>${Number(product.price || 0).toFixed(2)}</td>
                    <td>
                      <span className="sp-status sp-status-live sp-cut-sm">
                        Live
                      </span>
                    </td>
                    <td>—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <EmptyState
            icon={BarChart3}
            title="No analytics yet"
            text="Analytics will become more useful as you add products and connect order data."
          />
        )}
      </section>
    </>
  );
}

function SettingsSection({ profile, avatarInputRef, avatarUploading }) {
  return (
    <div className="sp-settings-grid">
      <section className="sp-panel sp-cut">
        <div className="sp-panel-rule" />

        <div className="sp-panel-head">
          <div>
            <div className="sp-panel-title">Profile settings</div>
            <div className="sp-panel-subtitle">
              Basic information pulled from your account.
            </div>
          </div>
        </div>

        <div className="sp-settings-form">
          <label>
            <span>Display name</span>
            <input className="sp-field sp-cut-sm" value={profile.name} readOnly />
          </label>

          <label>
            <span>Username</span>
            <input
              className="sp-field sp-cut-sm"
              value={profile.handle}
              readOnly
            />
          </label>

          <label>
            <span>Role</span>
            <input className="sp-field sp-cut-sm" value={profile.role} readOnly />
          </label>

          <div className="sp-settings-note">
            Add name/email fields to your <code>updateProfile</code> thunk if you
            want these values to be editable here.
          </div>
        </div>
      </section>

      <section className="sp-panel sp-cut">
        <div className="sp-panel-rule" />

        <div className="sp-panel-head">
          <div>
            <div className="sp-panel-title">Profile image</div>
            <div className="sp-panel-subtitle">
              Update the avatar used across your account.
            </div>
          </div>
        </div>

        <div className="sp-avatar-setting">
          <div
            className="sp-avatar-large sp-cut"
            style={
              profile.avatarUrl
                ? { backgroundImage: `url(${profile.avatarUrl})` }
                : undefined
            }
          >
            {!profile.avatarUrl && profile.av}
          </div>

          <button
            className="sp-btn sp-btn-ghost sp-cut-sm"
            onClick={() => avatarInputRef.current?.click()}
            disabled={avatarUploading}
          >
            <Camera size={14} />
            {avatarUploading ? "Uploading…" : "Change avatar"}
          </button>
        </div>
      </section>
    </div>
  );
}

export default function ProfilePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const avatarInputRef = useRef(null);

  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarEditorOpen, setAvatarEditorOpen] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  const loading = useSelector((state) => state.authentication.loading);
  const { user, error } = useSelector(
    (state) => state.authentication.authentication
  );
  const { list: allProducts, loading: productsLoading } = useSelector(
    (state) => state.products.products
  );
  const { list: myOrders, loading: ordersLoading } = useSelector((state) => state.orders.orders);

  useEffect(() => {
    if (!user && localStorage.getItem("token")) {
      dispatch(getMe());
    }
  }, [dispatch, user]);

  useEffect(() => {
    dispatch(getAllProducts());
  }, [dispatch]);

  useEffect(() => {
  dispatch(getMyOrders());
  }, [dispatch]);

  const profile = useMemo(() => {
    if (!user) return null;

    return {
      name: user.name || "Unnamed",
      handle: user.email ? `@${user.email.split("@")[0]}` : "@unknown",
      role: user.role || "Member",
      av: (user.name || "U").slice(0, 2).toUpperCase(),
      avatarUrl: user.avatar || null,
    };
  }, [user]);

  const myProducts = useMemo(() => {
    if (!user) return [];
    return (allProducts || []).filter((product) => product.userId === user.id);
  }, [allProducts, user]);

  const canSell =
    profile?.role?.toLowerCase() === "streamer" ||
    profile?.role?.toLowerCase() === "admin";

  const handleBecomeStreamer = () => {
    setUpgrading(true);

    dispatch(becomeStreamer())
      .unwrap()
      .finally(() => setUpgrading(false))
      .catch((err) => {
        alert(err?.message || err?.messege || "Failed to upgrade your account.");
      });
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);

    dispatch(updateProfile({ avatar: file }))
      .unwrap()
      .catch((err) => {
        console.error(err, "Failed to update avatar");
      })
      .finally(() => setAvatarUploading(false));

    e.target.value = "";
  };

  const handleCreateProduct = (data) => {
    setCreating(true);

    dispatch(createProduct(data))
      .unwrap()
      .then(() => setModalOpen(false))
      .catch((err) => {
        console.error(err, "Failed to create product");
      })
      .finally(() => setCreating(false));
  };

  const handleDeleteProduct = (id) => {
    const confirmed = window.confirm(
      "Delete this product? This can't be undone."
    );
    if (!confirmed) return;

    dispatch(deleteProduct(id))
      .unwrap()
      .catch((err) => {
        console.error(err, "Failed to delete product");
        alert(err?.message || err?.messege || "Failed to delete product.");
      });
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Your Orders", icon: ShoppingBag },
    { id: "products", label: "Products", icon: Package },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="sp-page">
        <Navbar />
        <div className="sp-center-state">
          <div className="sp-loader" />
          Loading dashboard...
        </div>
        <Footer />
      </div>
    );
  }

  if (!user || !profile) {
    return (
      <div className="sp-page">
        <Navbar />
        <div className="sp-center-state">
          <div>
            {error ? "Could not load your profile." : "You're not logged in."}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const sectionTitle =
    navItems.find((item) => item.id === activeSection)?.label || "Dashboard";

  return (
    <div className="sp-page">
      <Navbar />

      <div className="sp-layout">
        <aside className="sp-sidebar">
          <div className="sp-sidebar-inner">
            <div className="sp-av-section">
              <div className="sp-avatar-wrap">
                <button
                  className="sp-avatar-frame"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Change avatar"
                >
                  <div
                    className="sp-avatar-inner"
                    style={
                      profile.avatarUrl
                        ? { backgroundImage: `url(${profile.avatarUrl})` }
                        : undefined
                    }
                  >
                    {!profile.avatarUrl &&
                      (avatarUploading ? "…" : profile.av)}
                  </div>
                </button>

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleAvatarPick}
                />

                <button
                  className="sp-avatar-badge"
                  onClick={() => avatarInputRef.current?.click()}
                  aria-label="Upload avatar"
                >
                  <Camera size={12} />
                </button>
              </div>

              <div className="sp-name sp-display">{profile.name}</div>
              <div className="sp-handle sp-mono">{profile.handle}</div>

              <div className="sp-role-chip sp-cut-sm">{profile.role}</div>
            </div>

            <div className="sp-sidebar-nav-wrap">
              <div className="sp-nav-label">Dashboard</div>

              <nav className="sp-sidebar-nav">
                {navItems.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    className={`sp-nav-item sp-cut-sm ${
                      activeSection === id ? "is-active" : ""
                    }`}
                    onClick={() => setActiveSection(id)}
                  >
                    <span className="sp-nav-item-left">
                      <Icon size={16} />
                      {label}
                    </span>

                    {id === "products" && (
                      <span className="sp-nav-badge">{myProducts.length}</span>
                    )}
                  </button>
                ))}
              </nav>
            </div>

            <div className="sp-sidebar-bottom">
              <div className="sp-seller-card sp-cut">
                <span className="sp-live-dot" />
                <div>
                  <strong>{canSell ? "Seller mode active" : "Member account"}</strong>
                  <p>
                    {canSell
                      ? `${myProducts.length} product${
                          myProducts.length === 1 ? "" : "s"
                        } listed`
                      : "Upgrade to unlock selling tools"}
                  </p>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="sp-btn sp-btn-logout sp-cut-sm"
              >
                <LogOut size={14} />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <main className="sp-main">
          <div className="sp-main-topbar">
            <div>
              <div className="sp-eyebrow">StreamSphere / Account</div>
              <h2 className="sp-page-title">{sectionTitle}</h2>
            </div>

            <div className="sp-topbar-meta sp-cut-sm">
              <span className="sp-live-dot" />
              <span>{canSell ? "Store online" : "Account active"}</span>
            </div>
          </div>

          <div className="sp-section-view" key={activeSection}>
            {activeSection === "overview" && (
              <DashboardOverview
                profile={profile}
                myProducts={myProducts}
                myOrders={myOrders}   // <-- ADD
                onAddProduct={() => setModalOpen(true)}
                canSell={canSell}
                upgrading={upgrading}
                onUpgrade={handleBecomeStreamer}
                setActiveSection={setActiveSection}
              />
            )}

            {activeSection === "orders" && <OrdersSection myOrders={myOrders} ordersLoading={ordersLoading} />}

            {activeSection === "products" && (
              <ProductsSection
                myProducts={myProducts}
                productsLoading={productsLoading}
                canSell={canSell}
                upgrading={upgrading}
                onUpgrade={handleBecomeStreamer}
                onAddProduct={() => setModalOpen(true)}
                onDelete={handleDeleteProduct}
                onView={(id) => navigate(`/products/${id}`)}
              />
            )}

            {activeSection === "analytics" && (
              <AnalyticsSection myProducts={myProducts} myOrders={myOrders} canSell={canSell} />
            )}

            {activeSection === "settings" && (
              <SettingsSection
                profile={profile}
                avatarInputRef={avatarInputRef}
                avatarUploading={avatarUploading}
              />
            )}
          </div>
        </main>
      </div>

      <Footer />

      {modalOpen && (
        <ProductFormModal
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreateProduct}
          submitting={creating}
        />
      )}
    </div>
  );
}
