import { Routes, Route } from "react-router-dom";
import Index from "../pages";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
    </Routes>
  );
}
