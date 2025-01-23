import React, { useState } from "react";
import { loginUser } from "../../../client/src/services/userApiServices";
import { useNavigate } from "react-router-dom";
// import { useDispatch, UseDispatch } from "react-redux";
// import { loginSuccess } from "../../../client-1/src/redux/slices/authSlices";


const LoginForm: React.FC = () => {
  // const navigate = useNavigate()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    error: "",
  });
  // const dispatch = useDispatch();

  // Handle input change for all fields
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    console
    e.preventDefault();
    setFormData({ ...formData, error: "" });

    // Simple validation
    if (!formData.email || !formData.password) {
      setFormData({ ...formData, error: "Both fields are required." });
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setFormData({ ...formData, error: "Please enter a valid email address." });
      return;
    }

    // try {
    //   const userData = await loginUser(formData);
    //   console.log("Login Successful:", userData);
    //   navigate('/dashboard')
    //   // console.log("Login successful:", userData.user);
    //   // console.log("Login successful:", userData.token);

    //   // Add post-login logic here (e.g., store token, redirect)
    // } catch (err: any) {
    //   setFormData({
    //     ...formData,
    //     error: err.message || "Something went wrong.",
    //   });
    // }
    try {
      const response = await loginUser(formData);

      if (response.data) {
        // const { token, user } = response.data;
        console.log(response.data)

        // Dispatch action to store data in Redux
        // dispatch(loginSuccess({ token, user }));

        // Store token in localStorage for persistence
        // localStorage.setItem('token', token);
        // navigate('/');
        // navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="p-6 bg-white dark:bg-gray-700 dark:text-gray-200 rounded-lg shadow-lg w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-4">Login</h2>
      {formData.error && <p className="text-red-500 mb-4">{formData.error}</p>}
      <form onSubmit={handleLogin}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border rounded-md p-3"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
