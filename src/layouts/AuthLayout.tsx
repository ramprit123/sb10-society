import React from "react";
import { Outlet } from "react-router-dom";
import { Building2 } from "lucide-react";

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Building2 className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">SocietyHub</h1>
          <p className="text-gray-600 mt-2">
            Multi-Tenant Society Management Platform
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm p-8">
          <Outlet />
        </div>

        <div className="text-center mt-6 text-sm text-gray-500">
          © 2024 SocietyHub. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
