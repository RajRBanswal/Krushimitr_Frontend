import React from 'react'
const AllCategories  = React.lazy(() => import('./dashboard_content/AllCategories'));
const All_Users = React.lazy(() => import('./dashboard_content/All_Users'));
const Dashboard = React.lazy(() => import('./dashboard_content/Dashboard'));
const AllServices = React.lazy(() => import('./dashboard_content/AllServices'));


const allRoutes = [
    { path: "/admin/dashboard", name: "Dashboard", element: Dashboard },
    { path: "/all-services", name: "All-Services", element: AllServices },
    { path: "/all-categories", name: "All-Categories", element: AllCategories },
    { path: "/all-users", name: "All-Users", element: All_Users },
];

export default allRoutes