import { createBrowserRouter } from "react-router-dom";

import AdminLayout from "./Layout/AdminLayout";
import SuperLayout from "./Layout/SuperLayout";
import "./App.css";

import { Navigate } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import Unauthorized from "./Auth/Unauthorized";

import Login from "./Auth/Login";
import PrivateRoute from "./Auth/PrivateRoute";
import SaveRoute from "./Auth/SaveRoute";
import SuperRoute from "./Auth/SuperRoute";
import LoginSuper from "./Auth/LoginSuper";
import SuperPrivateRoute from "./Auth/SuperPrivateRoute";

import Home from "./Pages/Admin/Home/Home";


import City from "./Pages/Admin/Cities/City";
import AddCity from "./Pages/Admin/Cities/AddCity";
import EditCity from "./Pages/Admin/Cities/EditCity";

import Zone from "./Pages/Admin/Zones/Zone";
import AddZone from "./Pages/Admin/Zones/AddZone";
import EditZone from "./Pages/Admin/Zones/EditZone";

import Admins from "./Pages/Admin/Admins/Admins";
import AddAdmins from "./Pages/Admin/Admins/AddAdmins";
import EditAdmins from "./Pages/Admin/Admins/EditAdmins";

import Buses from "./Pages/Admin/Buses/Buses";
import AddBuses from "./Pages/Admin/Buses/AddBuses";
import EditBuses from "./Pages/Admin/Buses/EditBuses";

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
import ManageRideStudents from "./Pages/Admin/Rides/ManageRideStudents";
import Scheduling from "./Pages/Admin/Rides/Scheduling";

import Profile from "./Pages/Admin/Profile";

import Peyment from "./Pages/Admin/Payments/Payments";
import AddPaymentsa from "./Pages/Admin/Payments/AddPayments";
import Subscribtions from "./Pages/Admin/Subscribtions/Subscribtions";
import Feeinstallments from "./Pages/Admin/Feeinstallments/Feeinstallments";
import Invoices from "./Pages/Admin/Invoices/Invoices";

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

import Paymentmethods from "./Pages/SuperAdmin/Paymentmethods/Paymentmethods";
import AddPaymentmethods from "./Pages/SuperAdmin/Paymentmethods/AddPaymentmethods";
import EditPaymentmethods from "./Pages/SuperAdmin/Paymentmethods/EditPaymentmethods";

import Promocodes from "./Pages/SuperAdmin/Promocodes/Promocodes";
import AddPromocodes from "./Pages/SuperAdmin/Promocodes/AddPromocodes";
import EditPromocodes from "./Pages/SuperAdmin/Promocodes/EditPromocodes";
import SuperProfile from "./Pages/SuperAdmin/Profile";
import LandPage from "./LandPage/LandPage";

import Subscribers from './Pages/SuperAdmin/Subscribers/Subscribers'
import SuperInvoices from './Pages/SuperAdmin/Invoices/Invoices'

import ParentPlans from "./Pages/SuperAdmin/ParentPlans/ParentPlans";
import AddParentPlans from "./Pages/SuperAdmin/ParentPlans/AddParentPlans";
import EditParentPlans from "./Pages/SuperAdmin/ParentPlans/EditParentPlans";

import SuperAddAdmins from "./Pages/SuperAdmin/Admins/AddAdmins";
import SuperAdmins from "./Pages/SuperAdmin/Admins/Admins";
import SuperEditAdmins from "./Pages/SuperAdmin/Admins/EditAdmins";

import SuperRoles from "./Pages/SuperAdmin/Roles/Roles";
import SuperAddRoles from "./Pages/SuperAdmin/Roles/AddRoles";
import SuperEditRoles from "./Pages/SuperAdmin/Roles/EditRoles";

import Installments from './Pages/SuperAdmin/Installments/Installments'

import SuperPayments from "./Pages/SuperAdmin/Payments/Payments";
import Wallet from "./Pages/SuperAdmin/Wallet/Wallet"


const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Navigate to="/landpage" replace />,
  // },
  {
    path: "/",
    element: <LandPage />,
  },
  {
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
      <SaveRoute>
        <AdminLayout />
      </SaveRoute>
    ),
    children: [
      { index: true, element: <Home /> },
  
{
  path: "admins",
  element: (
    <PrivateRoute requiredModule="admins" requiredAction="View">
      <Admins />
    </PrivateRoute>
  ),
},
{
  path: "admins/add",
  element: (
    <PrivateRoute requiredModule="admins" requiredAction="Add">
      <AddAdmins />
    </PrivateRoute>
  ),
},
{
  path: "admins/edit/:id",
  element: (
    <PrivateRoute requiredModule="admins" requiredAction="Edit">
      <EditAdmins />
    </PrivateRoute>
  ),
},

 {
  path: "buses",
  element: (
    <PrivateRoute requiredModule="buses" requiredAction="View">
      <Buses />
    </PrivateRoute>
  ),
},
{
  path: "buses/add",
  element: (
    <PrivateRoute requiredModule="buses" requiredAction="Add">
      <AddBuses />
    </PrivateRoute>
  ),
},
{
  path: "buses/edit/:id",
  element: (
    <PrivateRoute requiredModule="buses" requiredAction="Edit">
      <EditBuses />
    </PrivateRoute>
  ),
},
{
  path: "departments",
  element: (
    <PrivateRoute requiredModule="departments" requiredAction="View">
      <Departments />
    </PrivateRoute>
  ),
},
{
  path: "departments/add",
  element: (
    <PrivateRoute requiredModule="departments" requiredAction="Add">
      <AddDepartments />
    </PrivateRoute>
  ),
},
{
  path: "departments/edit/:id",
  element: (
    <PrivateRoute requiredModule="departments" requiredAction="Edit">
      <EditDepartments />
    </PrivateRoute>
  ),
},



{
  path: "pickuppoints",
  element: (
    <PrivateRoute requiredModule="pickup_points" requiredAction="View">
      <Pickuppoints />
    </PrivateRoute>
  ),
},
{
  path: "pickuppoints/add",
  element: (
    <PrivateRoute requiredModule="pickup_points" requiredAction="Add">
      <AddPickuppoints />
    </PrivateRoute>
  ),
},
{
  path: "pickuppoints/edit/:id",
  element: (
    <PrivateRoute requiredModule="pickup_points" requiredAction="Edit">
      <EditPickuppoints />
    </PrivateRoute>
  ),
},


{
  path: "roles",
  element: (
    <PrivateRoute requiredModule="roles" requiredAction="View">
      <Roles />
    </PrivateRoute>
  ),
},
{
  path: "roles/add",
  element: (
    <PrivateRoute requiredModule="roles" requiredAction="Add">
      <AddRoles />
    </PrivateRoute>
  ),
},
{
  path: "roles/edit/:id",
  element: (
    <PrivateRoute requiredModule="roles" requiredAction="Edit">
      <EditRoles />
    </PrivateRoute>
  ),
},
    
  
{
  path: "routes",
  element: (
    <PrivateRoute requiredModule="routes" requiredAction="View">
      <Routes />
    </PrivateRoute>
  ),
},
{
  path: "routes/add",
  element: (
    <PrivateRoute requiredModule="routes" requiredAction="Add">
      <AddRoutes />
    </PrivateRoute>
  ),
},
{
  path: "routes/edit/:id",
  element: (
    <PrivateRoute requiredModule="routes" requiredAction="Edit">
      <EditRoutes />
    </PrivateRoute>
  ),
},
 

{
  path: "drivers",
  element: (
    <PrivateRoute requiredModule="drivers" requiredAction="View">
      <Drivers />
    </PrivateRoute>
  ),
},
{
  path: "drivers/add",
  element: (
    <PrivateRoute requiredModule="drivers" requiredAction="Add">
      <AddDrivers />
    </PrivateRoute>
  ),
},
{
  path: "drivers/edit/:id",
  element: (
    <PrivateRoute requiredModule="drivers" requiredAction="Edit">
      <EditDrivers />
    </PrivateRoute>
  ),
},



{
  path: "codrivers",
  element: (
    <PrivateRoute requiredModule="codrivers" requiredAction="View">
      <Codrivers />
    </PrivateRoute>
  ),
},
{
  path: "codrivers/add",
  element: (
    <PrivateRoute requiredModule="codrivers" requiredAction="Add">
      <AddCodrivers />
    </PrivateRoute>
  ),
},
{
  path: "codrivers/edit/:id",
  element: (
    <PrivateRoute requiredModule="codrivers" requiredAction="Edit">
      <EditCodrivers />
    </PrivateRoute>
  ),
},



{
  path: "students",
  element: (
    <PrivateRoute requiredModule="students" requiredAction="View">
      <Students />
    </PrivateRoute>
  ),
},
{
  path: "students/add",
  element: (
    <PrivateRoute requiredModule="students" requiredAction="Add">
      <AddStudents />
    </PrivateRoute>
  ),
},
{
  path: "students/edit/:id",
  element: (
    <PrivateRoute requiredModule="students" requiredAction="Edit">
      <EditStudents />
    </PrivateRoute>
  ),
},

{
  path: "city",
  element: (
    <PrivateRoute requiredModule="City" requiredAction="View">
      <City />
    </PrivateRoute>
  ),
},
{
  path: "city/add",
  element: (
    <PrivateRoute requiredModule="City" requiredAction="Add">
      <AddCity />
    </PrivateRoute>
  ),
},
{
  path: "city/edit/:id",
  element: (
    <PrivateRoute requiredModule="City" requiredAction="Edit">
      <EditCity />
    </PrivateRoute>
  ),
},
   


{
  path: "zone",
  element: (
    <PrivateRoute requiredModule="Zone" requiredAction="View">
      <Zone />
    </PrivateRoute>
  ),
},
{
  path: "zone/add",
  element: (
    <PrivateRoute requiredModule="Zone" requiredAction="Add">
      <AddZone />
    </PrivateRoute>
  ),
},
{
  path: "zone/edit/:id",
  element: (
    <PrivateRoute requiredModule="Zone" requiredAction="Edit">
      <EditZone />
    </PrivateRoute>
  ),
},

{
  path: "rides",
  element: (
    <PrivateRoute requiredModule="rides" requiredAction="View">
      <Rides />
    </PrivateRoute>
  ),
},
{
  path: "rides/add",
  element: (
    <PrivateRoute requiredModule="rides" requiredAction="Add">
      <AddRides />
    </PrivateRoute>
  ),
},

{
  path: "rides/edit/:id",
  element: (
    <PrivateRoute requiredModule="rides" requiredAction="Edit">
      <EditRides />
    </PrivateRoute>
  ),
},


{
  path: "rides/scheduling/ManageRideStudents/:id",
  element: (
    <PrivateRoute requiredModule="rides" requiredAction="View">
      <ManageRideStudents />
    </PrivateRoute>
  ),
},


{
  path: "rides/scheduling",
  element: (
    <PrivateRoute requiredModule="rides" requiredAction="View">
      <Scheduling />
    </PrivateRoute>
  ),
},

     
{
  path: "profile",
  element: (
    <PrivateRoute requiredModule="profile" requiredAction="View">
      <Profile />
    </PrivateRoute>
  ),
},


{
  path: "peyment",
  element: (
    <PrivateRoute requiredModule="payments" requiredAction="View">
      <Peyment />
    </PrivateRoute>
  ),
},
{
  path: "peyment/add",
  element: (
    <PrivateRoute requiredModule="payments" requiredAction="Add">
      <AddPaymentsa />
    </PrivateRoute>
  ),
},

{
  path: "feeinstallments",
  element: (
    <PrivateRoute requiredModule="feeinstallments" requiredAction="View">
      <Feeinstallments />
    </PrivateRoute>
  ),
},

{
  path: "subscribtions",
  element: (
    <PrivateRoute requiredModule="Subscription" requiredAction="View">
      <Subscribtions />
    </PrivateRoute>
  ),
},


{
  path: "invoices",
  element: (
    <PrivateRoute requiredModule="invoices" requiredAction="View">
      <Invoices />
    </PrivateRoute>
  ),
},

      { path: "unauthorized", element: <Unauthorized /> },
     

      // { path: "parents", element: <Parents /> },
      // { path: "parents/add", element: <AddParents /> },
      // { path: "parents/edit/:id", element: <EditParents /> },
      { path: "*", element: <ErrorPage /> },
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
      { index: true, element: <Home /> },

      {
  path: "bustypes",
  element: (
    <SuperPrivateRoute requiredModule="bustypes" requiredAction="view">
      <BusTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "bustypes/add",
  element: (
    <SuperPrivateRoute requiredModule="bustypes" requiredAction="create">
      <AddBusTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "bustypes/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="bustypes" requiredAction="update">
      <EditBusTypes />
    </SuperPrivateRoute>
  ),
},
        
{
  path: "parentplans",
  element: (
    <SuperPrivateRoute requiredModule="parentplans" requiredAction="view">
      <BusTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "parentplans/add",
  element: (
    <SuperPrivateRoute requiredModule="parentplans" requiredAction="create">
      <AddBusTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "parentplans/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="parentplans" requiredAction="update">
      <EditBusTypes />
    </SuperPrivateRoute>
  ),
},
      
{
  path: "admins",
  element: (
    <SuperPrivateRoute requiredModule="sub_admins" requiredAction="view">
      <SuperAdmins />
    </SuperPrivateRoute>
  ),
},
      {
  path: "admins/add",
  element: (
    <SuperPrivateRoute requiredModule="sub_admins" requiredAction="create">
      <SuperAddAdmins />
    </SuperPrivateRoute>
  ),
},
      {
  path: "admins/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="sub_admins" requiredAction="update">
      <SuperEditAdmins />
    </SuperPrivateRoute>
  ),
},

{
  path: "roles",
  element: (
    <SuperPrivateRoute requiredModule="super_admin_roles" requiredAction="view">
      <SuperRoles />
    </SuperPrivateRoute>
  ),
},
      {
  path: "roles/add",
  element: (
    <SuperPrivateRoute requiredModule="super_admin_roles" requiredAction="create">
      <SuperAddRoles />
    </SuperPrivateRoute>
  ),
},
      {
  path: "roles/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="super_admin_roles" requiredAction="update">
      <SuperEditRoles />
    </SuperPrivateRoute>
  ),
},


{
  path: "organization",
  element: (
    <SuperPrivateRoute requiredModule="organizations" requiredAction="view">
      <Organization />
    </SuperPrivateRoute>
  ),
},
      {
  path: "organization/add",
  element: (
    <SuperPrivateRoute requiredModule="organizations" requiredAction="create">
      <AddOrganization />
    </SuperPrivateRoute>
  ),
},
      {
  path: "organization/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="organizations" requiredAction="update">
      <EditOrganization />
    </SuperPrivateRoute>
  ),
},



{
  path: "promocodes",
  element: (
    <SuperPrivateRoute requiredModule="promocodes" requiredAction="view">
      <Promocodes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "promocodes/add",
  element: (
    <SuperPrivateRoute requiredModule="promocodes" requiredAction="create">
      <AddPromocodes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "promocodes/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="promocodes" requiredAction="update">
      <EditPromocodes />
    </SuperPrivateRoute>
  ),
},

{
  path: "plans",
  element: (
    <SuperPrivateRoute requiredModule="plans" requiredAction="view">
      <Plans />
    </SuperPrivateRoute>
  ),
},
      {
  path: "plans/add",
  element: (
    <SuperPrivateRoute requiredModule="plans" requiredAction="create">
      <AddPlans />
    </SuperPrivateRoute>
  ),
},
      {
  path: "plans/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="plans" requiredAction="update">
      <EditPlans />
    </SuperPrivateRoute>
  ),
},

{
  path: "paymentmethods",
  element: (
    <SuperPrivateRoute requiredModule="payment_methods" requiredAction="view">
      <Paymentmethods />
    </SuperPrivateRoute>
  ),
},
      {
  path: "paymentmethods/add",
  element: (
    <SuperPrivateRoute requiredModule="payment_methods" requiredAction="create">
      <AddPaymentmethods />
    </SuperPrivateRoute>
  ),
},
      {
  path: "paymentmethods/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="payment_methods" requiredAction="update">
      <EditPaymentmethods />
    </SuperPrivateRoute>
  ),
},


      
      {
  path: "typesorganization",
  element: (
    <SuperPrivateRoute requiredModule="typesorganization" requiredAction="view">
      <OrganizationTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "typesorganization/add",
  element: (
    <SuperPrivateRoute requiredModule="typesorganization" requiredAction="create">
      <AddOrganizationTypes />
    </SuperPrivateRoute>
  ),
},
      {
  path: "typesorganization/edit/:id",
  element: (
    <SuperPrivateRoute requiredModule="typesorganization" requiredAction="update">
      <EditOrganizationTypes />
    </SuperPrivateRoute>
  ),
},
  
         {
  path: "invoice",
  element: (
    <SuperPrivateRoute requiredModule="invoice" requiredAction="view">
      <SuperInvoices />
    </SuperPrivateRoute>
  ),
},
         {
  path: "profile",
  element: (
    <SuperPrivateRoute requiredModule="profile" requiredAction="view">
      <SuperProfile />
    </SuperPrivateRoute>
  ),
},
         {
  path: "subscribers",
  element: (
    <SuperPrivateRoute requiredModule="subscribers" requiredAction="view">
      <Subscribers />
    </SuperPrivateRoute>
  ),
},
         {
  path: "installments",
  element: (
    <SuperPrivateRoute requiredModule="installments" requiredAction="view">
      <Installments />
    </SuperPrivateRoute>
  ),
},
         {
  path: "payments",
  element: (
    <SuperPrivateRoute requiredModule="payments" requiredAction="view">
      <SuperPayments />
    </SuperPrivateRoute>
  ),
},
         {
  path: "wallet",
  element: (
    <SuperPrivateRoute requiredModule="wallet" requiredAction="view">
      <Wallet />
    </SuperPrivateRoute>
  ),
},




            { path: "unauthorized", element: <Unauthorized /> },

            { path: "*", element: <ErrorPage /> },

    ],
  },
]);

export default router;
