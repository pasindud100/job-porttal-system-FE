import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please enter both email and password");
      return;
    }

    const role = await login(email, password);

    if (!role) {
      alert("Login failed. Please check your credentials.");
      return;
    }

    alert("Login successful");
    setRedirect(true);

    // Navigate based on the role
    switch (role) {
      case "JOB_SEEKER":
        navigate("/");
        break;
      case "ADMIN":
        navigate("/home");
        break;
      case "TRAINER":
        navigate("/training-programs");
        window.location.reload();
        break;
      case "EMPLOYER":
        navigate("/employerdash");
        break;
      default:
        navigate("/home");
    }
  };

  useEffect(() => {
    if (redirect) {
      window.location.reload();
    }
  }, [redirect]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center gap-4 w-80 p-6 border border-gray-300 rounded-lg shadow-lg bg-white">
        <h2 className="text-2xl font-semibold text-center">Login Page</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={handleLogin}
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
        >
          Login
        </button>

        <p className="text-sm">
          Don't have an account?{" "}
          <Link to="/register" className="text-green-500 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
