import { useAuthStore } from "@/stores/authStore";
import { useSocietyStore } from "@/stores/societyStore";
import { Eye, EyeOff, Lock, Mail, User, Phone } from "lucide-react";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    globalRole: "platform_admin",
    defaultSocietyId: "",
    flatOwnerType: "owner",
    propertyType: "residential",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const { signUp, isLoading } = useAuthStore();
  const {
    societies,
    fetchSocieties,
    isLoading: societiesLoading,
  } = useSocietyStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch societies on component mount
    const loadSocieties = async () => {
      try {
        await fetchSocieties();
      } catch (error) {
        console.error("Failed to fetch societies:", error);
        setError("Failed to load societies. Please refresh the page.");
      }
    };

    loadSocieties();
  }, [fetchSocieties]);

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

    // Validate form fields
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.phone.trim()) {
      setError("Phone number is required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!formData.defaultSocietyId) {
      setError("Please select a society");
      return;
    }

    try {
      console.log("Submitting registration with data:", {
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        globalRole: formData.globalRole,
        defaultSocietyId: formData.defaultSocietyId,
        flatOwnerType: formData.flatOwnerType,
        propertyType: formData.propertyType,
      });

      await signUp(formData.email, formData.password, {
        first_name: formData.firstName.trim(),
        last_name: formData.lastName.trim(),
        phone: formData.phone.trim(),
        global_role: formData.globalRole as
          | "super_admin"
          | "platform_admin"
          | "admin"
          | "secretary"
          | "chairman"
          | "treasurer"
          | "resident"
          | "staff"
          | "security"
          | "other",
        default_society_id: formData.defaultSocietyId,
        flat_owner_type: formData.flatOwnerType as "owner" | "tenant",
        property_type: formData.propertyType as
          | "residential"
          | "commercial"
          | "shop"
          | "office",
      });
      navigate("/");
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.message || "Registration failed. Please try again.");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              First Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="firstName"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your first name"
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Last Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                id="lastName"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="phone"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              id="phone"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter your phone number"
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
            htmlFor="globalRole"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Role
          </label>
          <Select
            value={formData.globalRole}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, globalRole: value }))
            }
          >
            <SelectTrigger className="w-full px-4 py-6 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="platform_admin">Platform Admin</SelectItem>
              <SelectItem value="super_admin">Super Admin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="secretary">Secretary</SelectItem>
              <SelectItem value="chairman">Chairman</SelectItem>
              <SelectItem value="treasurer">Treasurer</SelectItem>
              <SelectItem value="resident">Resident</SelectItem>
              <SelectItem value="staff">Staff</SelectItem>
              <SelectItem value="security">Security</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="defaultSocietyId"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Society {societies.length > 0 && `(${societies.length} available)`}
          </label>
          <Select
            value={formData.defaultSocietyId}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, defaultSocietyId: value }))
            }
            disabled={societiesLoading}
          >
            <SelectTrigger className="w-full px-4 py-6 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent">
              <SelectValue
                placeholder={
                  societiesLoading ? "Loading societies..." : "Select a society"
                }
              />
            </SelectTrigger>
            <SelectContent>
              {societies.map((society) => (
                <SelectItem key={society.id} value={society.id}>
                  {society.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="flatOwnerType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Flat Owner Type
            </label>
            <Select
              value={formData.flatOwnerType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, flatOwnerType: value }))
              }
            >
              <SelectTrigger className="w-full px-4 py-6 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent">
                <SelectValue placeholder="Select flat owner type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="owner">Owner</SelectItem>
                <SelectItem value="tenant">Tenant</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label
              htmlFor="propertyType"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Property Type
            </label>
            <Select
              value={formData.propertyType}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, propertyType: value }))
              }
            >
              <SelectTrigger className="w-full px-4 py-6 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent">
                <SelectValue placeholder="Select property type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="residential">Residential</SelectItem>
                <SelectItem value="commercial">Commercial</SelectItem>
                <SelectItem value="shop">Shop</SelectItem>
                <SelectItem value="office">Office</SelectItem>
              </SelectContent>
            </Select>
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
