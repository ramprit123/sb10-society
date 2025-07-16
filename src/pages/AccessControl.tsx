import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CheckCircle,
  Edit,
  Eye,
  Key,
  Lock,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Shield,
  Trash2,
  Unlock,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";

// Mock data for access control
const accessLogs = [
  {
    id: 1,
    user: "John Doe",
    action: "Entry",
    location: "Main Gate",
    time: "2025-07-16T09:30:00",
    method: "Access Card",
    status: "success",
    flatNumber: "A-101",
  },
  {
    id: 2,
    user: "Jane Smith",
    action: "Exit",
    location: "Parking Gate",
    time: "2025-07-16T08:45:00",
    method: "QR Code",
    status: "success",
    flatNumber: "B-205",
  },
  {
    id: 3,
    user: "Unknown",
    action: "Entry",
    location: "Main Gate",
    time: "2025-07-16T10:15:00",
    method: "Manual Override",
    status: "failed",
    flatNumber: "N/A",
  },
];

const accessDevices = [
  {
    id: 1,
    name: "Main Gate Scanner",
    type: "Card Reader",
    location: "Main Entrance",
    status: "online",
    lastSeen: "2025-07-16T10:30:00",
    battery: 85,
  },
  {
    id: 2,
    name: "Parking Gate",
    type: "QR Scanner",
    location: "Parking Area",
    status: "online",
    lastSeen: "2025-07-16T10:28:00",
    battery: 92,
  },
  {
    id: 3,
    name: "Emergency Exit",
    type: "Keypad",
    location: "Emergency Exit",
    status: "offline",
    lastSeen: "2025-07-16T08:15:00",
    battery: 23,
  },
];

const accessPermissions = [
  {
    id: 1,
    resident: "John Doe",
    flatNumber: "A-101",
    cardNumber: "1234567890",
    permissions: ["main_gate", "parking", "gym", "pool"],
    status: "active",
    validUntil: "2025-12-31",
  },
  {
    id: 2,
    resident: "Jane Smith",
    flatNumber: "B-205",
    cardNumber: "0987654321",
    permissions: ["main_gate", "parking"],
    status: "active",
    validUntil: "2025-12-31",
  },
  {
    id: 3,
    resident: "Mike Johnson",
    flatNumber: "C-302",
    cardNumber: "5555666677",
    permissions: ["main_gate"],
    status: "suspended",
    validUntil: "2025-12-31",
  },
];

const AccessControl: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedDevice, setSelectedDevice] = useState<any>(null);
  const [isPermissionDialogOpen, setIsPermissionDialogOpen] = useState(false);
  const [isDeviceDialogOpen, setIsDeviceDialogOpen] = useState(false);

  const filteredLogs = accessLogs.filter((log) => {
    const matchesSearch =
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.flatNumber.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "all" || log.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const stats = {
    totalAccess: accessLogs.length,
    successfulAccess: accessLogs.filter((log) => log.status === "success")
      .length,
    failedAccess: accessLogs.filter((log) => log.status === "failed").length,
    onlineDevices: accessDevices.filter((device) => device.status === "online")
      .length,
    totalDevices: accessDevices.length,
    activePermissions: accessPermissions.filter((p) => p.status === "active")
      .length,
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Access Control</h1>
          <p className="text-gray-600 mt-1">
            Manage access permissions and monitor entry/exit activities
          </p>
        </div>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <Button onClick={() => setIsDeviceDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Device
          </Button>
          <Button onClick={() => setIsPermissionDialogOpen(true)}>
            <Shield className="h-4 w-4 mr-2" />
            Manage Permissions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Access</CardTitle>
            <Key className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAccess}</div>
            <p className="text-xs text-muted-foreground">Today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Successful</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.successfulAccess}
            </div>
            <p className="text-xs text-muted-foreground">
              {((stats.successfulAccess / stats.totalAccess) * 100).toFixed(1)}%
              success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed Access</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.failedAccess}
            </div>
            <p className="text-xs text-muted-foreground">Security alerts</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Online Devices
            </CardTitle>
            <Settings className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {stats.onlineDevices}/{stats.totalDevices}
            </div>
            <p className="text-xs text-muted-foreground">Active devices</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="logs" className="space-y-4">
        <TabsList>
          <TabsTrigger value="logs">Access Logs</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
        </TabsList>

        {/* Access Logs Tab */}
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <CardTitle>Access Logs</CardTitle>
                <div className="flex gap-2 mt-2 sm:mt-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search logs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-full sm:w-64"
                    />
                  </div>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Method</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.map((log) => (
                      <TableRow key={log.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{log.user}</div>
                            <div className="text-sm text-gray-500">
                              {log.flatNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.action === "Entry" ? "default" : "secondary"
                            }
                          >
                            {log.action}
                          </Badge>
                        </TableCell>
                        <TableCell>{log.location}</TableCell>
                        <TableCell>
                          {new Date(log.time).toLocaleString()}
                        </TableCell>
                        <TableCell>{log.method}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              log.status === "success"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {log.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Shield className="mr-2 h-4 w-4" />
                                Security Report
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {filteredLogs.map((log) => (
                  <Card key={log.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{log.user}</div>
                            <Badge
                              variant={
                                log.action === "Entry" ? "default" : "secondary"
                              }
                            >
                              {log.action}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {log.flatNumber}
                          </div>
                          <div className="text-sm">{log.location}</div>
                          <div className="text-sm text-gray-500">
                            {new Date(log.time).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                log.status === "success"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {log.status}
                            </Badge>
                            <span className="text-sm text-gray-500">
                              {log.method}
                            </span>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Shield className="mr-2 h-4 w-4" />
                              Security Report
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <Card>
            <CardHeader>
              <CardTitle>Access Control Devices</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {accessDevices.map((device) => (
                  <Card key={device.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">{device.name}</div>
                            <Badge
                              variant={
                                device.status === "online"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {device.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {device.type}
                          </div>
                          <div className="text-sm">{device.location}</div>
                          <div className="text-sm text-gray-500">
                            Last seen:{" "}
                            {new Date(device.lastSeen).toLocaleString()}
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm">
                              Battery: {device.battery}%
                            </div>
                            <div
                              className={`h-2 w-16 rounded-full ${
                                device.battery > 50
                                  ? "bg-green-200"
                                  : device.battery > 20
                                  ? "bg-yellow-200"
                                  : "bg-red-200"
                              }`}
                            >
                              <div
                                className={`h-full rounded-full ${
                                  device.battery > 50
                                    ? "bg-green-500"
                                    : device.battery > 20
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                                style={{ width: `${device.battery}%` }}
                              />
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Settings className="mr-2 h-4 w-4" />
                              Configure
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Eye className="mr-2 h-4 w-4" />
                              View Logs
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Remove
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Permissions Tab */}
        <TabsContent value="permissions">
          <Card>
            <CardHeader>
              <CardTitle>Access Permissions</CardTitle>
            </CardHeader>
            <CardContent>
              {/* Desktop Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resident</TableHead>
                      <TableHead>Card Number</TableHead>
                      <TableHead>Permissions</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Valid Until</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {accessPermissions.map((permission) => (
                      <TableRow key={permission.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {permission.resident}
                            </div>
                            <div className="text-sm text-gray-500">
                              {permission.flatNumber}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono">
                          {permission.cardNumber}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {permission.permissions.map((perm) => (
                              <Badge key={perm} variant="outline">
                                {perm.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              permission.status === "active"
                                ? "default"
                                : "destructive"
                            }
                          >
                            {permission.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{permission.validUntil}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              {permission.status === "active" ? (
                                <Lock className="h-4 w-4" />
                              ) : (
                                <Unlock className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="md:hidden space-y-4">
                {accessPermissions.map((permission) => (
                  <Card key={permission.id}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="font-medium">
                              {permission.resident}
                            </div>
                            <Badge
                              variant={
                                permission.status === "active"
                                  ? "default"
                                  : "destructive"
                              }
                            >
                              {permission.status}
                            </Badge>
                          </div>
                          <div className="text-sm text-gray-500">
                            {permission.flatNumber}
                          </div>
                          <div className="text-sm font-mono">
                            {permission.cardNumber}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {permission.permissions.map((perm) => (
                              <Badge key={perm} variant="outline">
                                {perm.replace("_", " ")}
                              </Badge>
                            ))}
                          </div>
                          <div className="text-sm text-gray-500">
                            Valid until: {permission.validUntil}
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button size="sm" variant="outline">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="outline">
                            {permission.status === "active" ? (
                              <Lock className="h-4 w-4" />
                            ) : (
                              <Unlock className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AccessControl;
