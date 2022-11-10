import axios from "axios";
import { ToolbarConfig } from "react-rte";

const toolbarConfigs: ToolbarConfig = {
  display: [
    "INLINE_STYLE_BUTTONS",
    "BLOCK_TYPE_BUTTONS",
    "BLOCK_TYPE_DROPDOWN",
  ],
  INLINE_STYLE_BUTTONS: [
    { label: "Negrito", style: "BOLD", className: "custom-css-class" },
    { label: "Itálico", style: "ITALIC" },
    { label: "Sublinhado", style: "UNDERLINE" },
    {
      label: "Tracejado",
      style: "STRIKETHROUGH",
    },
  ],
  BLOCK_TYPE_DROPDOWN: [
    { label: "Normal", style: "unstyled" },
    { label: "Título 1", style: "header-one" },
    { label: "Título 2", style: "header-two" },
    { label: "Título 3", style: "header-three" },
  ],
  BLOCK_TYPE_BUTTONS: [
    { label: "Lista", style: "unordered-list-item" },
    { label: "Numeração", style: "ordered-list-item" },
    { label: "Citação", style: "blockquote" },
  ],
};

const configs = {
  url: "http://localhost:4003",
  pagination: 10,
  defaultIcon: { icon: "AiFillTag", title: "Padrão", category: "default" },
  toastPosition: "bottom-right",
  toolbarConfigs,
};

const api = axios.create({
  baseURL: configs.url,
});

export { configs, api };
