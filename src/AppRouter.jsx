import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "./Layout/AdminLayout";
import SuperLayout from "./Layout/SuperLayout";
import "./App.css";

import Login from "./Auth/Login";
import PrivateRoute from "./Auth/PrivateRoute";
import SuperRoute from "./Auth/SuperRoute";
import LoginSuper from "./Auth/LoginSuper";

import Home from "./Pages/Admin/Home/Home";
import AddHome from "./Pages/Admin/Home/AddHome";
import EditHome from "./Pages/Admin/Home/EditHome";


import Admins from "./Pages/Admin/Admins/Admins";
import AddAdmins from "./Pages/Admin/Admins/AddAdmins";
import EditAdmins from "./Pages/Admin/Admins/EditAdmins";

import Buses from "./Pages/Admin/Buses/Buses";
import AddBuses from "./Pages/Admin/Buses/AddBuses";
import EditBuses from "./Pages/Admin/Buses/EditBuses"

import Departments from "./Pages/Admin/Departments/Departments";
import AddDepartments from "./Pages/Admin/Departments/AddDepartments";
import EditDepartments from "./Pages/Admin/Departments/EditDepartments";

import Pickuppoints from "./Pages/Admin/Pickuppoints/Pickuppoints";
import AddPickuppoints from "./Pages/Admin/Pickuppoints/AddPickuppoints";
import EditPickuppoints from "./Pages/Admin/Pickuppoints/EditPickuppoints";

import Roles from "./Pages/Admin/Roles/Roles";
import AddRoles from "./Pages/Admin/Roles/AddRoles";
import EditRoles from "./Pages/Admin/Roles/EditRoles";

import Routes from "./Pages/Admin/Routes/Routes";
import AddRoutes from "./Pages/Admin/Routes/AddRoutes";
import EditRoutes from "./Pages/Admin/Routes/EditRoutes";

import Drivers from "./Pages/Admin/Drivers/Drivers";
import AddDrivers from "./Pages/Admin/Drivers/AddDrivers";
import EditDrivers from "./Pages/Admin/Drivers/EditDrivers";

import Codrivers from "./Pages/Admin/Codrivers/Codrivers";
import AddCodrivers from "./Pages/Admin/Codrivers/AddCodrivers";
import EditCodrivers from "./Pages/Admin/Codrivers/EditCodrivers";


import Students from "./Pages/Admin/Students/Students";
import AddStudents from "./Pages/Admin/Students/AddStudents";
import EditStudents from "./Pages/Admin/Students/EditStudents";

import Parents from "./Pages/Admin/Parents/Parents";
import AddParents from "./Pages/Admin/Parents/AddParents";
import EditParents from "./Pages/Admin/Parents/EditParents";

import Rides from "./Pages/Admin/Rides/Rides";
import AddRides from "./Pages/Admin/Rides/AddRides";
import EditRides from "./Pages/Admin/Rides/EditRides";

import Profile from "./Pages/Admin/Profile";

// super
import BusTypes from "./Pages/SuperAdmin/BusTypes/BusTypes";
import AddBusTypes from "./Pages/SuperAdmin/BusTypes/AddBusTypes";
import EditBusTypes from "./Pages/SuperAdmin/BusTypes/EditBusTypes";

import Organization from "./Pages/SuperAdmin/Organization/Organization";
import AddOrganization from "./Pages/SuperAdmin/Organization/AddOrganization";
import EditOrganization from "./Pages/SuperAdmin/Organization/EditOrganization";

import OrganizationTypes from "./Pages/SuperAdmin/OrganizationTypes/OrganizationTypes";
import AddOrganizationTypes from "./Pages/SuperAdmin/OrganizationTypes/AddOrganizationTypes";
import EditOrganizationTypes from "./Pages/SuperAdmin/OrganizationTypes/EditOrganizationTypes";

import Plans from "./Pages/SuperAdmin/Plans/Plans";
import AddPlans from "./Pages/SuperAdmin/Plans/AddPlans";
import EditPlans from "./Pages/SuperAdmin/Plans/EditPlans";

import Promocodes from "./Pages/SuperAdmin/Promocodes/Promocodes";
import AddPromocodes from "./Pages/SuperAdmin/Promocodes/AddPromocodes";
import EditPromocodes from "./Pages/SuperAdmin/Promocodes/EditPromocodes";
import SuperProfile from "./Pages/SuperAdmin/Profile";
const router = createBrowserRouter([ {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/loginsuper",
    element: <LoginSuper />,
  },
  {
    path: "/admin/*",
    element: (
      <PrivateRoute>
        <AdminLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: "home/add", element: <AddHome /> },
      { path: "home/edit/:id", element: <EditHome /> },

      { path: "admins", element: <Admins /> },
      { path: "admins/add", element: <AddAdmins /> },
      { path: "admins/edit/:id", element: <EditAdmins /> },

      { path: "buses", element: <Buses /> },
      { path: "buses/add", element: <AddBuses /> },
      { path: "buses/edit/:id", element: <EditBuses /> },

      { path: "departments", element: <Departments /> },
      { path: "departments/add", element: <AddDepartments /> },
      { path: "departments/edit/:id", element: <EditDepartments /> },

      { path: "pickuppoints", element: <Pickuppoints /> },
      { path: "pickuppoints/add", element: <AddPickuppoints /> },
      { path: "pickuppoints/edit/:id", element: <EditPickuppoints /> },

      { path: "roles", element: <Roles /> },
      { path: "roles/add", element: <AddRoles /> },
      { path: "roles/edit/:id", element: <EditRoles /> },

      { path: "roles", element: <Roles /> },
      { path: "roles/add", element: <AddRoles /> },
      { path: "roles/edit/:id", element: <EditRoles /> },

      { path: "routes", element: <Routes /> },
      { path: "routes/add", element: <AddRoutes /> },
      { path: "routes/edit/:id", element: <EditRoutes /> },

      { path: "drivers", element: <Drivers /> },
      { path: "drivers/add", element: <AddDrivers /> },
      { path: "drivers/edit/:id", element: <EditDrivers /> },

      { path: "codrivers", element: <Codrivers /> },
      { path: "codrivers/add", element: <AddCodrivers /> },
      { path: "codrivers/edit/:id", element: <EditCodrivers /> },

      { path: "students", element: <Students /> },
      { path: "students/add", element: <AddStudents /> },
      { path: "students/edit/:id", element: <EditStudents /> },

      { path: "parents", element: <Parents /> },
      { path: "parents/add", element: <AddParents /> },
      { path: "parents/edit/:id", element: <EditParents /> },

      { path: "rides", element: <Rides /> },
      { path: "rides/add", element: <AddRides /> },
      { path: "rides/edit/:id", element: <EditRides /> },

      
      { path: "profile", element: <Profile /> },
    ],
  },
  
  {
    path: "/super",
    element: (
    <SuperRoute>
      <SuperLayout />
    </SuperRoute>
  ),
  children: [
    
    { index: true, element: <BusTypes /> }, 
    { path: "bustypes", element: <BusTypes /> }, 
    { path: "bustypes/add", element: <BusTypes /> },
    { path: "bustypes/edit/:id", element: <BusTypes /> },
    
    { path: "organization", element: <Organization /> },
    { path: "organization/add", element: <AddOrganization /> },
    { path: "organization/edit/:id", element: <EditOrganization /> },
    
    { path: "promocodes", element: <Promocodes /> },
    { path: "promocodes/add", element: <AddPromocodes /> },
    { path: "promocodes/edit/:id", element: <EditPromocodes /> },
    
    { path: "plans", element: <Plans /> },
    { path: "plans/add", element: <AddPlans /> },
    { path: "plans/edit/:id", element: <EditPlans /> },
    
    { path: "typesorganization", element: <OrganizationTypes /> },
    { path: "typesorganization/add", element: <AddOrganizationTypes /> },
    { path: "typesorganization/edit/:id", element: <EditOrganizationTypes /> },
    
    { path: "profile", element: <SuperProfile /> },
    
  ],
},
]);

export default router;
