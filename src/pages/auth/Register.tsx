import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, User, Building } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "admin",
    companyName: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      await register(formData);
      navigate("/");
    } catch (err) {
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Create Account</h2>
        <p className="text-gray-600 mt-2">Join SocietyHub today</p>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your full name"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="role"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Role
          </label>
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
            required
          >
            <option value="admin">Society Admin</option>
            <option value="manager">Property Manager</option>
            <option value="super_admin">Super Admin</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="companyName"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Company/Society Name
          </label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={formData.companyName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter company or society name"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Create a password"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="terms"
            type="checkbox"
            className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
            required
          />
          <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
            I agree to the{" "}
            <Link to="#" className="text-purple-600 hover:text-purple-500">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-purple-600 hover:text-purple-500">
              Privacy Policy
            </Link>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 focus:none focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{" "}
          <Link
            to="/auth/login"
            className="text-purple-600 hover:text-purple-500 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
