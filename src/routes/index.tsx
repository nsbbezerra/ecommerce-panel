import { Routes, Route } from "react-router-dom";
import Index from "../pages";
import IndexCategories from "../pages/categories";
import Clients from "../pages/clients";
import Company from "../pages/company";
import EmployeeCreate from "../pages/employees/create";
import ListEmployee from "../pages/employees/list";
import IndexProducts from "../pages/products";
import IndexSubCategories from "../pages/sub_categories";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/empresa" element={<Company />} />
      <Route path="/criar_colaborador" element={<EmployeeCreate />} />
      <Route path="/listar_colaboradores" element={<ListEmployee />} />
      <Route path="/clientes" element={<Clients />} />
      <Route path="/categorias" element={<IndexCategories />} />
      <Route path="/sub_categorias" element={<IndexSubCategories />} />
      <Route path="/produtos" element={<IndexProducts />} />
    </Routes>
  );
}
