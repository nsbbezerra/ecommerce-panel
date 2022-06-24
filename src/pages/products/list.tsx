import {
  Grid,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  Input as ChakraInput,
  Divider,
  RadioGroup,
  Radio,
  Stack,
  useToast,
  Skeleton,
  Flex,
  Icon,
  Text,
  Select as ChakraSelect,
  Avatar,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Tag,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Tooltip,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  IconButton,
  Box,
  useColorModeValue,
  theme,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Image,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineCalculator,
  AiOutlineEdit,
  AiOutlinePercentage,
  AiOutlinePicture,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineTool,
} from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { HiOutlineAdjustments } from "react-icons/hi";
import { MdHelpOutline } from "react-icons/md";
import { useQuery, useMutation, QueryClient } from "react-query";
import { api, configs } from "../../configs";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { dataTrib } from "../../configs/data";
import Input from "../../components/Input";
import Select from "../../components/Select";
import RichTextEditor from "react-rte";
import MaskedInput from "react-input-mask";
import TextArea from "../../components/textArea";
import { FaRuler, FaTrashAlt } from "react-icons/fa";

import imageHelp from "../../assets/correios.png";
import imageRolo from "../../assets/rolo.png";
import imageEnv from "../../assets/envelope.png";

const queryClient = new QueryClient();

type Props = {
  id: string;
  token: string;
};

type ProductProps = {
  id: string;
  thumbnail?: string;
  title: string;
  sku: string;
  sale_value: number;
  active: boolean;
  in_promotion: boolean;
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without";
  unit_desc: string;
  inventory: number;
  weight: number;
  liter: number;
  length: number;
  type_sale: "unique" | "partition";
};

type TaxProps = {
  id: string;
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

type ActiveProductProps = {
  id: string;
  active: boolean;
};

type ProductsEditProps = {
  title: string;
  description: string;
  sku: string;
  barcode: string;
  internal_code: string;
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without";
  unit_desc: string;
  details: string;
  cost_value: CostValueProps;
  type_sale: "unique" | "partition";
  sale_options: string;
  sale_options_category: string;
  weight: number;
  liter: number;
  length: number;
  width: WidthProps;
};

type WidthProps = {
  id: string;
  width: string;
};

type CostValueProps = {
  cost: number;
  otherCost: number;
  freightValue: number;
  tax: number;
  cardTax: number;
  comission: number;
  marge: number;
  sale: number;
};

type ShippingProps = {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
};

type PropsCategoryPartition = {
  id: string;
  name: string;
};

type ShippinOptionsProps = {
  width: number;
  height: number;
  length: number;
  weight: number;
  format: number;
  diameter: number;
};

export default function ListProduct() {
  const toast = useToast();
  const formRefTax = useRef<FormHandles>(null);
  const formRefInformation = useRef<FormHandles>(null);

  const [auth, setAuth] = useState<Props>();

  const [search, setSearch] = useState<string>("all");
  const [textSearch, setTextSearch] = useState<string>("");

  const [products, setProducts] = useState<ProductProps[]>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [loadingModal, setLoadingModal] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalTax, setModalTax] = useState<boolean>(false);
  const [isTributed, setIsTributed] = useState<boolean>(true);
  const [modalInformation, setModalInformation] = useState<boolean>(false);
  const [widthProduct, setWidthProduct] = useState<WidthProps[]>();
  const [cost, setCost] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);
  const [sale, setSale] = useState<number>(0);
  const [marge, setMarge] = useState<number>(0);
  const [cardTax, setCardTax] = useState<number>(0);
  const [taxProduct, setTaxProduct] = useState<number>(0);
  const [comission, setComission] = useState<number>(0);
  const [freightValue, setFreightValue] = useState<number>(0);
  const [text, setText] = useState<any>(RichTextEditor.createEmptyValue());
  const [indexUnit, setIndexUnit] = useState<number>(2);
  const [widthNumber, setWidthNumber] = useState<string>("");

  const [originCep, setOriginCep] = useState<string>("");
  const [destinyCep, setDestinyCep] = useState<string>("");
  const [weight, setWeight] = useState<number>(0);
  const [format, setFormat] = useState<number>(0);
  const [length, setLength] = useState<number>(0);
  const [widthFreight, setWidthFreight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [diameter, setDiameter] = useState<number>(0);
  const [shipping, setShipping] = useState<ShippingProps[]>();
  const [loadingShipping, setLoadingShipping] = useState<boolean>(false);
  const [modalHelp, setModalHelp] = useState<boolean>(false);

  const [tax, setTax] = useState<TaxProps>();
  const [productId, setProductId] = useState<string>("");
  const [productInformation, setProductInformation] =
    useState<ProductsEditProps>();
  const [partitionCategories, setPartitionCategories] =
    useState<PropsCategoryPartition[]>();

  function handleSearch(type: string) {
    setTextSearch("");
    setSearch(type);
  }

  function showToast(
    message: string,
    status: "error" | "info" | "warning" | "success" | undefined,
    title: string
  ) {
    toast({
      title: title,
      description: message,
      status: status,
      position: "top-right",
      duration: 8000,
      isClosable: true,
    });
  }

  async function getInformation() {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
    try {
      const { data } = await api.get(`/products/${companyParse?.id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const paginateGood = (array: ProductProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setProducts(pag);
  };

  const { data, isLoading, error } = useQuery("list-products", getInformation, {
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  function filterSearch(array: ProductProps[]) {
    if (search === "all") {
      paginateGood(array, configs.pagination);
      setPages(Math.ceil(array.length / configs.pagination));
    } else if (search === "active") {
      let resultActive = array.filter((obj) => obj.active === true);
      paginateGood(resultActive, configs.pagination);
      setPages(Math.ceil(resultActive.length / configs.pagination));
    } else if (search === "locked") {
      let resultLocked = array.filter((obj) => obj.active === false);
      paginateGood(resultLocked, configs.pagination);
      setPages(Math.ceil(resultLocked.length / configs.pagination));
    } else if (search === "promotional") {
      let resultPromo = array.filter((obj) => obj.in_promotion === true);
      paginateGood(resultPromo, configs.pagination);
      setPages(Math.ceil(resultPromo.length / configs.pagination));
    } else if (search === "name") {
      if (textSearch === "") {
        paginateGood(array, configs.pagination);
        setPages(Math.ceil(array.length / configs.pagination));
      } else {
        let resultName = array.filter((obj) =>
          obj.title.toLowerCase().includes(textSearch.toLowerCase())
        );
        paginateGood(resultName, configs.pagination);
        setPages(Math.ceil(resultName.length / configs.pagination));
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

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      findPartitionItems(companyParse.id, userParse.token);
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  useEffect(() => {
    if (data) {
      filterSearch(data);
    }
  }, [search]);

  useEffect(() => {
    if (data) {
      filterSearch(data);
    }
  }, [data]);

  useEffect(() => {
    if (products) {
      paginateGood(products, configs.pagination);
    }
  }, [page]);

  function handleSearchName(text: string) {
    setTextSearch(text);
    if (text === "") {
      paginateGood(data, configs.pagination);
      setPages(Math.ceil(data.length / configs.pagination));
    } else {
      let allProducts: ProductProps[] = data;
      let result = allProducts.filter((obj) =>
        obj.title.toLowerCase().includes(text.toLowerCase())
      );
      paginateGood(result, configs.pagination);
      setPages(Math.ceil(result.length / configs.pagination));
    }
  }

  const handleFindTax = async (id: string) => {
    try {
      setLoadingModal(true);
      setModalTax(true);
      setProductId(id);
      const response = await api.get(`/findTaxesProduct/${id}`);
      setTax(response.data);
      setIsTributed(response.data.isTributed);
      setLoadingModal(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const updateTax: SubmitHandler<TaxProps> = async (data, { reset }) => {
    try {
      setLoading(true);
      const response = await api.put(
        `/updateProductTax/${tax?.id}/${productId}`,
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
      showToast(response.data.message, "success", " Sucesso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const mutationActive = useMutation(
    (data: ActiveProductProps) => {
      return api.put(
        `/productsActive/${data.id}`,
        {
          active: data.active,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-products");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        } else {
          const message = (error as Error).message;
          showToast(message, "error", "Erro");
        }
      },
    }
  );

  const handleUpdateInformation: SubmitHandler<ProductsEditProps> = async (
    data,
    { reset }
  ) => {
    console.log(data);
  };

  async function findProductInformation(id: string) {
    try {
      setProductId(id);
      setLoadingModal(true);
      setModalInformation(true);
      const response = await api.get(`/listProductInformation/${id}`);
      let costValueProduct: CostValueProps = JSON.parse(
        response.data.cost_value
      );
      let typeUnit = response.data.type_unit;
      let shippingOptions: ShippinOptionsProps = JSON.parse(
        response.data.shipping
      );
      if (typeUnit === "square_meter") {
        setIndexUnit(0);
      } else if (typeUnit === "meter") {
        setIndexUnit(1);
      } else if (typeUnit === "unity") {
        setIndexUnit(2);
      } else if (typeUnit === "weight") {
        setIndexUnit(3);
      } else if (typeUnit === "liter") {
        setIndexUnit(4);
      } else if (typeUnit === "without") {
        setIndexUnit(5);
      }
      setWeight(shippingOptions.weight);
      setLength(shippingOptions.length);
      setFormat(shippingOptions.format);
      setWidthFreight(shippingOptions.width);
      setHeight(shippingOptions.height);
      setDiameter(shippingOptions.diameter);

      setCost(costValueProduct.cost);
      setOtherCost(costValueProduct.otherCost);
      setSale(costValueProduct.sale);
      setMarge(costValueProduct.marge);
      setCardTax(costValueProduct.cardTax);
      setComission(costValueProduct.comission);
      setTaxProduct(costValueProduct.tax);
      setFreightValue(costValueProduct.freightValue);
      setProductInformation(response.data);
      setWidthProduct(JSON.parse(response.data.width));
      setText(
        RichTextEditor.createValueFromString(response.data.details, "html")
      );

      setLoadingModal(false);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  const calcSaleVale = () => {
    let costPrices = cost + otherCost + freightValue;
    let calcTaxes = costPrices * (taxProduct / 100);
    let calcCardTax = costPrices * (cardTax / 100);
    let comissionCalc = costPrices * (comission / 100);
    let totalCalcs = costPrices + calcTaxes + calcCardTax + comissionCalc;
    let calcMarge = totalCalcs * (marge / 100);
    let finalCalc = totalCalcs + calcMarge;
    setSale(parseFloat(finalCalc.toFixed(2)));
  };

  const handleWidth = () => {
    let myWidths = widthProduct;
    const result = widthProduct?.find((obj) => obj.id === widthNumber);
    if (result) {
      showToast("Medida já inserida", "warning", "Atenção");
      return false;
    }
    let info: WidthProps = { id: widthNumber, width: widthNumber };
    myWidths?.push(info);
    setWidthProduct(myWidths);
    setWidthNumber("");
  };

  const removeWidth = (id: string) => {
    const result = widthProduct?.filter((obj) => obj.id !== id);
    setWidthProduct(result);
  };

  async function calcShipping() {
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

  return (
    <Fragment>
      <Grid templateColumns={"200px 1fr"} gap={3}>
        <Popover placement="bottom-start">
          <PopoverTrigger>
            <Button
              colorScheme={"blue"}
              variant="outline"
              leftIcon={<HiOutlineAdjustments />}
            >
              Filtrar por
            </Button>
          </PopoverTrigger>
          <PopoverContent shadow={"lg"}>
            <PopoverArrow />
            <PopoverCloseButton />
            <PopoverHeader>Filtros</PopoverHeader>
            <PopoverBody>
              <RadioGroup value={search} onChange={(e) => handleSearch(e)}>
                <Stack>
                  <Radio value={"all"}>Todos os Produtos</Radio>
                  <Radio value={"active"}>Produtos Ativos</Radio>
                  <Radio value={"locked"}>Produtos Bloqueados</Radio>
                  <Radio value={"promotional"}>Produtos Promocionais</Radio>
                  <Radio value={"name"}>Buscar por Nome</Radio>
                </Stack>
              </RadioGroup>
            </PopoverBody>
          </PopoverContent>
        </Popover>

        <ChakraInput
          placeholder="Digite para Buscar"
          isDisabled={search === "name" ? false : true}
          value={textSearch}
          onChange={(e) => handleSearchName(e.target.value)}
        />
      </Grid>
      <Divider mt={5} mb={5} />

      {isLoading ? (
        <Stack spacing={3}>
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
        </Stack>
      ) : (
        <Fragment>
          {products?.length === 0 ? (
            <Flex justify={"center"} align="center" direction={"column"}>
              <Icon as={GiCardboardBox} fontSize="8xl" />
              <Text>Nenhuma informação para mostrar</Text>
            </Flex>
          ) : (
            <Fragment>
              <Table size="sm">
                <Thead>
                  <Tr>
                    <Th w="5%" textAlign={"center"}>
                      Thumb
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Ativo?
                    </Th>
                    <Th w="3%" textAlign={"center"}>
                      Promocional?
                    </Th>
                    <Th>Nome</Th>
                    <Th>SKU</Th>
                    <Th>Uni.</Th>
                    <Th isNumeric>Estoque</Th>
                    <Th isNumeric>Preço</Th>
                    <Th textAlign={"center"} w="12%">
                      Opções
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {products?.map((pro) => (
                    <Tr key={pro.id}>
                      <Td w="5%" textAlign={"center"}>
                        <Avatar src={pro.thumbnail} size="sm" />
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        <Switch
                          defaultChecked={pro.active}
                          onChange={(e) =>
                            mutationActive.mutate({
                              id: pro.id,
                              active: e.target.checked,
                            })
                          }
                        />
                      </Td>
                      <Td w="3%" textAlign={"center"}>
                        {pro.in_promotion === true ? (
                          <Tag colorScheme={"green"}>SIM</Tag>
                        ) : (
                          <Tag colorScheme={"red"}>NÃO</Tag>
                        )}
                      </Td>
                      <Td>{pro.title}</Td>
                      <Td>{pro.sku}</Td>
                      <Td>{pro.unit_desc}</Td>
                      <Td isNumeric>
                        {(pro.type_unit === "square_meter" && "Indefinido") ||
                          (pro.type_unit === "unity" &&
                            `${pro.inventory} ${pro.unit_desc}`) ||
                          (pro.type_unit === "liter" &&
                            `${pro.liter} ${pro.unit_desc}`) ||
                          (pro.type_unit === "meter" &&
                            `${pro.length} ${pro.unit_desc}`) ||
                          (pro.type_unit === "weight" &&
                            `${pro.weight} ${pro.unit_desc}`) ||
                          (pro.type_unit === "without" && "Venda sem Estoque")}
                      </Td>
                      <Td isNumeric>
                        {parseFloat(pro.sale_value.toString()).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </Td>
                      <Td textAlign={"center"} w="12%">
                        <Menu>
                          <MenuButton
                            as={Button}
                            rightIcon={<AiOutlineTool />}
                            size="xs"
                            isFullWidth
                          >
                            Opções
                          </MenuButton>
                          <MenuList>
                            <MenuItem
                              icon={<AiOutlineEdit />}
                              onClick={() => findProductInformation(pro.id)}
                            >
                              Alterar Informações
                            </MenuItem>
                            <MenuItem
                              icon={<AiOutlinePercentage />}
                              onClick={() => handleFindTax(pro.id)}
                            >
                              Alterar Tributação
                            </MenuItem>
                            <MenuItem icon={<AiOutlinePicture />}>
                              Alterar Imagens
                            </MenuItem>
                            <MenuDivider />
                            <MenuItem icon={<AiOutlineAppstoreAdd />}>
                              Items Adicionais
                            </MenuItem>
                            <MenuItem icon={<AiOutlineCalculator />}>
                              Promoções
                            </MenuItem>
                          </MenuList>
                        </Menu>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Fragment>
          )}
          <Flex justify={"flex-end"} align="center" gap={3} mt={3}>
            <Button
              size={"sm"}
              onClick={() => setPage(page - 1)}
              isDisabled={page + 1 === 1}
            >
              Anterior
            </Button>
            <Text>
              {page + 1} / {pages}
            </Text>
            <Button
              size={"sm"}
              onClick={() => setPage(page + 1)}
              isDisabled={page + 1 === pages}
            >
              Próxima
            </Button>
          </Flex>
        </Fragment>
      )}

      <Modal isOpen={modalTax} onClose={() => setModalTax(false)} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Tributação</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {loadingModal ? (
              <Stack spacing={3}>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
              </Stack>
            ) : (
              <Form ref={formRefTax} onSubmit={updateTax} initialData={tax}>
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
                          6 - Estrangeira (importação direta) sem produto
                          nacional similar
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
                          103 - Isenção do ICMS no Simples Nacional para faixa
                          de receita bruta
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
                          203 - Isenção do ICMS no Simples Nacional para faixa
                          de receita bruta e com cobrança do ICMS por
                          substituição tributária
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

                <Flex justify={"end"}>
                  <Button
                    colorScheme={"blue"}
                    leftIcon={<AiOutlineSave />}
                    mt={5}
                    type="submit"
                    isLoading={loading}
                  >
                    Salvar
                  </Button>
                </Flex>
              </Form>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalInformation}
        onClose={() => setModalInformation(false)}
        size="6xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informações do Produto</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            {loadingModal ? (
              <Stack spacing={3}>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                  <Skeleton h={10} />
                </Grid>
              </Stack>
            ) : (
              <Fragment>
                <Form
                  ref={formRefInformation}
                  onSubmit={handleUpdateInformation}
                  initialData={productInformation}
                >
                  <Stack spacing={3}>
                    <Grid templateColumns={"1fr"} gap={3}>
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
                        <Input
                          placeholder="Código de Barras / SEM GTIN"
                          name="barcode"
                        />
                      </FormControl>
                      <FormControl isRequired>
                        <FormLabel>Código Interno</FormLabel>
                        <Input
                          placeholder="Código Interno"
                          name="internal_code"
                        />
                      </FormControl>
                    </Grid>
                    <FormControl isRequired>
                      <FormLabel>Unidade de Medida</FormLabel>
                      <Select
                        name="unit_desc"
                        placeholder="Selecione uma opção"
                      >
                        <option value="KG">Quilograma</option>
                        <option value="GR">Grama</option>
                        <option value="UN">Unidade</option>
                        <option value="MT">Metro</option>
                        <option value="M²">Metro Quadrado</option>
                        <option value="CM">Centímetro</option>
                        <option value="MM">Milímetro</option>
                        <option value="PC">Peça</option>
                        <option value="CX">Caixa</option>
                        <option value="DZ">Duzia</option>
                        <option value="EM">Embalagem</option>
                        <option value="FD">Fardo</option>
                        <option value="KT">KIT</option>
                        <option value="JG">Jogo</option>
                        <option value="PT">Pacote</option>
                        <option value="LATA">Lata</option>
                        <option value="LT">Litro</option>
                        <option value="ML">Mililitro</option>
                        <option value="SC">Saco</option>
                        <option value="ROLO">Rolo</option>
                        <option value="VD">Vidro</option>
                        <option value="CE">Centro</option>
                        <option value="CJ">Conjunto</option>
                        <option value="GF">Garrafa</option>
                      </Select>
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Cálculo de Medidas</FormLabel>
                      <Tabs
                        mt={2}
                        variant="enclosed"
                        size="sm"
                        defaultIndex={indexUnit}
                        onChange={(e) => setIndexUnit(e)}
                      >
                        <TabList>
                          <Tab>Metro Quadrado</Tab>
                          <Tab>Comprimento</Tab>
                          <Tab>Unidade</Tab>
                          <Tab>Peso</Tab>
                          <Tab>Litro</Tab>
                          <Tab>Sem Estoque</Tab>
                        </TabList>

                        <TabPanels>
                          <TabPanel>
                            <Grid
                              templateColumns={"1fr 1fr"}
                              gap={3}
                              position="relative"
                            >
                              <FormControl>
                                <FormLabel>Largura</FormLabel>
                                <HStack>
                                  <NumberInput
                                    w="100%"
                                    value={widthNumber}
                                    onChange={(e) => setWidthNumber(e)}
                                  >
                                    <NumberInputField />
                                    <NumberInputStepper>
                                      <NumberIncrementStepper />
                                      <NumberDecrementStepper />
                                    </NumberInputStepper>
                                  </NumberInput>
                                  <IconButton
                                    aria-label="Inserir largura"
                                    icon={<AiOutlinePlus />}
                                    onClick={() => handleWidth()}
                                  />
                                </HStack>
                                <Box
                                  borderWidth={"1px"}
                                  rounded="md"
                                  py={1}
                                  mt={3}
                                  px={3}
                                >
                                  {widthProduct?.length === 0 ? (
                                    <Text>Insira uma largura</Text>
                                  ) : (
                                    <Stack spacing={1}>
                                      {widthProduct?.map((wd) => (
                                        <HStack key={wd.id}>
                                          <Icon as={FaRuler} />
                                          <Text>{wd.width}m</Text>
                                          <IconButton
                                            aria-label="Remover Altura"
                                            icon={<FaTrashAlt />}
                                            variant="link"
                                            colorScheme={"red"}
                                            size="sm"
                                            onClick={() => removeWidth(wd.id)}
                                          />
                                        </HStack>
                                      ))}
                                    </Stack>
                                  )}
                                </Box>
                              </FormControl>
                              <FormControl>
                                <FormLabel>Altura</FormLabel>
                                <Flex
                                  borderWidth={"1px"}
                                  rounded="md"
                                  p={4}
                                  justify={"center"}
                                  align="center"
                                  textAlign={"center"}
                                >
                                  <Text>
                                    A Altura ficará a critério do cliente
                                  </Text>
                                </Flex>
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns={"1fr"} gap={3}>
                              <FormControl>
                                <FormLabel>Comprimento (Metros)</FormLabel>
                                <Input
                                  name="length"
                                  placeholder="Comprimento"
                                />
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns={"1fr"} gap={3}>
                              <FormControl>
                                <FormLabel>Total de Unidades</FormLabel>
                                <Input
                                  name="inventory"
                                  placeholder="Total de Unidades"
                                  type="number"
                                />
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns={"1fr"} gap={3}>
                              <FormControl>
                                <FormLabel>Peso (Kg)</FormLabel>
                                <Input name="weight" placeholder="Peso" />
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Grid templateColumns={"1fr"} gap={3}>
                              <FormControl>
                                <FormLabel>Volume (Lt / Ml)</FormLabel>
                                <Input name="liter" placeholder="Volume" />
                              </FormControl>
                            </Grid>
                          </TabPanel>
                          <TabPanel>
                            <Flex
                              borderWidth={"1px"}
                              rounded="md"
                              p={4}
                              justify="center"
                              align="center"
                              textAlign={"center"}
                            >
                              Produto não possui estoque definido, pode efetuar
                              venda sem estoque.
                            </Flex>
                          </TabPanel>
                        </TabPanels>
                      </Tabs>
                    </FormControl>
                    <Divider />
                    <FormControl>
                      <FormLabel>Detalhes do Produto</FormLabel>
                      <RichTextEditor
                        value={text}
                        onChange={(e) => setText(e)}
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
                        }}
                        toolbarStyle={{
                          borderColor: useColorModeValue(
                            theme.colors.gray["300"],
                            theme.colors.gray["600"]
                          ),
                        }}
                      />
                    </FormControl>

                    <Flex
                      bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                      p={1}
                      justify="center"
                      align={"center"}
                      rounded="md"
                    >
                      CÁLCULO DE PREÇO
                    </Flex>

                    <Grid
                      templateColumns={"repeat(5,1fr)"}
                      gap={3}
                      alignItems="end"
                    >
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
                          onChange={(e) =>
                            setOtherCost(parseFloat(e.target.value))
                          }
                          name="other_cost"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Valor do Frete (R$)</FormLabel>
                        <ChakraInput
                          placeholder="Margem de Lucro Desejada (%)"
                          type={"number"}
                          value={freightValue}
                          onChange={(e) =>
                            setFreightValue(parseFloat(e.target.value))
                          }
                          name="freight_value"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Impostos (%)</FormLabel>
                        <ChakraInput
                          placeholder="Impostos (%)"
                          type={"number"}
                          value={taxProduct}
                          onChange={(e) =>
                            setTaxProduct(parseFloat(e.target.value))
                          }
                          name="tax_value"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Taxa de Cartão (%)</FormLabel>
                        <ChakraInput
                          placeholder="Taxa de Cartão (%)"
                          type={"number"}
                          value={cardTax}
                          onChange={(e) =>
                            setCardTax(parseFloat(e.target.value))
                          }
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
                          onChange={(e) =>
                            setComission(parseFloat(e.target.value))
                          }
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
                      VENDA FRACIONADA
                    </Flex>

                    <Grid templateColumns={"1fr 1fr 1fr"} gap={3}>
                      <FormControl isRequired>
                        <FormLabel>Fracionar Venda?</FormLabel>
                        <Select
                          name="type_sale"
                          placeholder="Selecione uma opção"
                        >
                          <option value="unique">Não</option>
                          <option value="partition">Sim</option>
                        </Select>
                      </FormControl>
                      <FormControl>
                        <FormLabel>Total de Partes</FormLabel>
                        <Input
                          placeholder="Total de Partes"
                          name="sale_options"
                        />
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
                          onChange={(e) =>
                            setWeight(parseFloat(e.target.value))
                          }
                          type="number"
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
                          onChange={(e) =>
                            setLength(parseFloat(e.target.value))
                          }
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
                          onChange={(e) =>
                            setHeight(parseFloat(e.target.value))
                          }
                          type="number"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Largura (cm)</FormLabel>
                        <ChakraInput
                          placeholder="Largura (cm)"
                          name="freight_width"
                          value={widthFreight}
                          onChange={(e) =>
                            setWidthFreight(parseFloat(e.target.value))
                          }
                          type="number"
                        />
                      </FormControl>
                      <FormControl>
                        <FormLabel>Diâmetro (cm)</FormLabel>
                        <ChakraInput
                          placeholder="Diâmetro (cm)"
                          name="freight_diameter"
                          value={diameter}
                          onChange={(e) =>
                            setDiameter(parseFloat(e.target.value))
                          }
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
                    <Flex mt={5} justify="end">
                      <Button
                        leftIcon={<AiOutlineSave />}
                        colorScheme={"blue"}
                        w="fit-content"
                        type="submit"
                        isLoading={loading}
                      >
                        Salvar
                      </Button>
                    </Flex>
                  </Stack>
                </Form>
              </Fragment>
            )}
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
    </Fragment>
  );
}
