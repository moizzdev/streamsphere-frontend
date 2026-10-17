import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Navbar from "../Navbar";

const TABS = ["Users", "Products", "Orders"];

function AdminPanel() {
    const [tab, setTab] = useState("Users");
    const [users, setUsers] = useState([]);
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(false);

    const load = async () => {
        setLoading(true);
        try {
            if (tab === "Users") {
                const res = await api.get("/admin/users");
                setUsers(res.data.data);
            } else if (tab === "Products") {
                const res = await api.get("/admin/products");
                setProducts(res.data.data);
            } else {
                const res = await api.get("/admin/orders");
                setOrders(res.data.data);
            }
        } catch (err) {
            console.log(err, "admin load error");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, [tab]);

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        await api.delete(`/admin/users/${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
    };

    const setRole = async (id, role) => {
        await api.patch(`/admin/users/${id}/role`, { role });
        setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    };

    const deleteProduct = async (id) => {
        if (!window.confirm("Delete this product?")) return;
        await api.delete(`/admin/products/${id}`);
        setProducts((prev) => prev.filter((p) => p.id !== id));
    };

    return (
        <div>
            <Navbar />
            <div style={{ padding: 24, color: "#fff" }}>
                <h1>Admin Panel</h1>

                <div style={{ display: "flex", gap: 12, margin: "16px 0" }}>
                    {TABS.map((t) => (
                        <button
                            key={t}
                            onClick={() => setTab(t)}
                            style={{
                                padding: "8px 16px",
                                background: tab === t ? "#8b5cf6" : "#222",
                                color: "#fff",
                                border: "none",
                                cursor: "pointer",
                            }}
                        >
                            {t}
                        </button>
                    ))}
                </div>

                {loading && <p>Loading...</p>}

                {!loading && tab === "Users" && (
                    <table width="100%">
                        <thead>
                            <tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.name}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <select value={u.role} onChange={(e) => setRole(u.id, e.target.value)}>
                                            <option value="user">user</option>
                                            <option value="streamer">streamer</option>
                                            <option value="admin">admin</option>
                                        </select>
                                    </td>
                                    <td>
                                        <button onClick={() => deleteUser(u.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && tab === "Products" && (
                    <table width="100%">
                        <thead>
                            <tr><th>Title</th><th>Price</th><th>Owner</th><th>Actions</th></tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p.id}>
                                    <td>{p.title}</td>
                                    <td>${p.price}</td>
                                    <td>{p.User?.email}</td>
                                    <td>
                                        <button onClick={() => deleteProduct(p.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

                {!loading && tab === "Orders" && (
                    <table width="100%">
                        <thead>
                            <tr><th>Product</th><th>Buyer</th><th>Total</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            {orders.map((o) => (
                                <tr key={o.id}>
                                    <td>{o.PRODUCT?.title}</td>
                                    <td>{o.USER?.email}</td>
                                    <td>${o.totalPrice}</td>
                                    <td>{o.paymentMethod}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default AdminPanel;