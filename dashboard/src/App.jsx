import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    company: "",
    email: "",
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    axios
      .get("https://jsonplaceholder.typicode.com/users")
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleDelete = (id) => {
    const deletedData = users.filter((ele) => ele.id !== id);
    setUsers(deletedData);
    alert("User deleted successfully");
  };

  const handleEdit = (id) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id ? { ...user, isEditing: true } : user
      )
    );
  };

  const handleSave = (id, updatedUser) => {
    if (!validateEmail(updatedUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              name: updatedUser.name,
              company: updatedUser.company,
              email: updatedUser.email,
              isEditing: false,
            }
          : user
      )
    );
  };

  const handleChange = (e, id) => {
    const { name, value } = e.target;
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === id
          ? {
              ...user,
              [name]: value,
              company:
                name === "company"
                  ? { ...user.company, name: value }
                  : user.company,
            }
          : user
      )
    );
  };

  const handleNewUserChange = (e) => {
    const { name, value } = e.target;
    setNewUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleAddNewUser = () => {
    if (!validateEmail(newUser.email)) {
      alert("Please enter a valid email address.");
      return;
    }
    if (newUser.name && newUser.company && newUser.email) {
      const newId =
        newUser.id || (users.length ? users[users.length - 1].id + 1 : 1);
      setUsers([
        ...users,
        {
          id: newId,
          name: newUser.name,
          company: { name: newUser.company },
          email: newUser.email,
          isEditing: false,
        },
      ]);
      setNewUser({ id: "", name: "", company: "", email: "" });
      setShowForm(false);
    } else {
      alert("Please fill in all fields!");
    }
  };

  return (
    <>
      <h1
        style={{
          textAlign: "center",
          fontFamily: "sans-serif",
          fontSize: "3rem",
          color: "blue",
        }}
      >
        User Details
      </h1>
      <button
        className="btn"
        style={{
          backgroundColor: "blue",
          paddingLeft: "25px",
          paddingRight: "25px",
          marginBottom: "30px",
          marginLeft: "80%",

        }}
        onClick={() => setShowForm(!showForm)}
      >
        {showForm ? "Cancel" : "Add New User"}
      </button>

      {showForm && (
        <div className="new-user-form" style={{ marginBottom: "20px" }}>
          <input
            type="number"
            name="id"
            value={newUser.id}
            onChange={handleNewUserChange}
            placeholder="ID (Auto-generated if left blank)"
          />
          <input
            type="text"
            name="name"
            value={newUser.name}
            onChange={handleNewUserChange}
            placeholder="Username"
            required
          />
          <input
            type="text"
            name="company"
            value={newUser.company}
            onChange={handleNewUserChange}
            placeholder="Company"
            required
          />
          <input
            type="email"
            name="email"
            value={newUser.email}
            onChange={handleNewUserChange}
            placeholder="Email"
            required
          />
          <button
            onClick={handleAddNewUser}
            className="btn"
            style={{
              backgroundColor: "green",
              paddingLeft: "25px",
              paddingRight: "25px",
            }}
          >
            Add User
          </button>
        </div>
      )}

      <div className="user-details">
        {users.map((user) => (
          <div className="user" key={user.id}>
            <h1>UserID: {user.id}</h1>
            {user.isEditing ? (
              <>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={(e) => handleChange(e, user.id)}
                  placeholder="Username"
                />
                <input
                  type="text"
                  name="company"
                  value={user.company.name}
                  onChange={(e) => handleChange(e, user.id)}
                  placeholder="Company"
                />
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  onChange={(e) => handleChange(e, user.id)}
                  placeholder="Email"
                />
                <button
                  onClick={() => handleSave(user.id, user)}
                  className="btn"
                  style={{
                    backgroundColor: "green",
                    paddingLeft: "25px",
                    paddingRight: "25px",
                  }}
                >
                  Save
                </button>
              </>
            ) : (
              <>
                <h2>Username: {user.name}</h2>
                <h3>Company: {user.company.name}</h3>
                <h3>Email: {user.email}</h3>
                <button className="btn" onClick={() => handleDelete(user.id)}>
                  Delete
                </button>
                <button
                  className="btn"
                  style={{
                    backgroundColor: "blue",
                    paddingLeft: "25px",
                    paddingRight: "25px",
                  }}
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default App;
