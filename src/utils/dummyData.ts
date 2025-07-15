import { createResidents } from "@/services/residentsService";
import { createVehicles } from "@/services/vehiclesService";

// Dummy residents data (without vehicle_number)
const dummyResidents = [
  {
    society_id: "society-1",
    first_name: "Rajesh",
    last_name: "Kumar",
    email: "rajesh.kumar@email.com",
    phone: "+91 98765 43210",
    flat_number: "A-101",
    move_in_date: "2023-01-15",
    status: "active" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43211",
    avatar:
      "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Priya",
    last_name: "Sharma",
    email: "priya.sharma@email.com",
    phone: "+91 98765 43212",
    flat_number: "B-205",
    move_in_date: "2023-03-20",
    status: "active" as const,
    type: "tenant" as const,
    emergency_contact: "+91 98765 43213",
    avatar:
      "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Amit",
    last_name: "Patel",
    email: "amit.patel@email.com",
    phone: "+91 98765 43214",
    flat_number: "C-302",
    move_in_date: "2022-11-10",
    status: "active" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43215",
    avatar:
      "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Sneha",
    last_name: "Gupta",
    email: "sneha.gupta@email.com",
    phone: "+91 98765 43216",
    flat_number: "A-405",
    move_in_date: "2024-01-05",
    status: "pending" as const,
    type: "tenant" as const,
    emergency_contact: "+91 98765 43217",
  },
  {
    society_id: "society-1",
    first_name: "Vikram",
    last_name: "Singh",
    email: "vikram.singh@email.com",
    phone: "+91 98765 43218",
    flat_number: "B-103",
    move_in_date: "2023-08-15",
    status: "inactive" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43219",
    avatar:
      "https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Anita",
    last_name: "Verma",
    email: "anita.verma@email.com",
    phone: "+91 98765 43220",
    flat_number: "C-401",
    move_in_date: "2023-06-12",
    status: "active" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43221",
    avatar:
      "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Suresh",
    last_name: "Reddy",
    email: "suresh.reddy@email.com",
    phone: "+91 98765 43222",
    flat_number: "D-201",
    move_in_date: "2023-09-03",
    status: "active" as const,
    type: "tenant" as const,
    emergency_contact: "+91 98765 43223",
    avatar:
      "https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Kavita",
    last_name: "Joshi",
    email: "kavita.joshi@email.com",
    phone: "+91 98765 43224",
    flat_number: "E-304",
    move_in_date: "2024-02-18",
    status: "pending" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43225",
    avatar:
      "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Manoj",
    last_name: "Agarwal",
    email: "manoj.agarwal@email.com",
    phone: "+91 98765 43226",
    flat_number: "F-105",
    move_in_date: "2023-11-25",
    status: "active" as const,
    type: "tenant" as const,
    emergency_contact: "+91 98765 43227",
    avatar:
      "https://images.pexels.com/photos/1484810/pexels-photo-1484810.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
  {
    society_id: "society-1",
    first_name: "Deepa",
    last_name: "Nair",
    email: "deepa.nair@email.com",
    phone: "+91 98765 43228",
    flat_number: "G-203",
    move_in_date: "2024-03-10",
    status: "active" as const,
    type: "owner" as const,
    emergency_contact: "+91 98765 43229",
    avatar:
      "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150",
  },
];

// Dummy vehicles data - Note: You'll need to update resident_id with actual UUIDs after creating residents
const dummyVehicles = [
  // Rajesh Kumar (A-101) - 2 vehicles
  {
    resident_id: "temp-1", // This will need to be updated with actual resident ID
    vehicle_number: "MH01AB1234",
    vehicle_type: "car" as const,
    model: "Honda City",
    color: "Silver",
    is_primary: true,
    is_active: true,
  },
  {
    resident_id: "temp-1",
    vehicle_number: "MH01AB5678",
    vehicle_type: "bike" as const,
    model: "Royal Enfield",
    color: "Black",
    is_primary: false,
    is_active: true,
  },
  // Priya Sharma (B-205) - 1 vehicle
  {
    resident_id: "temp-2",
    vehicle_number: "MH01CD5678",
    vehicle_type: "scooter" as const,
    model: "Honda Activa",
    color: "Red",
    is_primary: true,
    is_active: true,
  },
  // Amit Patel (C-302) - 1 vehicle
  {
    resident_id: "temp-3",
    vehicle_number: "MH01EF9012",
    vehicle_type: "car" as const,
    model: "Maruti Swift",
    color: "Blue",
    is_primary: true,
    is_active: true,
  },
  // Sneha Gupta (A-405) - 1 vehicle
  {
    resident_id: "temp-4",
    vehicle_number: "MH01GH3456",
    vehicle_type: "scooter" as const,
    model: "TVS Jupiter",
    color: "White",
    is_primary: true,
    is_active: true,
  },
  // Anita Verma (C-401) - 2 vehicles
  {
    resident_id: "temp-6",
    vehicle_number: "MH01IJ7890",
    vehicle_type: "car" as const,
    model: "Hyundai i20",
    color: "White",
    is_primary: true,
    is_active: true,
  },
  {
    resident_id: "temp-6",
    vehicle_number: "MH01IJ7891",
    vehicle_type: "bike" as const,
    model: "Bajaj Pulsar",
    color: "Blue",
    is_primary: false,
    is_active: true,
  },
  // Suresh Reddy (D-201) - 1 vehicle
  {
    resident_id: "temp-7",
    vehicle_number: "MH01KL2468",
    vehicle_type: "car" as const,
    model: "Tata Nexon",
    color: "Black",
    is_primary: true,
    is_active: true,
  },
  // Manoj Agarwal (F-105) - 1 vehicle
  {
    resident_id: "temp-9",
    vehicle_number: "MH01MN1357",
    vehicle_type: "scooter" as const,
    model: "Suzuki Access",
    color: "Grey",
    is_primary: true,
    is_active: true,
  },
  // Deepa Nair (G-203) - 3 vehicles
  {
    resident_id: "temp-10",
    vehicle_number: "MH01OP2468",
    vehicle_type: "car" as const,
    model: "Toyota Innova",
    color: "Silver",
    is_primary: true,
    is_active: true,
  },
  {
    resident_id: "temp-10",
    vehicle_number: "MH01OP2469",
    vehicle_type: "bike" as const,
    model: "Honda CB Shine",
    color: "Red",
    is_primary: false,
    is_active: true,
  },
  {
    resident_id: "temp-10",
    vehicle_number: "MH01OP2470",
    vehicle_type: "bicycle" as const,
    model: "Hero Lectro",
    color: "Green",
    is_primary: false,
    is_active: true,
  },
];

// Function to insert dummy residents and their vehicles
export const insertDummyResidents = async () => {
  try {
    console.log("Inserting dummy residents...");
    const residentsResult = await createResidents(dummyResidents);
    console.log(`Successfully inserted ${residentsResult.length} residents`);

    // Create a mapping of temp IDs to actual resident IDs based on email
    const residentIdMap: { [key: string]: string } = {};
    residentsResult.forEach((resident, index) => {
      residentIdMap[`temp-${index + 1}`] = resident.id;
    });

    // Update vehicle data with actual resident IDs
    const vehiclesWithRealIds = dummyVehicles
      .map((vehicle) => ({
        ...vehicle,
        resident_id: residentIdMap[vehicle.resident_id] || vehicle.resident_id,
      }))
      .filter((vehicle) => vehicle.resident_id.startsWith("temp-") === false);

    if (vehiclesWithRealIds.length > 0) {
      console.log("Inserting dummy vehicles...");
      const vehiclesResult = await createVehicles(vehiclesWithRealIds);
      console.log(`Successfully inserted ${vehiclesResult.length} vehicles`);
    }

    return { residents: residentsResult, vehicles: vehiclesWithRealIds };
  } catch (error) {
    console.error("Error inserting dummy data:", error);
    throw error;
  }
};

// Export the dummy data for use in other places
export { dummyResidents, dummyVehicles };
