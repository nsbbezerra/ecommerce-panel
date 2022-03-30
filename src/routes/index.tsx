import { Routes, Route } from "react-router-dom";
import Index from "../pages";
import Company from "../pages/company";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/empresa" element={<Company />} />
    </Routes>
  );
}
