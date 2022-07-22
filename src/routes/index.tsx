import { Routes, Route } from "react-router-dom";
import Index from "../pages";
import AdictionalItems from "../pages/adictional_items";
import IndexCategories from "../pages/categories";
import Clients from "../pages/clients";
import Company from "../pages/company";
import Coupons from "../pages/coupons";
import IndexEmployee from "../pages/employees";
import PartitionSale from "../pages/partition_sale";
import PayForms from "../pages/pay_form";
import PDV from "../pages/pdv/pdv";
import IndexProducts from "../pages/products";
import IndexPromotions from "../pages/promotions";
import IndexRevenues from "../pages/revenues";
import IndexSubCategories from "../pages/sub_categories";

export default function Routing() {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/empresa" element={<Company />} />
      <Route path="/colaboradores" element={<IndexEmployee />} />
      <Route path="/clientes" element={<Clients />} />
      <Route path="/categorias" element={<IndexCategories />} />
      <Route path="/sub_categorias" element={<IndexSubCategories />} />
      <Route path="/produtos" element={<IndexProducts />} />
      <Route path="/venda_fracionada" element={<PartitionSale />} />
      <Route path="/itens_adicionais" element={<AdictionalItems />} />
      <Route path="/promocoes" element={<IndexPromotions />} />
      <Route path="/cupons" element={<Coupons />} />
      <Route path="/formas_pagamento" element={<PayForms />} />
      <Route path="/pdv" element={<PDV />} />
      <Route path="/receitas" element={<IndexRevenues />} />
    </Routes>
  );
}
