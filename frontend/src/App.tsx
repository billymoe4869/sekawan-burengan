import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import UMKM from "./pages/Umkm";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerProducts from "./pages/OwnerProducts";
import CreateUMKM from "./pages/CreateUMKM";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import ManageCategories from "./pages/ManageCategories";
import Layout from "./components/Layout";
import UMKMDetail from "./pages/DetailUMKM";
import Product from "./pages/Product";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* layout */}
        <Route path="/" element={<Layout />}>
          {/* publik */}
          <Route path="/" element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="umkm" element={<UMKM />} />
          <Route path="product" element={<Product />} />
          <Route path="products" element={<Product />} />
          <Route path="umkm/:id" element={<UMKMDetail />} />

          {/* untuk owner (wajib login & role Owner) */}
          <Route
            path="owner/dashboard"
            element={
              <ProtectedRoute allowRoles={["Owner"]}>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/create-umkm"
            element={
              <ProtectedRoute allowRoles={["Owner"]}>
                <CreateUMKM />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/products"
            element={
              <ProtectedRoute allowRoles={["Owner"]}>
                <OwnerProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="owner/products/add"
            element={<Navigate to="/owner/products" replace />}
          />

          {/* untuk admin (wajib login & role Admin) */}
          <Route
            path="admin/dashboard"
            element={
              <ProtectedRoute allowRoles={["Admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/categories"
            element={
              <ProtectedRoute allowRoles={["Admin"]}>
                <ManageCategories />
              </ProtectedRoute>
            }
          />

          {/* untuk page not found */}
          <Route path="*" element={<h2>Page Not Found. 404</h2>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
