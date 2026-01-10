import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from "react-router-dom";
import router from "./AppRouter";
import "leaflet/dist/leaflet.css";

createRoot(document.getElementById('root')).render(
<RouterProvider router={router} />
)


