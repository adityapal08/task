import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import UserList from "./pages/UserList.jsx";
import UserForm from "./pages/UserForm.jsx";

function App() {
  return (
    <Router>
      <div className="max-w-6xl mx-auto p-6">
        {/* Routes */}
        <Routes>
          {/* Redirect / to /users */}
          <Route path="/" element={<Navigate to="/users" replace />} />

          {/* All Users Page */}
          <Route path="/users" element={<UserList />} />

          {/* Add New User Page */}
          <Route path="/add-user" element={<UserForm />} />

          {/* Edit User Page (dynamic ID) */}
          <Route path="/edit-user/:id" element={<UserForm />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
