import { Routes, Route } from "react-router-dom";
import Index from "../pages";
import Company from "../pages/company";
import EmployeeCreate from "../pages/employees/create";
import ListEmployee from "../pages/employees/list";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/empresa" element={<Company />} />
      <Route path="/criar_colaborador" element={<EmployeeCreate />} />
      <Route path="/listar_colaboradores" element={<ListEmployee />} />
    </Routes>
  );
}
