"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTenant } from "@/contexts/TenantContext";
import { supabase } from "@/lib/supabase";
import { useUpdateResident, useOwners } from "@/services/residentsService";
import { DEV_UUIDS } from "@/utils/uuidUtils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Calendar,
  Camera,
  Home,
  ImageIcon,
  Mail,
  Phone,
  User,
  UserCheck,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z
  .object({
    first_name: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    last_name: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    flat_number: z.string().min(1, {
      message: "Flat number is required.",
    }),
    move_in_date: z.string().min(1, {
      message: "Move-in date is required.",
    }),
    emergency_contact: z.string().min(10, {
      message: "Emergency contact must be at least 10 characters.",
    }),
    type: z.enum(["owner", "tenant"], {
      message: "Please select a resident type.",
    }),
    status: z.enum(["active", "inactive", "pending"], {
      message: "Please select a status.",
    }),
    resident_category: z.enum(["home", "shop", "office", "other"], {
      message: "Please select a category.",
    }),
    owner_id: z.string().optional(),
    avatar: z.string().optional(),
  })
  .refine(
    (data) => {
      // If type is tenant, owner_id is required
      if (data.type === "tenant" && !data.owner_id) {
        return false;
      }
      return true;
    },
    {
      message: "Owner selection is required for tenants.",
      path: ["owner_id"],
    }
  );

interface EditResidentModalProps {
  isOpen: boolean;
  onClose: () => void;
  resident: any;
}

const EditResidentModal: React.FC<EditResidentModalProps> = ({
  isOpen,
  onClose,
  resident,
}) => {
  const { currentTenant } = useTenant();
  const societyId = currentTenant?.id || DEV_UUIDS.SOCIETY_1;
  const updateResident = useUpdateResident(societyId);
  const { data: owners = [] } = useOwners(societyId);

  const [uploading, setUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(
    resident?.avatar
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      flat_number: "",
      move_in_date: "",
      emergency_contact: "",
      type: "owner",
      status: "active",
      resident_category: "home",
      owner_id: "",
      avatar: "",
    },
  });

  const watchedType = form.watch("type");

  // Update form when resident changes
  useEffect(() => {
    if (resident) {
      form.reset({
        first_name: resident.first_name || "",
        last_name: resident.last_name || "",
        email: resident.email || "",
        phone: resident.phone || "",
        flat_number: resident.flat_number || "",
        move_in_date: resident.move_in_date || "",
        emergency_contact: resident.emergency_contact || "",
        type: resident.type || "owner",
        status: resident.status || "active",
        resident_category: resident.resident_category || "home",
        owner_id: resident.owner_id,
        avatar: resident.avatar || "",
      });
      setAvatarUrl(resident.avatar);
    }
  }, [resident, form]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = event.target.files[0];

      // Validate file type
      const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
      ];
      if (!allowedTypes.includes(file.type)) {
        throw new Error(
          "Please select a valid image file (JPEG, PNG, WebP, or GIF)."
        );
      }

      // Validate file size (5MB limit)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        throw new Error("File size must be less than 5MB.");
      }

      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      // First check if bucket exists
      const { data: buckets, error: bucketsError } =
        await supabase.storage.listBuckets();

      if (bucketsError) {
        throw new Error(
          "Unable to access storage. Please contact administrator."
        );
      }

      const bucketExists = buckets?.some((bucket) => bucket.id === "residents");

      if (!bucketExists) {
        throw new Error(
          "Storage bucket 'residents' not found. Please create it in the Supabase Dashboard first or contact administrator."
        );
      }

      const { error: uploadError } = await supabase.storage
        .from("residents")
        .upload(filePath, file);

      if (uploadError) {
        // Handle specific bucket not found error
        if (
          uploadError.message.includes("Bucket not found") ||
          uploadError.message.includes("bucket does not exist")
        ) {
          throw new Error(
            "Storage bucket not configured. Please create the 'residents' bucket in Supabase Dashboard first."
          );
        }
        if (
          uploadError.message.includes("row-level security") ||
          uploadError.message.includes("policy")
        ) {
          throw new Error(
            "Storage permissions not configured. Please set up storage policies in Supabase Dashboard."
          );
        }
        throw uploadError;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("residents").getPublicUrl(filePath);
      setAvatarUrl(publicUrl);
      form.setValue("avatar", publicUrl);

      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error uploading image"
      );
      // Clear the file input on error
      if (event.target) {
        event.target.value = "";
      }
    } finally {
      setUploading(false);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await updateResident.mutateAsync({
        id: resident.id,
        updates: {
          ...values,
          avatar: avatarUrl,
        },
      });

      toast.success("Resident updated successfully!");
      onClose();
    } catch (error) {
      toast.error("Failed to update resident. Please try again.");
    }
  };

  if (!resident) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Edit Resident
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Avatar Upload - Enhanced Modern UI */}
            <div className="flex flex-col items-center space-y-6 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-200 hover:border-purple-300 transition-all duration-300">
              <div className="relative group">
                <Avatar
                  className="w-32 h-32 border-4 border-white shadow-lg cursor-pointer"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                  tabIndex={0}
                  role="button"
                  aria-label="Upload avatar"
                >
                  <AvatarImage
                    src={avatarUrl}
                    alt="Resident avatar"
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-purple-400 to-purple-600 text-white text-2xl">
                    <User className="h-16 w-16" />
                  </AvatarFallback>
                </Avatar>

                {/* Upload overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <Camera className="h-8 w-8 text-white" />
                </div>
              </div>

              <div className="flex flex-col items-center space-y-3">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploading}
                  className="hidden"
                  style={{ display: "none" }}
                  id="avatar-upload"
                  tabIndex={-1}
                  aria-hidden="true"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  disabled={uploading}
                  className="bg-white hover:bg-purple-50 border-purple-200 hover:border-purple-300 text-purple-700 font-medium px-6 py-3 rounded-xl transition-all duration-300 shadow-sm hover:shadow-md"
                  onClick={() =>
                    document.getElementById("avatar-upload")?.click()
                  }
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600 mr-3"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <ImageIcon className="h-5 w-5 mr-2" />
                      {avatarUrl ? "Change Photo" : "Upload Photo"}
                    </>
                  )}
                </Button>
                <p className="text-xs text-gray-500 text-center">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
            </div>

            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="first_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      First Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter first name"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="last_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Last Name
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter last name"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Email
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          placeholder="Enter email address"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="tel"
                          placeholder="Enter phone number"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="flat_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Flat Number
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Enter flat number"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="move_in_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Move-in Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          type="date"
                          className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                          {...field}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="emergency_contact"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                    Emergency Contact
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        type="tel"
                        placeholder="Enter emergency contact number"
                        className="pl-10 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                        {...field}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Resident Details */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Resident Type
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="owner">Owner</SelectItem>
                        <SelectItem value="tenant">Tenant</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Status
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="resident_category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2 text-gray-700 font-medium">
                      Category
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-purple-500 focus:ring-purple-500">
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="home">Home</SelectItem>
                        <SelectItem value="shop">Shop</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Owner Selection for Tenants */}
            {watchedType === "tenant" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <FormField
                  control={form.control}
                  name="owner_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-blue-800 font-medium">
                        <UserCheck className="h-4 w-4 text-blue-600" />
                        Linked Owner
                        <span className="text-red-500 text-sm">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-blue-300 focus:border-blue-500 focus:ring-blue-500 bg-white">
                            <SelectValue placeholder="Select the owner for this tenant" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {owners.length > 0 ? (
                            owners.map((owner) => (
                              <SelectItem key={owner.id} value={owner.id}>
                                <div className="flex items-center gap-2">
                                  <UserCheck className="h-4 w-4 text-blue-600" />
                                  {owner.first_name} {owner.last_name} -{" "}
                                  {owner.flat_number}
                                </div>
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="" disabled>
                              No owners available
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormDescription className="text-blue-600">
                        Select the owner that this tenant is associated with
                        (Required for tenants)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="px-6 py-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateResident.isPending}
                className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50"
              >
                {updateResident.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Updating...
                  </>
                ) : (
                  "Update Resident"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditResidentModal;
