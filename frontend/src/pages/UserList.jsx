import React, { useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance.js";
import Loader from "../components/Loader.jsx";
import Toast from "../components/Toast.jsx";
import UserForm from "./UserForm.jsx";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", type: "success" });
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/users");
      setUsers(res.data.data || []);
    } catch (error) {
      setToast({ message: "Failed to fetch users", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Mark this user as inactive?")) return;
    try {
      await axiosInstance.delete(`/users/${id}`);
      setToast({ message: "User marked inactive", type: "success" });
      fetchUsers();
    } catch {
      setToast({ message: "Delete failed", type: "error" });
    }
  };

  const handleSearch = (e) => setQuery(e.target.value.toLowerCase());

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(query) ||
      u.email.toLowerCase().includes(query)
  );

  if (loading) return <Loader text="Fetching users..." />;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">User Management</h1>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Search by name or email"
            className="border px-3 py-2 rounded"
            onChange={handleSearch}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={() => {
              setEditUser(null);
              setShowForm(true);
            }}
          >
            + Add User
          </button>
        </div>
      </div>

      {/* User List */}
      <div className="grid gap-4 sm:grid-cols-2">
        {filtered.map((user) => (
          <div
            key={user.id}
            className="bg-white p-4 rounded shadow flex justify-between items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user.role} • {user.status}
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditUser(user);
                  setShowForm(true);
                }}
                className="border px-3 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="border px-3 py-1 rounded text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
            <UserForm
              userToEdit={editUser}
              onSuccess={() => {
                setShowForm(false);
                fetchUsers();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </div>
  );
}
