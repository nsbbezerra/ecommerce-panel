import { Fragment, useEffect, useMemo, useRef, useState, memo } from "react";
import {
  Box,
  Flex,
  Grid,
  FormControl,
  FormLabel,
  Button,
  Stack,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Text,
  Icon,
  useToast,
  useColorModeValue,
  theme,
  Tooltip,
  Select as ChakraSelect,
  Divider,
  Input as ChakraInput,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
  Switch,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Wrap,
  TagLabel,
  TagCloseButton,
  Tag,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Select from "../../components/Select";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import {
  AiOutlineCalculator,
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import RichTextEditor from "react-rte";
import { dataTrib } from "../../configs/data";
import MaskedInput from "react-input-mask";
import axios from "axios";
import { api, configs } from "../../configs";
import { MdHelpOutline } from "react-icons/md";

import imageHelp from "../../assets/correios.png";
import imageRolo from "../../assets/rolo.png";
import imageEnv from "../../assets/envelope.png";
import Uploader from "../../components/uploader";

type CostValueProps = {
  title: string;
  value: number;
};

type ProductProps = {
  category_id: string;
  sub_category_id: string;
  title: string;
  description: string;
  sku: string;
  barcode: string;
  internal_code: string;
  calc_price: "marge" | "markup";
  cost_value: CostValueProps[];
  profit_percent: number;
  sale_value: number;
  markup_factor: number;
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without"
    | "sizes";
  unit_desc: string;
  inventory: number;
  width: number;
  unity: number;
  details: string;
  tags: TagsProps[];
  thumbnail: string;
  type_sale: string;
  sale_options: string;
  sale_options_category: string;
};

type TaxProps = {
  cfop: string;
  ncm: string;
  icms_rate: number;
  icms_origin: string;
  icms_csosn: string;
  icms_st_rate: number;
  icms_marg_val_agregate: number;
  icms_st_mod_bc: string;
  icms_base_calc: number;
  imcs_st_base_calc: number;
  fcp_rate: number;
  fcp_st_rate: number;
  fcp_ret_rate: number;
  fcp_base_calc: number;
  fcp_st_base_calc: number;
  ipi_cst: string;
  ipi_rate: number;
  ipi_code: string;
  pis_cst: string;
  pis_rate: number;
  pis_base_calc: number;
  cofins_cst: string;
  cofins_rate: number;
  cofins_base_calc: number;
  cest: string;
  isTributed: boolean;
};

type TagsProps = {
  title: string;
};

type CategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  title: string;
  description: string;
};

type SubCategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  category: CategoriesProps;
  title: string;
  description: string;
};

type CategoriesProps = {
  title: string;
};

type WidthProps = {
  id: string;
  width: string;
};

type ShippingProps = {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
};

type AuthProps = {
  id: string;
  token: string;
};

type ImageProps = {
  id: string;
  image: string;
};

type PropsCategoryPartition = {
  id: string;
  name: string;
};

type AdicionalItemsProps = {
  id: string;
  title: string;
};

type SizeProps = {
  id: string;
  description: string;
  inventory: number;
};

const RegisterProduct = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const formRefTax = useRef<FormHandles>(null);
  const formRefSizes = useRef<FormHandles>(null);
  const formRefUpSizes = useRef<FormHandles>(null);

  const [categories, setCategories] = useState<CategoryProps[]>();
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>();
  const [partitionCategories, setPartitionCategories] =
    useState<PropsCategoryPartition[]>();
  const [images, setImages] = useState<ImageProps[]>();
  const [adicionalItems, setAdictionalItems] =
    useState<AdicionalItemsProps[]>();
  const [adicionalItemsId, setAdicionalItemsId] = useState<string>("");
  const [modalSizes, setModalSizes] = useState<boolean>(false);
  const [modalPricImage, setModalPrincImage] = useState<boolean>(false);
  const [sizes, setSizes] = useState<SizeProps[]>();

  const [styleStock, setStyleStock] = useState<string>("");
  const [width, setWidth] = useState<WidthProps[]>([]);
  const [widthNumber, setWidthNumber] = useState<string>("");
  const [text, setText] = useState<any>(RichTextEditor.createEmptyValue());
  const [cost, setCost] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);
  const [sale, setSale] = useState<number>(0);
  const [marge, setMarge] = useState<number>(0);
  const [cardTax, setCardTax] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [comission, setComission] = useState<number>(0);
  const [freightValue, setFreightValue] = useState<number>(0);
  const [originCep, setOriginCep] = useState<string>("");
  const [destinyCep, setDestinyCep] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [format, setFormat] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [widthFreight, setWidthFreight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [diameter, setDiameter] = useState<number>(0);
  const [shipping, setShipping] = useState<ShippingProps[]>();
  const [loadingShipping, setLoadingShipping] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTributed, setIsTributed] = useState<boolean>(true);

  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);

  const [auth, setAuth] = useState<AuthProps>();

  const [productId, setProductId] = useState<string>("");

  const [modalTaxes, setModalTaxes] = useState<boolean>(false);
  const [modalImages, setModalImages] = useState<boolean>(false);
  const [modalAdictional, setModalAdictional] = useState<boolean>(false);
  const [have_adictional, setHave_adictional] = useState<boolean>(false);
  const [modalHelp, setModalHelp] = useState<boolean>(false);

  const [tags, setTags] = useState<string[]>([]);
  const [tagName, setTagName] = useState<string>("");

  async function findCategories(id: string, token: string) {
    try {
      const response = await api.get(`/showCategoriesByProduct/${id}`, {
        headers: { "x-access-authorization": token || "" },
      });
      setCategories(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function findPartitionItems(id: string, token: string) {
    try {
      const response = await api.get(`/showCategoryPartitionSale/${id}`, {
        headers: { "x-access-authorization": token || "" },
      });
      setPartitionCategories(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function findSubCategories(id: string) {
    try {
      const response = await api.get(`/showSubCategoriesProduct/${id}`, {
        headers: { "x-access-authorization": auth?.token || "" },
      });
      setSubCategories(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function findAdicionalItems(id: string, token: string) {
    try {
      const response = await api.get(`/categoryAdictionalItems/${id}`, {
        headers: { "x-access-authorization": token || "" },
      });
      setAdictionalItems(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      findCategories(companyParse.id, userParse.token);
      findPartitionItems(companyParse.id, userParse.token);
      findAdicionalItems(companyParse.id, userParse.token);
      setAuth({ id: companyParse.id, token: userParse.token });
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  function showToast(
    message: string,
    status: "error" | "info" | "warning" | "success" | undefined,
    title: string
  ) {
    toast({
      title: title,
      description: message,
      status: status,
      position: configs.toastPosition as ToastPositionWithLogical,
      duration: 8000,
      isClosable: true,
    });
  }

  function clear() {
    setCost(0);
    setOtherCost(0);
    setFreightValue(0);
    setTax(0);
    setCardTax(0);
    setComission(0);
    setMarge(0);
    setSale(0);
    setWidth([]);
    setWeight("");
    setFormat(0);
    setLength(0);
    setWidthFreight(0);
    setHeight(0);
    setDiameter(0);
    setOriginCep("");
    setDestinyCep("");
    setText(RichTextEditor.createEmptyValue());
    setShipping([]);
    setAdictionalItems([]);
    setAdicionalItemsId("");
    setImages([]);
    setStyleStock("");
    setHave_adictional(false);
    setTags([]);
    setIsTributed(true);
  }

  const handleSubmit: SubmitHandler<ProductProps> = async (data, { reset }) => {
    try {
      let calcValue = {
        cost,
        otherCost,
        freightValue,
        tax,
        cardTax,
        comission,
        marge,
        sale,
      };
      let shippingValues = {
        width: widthFreight,
        height,
        length,
        weight,
        format,
        diameter,
      };

      const scheme = Yup.object().shape({
        category_id: Yup.string().required("Selecione uma categoria"),
        sub_category_id: Yup.string().required("Selecione uma sub-categoria"),
        title: Yup.string().required("Insira um nome para o produto"),
        sku: Yup.string().required("Insira um SKU"),
        barcode: Yup.string().required(
          "Insira um código de barras ou digite: SEM GTIN"
        ),
        unit_desc: Yup.string().required("Selecione uma Unidade de Medida"),
        internal_code: Yup.string().required("Insira um código interno"),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });

      setLoading(true);
      const response = await api.post(
        `/products/${auth?.id}`,
        {
          category_id: data.category_id,
          sub_category_id: data.sub_category_id,
          title: data.title,
          description: data.description,
          sku: data.sku,
          barcode: data.barcode,
          internal_code: data.internal_code,
          calc_price: "marge",
          markup_factor: 0.0,
          cost_value: JSON.stringify(calcValue),
          profit_percent: marge,
          sale_value: sale,
          type_unit: data.type_unit,
          unit_desc: data.unit_desc,
          inventory: data.inventory,
          width: JSON.stringify(width),
          unity: "none",
          details: text.toString("html"),
          tags: JSON.stringify(tags),
          shipping: JSON.stringify(shippingValues),
          type_sale: data.type_sale,
          sale_options: data.sale_options,
          sale_options_category: data.sale_options_category,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      setProductId(response.data.product.id);
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      reset();
      styleStock === "sizes" ? setModalSizes(true) : setModalTaxes(true);
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      }
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.error.message, "error", "Erro");
      }
    }
  };

  const handleWidth = () => {
    if (widthNumber === "") {
      showToast("Digite uma informação", "warning", "Atenção");
      return false;
    }
    let myWidths = width;
    const result = width.find((obj) => obj.id === widthNumber);
    if (result) {
      showToast("Medida já inserida", "warning", "Atenção");
      return false;
    }
    let info: WidthProps = { id: widthNumber, width: widthNumber };
    myWidths?.push(info);
    setWidth(myWidths);
    setWidthNumber("");
  };

  const removeWidth = (id: string) => {
    const result = width.filter((obj) => obj.id !== id);
    setWidth(result);
  };

  const calcSaleVale = () => {
    let costPrices = cost + otherCost + freightValue;
    let calcTaxes = costPrices * (tax / 100);
    let calcCardTax = costPrices * (cardTax / 100);
    let comissionCalc = costPrices * (comission / 100);
    let totalCalcs = costPrices + calcTaxes + calcCardTax + comissionCalc;
    let calcMarge = totalCalcs * (marge / 100);
    let finalCalc = totalCalcs + calcMarge;
    setSale(parseFloat(finalCalc.toFixed(2)));
  };

  async function calcShipping() {
    if (originCep === "") {
      showToast("Insira um CEP de origem", "warning", "Atenção");
      return false;
    }
    if (destinyCep === "") {
      showToast("Insira um CEP de destino", "warning", "Atenção");
      return false;
    }
    if (!format || format === 0) {
      showToast("Selecione um formato de encomenda", "warning", "Atenção");
      return false;
    }
    setLoadingShipping(true);
    try {
      const response = await api.post("/shipping", {
        weight,
        format,
        length,
        width: widthFreight,
        height,
        diameter,
        originCep,
        destinyCep,
      });
      setShipping(response.data);
      setLoadingShipping(false);
    } catch (error) {
      setLoadingShipping(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function storeAddctionalItems() {
    if (productId === "") {
      showToast("Você precisa salvar o produto primeiro", "warning", "Atenção");
      return false;
    }
    if (adicionalItemsId === "") {
      showToast(
        "Selecione uma opção de itens adicionais",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/setAdicionalItems/${productId}`,
        {
          adictional: adicionalItemsId,
          have_adictional,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      handleCloseFinish();
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  const saveTaxes: SubmitHandler<TaxProps> = async (data, { reset }) => {
    if (productId === "") {
      showToast("Você precisa salvar o produto primeiro", "warning", "Atenção");
      return false;
    }

    try {
      setLoadingImage(true);
      const response = await api.post(
        `/storeProductTaxes/${productId}`,
        {
          cfop: data.cfop,
          ncm: data.ncm,
          icms_rate: data.icms_rate,
          icms_origin: data.icms_origin,
          icms_csosn: data.icms_csosn,
          icms_st_rate: data.icms_st_rate,
          icms_marg_val_agregate: data.icms_marg_val_agregate,
          icms_st_mod_bc: data.icms_st_mod_bc,
          icms_base_calc: data.icms_base_calc,
          imcs_st_base_calc: data.imcs_st_base_calc,
          fcp_rate: data.fcp_rate,
          fcp_st_rate: data.fcp_st_rate,
          fcp_ret_rate: data.fcp_ret_rate,
          fcp_base_calc: data.fcp_base_calc,
          fcp_st_base_calc: data.fcp_st_base_calc,
          ipi_cst: data.ipi_cst,
          ipi_rate: data.ipi_rate,
          ipi_code: data.ipi_code,
          pis_cst: data.pis_cst,
          pis_rate: data.pis_rate,
          pis_base_calc: data.pis_base_calc,
          cofins_cst: data.cofins_cst,
          cofins_rate: data.cofins_rate,
          cofins_base_calc: data.cofins_base_calc,
          cest: data.cest,
          isTributed: isTributed,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      setLoadingImage(false);
      showToast(response.data.message, "success", "Sucesso");
      setModalTaxes(false);
      setModalPrincImage(true);
      reset();
    } catch (error) {
      setLoadingImage(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  function handleCloseImages() {
    setModalImages(false);
    setModalAdictional(true);
  }

  function handleCloseFinish() {
    clear();
    setModalAdictional(false);
  }

  const saveSizes: SubmitHandler<SizeProps> = async (data, { reset }) => {
    try {
      const scheme = Yup.object().shape({
        description: Yup.string().required("Insira uma descrição"),
        inventory: Yup.string().required("Insira um valor para o estoque"),
      });
      await scheme.validate(data, {
        abortEarly: false,
      });
      setLoadingImage(true);
      const response = await api.post(
        "/sizes",
        {
          product_id: productId,
          description: data.description,
          inventory: data.inventory,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setSizes(response.data.sizes);
      reset();
      setLoadingImage(false);
    } catch (error) {
      setLoadingImage(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  function handleCloseSizes() {
    setModalSizes(false);
    setModalTaxes(true);
  }

  const updateSizes: SubmitHandler<SizeProps> = async (data, { reset }) => {
    try {
      const scheme = Yup.object().shape({
        description: Yup.string().required("Insira uma descrição"),
        inventory: Yup.string().required("Insira um valor para o estoque"),
      });
      await scheme.validate(data, {
        abortEarly: false,
      });
      setLoadingThumbnail(true);
      const response = await api.put(
        `/sizes/${data.id}`,
        {
          description: data.description,
          inventory: data.inventory,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      const updated = sizes?.map((siz) => {
        if (siz.id === data.id) {
          return {
            ...siz,
            description: data.description,
            inventory: data.inventory,
          };
        }
        return siz;
      });
      setSizes(updated);
      setLoadingThumbnail(false);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingThumbnail(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const handleTag = () => {
    const find = tags?.find((obj) => obj === tagName);
    if (find) {
      showToast("Tag já inserida", "warning", "Atenção");
      return false;
    }

    setTags((prev) => [...prev, `${tagName}`]);
    setTagName("");
  };

  const removeTag = (tag: string) => {
    const result = tags?.filter((obj) => obj !== tag);
    setTags(result);
  };

  const handleCloseImagesPrinc = () => {
    setModalPrincImage(false);
    setModalImages(true);
  };

  return (
    <Fragment>
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid templateColumns={"1fr 1fr 3fr"} gap={3}>
            <FormControl isRequired>
              <FormLabel>Categoria</FormLabel>
              <Select
                placeholder="Selecione uma categoria"
                name="category_id"
                autoFocus
                isDisabled={categories?.length === 0 && true}
                onChange={(e) => findSubCategories(e.target.value)}
              >
                {categories?.map((cat) => (
                  <option value={cat.id} key={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Sub Categoria</FormLabel>
              <Select
                placeholder="Selecione uma sub-categoria"
                name="sub_category_id"
                isDisabled={subCategories?.length === 0 && true}
              >
                {subCategories?.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.title}
                  </option>
                ))}
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Nome do Produto</FormLabel>
              <Input name="title" placeholder="Nome do Produto" />
            </FormControl>
          </Grid>
          <FormControl>
            <FormLabel>Descrição Curta</FormLabel>
            <TextArea
              rows={3}
              placeholder="Descrição Curta"
              name="description"
              resize={"none"}
            />
          </FormControl>
          <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
            <FormControl isRequired>
              <FormLabel>SKU</FormLabel>
              <Input placeholder="SKU" name="sku" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Código de Barras</FormLabel>
              <Input placeholder="Código de Barras / SEM GTIN" name="barcode" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Código Interno</FormLabel>
              <Input placeholder="Código Interno" name="internal_code" />
            </FormControl>
          </Grid>
          <Grid templateColumns={"1fr 2fr 1fr"} gap={3}>
            <FormControl isRequired>
              <FormLabel>Estilo do Estoque</FormLabel>
              <Select
                name="type_unit"
                placeholder="Selecione uma opção"
                onChange={(e) => setStyleStock(e.target.value)}
              >
                <option value="square_meter">Venda por Metro Quadrado</option>
                <option value="unity">Venda por Unidade</option>
                <option value="without">Venda sem Estoque</option>
                <option value="sizes">Estoque Personalizado</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>
                {(styleStock === "" && "Informações do Estoque") ||
                  (styleStock === "square_meter" && "Insira as Larguras") ||
                  (styleStock === "meter" && "Insira o Comprimento") ||
                  (styleStock === "unity" &&
                    "Insira a quantidade do Estoque") ||
                  (styleStock === "unity" &&
                    "Insira a quantidade do Estoque") ||
                  (styleStock === "weight" && "Insira o Peso") ||
                  (styleStock === "liter" && "Insira o Volume em Litros") ||
                  (styleStock === "without" && "Sem Estoque Definido") ||
                  (styleStock === "sizes" && "Personalizar o Estoque")}
              </FormLabel>

              {styleStock === "square_meter" && (
                <Grid templateColumns={"1fr"} gap={3} position="relative">
                  <FormControl>
                    <HStack>
                      <NumberInput
                        w="100%"
                        value={widthNumber}
                        onChange={(e) => setWidthNumber(e)}
                      >
                        <NumberInputField placeholder="Largura em Metros" />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Button
                        aria-label="Inserir largura"
                        leftIcon={<AiOutlinePlus />}
                        onClick={() => handleWidth()}
                        px={10}
                      >
                        Incluir Tamanho
                      </Button>
                    </HStack>
                  </FormControl>
                  <Box>
                    {width?.length === 0 ? (
                      <Text></Text>
                    ) : (
                      <Wrap>
                        {width?.map((wd) => (
                          <Tag key={wd.id} size="lg" colorScheme={"blue"}>
                            <TagLabel>{wd.width} mt</TagLabel>

                            <TagCloseButton
                              onClick={() => removeWidth(wd.id)}
                            />
                          </Tag>
                        ))}
                      </Wrap>
                    )}
                  </Box>
                </Grid>
              )}
              {styleStock === "meter" ||
              styleStock === "weight" ||
              styleStock === "liter" ||
              styleStock === "unity" ? (
                <Input
                  name="inventory"
                  placeholder="Quantidade"
                  type="number"
                />
              ) : (
                ""
              )}
              {styleStock === "without" && (
                <Flex
                  borderWidth={"1px"}
                  rounded="md"
                  justify="center"
                  align="center"
                  textAlign={"center"}
                  h={10}
                >
                  Produto não possui estoque definido, pode efetuar venda sem
                  estoque.
                </Flex>
              )}
              {styleStock === "sizes" && (
                <Flex
                  borderWidth={"1px"}
                  rounded="md"
                  h={10}
                  justify="center"
                  align="center"
                  textAlign={"center"}
                >
                  Os Informações serão inseridas posteriormente nesta mesma
                  tela.
                </Flex>
              )}
              {styleStock === "" && (
                <Flex
                  borderWidth={"1px"}
                  rounded="md"
                  h={10}
                  justify="center"
                  align="center"
                  textAlign={"center"}
                >
                  Selecione uma opção ao lado para adicionar o estoque.
                </Flex>
              )}
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Unidade de Medida</FormLabel>
              <Select name="unit_desc" placeholder="Selecione uma opção">
                <option value="KG">Quilograma (KG)</option>
                <option value="GR">Grama (GR)</option>
                <option value="UN">Unidade (UN)</option>
                <option value="MT">Metro (MT)</option>
                <option value="M²">Metro Quadrado (M²)</option>
                <option value="CM">Centímetro (CM)</option>
                <option value="MM">Milímetro (MM)</option>
                <option value="PC">Peça (PC)</option>
                <option value="CX">Caixa (CX)</option>
                <option value="DZ">Duzia (DZ)</option>
                <option value="EM">Embalagem (EM)</option>
                <option value="FD">Fardo (FD)</option>
                <option value="KT">KIT (KT)</option>
                <option value="JG">Jogo (JG)</option>
                <option value="PT">Pacote (PT)</option>
                <option value="LATA">Lata (LATA)</option>
                <option value="LT">Litro (LT)</option>
                <option value="ML">Mililitro (ML)</option>
                <option value="SC">Saco (SC)</option>
                <option value="ROLO">Rolo (ROLO)</option>
                <option value="VD">Vidro (VD)</option>
                <option value="CE">Centro (CE)</option>
                <option value="CJ">Conjunto (CJ)</option>
                <option value="GF">Garrafa (GF)</option>
              </Select>
            </FormControl>
          </Grid>
          <FormControl>
            <FormLabel>Detalhes do Produto</FormLabel>
            <RichTextEditor
              value={text}
              onChange={(e) => setText(e)}
              toolbarConfig={configs.toolbarConfigs}
              placeholder="Insira seu texto aqui"
              editorStyle={{
                background: "transparent",
              }}
              rootStyle={{
                background: "transparent",
                borderColor: useColorModeValue(
                  theme.colors.gray["300"],
                  theme.colors.gray["600"]
                ),
                fontFamily: "Roboto Condensed, sans-serif",
                borderRadius: "8px",
              }}
              toolbarStyle={{
                borderColor: useColorModeValue(
                  theme.colors.gray["300"],
                  theme.colors.gray["600"]
                ),
              }}
              className="rte-editor"
            />
          </FormControl>

          <FormControl>
            <FormLabel>Tags do Produto</FormLabel>
            <HStack spacing={3}>
              <ChakraInput
                placeholder="Tag"
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
              />
              <Button
                leftIcon={<AiOutlinePlus />}
                px={10}
                onClick={() => handleTag()}
              >
                Incluir Tag
              </Button>
            </HStack>
          </FormControl>
          <Wrap>
            {tags?.map((tg) => (
              <Tag key={tg} size="lg" colorScheme={"blue"}>
                <TagLabel>{tg}</TagLabel>

                <TagCloseButton onClick={() => removeTag(tg)} />
              </Tag>
            ))}
          </Wrap>

          <Flex
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            p={1}
            justify="center"
            align={"center"}
            rounded="md"
          >
            CÁLCULO DE PREÇO
          </Flex>

          <Grid templateColumns={"repeat(5,1fr)"} gap={3} alignItems="end">
            <FormControl>
              <FormLabel>Valor de Custo (R$)</FormLabel>
              <ChakraInput
                placeholder="Valor de Custo (R$)"
                type={"number"}
                value={cost}
                onChange={(e) => setCost(parseFloat(e.target.value))}
                name="cost"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Outros Custos (R$)</FormLabel>
              <ChakraInput
                placeholder="Outros Custos (R$)"
                type={"number"}
                value={otherCost}
                onChange={(e) => setOtherCost(parseFloat(e.target.value))}
                name="other_cost"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Valor do Frete (R$)</FormLabel>
              <ChakraInput
                placeholder="Margem de Lucro Desejada (%)"
                type={"number"}
                value={freightValue}
                onChange={(e) => setFreightValue(parseFloat(e.target.value))}
                name="freight_value"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Impostos (%)</FormLabel>
              <ChakraInput
                placeholder="Impostos (%)"
                type={"number"}
                value={tax}
                onChange={(e) => setTax(parseFloat(e.target.value))}
                name="tax_value"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Taxa de Cartão (%)</FormLabel>
              <ChakraInput
                placeholder="Taxa de Cartão (%)"
                type={"number"}
                value={cardTax}
                onChange={(e) => setCardTax(parseFloat(e.target.value))}
                name="tax_card"
              />
            </FormControl>
          </Grid>
          <Grid
            templateColumns={"repeat(4,1fr)"}
            gap={3}
            alignItems="end"
            mt={3}
          >
            <FormControl>
              <FormLabel>Comissões (%)</FormLabel>
              <ChakraInput
                placeholder="Comissões (%)"
                type={"number"}
                value={comission}
                onChange={(e) => setComission(parseFloat(e.target.value))}
                name="comission"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Margem de Lucro Desejada (%)</FormLabel>
              <ChakraInput
                placeholder="Margem de Lucro Desejada (%)"
                type={"number"}
                value={marge}
                onChange={(e) => setMarge(parseFloat(e.target.value))}
                name="marge"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Preço de Venda (R$)</FormLabel>
              <ChakraInput
                placeholder="Preço de Venda (R$)"
                type={"number"}
                value={sale}
                onChange={(e) => setSale(parseFloat(e.target.value))}
                name="sale_value"
              />
            </FormControl>
            <Button
              leftIcon={<AiOutlineCalculator />}
              colorScheme="blue"
              variant="outline"
              onClick={() => calcSaleVale()}
            >
              Calcular
            </Button>
          </Grid>

          <Flex
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            p={1}
            justify="center"
            align={"center"}
            rounded="md"
          >
            VENDA FRACIONADA (FAST-FOOD'S)
          </Flex>

          <Grid templateColumns={"1fr 1fr 1fr"} gap={3}>
            <FormControl isRequired>
              <FormLabel>Fracionar Venda?</FormLabel>
              <Select name="type_sale" placeholder="Selecione uma opção">
                <option value="unique">Não</option>
                <option value="partition">Sim</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Total de Partes</FormLabel>
              <Select name="sale_options" placeholder="Selecione uma opção">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4">4</option>
                <option value="6">6</option>
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Categoria de Itens</FormLabel>
              <Select
                name="sale_options_category"
                placeholder="Selecione uma opção"
              >
                {partitionCategories?.map((pt) => (
                  <option value={pt.id} key={pt.id}>
                    {pt.name}
                  </option>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Flex
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            p={1}
            justify="center"
            align={"center"}
            rounded="md"
          >
            CÁLCULO DE FRETE
          </Flex>

          <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
            <FormControl>
              <FormLabel>Peso (kg)</FormLabel>
              <ChakraInput
                placeholder="Peso (kg)"
                name="freight_weight"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Formato</FormLabel>
              <ChakraSelect
                placeholder="Selecione um opção"
                name="format"
                value={format}
                onChange={(e) => setFormat(parseInt(e.target.value))}
              >
                <option value={1}>Caixa / Pacote</option>
                <option value={2}>Rolo / Prisma</option>
                <option value={3}>Envelope</option>
              </ChakraSelect>
            </FormControl>
            <FormControl>
              <FormLabel>Comprimento (cm)</FormLabel>
              <ChakraInput
                placeholder="Comprimento (cm)"
                name="freight_lenght"
                value={length}
                onChange={(e) => setLength(parseFloat(e.target.value))}
                type="number"
              />
            </FormControl>
          </Grid>
          <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
            <FormControl>
              <FormLabel>Altura (cm)</FormLabel>
              <ChakraInput
                placeholder="Altura (cm)"
                name="freight_height"
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
                type="number"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Largura (cm)</FormLabel>
              <ChakraInput
                placeholder="Largura (cm)"
                name="freight_width"
                value={widthFreight}
                onChange={(e) => setWidthFreight(parseFloat(e.target.value))}
                type="number"
              />
            </FormControl>
            <FormControl>
              <FormLabel>Diâmetro (cm)</FormLabel>
              <ChakraInput
                placeholder="Diâmetro (cm)"
                name="freight_diameter"
                value={diameter}
                onChange={(e) => setDiameter(parseFloat(e.target.value))}
                type="number"
              />
            </FormControl>
          </Grid>

          <Button
            rightIcon={<MdHelpOutline />}
            size="sm"
            w="fit-content"
            colorScheme={"yellow"}
            onClick={() => setModalHelp(true)}
          >
            Ajuda
          </Button>

          <Divider />

          <FormControl>
            <FormLabel>Simular Frete</FormLabel>
            <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
              <ChakraInput
                as={MaskedInput}
                mask="99999-999"
                placeholder="CEP de Origem"
                name="freight_cep_origin"
                value={originCep}
                onChange={(e) => setOriginCep(e.target.value)}
              />
              <ChakraInput
                as={MaskedInput}
                mask="99999-999"
                placeholder="CEP de Destino"
                value={destinyCep}
                onChange={(e) => setDestinyCep(e.target.value)}
                name="freight_cep_destiny"
              />
              <Button
                leftIcon={<AiOutlineCalculator />}
                onClick={() => calcShipping()}
                isLoading={loadingShipping}
              >
                Calcular Frete
              </Button>
            </Grid>
          </FormControl>
          {shipping?.length !== 0 && (
            <Table size={"sm"}>
              <Thead>
                <Tr>
                  <Th>Tipo</Th>
                  <Th>Prazo de Entrega</Th>
                  <Th isNumeric>Valor</Th>
                </Tr>
              </Thead>
              <Tbody>
                {shipping?.map((ship) => (
                  <Tr key={ship.Codigo}>
                    <Td>
                      {(ship.Codigo === "04014" && "SEDEX") ||
                        (ship.Codigo === "04510" && "PAC")}
                    </Td>
                    <Td>{ship.PrazoEntrega} dias</Td>
                    <Td isNumeric>R$ {ship.Valor}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
          <Button
            leftIcon={<AiOutlineSave />}
            size="lg"
            colorScheme={"blue"}
            w="fit-content"
            type="submit"
            isLoading={loading}
          >
            Salvar Produto
          </Button>
        </Stack>
      </Form>

      <Modal
        isOpen={modalTaxes}
        onClose={() => setModalTaxes(false)}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="6xl"
      >
        <ModalOverlay />
        <Form onSubmit={saveTaxes} ref={formRefTax}>
          <ModalContent>
            <ModalHeader>Tributação</ModalHeader>
            <ModalBody>
              <Stack spacing={3}>
                <Grid templateColumns={"1fr 1fr 1fr 1fr"} gap={3}>
                  <FormControl>
                    <FormLabel>Produto Tributado?</FormLabel>
                    <Switch
                      defaultChecked={isTributed}
                      onChange={(e) => setIsTributed(e.target.checked)}
                      size="lg"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CEST</FormLabel>
                    <Input
                      placeholder="CEST"
                      name="cest"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>NCM</FormLabel>
                    <Input
                      placeholder="NCM"
                      name="ncm"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CFOP</FormLabel>
                    <Input
                      placeholder="CFOP"
                      name="cfop"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>ICMS Origem</FormLabel>
                    <Select
                      placeholder="Selecione uma opção"
                      name="icms_origin"
                      isDisabled={!isTributed}
                    >
                      <option value={"0"}>0 - Nacional</option>
                      <option value={"1"}>
                        1 - Estrangeira (importação direta)
                      </option>
                      <option value={"2"}>
                        2 - Estrangeira (adquirida no mercado interno)
                      </option>
                      <option value={"3"}>
                        3 - Nacional com mais de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"4"}>
                        4 - Nacional produzida através de processos produtivos
                        básicos
                      </option>
                      <option value={"5"}>
                        5 - Nacional com menos de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"6"}>
                        6 - Estrangeira (importação direta) sem produto nacional
                        similar
                      </option>
                      <option value={"7"}>
                        7 - Estrangeira (adquirida no mercado interno) sem
                        produto nacional similar
                      </option>
                      <option value={"8"}>
                        8 - Nacional, mercadoria ou bem com Conteúdo de
                        Importação superior a 70%;
                      </option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS CSOSN</FormLabel>
                    <Select
                      name="icms_csosn"
                      placeholder="Selecione uma opção"
                      isDisabled={!isTributed}
                    >
                      <option value={"101"}>
                        101 - Tributada pelo Simples Nacional com permissão de
                        crédito
                      </option>
                      <option value={"102"}>
                        102 - Tributada pelo Simples Nacional sem permissão de
                        crédito
                      </option>
                      <option value={"103"}>
                        103 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta
                      </option>
                      <option value={"201"}>
                        201 - Tributada pelo Simples Nacional com permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"202"}>
                        202 - Tributada pelo Simples Nacional sem permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"203"}>
                        203 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"300"}>300 - Imune</option>
                      <option value={"400"}>
                        400 - Não tributada pelo Simples Nacional
                      </option>
                      <option value={"500"}>
                        500 - ICMS cobrado anteriormente por substituição
                        tributária (substituído) ou por antecipação
                      </option>
                      <option value={"900"}>900 - Outros</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Alíquota (%)</FormLabel>
                    <Input
                      name="icms_rate"
                      placeholder="ICMS Alíquota"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Base de Cálculo</FormLabel>
                    <Input
                      name="icms_base_calc"
                      placeholder="ICMS Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>
                      <Tooltip label="Margem de valor agregado" hasArrow>
                        <Text>ICMS MVA (%)</Text>
                      </Tooltip>
                      <Input
                        name="icms_marg_val_agregate"
                        placeholder="Margem de valor agregado"
                        isDisabled={!isTributed}
                      />
                    </FormLabel>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Alíquota (%)</FormLabel>
                    <Input
                      name="icms_st_rate"
                      placeholder="ICMS ST Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Modalidade de Cálculo (%)</FormLabel>
                    <Select
                      name="icms_st_mod_bc"
                      placeholder="Selecione uma opção"
                      isDisabled={!isTributed}
                    >
                      <option value={"0"}>
                        Preço tabelado ou máximo sugerido
                      </option>
                      <option value={"1"}>Lista Negativa (valor)</option>
                      <option value={"2"}>Lista Positiva (valor)</option>
                      <option value={"3"}>Lista Neutra (valor)</option>
                      <option value={"4"}>Margem Valor Agregado (%)</option>
                      <option value={"5"}>Pauta (valor)</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Base de Cálculo</FormLabel>
                    <Input
                      name="imcs_st_base_calc"
                      placeholder="ICMS ST Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(5, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>FCP Alíquota (%)</FormLabel>
                    <Input
                      name="fcp_rate"
                      placeholder="FCP Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Alíquota (%)</FormLabel>
                    <Input
                      name="fcp_st_rate"
                      placeholder="FCP ST Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Ret. Alíquota (%)</FormLabel>
                    <Input
                      name="fcp_ret_rate"
                      placeholder="FCP Ret. Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Base de Cálculo</FormLabel>
                    <Input
                      name="fcp_base_calc"
                      placeholder="FCP Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Base de Cálculo</FormLabel>
                    <Input
                      name="fcp_st_base_calc"
                      placeholder="FCP ST Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>IPI CST</FormLabel>
                    <Select
                      name="ipi_cst"
                      placeholder="Selecione uma opção"
                      isDisabled={!isTributed}
                    >
                      <option value={""}>Nenhum</option>
                      <option value={"00"}>
                        00 – Entrada com Recuperação de Crédito
                      </option>
                      <option value={"01"}>
                        01 – Entrada Tributada com Alíquota Zero
                      </option>
                      <option value={"02"}>02 – Entrada Isenta</option>
                      <option value={"03"}>03 – Entrada Não Tributada</option>
                      <option value={"04"}>04 – Entrada Imune</option>
                      <option value={"05"}>05 – Entrada com Suspensão</option>
                      <option value={"49"}>49 – Outras Entradas</option>
                      <option value={"50"}>50 – Saída Tributada</option>
                      <option value={"51"}>
                        51 – Saída Tributável com Alíquota Zero
                      </option>
                      <option value={"52"}>52 – Saída Isenta</option>
                      <option value={"53"}>53 – Saída Não Tributada</option>
                      <option value={"54"}>54 – Saída Imune</option>
                      <option value={"55"}>55 – Saída com Suspensão</option>
                      <option value={"99"}>99 – Outras Saídas</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Alíquota (%)</FormLabel>
                    <Input
                      name="ipi_rate"
                      placeholder="IPI Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Código</FormLabel>
                    <Input
                      name="ipi_code"
                      placeholder="IPI Código"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>PIS CST</FormLabel>
                    <Select
                      name="pis_cst"
                      placeholder="Selecione uma opção"
                      isDisabled={!isTributed}
                    >
                      {dataTrib.map((dt) => (
                        <option key={dt.code} value={dt.code}>
                          {dt.desc}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Alíquota (%)</FormLabel>
                    <Input
                      name="pis_rate"
                      placeholder="PIS Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Base de Cálculo</FormLabel>
                    <Input
                      name="pis_base_calc"
                      placeholder="PIS Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>COFINS CST</FormLabel>
                    <Select
                      name="cofins_cst"
                      placeholder="Selecione uma opção"
                      isDisabled={!isTributed}
                    >
                      {dataTrib.map((dt) => (
                        <option key={dt.code} value={dt.code}>
                          {dt.desc}
                        </option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Alíquota (%)</FormLabel>
                    <Input
                      name="cofins_rate"
                      placeholder="COFINS Alíquota (%)"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Base de Cálculo</FormLabel>
                    <Input
                      name="cofins_base_calc"
                      placeholder="COFINS Base de Cálculo"
                      isDisabled={!isTributed}
                    />
                  </FormControl>
                </Grid>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={"blue"}
                leftIcon={<AiOutlineSave />}
                type="submit"
                isLoading={loadingImage}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>

      <Modal
        isOpen={modalPricImage}
        onClose={() => handleCloseImagesPrinc()}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="xs"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Thumbnail</ModalHeader>
          <ModalBody pb={5}>
            <Flex w={"100%"} justify="center">
              <Uploader
                height={260}
                width={260}
                name="thumbnail"
                title={false}
                url={`/productsThumbnail/${productId}`}
                onSuccess={handleCloseImagesPrinc}
              />
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalImages}
        onClose={() => handleCloseImages()}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="xs"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Imagens</ModalHeader>
          <ModalBody>
            <Grid templateColumns={"1fr"} gap={5}>
              <Flex w="100%" justify={"center"}>
                <Grid
                  templateColumns={"repeat(auto-fit, minmax(260px, 260px))"}
                  gap={2}
                  justifyContent="center"
                >
                  {images?.map((img) => (
                    <Box
                      key={img.id}
                      w="260px"
                      h="260px"
                      rounded="md"
                      borderWidth={"1px"}
                      overflow="hidden"
                      position={"relative"}
                    >
                      <Image
                        w="260px"
                        h="260px"
                        src={img.image}
                        objectFit="cover"
                      />
                    </Box>
                  ))}
                  <Uploader
                    height={260}
                    width={260}
                    name="image"
                    title={false}
                    url={`/storeImagesProduct/${productId}`}
                    type="POST"
                  />
                </Grid>
              </Flex>
            </Grid>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => handleCloseImages()}
              leftIcon={<AiOutlineCheck />}
            >
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalAdictional}
        onClose={() => handleCloseFinish()}
        closeOnEsc={false}
        closeOnOverlayClick={false}
        size="md"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Itens Adicionais</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns={"1fr 100px"} gap={3} alignItems="end">
              <FormControl>
                <FormLabel>
                  Itens Adicionais{" "}
                  <Switch
                    mt={1}
                    mb={1}
                    defaultChecked={have_adictional}
                    onChange={(e) => setHave_adictional(e.target.checked)}
                  />
                </FormLabel>
                <ChakraSelect
                  value={adicionalItemsId}
                  onChange={(e) => setAdicionalItemsId(e.target.value)}
                  placeholder="Selecione uma opção"
                  isDisabled={!have_adictional}
                >
                  {adicionalItems?.map((add) => (
                    <option key={add.id} value={add.id}>
                      {add.title}
                    </option>
                  ))}
                </ChakraSelect>
              </FormControl>
              <Button
                leftIcon={<AiOutlineSave />}
                colorScheme="blue"
                isLoading={loading}
                onClick={() => storeAddctionalItems()}
              >
                Salvar
              </Button>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={modalHelp} onClose={() => setModalHelp(false)} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Ajuda</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {!format ? (
              <Text>Selecione uma opção no formato do frete</Text>
            ) : (
              <Image
                src={
                  (format === 1 && imageHelp) ||
                  (format === 2 && imageRolo) ||
                  (format === 3 && imageEnv) ||
                  undefined
                }
                w="100%"
                rounded={"md"}
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalSizes}
        onClose={() => handleCloseSizes()}
        size="3xl"
        closeOnOverlayClick={false}
        closeOnEsc={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Estoque Personalizado</ModalHeader>
          <ModalBody>
            <Form ref={formRefSizes} onSubmit={saveSizes}>
              <Grid templateColumns={"2fr 2fr 1fr"} gap={3} alignItems="end">
                <FormControl isRequired>
                  <FormLabel>Descrição</FormLabel>
                  <Input name="description" placeholder="Descrição" autoFocus />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Quantidade em Estoque</FormLabel>
                  <Input
                    name="inventory"
                    placeholder="Quantidade em Estoque"
                    type="number"
                  />
                </FormControl>
                <Button
                  leftIcon={<AiOutlineSave />}
                  colorScheme="blue"
                  type="submit"
                  isLoading={loadingImage}
                >
                  Salvar
                </Button>
              </Grid>
            </Form>

            <Box
              rounded="md"
              borderWidth={"1px"}
              overflow="hidden"
              pt={2}
              mt={3}
            >
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th>Descrição</Th>
                    <Th isNumeric>Estoque</Th>
                    <Th w="20%" textAlign={"center"}>
                      Opções
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {sizes?.map((siz) => (
                    <Tr key={siz.id}>
                      <Td>{siz.description}</Td>
                      <Td isNumeric>{siz.inventory} UN</Td>
                      <Td w="20%">
                        <Popover>
                          <PopoverTrigger>
                            <Button
                              leftIcon={<AiOutlineEdit />}
                              size="xs"
                              isFullWidth
                            >
                              Editar
                            </Button>
                          </PopoverTrigger>

                          <Form
                            ref={formRefUpSizes}
                            onSubmit={updateSizes}
                            initialData={{
                              id: siz.id,
                              description: siz.description,
                              inventory: siz.inventory,
                            }}
                          >
                            <PopoverContent shadow={"lg"}>
                              <PopoverArrow />
                              <PopoverHeader>Editar Informações</PopoverHeader>
                              <PopoverCloseButton />
                              <PopoverBody>
                                <Stack spacing={3}>
                                  <FormControl isRequired>
                                    <FormLabel>Descrição</FormLabel>
                                    <Input
                                      name="description"
                                      placeholder="Descrição"
                                      size="sm"
                                    />
                                  </FormControl>
                                  <FormControl isRequired>
                                    <FormLabel>Quantidade em Estoque</FormLabel>
                                    <Input
                                      type="number"
                                      name="inventory"
                                      placeholder="Quantidade em Estoque"
                                      size="sm"
                                    />
                                  </FormControl>
                                </Stack>
                                <Input name="id" display={"none"} isReadOnly />
                              </PopoverBody>
                              <PopoverFooter
                                display={"flex"}
                                justifyContent="end"
                              >
                                <Button
                                  colorScheme="blue"
                                  size="sm"
                                  type="submit"
                                  isLoading={loadingThumbnail}
                                >
                                  Salvar
                                </Button>
                              </PopoverFooter>
                            </PopoverContent>
                          </Form>
                        </Popover>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          </ModalBody>

          <ModalFooter>
            <Button
              onClick={() => handleCloseSizes()}
              leftIcon={<AiOutlineCheck />}
            >
              Finalizar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default memo(RegisterProduct);
