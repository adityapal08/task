import React, { useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance.js";
import Loader from "../components/Loader.jsx";

export default function UserForm({ userToEdit = null, onSuccess, onCancel }) {
  // Initial state
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "user",
    status: "active",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Pre-fill when editing
  useEffect(() => {
    if (userToEdit) {
      setForm({
        name: userToEdit.name || "",
        email: userToEdit.email || "",
        role: userToEdit.role || "user",
        status: userToEdit.status || "active",
      });
    } else {
      setForm({ name: "", email: "", role: "user", status: "active" });
    }
  }, [userToEdit]);

  // ✅ Validation
  function validate() {
    const err = {};

    if (!form.name.trim()) err.name = "Name is required.";
    else if (form.name.trim().length < 3)
      err.name = "Name must be at least 3 characters.";

    if (!form.email.trim()) err.email = "Email is required.";
    else if (!/^\S+@\S+\.\S+$/.test(form.email))
      err.email = "Invalid email format.";

    return err;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length > 0) return;

    try {
      setLoading(true);
      let res;

      if (userToEdit && userToEdit.id) {
        res = await axiosInstance.put(`/users/${userToEdit.id}`, form);
      } else {
        res = await axiosInstance.post("/users/create", form);
      }

      if (res.data?.success) {
        onSuccess && onSuccess(res.data.data);
      } else {
        setErrors({ submit: res.data?.message || "Operation failed" });
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Something went wrong";
      setErrors({ submit: msg });
      console.error("Form submission error:", error.msg);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-6 rounded-lg shadow w-full max-w-md"
    >
      <h2 className="text-lg font-semibold mb-4">
        {userToEdit ? "Edit User" : "Create User"}
      </h2>

      {/* Name */}
      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Name</span>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Enter name"
          className={`w-full mt-1 border px-3 py-2 rounded focus:outline-none ${
            errors.name ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.name && (
          <p className="text-xs text-red-500 mt-1">{errors.name}</p>
        )}
      </label>

      {/* Email */}
      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Email</span>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Enter email"
          className={`w-full mt-1 border px-3 py-2 rounded focus:outline-none ${
            errors.email ? "border-red-400" : "border-gray-300"
          }`}
        />
        {errors.email && (
          <p className="text-xs text-red-500 mt-1">{errors.email}</p>
        )}
      </label>

      {/* Role */}
      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Role</span>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mt-1 border px-3 py-2 rounded border-gray-300 focus:outline-none"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      {/* Status */}
      <label className="block mb-3">
        <span className="text-sm font-medium text-gray-700">Status</span>
        <select
          name="status"
          value={form.status}
          onChange={handleChange}
          className="w-full mt-1 border px-3 py-2 rounded border-gray-300 focus:outline-none"
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </label>

      {/* Error message */}
      {errors.submit && (
        <div className="text-sm text-red-600 mb-2">{errors.submit}</div>
      )}

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? (
            <Loader text="Saving..." />
          ) : userToEdit ? (
            "Update"
          ) : (
            "Create"
          )}
        </button>
      </div>
    </form>
  );
}
