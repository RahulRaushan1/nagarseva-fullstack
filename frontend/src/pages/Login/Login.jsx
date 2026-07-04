import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./login.module.css";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import Loader from "../../components/Loader/Loader";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateUserCredentials = () => {
    let error = {};

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email.trim() === "" || !emailRegex.test(email))
      error.email = "Email must be in valid format.";
    if (password.trim() === "")
      error.password = "Password must be between 8-15 Character";

    setError(error);

    return Object.keys(error).length === 0;
  };

  const redirectToDashboard = (role) => {
    switch (role) {
      case "ROLE_ADMIN":
        navigate("/admin/dashboard");
        break;

      case "ROLE_CITIZEN":
        navigate("/citizen/dashboard");
        break;

      case "ROLE_COUNCILLOR":
        navigate("/councillor/dashboard");
        break;

      case "ROLE_OFFICER":
        navigate("/officer/dashboard");
        break;

      default:
        return;
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateUserCredentials()) {
      Object.values(error).forEach((value) => {
        toast.error(value);
      });
      return;
    }

    setLoading(true);
    const trimmedEmail = email.trim();
    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: trimmedEmail,
          password,
        }),
      });

      if (!response.ok) {

        if (response.status=== 401 || response.status === 403) {
          toast.error("Invalid username or password")
          return;
        }
        
        const errorData = await response.json();

        if (errorData.code === "ACCOUNT_DISABLED") {
          toast.error(errorData.message);
          return;
        }
          
        if (errorData.code === "INVALID_CREDENTIALS") {
          toast.error(errorData.message);
          return;
        }
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);

      const decodedToken = jwtDecode(data.token);
      const role = decodedToken.role;

      localStorage.setItem("role", role);

      toast.success(data.message);

      redirectToDashboard(role);
    } catch (err) {
      toast.error("Unable to connect to server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.auth_page_body}>
      {loading && <Loader text="Logging in..." />}
      <div className={styles.auth_container}>
        <div className={styles.auth_card}>
          <div className={styles.auth_header}>
            <div className={styles.logo}>
              <img
                src="https://res.cloudinary.com/dzexb7f3p/image/upload/v1778174553/Gemini_Generated_Image_dk0cs1dk0cs1dk0c_4_copy_ibfkmg.png"
                alt="NagarSeva Logo"
                className={styles.logo_img}
              />
            </div>
            <h2 className={styles.heading}>Welcome back</h2>
            <p className={styles.subtext}>
              Smart Civic Complaint Management Platform
            </p>
          </div>

          <form className={styles.auth_form} onSubmit={handleLogin}>
            <div className={styles.form_group}>
              <label htmlFor="email" className={styles.label}>
                Email address
              </label>
              <input
                type="email"
                id="email"
                className={styles.input_field}
                placeholder="name@example.com"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.form_group}>
              <div className={styles.label_row}>
                <label htmlFor="password" className={styles.label}>
                  Password
                </label>
                <Link to="/forgot-password" className={styles.forgot_link}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.input_wrapper}>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={styles.input_field}
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.toggle_icon}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.icon_svg}
                    >
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                      <line x1="1" y1="1" x2="23" y2="23"></line>
                    </svg>
                  ) : (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className={styles.icon_svg}
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                      <circle cx="12" cy="12" r="3"></circle>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            

            <button
              type="submit"
              className={styles.btn_primary}
              disabled={loading || !email.trim() || !password.trim()}
            >
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <div className={styles.auth_footer}>
            <p className={styles.footer_text}>
              Don't have an account?{" "}
              <Link to="/signup" className={styles.footer_link}>
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
