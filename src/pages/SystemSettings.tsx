import React, { useState } from "react";
import {
  Save,
  RefreshCw,
  Shield,
  Bell,
  Mail,
  Smartphone,
  Database,
  Cloud,
  Lock,
  Key,
  Globe,
  Server,
  Settings,
  AlertTriangle,
  CheckCircle,
  Clock,
  HardDrive,
  Wifi,
  Monitor,
} from "lucide-react";

interface SystemConfig {
  general: {
    siteName: string;
    siteUrl: string;
    timezone: string;
    dateFormat: string;
    currency: string;
    language: string;
  };
  security: {
    passwordMinLength: number;
    passwordRequireSpecialChars: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    twoFactorRequired: boolean;
    ipWhitelist: string[];
  };
  notifications: {
    emailEnabled: boolean;
    smsEnabled: boolean;
    pushEnabled: boolean;
    emailProvider: string;
    smsProvider: string;
  };
  backup: {
    autoBackupEnabled: boolean;
    backupFrequency: string;
    retentionDays: number;
    cloudProvider: string;
  };
  maintenance: {
    maintenanceMode: boolean;
    maintenanceMessage: string;
    allowedIPs: string[];
  };
}

const SystemSettings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "general" | "security" | "notifications" | "backup" | "maintenance"
  >("general");
  const [hasChanges, setHasChanges] = useState(false);

  const [config, setConfig] = useState<SystemConfig>({
    general: {
      siteName: "SocietyHub",
      siteUrl: "https://societyhub.com",
      timezone: "Asia/Kolkata",
      dateFormat: "DD/MM/YYYY",
      currency: "INR",
      language: "en",
    },
    security: {
      passwordMinLength: 8,
      passwordRequireSpecialChars: true,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      twoFactorRequired: false,
      ipWhitelist: ["192.168.1.0/24"],
    },
    notifications: {
      emailEnabled: true,
      smsEnabled: true,
      pushEnabled: false,
      emailProvider: "smtp",
      smsProvider: "twilio",
    },
    backup: {
      autoBackupEnabled: true,
      backupFrequency: "daily",
      retentionDays: 30,
      cloudProvider: "aws",
    },
    maintenance: {
      maintenanceMode: false,
      maintenanceMessage:
        "System is under maintenance. Please try again later.",
      allowedIPs: ["127.0.0.1"],
    },
  });

  const systemStatus = {
    database: { status: "healthy", lastCheck: "2024-02-15T10:30:00" },
    storage: {
      status: "healthy",
      usage: "45%",
      lastCheck: "2024-02-15T10:30:00",
    },
    email: { status: "healthy", lastCheck: "2024-02-15T10:25:00" },
    backup: { status: "warning", lastBackup: "2024-02-14T02:00:00" },
    security: { status: "healthy", lastScan: "2024-02-15T09:00:00" },
  };

  const handleConfigChange = (
    section: keyof SystemConfig,
    field: string,
    value: any
  ) => {
    setConfig((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    // Save configuration logic here
    console.log("Saving configuration:", config);
    setHasChanges(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600";
      case "warning":
        return "text-yellow-600";
      case "error":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertTriangle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600 mt-1">
            Configure system-wide settings and preferences
          </p>
        </div>
        <div className="flex space-x-3 mt-4 sm:mt-0">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <RefreshCw className="h-5 w-5 mr-2" />
            Reset
          </button>
          <button
            onClick={handleSave}
            disabled={!hasChanges}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save className="h-5 w-5 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* System Status Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          System Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="flex items-center space-x-3">
            <Database className="h-8 w-8 text-blue-500" />
            <div>
              <div className="flex items-center">
                {getStatusIcon(systemStatus.database.status)}
                <span
                  className={`ml-2 font-medium ${getStatusColor(
                    systemStatus.database.status
                  )}`}
                >
                  Database
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Last check:{" "}
                {new Date(systemStatus.database.lastCheck).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <HardDrive className="h-8 w-8 text-green-500" />
            <div>
              <div className="flex items-center">
                {getStatusIcon(systemStatus.storage.status)}
                <span
                  className={`ml-2 font-medium ${getStatusColor(
                    systemStatus.storage.status
                  )}`}
                >
                  Storage
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Usage: {systemStatus.storage.usage}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Mail className="h-8 w-8 text-purple-500" />
            <div>
              <div className="flex items-center">
                {getStatusIcon(systemStatus.email.status)}
                <span
                  className={`ml-2 font-medium ${getStatusColor(
                    systemStatus.email.status
                  )}`}
                >
                  Email
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Last check:{" "}
                {new Date(systemStatus.email.lastCheck).toLocaleTimeString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Cloud className="h-8 w-8 text-orange-500" />
            <div>
              <div className="flex items-center">
                {getStatusIcon(systemStatus.backup.status)}
                <span
                  className={`ml-2 font-medium ${getStatusColor(
                    systemStatus.backup.status
                  )}`}
                >
                  Backup
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Last:{" "}
                {new Date(systemStatus.backup.lastBackup).toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Shield className="h-8 w-8 text-red-500" />
            <div>
              <div className="flex items-center">
                {getStatusIcon(systemStatus.security.status)}
                <span
                  className={`ml-2 font-medium ${getStatusColor(
                    systemStatus.security.status
                  )}`}
                >
                  Security
                </span>
              </div>
              <div className="text-xs text-gray-500">
                Last scan:{" "}
                {new Date(systemStatus.security.lastScan).toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab("general")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "general"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Settings className="h-4 w-4 inline mr-2" />
              General
            </button>
            <button
              onClick={() => setActiveTab("security")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "security"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Shield className="h-4 w-4 inline mr-2" />
              Security
            </button>
            <button
              onClick={() => setActiveTab("notifications")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notifications"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Bell className="h-4 w-4 inline mr-2" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("backup")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "backup"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Cloud className="h-4 w-4 inline mr-2" />
              Backup
            </button>
            <button
              onClick={() => setActiveTab("maintenance")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "maintenance"
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              <Monitor className="h-4 w-4 inline mr-2" />
              Maintenance
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === "general" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site Name
                  </label>
                  <input
                    type="text"
                    value={config.general.siteName}
                    onChange={(e) =>
                      handleConfigChange("general", "siteName", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Site URL
                  </label>
                  <input
                    type="url"
                    value={config.general.siteUrl}
                    onChange={(e) =>
                      handleConfigChange("general", "siteUrl", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Timezone
                  </label>
                  <select
                    value={config.general.timezone}
                    onChange={(e) =>
                      handleConfigChange("general", "timezone", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="Asia/Kolkata">Asia/Kolkata</option>
                    <option value="America/New_York">America/New_York</option>
                    <option value="Europe/London">Europe/London</option>
                    <option value="Asia/Tokyo">Asia/Tokyo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={config.general.dateFormat}
                    onChange={(e) =>
                      handleConfigChange(
                        "general",
                        "dateFormat",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={config.general.currency}
                    onChange={(e) =>
                      handleConfigChange("general", "currency", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="INR">INR (₹)</option>
                    <option value="USD">USD ($)</option>
                    <option value="EUR">EUR (€)</option>
                    <option value="GBP">GBP (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={config.general.language}
                    onChange={(e) =>
                      handleConfigChange("general", "language", e.target.value)
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Password Length
                  </label>
                  <input
                    type="number"
                    min="6"
                    max="20"
                    value={config.security.passwordMinLength}
                    onChange={(e) =>
                      handleConfigChange(
                        "security",
                        "passwordMinLength",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Timeout (minutes)
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="120"
                    value={config.security.sessionTimeout}
                    onChange={(e) =>
                      handleConfigChange(
                        "security",
                        "sessionTimeout",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Login Attempts
                  </label>
                  <input
                    type="number"
                    min="3"
                    max="10"
                    value={config.security.maxLoginAttempts}
                    onChange={(e) =>
                      handleConfigChange(
                        "security",
                        "maxLoginAttempts",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.passwordRequireSpecialChars}
                    onChange={(e) =>
                      handleConfigChange(
                        "security",
                        "passwordRequireSpecialChars",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Require special characters in passwords
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={config.security.twoFactorRequired}
                    onChange={(e) =>
                      handleConfigChange(
                        "security",
                        "twoFactorRequired",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <label className="ml-2 text-sm text-gray-700">
                    Require two-factor authentication for all users
                  </label>
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Email Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Send notifications via email
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.emailEnabled}
                    onChange={(e) =>
                      handleConfigChange(
                        "notifications",
                        "emailEnabled",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      SMS Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Send notifications via SMS
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.smsEnabled}
                    onChange={(e) =>
                      handleConfigChange(
                        "notifications",
                        "smsEnabled",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Push Notifications
                    </h4>
                    <p className="text-sm text-gray-500">
                      Send push notifications to mobile apps
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={config.notifications.pushEnabled}
                    onChange={(e) =>
                      handleConfigChange(
                        "notifications",
                        "pushEnabled",
                        e.target.checked
                      )
                    }
                    className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Provider
                  </label>
                  <select
                    value={config.notifications.emailProvider}
                    onChange={(e) =>
                      handleConfigChange(
                        "notifications",
                        "emailProvider",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                    <option value="ses">Amazon SES</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SMS Provider
                  </label>
                  <select
                    value={config.notifications.smsProvider}
                    onChange={(e) =>
                      handleConfigChange(
                        "notifications",
                        "smsProvider",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="nexmo">Nexmo</option>
                    <option value="aws_sns">AWS SNS</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "backup" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Automatic Backups
                  </h4>
                  <p className="text-sm text-gray-500">
                    Enable automatic system backups
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.backup.autoBackupEnabled}
                  onChange={(e) =>
                    handleConfigChange(
                      "backup",
                      "autoBackupEnabled",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Backup Frequency
                  </label>
                  <select
                    value={config.backup.backupFrequency}
                    onChange={(e) =>
                      handleConfigChange(
                        "backup",
                        "backupFrequency",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Retention Days
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="365"
                    value={config.backup.retentionDays}
                    onChange={(e) =>
                      handleConfigChange(
                        "backup",
                        "retentionDays",
                        parseInt(e.target.value)
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cloud Provider
                  </label>
                  <select
                    value={config.backup.cloudProvider}
                    onChange={(e) =>
                      handleConfigChange(
                        "backup",
                        "cloudProvider",
                        e.target.value
                      )
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="aws">Amazon S3</option>
                    <option value="gcp">Google Cloud</option>
                    <option value="azure">Microsoft Azure</option>
                    <option value="local">Local Storage</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {activeTab === "maintenance" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Maintenance Mode
                  </h4>
                  <p className="text-sm text-gray-500">
                    Enable maintenance mode to restrict access
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={config.maintenance.maintenanceMode}
                  onChange={(e) =>
                    handleConfigChange(
                      "maintenance",
                      "maintenanceMode",
                      e.target.checked
                    )
                  }
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maintenance Message
                </label>
                <textarea
                  value={config.maintenance.maintenanceMessage}
                  onChange={(e) =>
                    handleConfigChange(
                      "maintenance",
                      "maintenanceMessage",
                      e.target.value
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Message to display during maintenance"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allowed IP Addresses
                </label>
                <textarea
                  value={config.maintenance.allowedIPs.join("\n")}
                  onChange={(e) =>
                    handleConfigChange(
                      "maintenance",
                      "allowedIPs",
                      e.target.value.split("\n").filter((ip) => ip.trim())
                    )
                  }
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:none focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter IP addresses (one per line)"
                />
                <p className="text-xs text-gray-500 mt-1">
                  IP addresses that can access the system during maintenance
                  mode
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasChanges && (
        <div className="fixed bottom-6 right-6 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2" />
            <span>You have unsaved changes</span>
            <button
              onClick={handleSave}
              className="ml-4 bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100"
            >
              Save Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SystemSettings;
