import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

function Login() {
  const { loginWithAPI, saveNewUser } = useContext(ShopContext);
  const navigate = useNavigate();

  const [currentState, setCurrentState] = useState("Login");
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // ---------- SIGN UP ----------
    if (currentState === "Sign Up") {
      try {
        const newUser = await saveNewUser(
          data.email,
          data.name,
          data.password
        );

        if (newUser) {
          toast.success("Account created successfully! Please log in.");
          setCurrentState("Login");
          setData({ name: "", email: "", password: "" });
        } else {
          toast.error("Sign up failed.");
        }
      } catch (err) {
        toast.error("Sign up error.");
      }

      setLoading(false);
      return;
    }

    // ---------- LOGIN (JWT) ----------
    try {
      await loginWithAPI(data.email, data.password);
      toast.success("Login successful!");
      navigate("/");
    } catch (error) {
      toast.error("Invalid email or password.");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-[calc(100vh-180px)]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-8 bg-white shadow-xl rounded-xl space-y-6 border border-gray-200"
      >
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          {currentState}
        </h2>

        <div className="space-y-4">
          {currentState === "Sign Up" && (
            <input
              type="text"
              name="name"
              value={data.name}
              onChange={onChangeHandler}
              placeholder="Your Name"
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          )}

          <input
            type="email"
            name="email"
            value={data.email}
            onChange={onChangeHandler}
            placeholder="Your Email"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="password"
            name="password"
            value={data.password}
            onChange={onChangeHandler}
            placeholder="Password"
            required
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full p-3 text-white font-semibold rounded-lg transition duration-200 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {loading
            ? currentState === "Login"
              ? "Logging in..."
              : "Signing up..."
            : currentState}
        </button>

        <div className="text-sm text-center">
          {currentState === "Login" ? (
            <p>
              Don&apos;t have an account?{" "}
              <span
                onClick={() => setCurrentState("Sign Up")}
                className="text-green-500 font-medium cursor-pointer hover:underline"
              >
                Sign Up here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => setCurrentState("Login")}
                className="text-green-500 font-medium cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
}

export default Login;
