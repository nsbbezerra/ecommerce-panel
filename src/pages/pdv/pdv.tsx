import {
  Avatar,
  Box,
  Button,
  Flex,
  Grid,
  HStack,
  Text,
  useColorModeValue,
  Table,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  IconButton,
  useColorMode,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightAddon,
  Kbd,
  Tooltip,
  Image,
  Tag,
  useToast,
  ToastPositionWithLogical,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Icon,
  Stack,
  FormControl,
  FormLabel,
  Skeleton,
  MenuDivider,
  InputLeftAddon,
} from "@chakra-ui/react";
import { forwardRef, Fragment, useEffect, useRef, useState, memo } from "react";
import {
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineEnter,
  AiOutlineMore,
  AiOutlineNumber,
  AiOutlinePercentage,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineTool,
  AiOutlineUser,
  AiOutlineZoomIn,
} from "react-icons/ai";
import { BiCog, BiRename } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Scrollbars from "react-custom-scrollbars";
import { api, configs } from "../../configs";
import axios from "axios";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { useQuery } from "react-query";
import { GiCardboardBox } from "react-icons/gi";
import { nanoid } from "nanoid";
import Hotkeys, { OnKeyFun } from "react-hot-keys";
import ProductInfo from "./components/productInfo";
import PartitionSale from "./components/partitionSale";
import AddictionalItems from "./components/addictionalItems";

type ClientsProps = {
  id: string;
  name: string;
  cpf: string;
  phone: string;
  street: string;
  number: string;
  comp: string;
  district: string;
  zip_code: string;
  state: string;
  city: string;
};

type PartitionSaleProps = {
  id: string;
  name: string;
  value: number;
};

type SizeProps = {
  id: string;
  description: string;
  inventory: number;
};

type ProductsProps = {
  id: string;
  title: string;
  thumbnail: string;
  barcode: string;
  sku: string;
  in_promotion: boolean;
  sale_value: string;
  profit_percent: number;
  unit_desc: string;
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without"
    | "sizes";
  have_adictional: boolean;
  type_sale: "unique" | "partition";
  sub_category: CatProps;
  category: CatProps;
  sale_options?: string;
  sale_options_category: string;
  adictional_items_id: string;
  Sizes: SizeProps[];
  inventory: number;
  PartitionSale: PartitionSaleProps[];
};

type CatProps = {
  title: string;
};

type Props = {
  id: string;
  token: string;
};

type ProductSaleProps = {
  id: string;
  product_id: string;
  thumbnail: string;
  name: string;
  quantity: number;
  type:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without"
    | "sizes";
  unity: string;
  sale_value: number;
  sale_total: number;
  partition: PartitionSaleProps[] | null;
  adictional: PartitionSaleProps[] | null;
  widths: number;
  height: number;
  size: SizeProps | null;
};

type WidthsProps = {
  id: string;
  width: string;
};

type PartitionInfoProps = {
  id: string;
  name: string;
  value: number;
  PartitionSale: PartitionSaleProps[];
};

type AddictionalInfoProps = {
  id: string;
  name: string;
  value: number;
  AddictionalItem: PartitionSaleProps[];
};

type PartitionSaleInfoProps = {
  partitionSale: PartitionInfoProps | undefined;
  addictionalItems: AddictionalInfoProps | undefined;
};

registerLocale("pt_br", pt_br);

const PDV = () => {
  const toast = useToast();
  const inputref = useRef(null);
  const { colorMode } = useColorMode();

  const [clients, setClients] = useState<ClientsProps[]>([]);
  const [clientsRef, setClientsRef] = useState<ClientsProps[]>([]);
  const [client, setClient] = useState<ClientsProps>();
  const [products, setProducts] = useState<ProductsProps[]>([]);
  const [modalClients, setModalClients] = useState<boolean>(false);
  const [searchClient, setSearchClient] = useState<string>("");
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [saleProducts, setSaleProducts] = useState<ProductSaleProps[]>([]);

  const [quantity, setQuantity] = useState<number>(1);
  const [modalWithUnity, setModalWithUnity] = useState<boolean>(false);
  const [modalPartitionSale, setModalPartitionSale] = useState<boolean>(false);
  const [modalAddicionalItems, setModalAddicionalItems] =
    useState<boolean>(false);
  const [refSaleValue, setRefSaleValue] = useState<number>(0);
  const [partitionSale, setPartitionSale] = useState<PartitionSaleProps[]>([]);
  const [adicionalItems, setAdictionalItems] = useState<PartitionSaleProps[]>(
    []
  );
  const [modalProductInfo, setModalProductInfo] = useState<boolean>(false);
  const [productInfo, setProductInfo] = useState<ProductsProps | null>(null);
  const [partitionSaleInfo, setPartitionSaleInfo] =
    useState<PartitionSaleInfoProps | null>(null);

  const [totalOrder, setTotalOrder] = useState<number>(0);

  const [name, setName] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");
  const [sku, setSku] = useState<string>("");

  const [auth, setAuth] = useState<Props>();

  useEffect(() => {
    const sum = saleProducts.reduce((a, b) => +a + +b.sale_total, 0);
    setTotalOrder(sum);
  }, [saleProducts]);

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

  const findDependents = async (id: string) => {
    try {
      const response = await api.get(`/pdv_dependent/${id}`);
      setClients(response.data.clients);
      setClientsRef(response.data.clients);
      setPartitionSale(response.data.partition_sale);
      setAdictionalItems(response.data.adictional_items);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  useEffect(() => {
    if (auth) {
      findDependents(auth?.id || "");
    }
  }, [auth]);

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  async function getInformation() {
    try {
      let companyId;
      if (!auth) {
        const company = localStorage.getItem("company");
        let companyParse = JSON.parse(company || "");
        companyId = companyParse.id;
      } else {
        companyId = auth.id;
      }
      const { data } = await api.get(`/pdv_products/${companyId}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  const { data, isLoading, error } = useQuery("list-products", getInformation, {
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (data) {
      setProducts(data);
    }
  }, [data]);

  function searchProductByName(text: string) {
    setName(text);
    if (text === "") {
      setProducts(data);
    } else {
      const initProducts: ProductsProps[] = data;
      const result = initProducts.filter((obj) =>
        obj.title.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(result);
    }
  }

  function searchProductByBarcode(text: string) {
    setBarcode(text);
    if (text === "") {
      setProducts(data);
    } else {
      const initProducts: ProductsProps[] = data;
      const result = initProducts.filter((obj) => obj.barcode.includes(text));
      setProducts(result);
    }
  }

  function searchProductBySku(text: string) {
    setSku(text);
    if (text === "") {
      setProducts(data);
    } else {
      const initProducts: ProductsProps[] = data;
      const result = initProducts.filter((obj) =>
        obj.sku.toLowerCase().includes(text.toLowerCase())
      );
      setProducts(result);
    }
  }

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  function handleClient(id: string) {
    const result = clients?.find((obj) => obj.id === id);
    setClient(result);
    setModalClients(false);
    setClients(clientsRef);
    setSearchClient("");
  }

  function handleSearchClient(text: string) {
    setSearchClient(text);
    if (text === "") {
      setClients(clientsRef);
    } else {
      const result = clientsRef?.filter((obj) =>
        obj.name.toLowerCase().includes(text.toLowerCase())
      );
      setClients(result);
    }
  }

  const CustomInput = forwardRef((props: any, ref) => {
    return <Input {...props} ref={ref} size="sm" />;
  });

  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  function handleAddProduct(id: string, un: string) {
    const productsReferencia: ProductsProps[] = data;
    const result = productsReferencia.find((obj) => obj.id === id);
    if (
      un === "meter" ||
      un === "unity" ||
      un === "weight" ||
      un === "liter" ||
      un === "without"
    ) {
      setProductInfo(result || null);
      if (result?.type_sale === "partition") {
        setModalPartitionSale(true);
        const partition = partitionSale.find(
          (obj) => obj.id === result.sale_options_category
        );
        const addicional = adicionalItems.find(
          (obj) => obj.id === result.adictional_items_id
        );
        setPartitionSaleInfo({
          addictionalItems: addicional as AddictionalInfoProps,
          partitionSale: partition as PartitionInfoProps,
        });
        setModalPartitionSale(true);
      } else {
        if (result?.have_adictional === true) {
          const addicional = adicionalItems.find(
            (obj) => obj.id === result?.adictional_items_id
          );
          setPartitionSaleInfo({
            partitionSale: undefined,
            addictionalItems: addicional as AddictionalInfoProps,
          });
          setModalAddicionalItems(true);
        } else {
          setModalWithUnity(true);
        }
      }
      setRefSaleValue(
        result?.in_promotion
          ? calcPercent(result?.sale_value, result.profit_percent)
          : parseFloat(result?.sale_value || "")
      );
    }
  }

  const addToCartUnity = () => {
    const findProduct = saleProducts?.find(
      (obj) => obj.product_id === productInfo?.id
    );
    if (findProduct) {
      showToast("Este produto já foi adicionado", "warning", "Atenção");
      return false;
    }
    let info: ProductSaleProps = {
      id: nanoid() || "",
      product_id: productInfo?.id || "",
      thumbnail: productInfo?.thumbnail || "",
      name: productInfo?.title || "",
      quantity: quantity || 0,
      sale_value: parseFloat(productInfo?.sale_value as string),
      sale_total: parseFloat(productInfo?.sale_value as string) * quantity,
      unity: productInfo?.unit_desc || "",
      type: productInfo?.type_unit || "unity",
      partition: null,
      adictional: null,
      height: 0,
      widths: 0,
      size: null,
    };
    setSaleProducts((old) => [...old, info]);
    setQuantity(1);
    setModalWithUnity(false);
  };

  const removeFromCart = (id: string) => {
    const result = saleProducts?.filter((obj) => obj.id !== id);
    setSaleProducts(result);
  };

  const handleProductInfo = (id: string) => {
    const result = products?.find((obj) => obj.id === id);
    setProductInfo(result || null);
    setModalProductInfo(true);
  };

  const onKeyDown: OnKeyFun = (shortcut, evn, handle) => {
    switch (shortcut) {
      case "f2":
        setModalClients(true);
        break;

      case "f3":
        modalWithUnity && document.getElementById("quantity")?.focus();
        break;

      case "f8":
        const inputSku = document.getElementById("sku");
        inputSku?.focus();
        break;

      case "f9":
        const inputBarcode = document.getElementById("barcode");
        inputBarcode?.focus();
        break;

      case "f10":
        const inputName = document.getElementById("name");
        inputName?.focus();
        break;

      case "f1":
        addToCartUnity();
        break;

      default:
        break;
    }
  };

  function handleProductPartitionSale(
    id: string,
    partition: PartitionSaleProps[] | null,
    addicional: PartitionSaleProps[] | null,
    totalPartition: number
  ) {
    const result = products.find((obj) => obj.id === id);
    if (partition === null) {
      showToast(
        "Complete seu pedido, ainda falta selecionar outras opções",
        "warning",
        "Atenção"
      );
      return false;
    } else if (
      (partition?.length as number) < parseInt(result?.sale_options as string)
    ) {
      showToast(
        "Complete seu pedido, ainda falta selecionar outras opções",
        "warning",
        "Atenção"
      );
      return false;
    }
    const findProduct = saleProducts?.find((obj) => obj.product_id === id);
    if (findProduct) {
      showToast("Este produto já foi adicionado", "warning", "Atenção");
      return false;
    }
    let info: ProductSaleProps = {
      id: nanoid() || "",
      product_id: result?.id || "",
      thumbnail: result?.thumbnail || "",
      name: result?.title || "",
      quantity: 1,
      sale_value: totalPartition,
      sale_total: totalPartition * 1,
      unity: result?.unit_desc || "",
      type: result?.type_unit || "unity",
      partition: partition,
      adictional: addicional,
      height: 0,
      widths: 0,
      size: null,
    };
    setSaleProducts((old) => [...old, info]);
    setModalPartitionSale(false);
  }

  return (
    <Fragment>
      <Hotkeys
        keyName="f2, ctrl+p, f6, f3, f7, f8, f9, f10, f12, f1, f4, f5, f11, ctrl+o, ctrl+v, ctrl+a"
        onKeyDown={onKeyDown}
        allowRepeat
        filter={(event) => {
          return true;
        }}
      >
        <Box py={2} h="full" maxH={"full"} position="relative">
          <Grid
            templateColumns={"1fr 1fr"}
            gap={3}
            h={"55px"}
            position={"absolute"}
            top={1}
            right={0}
            left={0}
          >
            <HStack>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AiOutlineUser />}
                />
                <Input
                  placeholder="Cliente"
                  value={client?.name || ""}
                  isReadOnly
                />
              </InputGroup>

              <Popover placement="bottom">
                <PopoverTrigger>
                  <IconButton aria-label="Detalhes" icon={<AiOutlineMore />} />
                </PopoverTrigger>
                <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Informações</PopoverHeader>
                  <PopoverBody>
                    <Stack>
                      <Box rounded="md" borderWidth={"1px"} overflow="hidden">
                        <Box
                          bg={useColorModeValue(
                            "blackAlpha.100",
                            "whiteAlpha.100"
                          )}
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight={"semibold"}
                        >
                          CPF
                        </Box>
                        <Box p={2} fontSize="sm">
                          {client?.cpf || ""}
                        </Box>
                      </Box>
                      <Box rounded="md" borderWidth={"1px"} overflow="hidden">
                        <Box
                          bg={useColorModeValue(
                            "blackAlpha.100",
                            "whiteAlpha.100"
                          )}
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight={"semibold"}
                        >
                          Contato
                        </Box>
                        <Box p={2} fontSize="sm">
                          {client?.phone || ""}
                        </Box>
                      </Box>
                      <Box rounded="md" borderWidth={"1px"} overflow="hidden">
                        <Box
                          bg={useColorModeValue(
                            "blackAlpha.100",
                            "whiteAlpha.100"
                          )}
                          px={3}
                          py={1}
                          fontSize="sm"
                          fontWeight={"semibold"}
                        >
                          Endereço
                        </Box>
                        <Box p={2} fontSize="sm">
                          {!client
                            ? ""
                            : `${client?.street || ""}, ${
                                client?.number || ""
                              }, ${client?.district || ""}, ${
                                client?.city || ""
                              } - ${client?.state || ""}`}
                        </Box>
                      </Box>
                    </Stack>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
              <Button
                colorScheme="blue"
                leftIcon={<AiOutlineSearch />}
                px={7}
                onClick={() => setModalClients(true)}
              >
                Buscar{" "}
                <Kbd color={"ButtonText"} ml={2}>
                  F2
                </Kbd>
              </Button>
            </HStack>

            <HStack>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AiOutlineNumber />}
                  zIndex={1}
                />
                <Input
                  placeholder="SKU"
                  id="sku"
                  value={sku}
                  onChange={(e) => searchProductBySku(e.target.value)}
                />
                <InputRightAddon px={2}>
                  <Kbd colorScheme={"blue"}>F8</Kbd>
                </InputRightAddon>
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<AiOutlineBarcode />}
                  zIndex={1}
                />
                <Input
                  placeholder="Código de Barras"
                  id="barcode"
                  value={barcode}
                  onChange={(e) => searchProductByBarcode(e.target.value)}
                />
                <InputRightAddon px={2}>
                  <Kbd colorScheme={"blue"}>F9</Kbd>
                </InputRightAddon>
              </InputGroup>
              <InputGroup>
                <InputLeftElement
                  pointerEvents="none"
                  children={<BiRename />}
                />
                <Input
                  placeholder="Nome"
                  id="name"
                  value={name}
                  onChange={(e) => searchProductByName(e.target.value)}
                />
                <InputRightAddon px={2}>
                  <Kbd colorScheme={"blue"}>F10</Kbd>
                </InputRightAddon>
              </InputGroup>
              <Popover placement="left-end">
                <PopoverTrigger>
                  <IconButton aria-label="Detalhes" icon={<BiCog />} />
                </PopoverTrigger>
                <PopoverContent
                  shadow="lg"
                  _focus={{ outline: "none" }}
                  zIndex={1000}
                >
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Configurações de Venda</PopoverHeader>
                  <PopoverBody>
                    <FormControl>
                      <FormLabel>Data da Venda</FormLabel>
                      <DatePicker
                        selected={saleDate}
                        onChange={(e) => setSaleDate(e || new Date())}
                        customInput={<CustomInput inputRef={inputref} />}
                        locale="pt_br"
                        dateFormat="dd/MM/yyyy"
                        showPopperArrow={true}
                      />
                    </FormControl>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </HStack>
          </Grid>

          <Box
            h="full"
            maxH="full"
            overflow={"hidden"}
            pt={"58px"}
            pb={1}
            px={1}
          >
            <Grid templateColumns={"570px 1fr"} gap={3} h="full" maxH={"full"}>
              <Grid
                templateRows={"1fr 100px"}
                borderWidth="2px"
                overflow={"hidden"}
                rounded="md"
                shadow={"md"}
                borderColor={useColorModeValue("blue.500", "blue.300")}
              >
                <Box maxH={"full"} h="full" overflow={"auto"}>
                  <Scrollbars autoHide>
                    {saleProducts.length === 0 ? (
                      <Flex
                        justify={"center"}
                        align="center"
                        direction={"column"}
                        mt={10}
                      >
                        <Icon as={GiCardboardBox} fontSize="8xl" />
                        <Text>Nenhum item na venda</Text>
                      </Flex>
                    ) : (
                      <Table size="sm">
                        <Thead
                          position="sticky"
                          top={0}
                          bg={useColorModeValue("white", "gray.800")}
                          shadow={"sm"}
                          zIndex={1}
                        >
                          <Tr>
                            <Th w="1%"></Th>
                            <Th py={3} w="1%" textAlign={"center"}>
                              Qtd
                            </Th>
                            <Th>descrição</Th>
                            <Th isNumeric>Unit</Th>
                            <Th isNumeric>Total</Th>
                            <Th w="3%" textAlign={"center"}>
                              Opções
                            </Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {saleProducts?.map((prd) => (
                            <Tr key={prd.id}>
                              <Td>
                                <Avatar
                                  src={prd.thumbnail}
                                  size="xs"
                                  zIndex={-1}
                                />
                              </Td>
                              <Td textAlign={"center"}>{prd.quantity}</Td>
                              <Td>{prd.name}</Td>
                              <Td isNumeric>
                                {prd.sale_value.toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Td>
                              <Td isNumeric>
                                {prd.sale_total.toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Td>
                              <Td textAlign={"center"}>
                                <HStack>
                                  <Tooltip label="Detalhes do Item" hasArrow>
                                    <IconButton
                                      aria-label="Detalhes"
                                      icon={<AiOutlineMore />}
                                      size="xs"
                                    />
                                  </Tooltip>

                                  <Popover>
                                    <PopoverTrigger>
                                      <IconButton
                                        aria-label="remover item"
                                        icon={<FaTrashAlt />}
                                        colorScheme="red"
                                        size="xs"
                                        zIndex={0}
                                      />
                                    </PopoverTrigger>

                                    <PopoverContent
                                      shadow="lg"
                                      _focus={{ outline: "none" }}
                                    >
                                      <PopoverArrow />
                                      <PopoverHeader textAlign={"justify"}>
                                        Confirmação
                                      </PopoverHeader>
                                      <PopoverCloseButton />
                                      <PopoverBody textAlign={"justify"}>
                                        Deseja excluir este item?
                                      </PopoverBody>
                                      <PopoverFooter
                                        display="flex"
                                        justifyContent={"end"}
                                      >
                                        <Button
                                          leftIcon={<AiOutlineCheck />}
                                          colorScheme="blue"
                                          size="sm"
                                          onClick={() => removeFromCart(prd.id)}
                                        >
                                          Sim
                                        </Button>
                                      </PopoverFooter>
                                    </PopoverContent>
                                  </Popover>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    )}
                  </Scrollbars>
                </Box>
                <Grid
                  bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
                  boxShadow={
                    colorMode === "light"
                      ? "0px -2px 6px rgba(0,0,0,.1)"
                      : "0px -2px 6px rgba(0,0,0,.3)"
                  }
                  templateRows="1fr 1fr 1fr"
                >
                  <Flex
                    justify={"space-between"}
                    w="full"
                    px={5}
                    align="center"
                    fontWeight={"light"}
                  >
                    <Text>SUB TOTAL</Text>
                    <Text>
                      {totalOrder.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </Flex>
                  <Flex
                    justify={"space-between"}
                    w="full"
                    px={5}
                    align="center"
                    fontWeight={"light"}
                  >
                    <Text>DESCONTO</Text>
                    <Text>0%</Text>
                  </Flex>
                  <Flex
                    justify={"space-between"}
                    w="full"
                    fontSize={"lg"}
                    fontWeight="semibold"
                    bg={useColorModeValue("blue.500", "blue.300")}
                    color={useColorModeValue("white", "gray.800")}
                    px={5}
                    align="center"
                  >
                    <Text>TOTAL A PAGAR</Text>
                    <Text>
                      {totalOrder.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </Flex>
                </Grid>
              </Grid>
              <Grid
                templateRows={"1fr 56px"}
                borderWidth="2px"
                overflow={"hidden"}
                rounded="md"
                shadow={"md"}
                borderColor={useColorModeValue("blue.500", "blue.300")}
              >
                <Box maxH={"full"} h="full" overflow={"auto"} p={3}>
                  <Scrollbars autoHide>
                    {isLoading ? (
                      <Grid templateColumns={"repeat(4, 1fr)"} gap={2}>
                        <Skeleton h="200px" rounded={"md"} />
                        <Skeleton h="200px" rounded={"md"} />
                        <Skeleton h="200px" rounded={"md"} />
                        <Skeleton h="200px" rounded={"md"} />
                      </Grid>
                    ) : (
                      <Fragment>
                        {!products || products.length === 0 ? (
                          <Flex
                            justify={"center"}
                            align="center"
                            direction={"column"}
                          >
                            <Icon as={GiCardboardBox} fontSize="8xl" />
                            <Text>Nenhuma informação para mostrar</Text>
                          </Flex>
                        ) : (
                          <>
                            <Box
                              w="100%"
                              sx={{ columnCount: [1, 2, 3, 3], columnGap: 2 }}
                            >
                              {products?.map((prod) => (
                                <Grid
                                  templateColumns={"78px 1fr"}
                                  rounded="md"
                                  overflow={"hidden"}
                                  borderWidth="1px"
                                  h="78px"
                                  key={prod.id}
                                  mb={2}
                                  position="relative"
                                >
                                  {prod.in_promotion && (
                                    <Tag
                                      position={"absolute"}
                                      right={1}
                                      top={1}
                                      colorScheme="red"
                                      size={"sm"}
                                    >
                                      -{prod.profit_percent}%
                                    </Tag>
                                  )}
                                  <Box
                                    w="100%"
                                    bg={useColorModeValue(
                                      "blackAlpha.100",
                                      "whiteAlpha.100"
                                    )}
                                  >
                                    <Image
                                      src={prod.thumbnail || ""}
                                      w="78px"
                                      h="78px"
                                      objectFit={"cover"}
                                    />
                                  </Box>
                                  <Box p={2}>
                                    <Tooltip label={prod.title} hasArrow>
                                      <Text
                                        fontSize="sm"
                                        noOfLines={2}
                                        cursor="pointer"
                                        mt={-1}
                                      >
                                        {prod.title || ""}
                                      </Text>
                                    </Tooltip>
                                    {prod.in_promotion ? (
                                      <HStack spacing={2} mt={-1}>
                                        <Text
                                          fontSize={"sm"}
                                          textDecor="line-through"
                                          color={useColorModeValue(
                                            "gray.600",
                                            "gray.400"
                                          )}
                                        >
                                          {parseFloat(
                                            prod.sale_value
                                          ).toLocaleString("pt-br", {
                                            style: "currency",
                                            currency: "BRL",
                                          })}
                                        </Text>
                                        <Text
                                          fontSize={"sm"}
                                          fontWeight="semibold"
                                        >
                                          {calcPercent(
                                            prod.sale_value,
                                            prod.profit_percent
                                          ).toLocaleString("pt-br", {
                                            style: "currency",
                                            currency: "BRL",
                                          })}{" "}
                                          {prod.unit_desc}
                                        </Text>
                                      </HStack>
                                    ) : (
                                      <Text
                                        fontSize={"sm"}
                                        fontWeight="semibold"
                                        mt={-1}
                                      >
                                        {parseFloat(
                                          prod.sale_value
                                        ).toLocaleString("pt-br", {
                                          style: "currency",
                                          currency: "BRL",
                                        })}{" "}
                                        {prod.unit_desc}
                                      </Text>
                                    )}
                                    <HStack mt={1} w="100%">
                                      <Button
                                        leftIcon={<AiOutlineShoppingCart />}
                                        size="xs"
                                        isFullWidth
                                        onClick={() =>
                                          handleAddProduct(
                                            prod.id,
                                            prod.type_unit
                                          )
                                        }
                                      >
                                        Adicionar
                                      </Button>
                                      <IconButton
                                        aria-label="Detalhes"
                                        icon={<AiOutlineZoomIn />}
                                        onClick={() =>
                                          handleProductInfo(prod.id)
                                        }
                                        size="xs"
                                        variant={"outline"}
                                      />
                                    </HStack>
                                  </Box>
                                </Grid>
                              ))}
                            </Box>
                            <Flex
                              borderTopWidth={"1px"}
                              mt={2}
                              pt={3}
                              align="center"
                              gap={2}
                              pl={1}
                            >
                              <Button size={"sm"}>Anterior</Button>
                              <Text>1 / 1</Text>
                              <Button size={"sm"}>Próxima</Button>
                            </Flex>
                          </>
                        )}
                      </Fragment>
                    )}
                  </Scrollbars>
                </Box>
                <Grid
                  templateColumns="1fr 1fr 3fr"
                  gap={2}
                  px={2}
                  alignItems="center"
                  boxShadow={
                    colorMode === "light"
                      ? "0px -2px 6px rgba(0,0,0,.1)"
                      : "0px -2px 6px rgba(0,0,0,.3)"
                  }
                  bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
                >
                  <Menu>
                    <MenuButton
                      as={Button}
                      aria-label="Oções"
                      leftIcon={<AiOutlineTool />}
                      colorScheme="blue"
                      variant="outline"
                    >
                      Opções
                    </MenuButton>
                    <MenuList>
                      <MenuItem icon={<AiOutlineEdit />}>Observações</MenuItem>
                      <MenuItem icon={<AiOutlineSave />}>
                        Salvar como Orçamento
                      </MenuItem>
                      <MenuItem icon={<BsPrinter />}>Imprimir Venda</MenuItem>
                      <MenuDivider />
                      <MenuItem
                        icon={<FaTrashAlt />}
                        color={useColorModeValue("red.600", "red.200")}
                      >
                        Cancelar Venda
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Button leftIcon={<AiOutlinePercentage />} colorScheme="blue">
                    Desconto{" "}
                    <Kbd color={"ButtonText"} ml={2}>
                      F6
                    </Kbd>
                  </Button>
                  <Button
                    leftIcon={<AiOutlineShoppingCart />}
                    colorScheme="green"
                  >
                    Finalizar Venda{" "}
                    <Kbd color={"ButtonText"} ml={2}>
                      F4
                    </Kbd>
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Box>
        </Box>

        <Modal
          isOpen={modalClients}
          onClose={() => setModalClients(false)}
          size="xl"
          scrollBehavior="inside"
        >
          <ModalOverlay />
          <ModalContent position={"relative"}>
            <ModalBody>
              <Box py={2}>
                <InputGroup size={"lg"}>
                  <InputLeftElement
                    pointerEvents="none"
                    children={
                      <Icon
                        as={AiOutlineSearch}
                        color={useColorModeValue("blue.500", "blue.300")}
                        fontSize="3xl"
                      />
                    }
                  />
                  <Input
                    placeholder="Digite para buscar"
                    variant={"flushed"}
                    autoFocus
                    onChange={(e) => handleSearchClient(e.target.value)}
                    value={searchClient}
                  />
                </InputGroup>
              </Box>

              <Stack spacing={2} role="listbox" pb={2} mt={2}>
                {clients?.map((cli) => (
                  <Button
                    key={cli.id}
                    leftIcon={<AiOutlineUser fontSize={"20px"} />}
                    isFullWidth
                    py={7}
                    size="lg"
                    justifyContent={"space-between"}
                    rightIcon={<AiOutlineEnter />}
                    textAlign="justify"
                    _focus={{
                      bg: useColorModeValue("blue.500", "blue.300"),
                      color: useColorModeValue("white", "gray.800"),
                    }}
                    _hover={{
                      bg: useColorModeValue("blue.500", "blue.300"),
                      color: useColorModeValue("white", "gray.800"),
                    }}
                    _active={{
                      bg: useColorModeValue("blue.600", "blue.400"),
                      color: useColorModeValue("white", "gray.800"),
                    }}
                    onClick={() => handleClient(cli.id)}
                  >
                    <Box w="full" ml={5}>
                      <Text fontWeight={"medium"}>{cli.name}</Text>
                      <HStack spacing={5} fontWeight="light" fontSize={"xs"}>
                        <Text>{cli.phone}</Text>
                        <Text>{cli.cpf}</Text>
                      </HStack>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </ModalBody>
          </ModalContent>
        </Modal>

        <Modal
          isOpen={modalWithUnity}
          onClose={() => setModalWithUnity(false)}
          size="md"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Quantidade</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl>
                <InputGroup>
                  <InputLeftAddon children={<Kbd>F3</Kbd>} />
                  <Input
                    value={quantity}
                    onChange={(e) => setQuantity(parseFloat(e.target.value))}
                    type="number"
                    id="quantity"
                    autoFocus
                  />
                </InputGroup>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <HStack>
                <InputGroup>
                  <InputLeftAddon children="R$" />
                  <Input
                    placeholder="Total"
                    isReadOnly
                    value={
                      parseFloat((quantity * refSaleValue).toFixed(2)) ||
                      parseFloat("0").toLocaleString("pt-br", {
                        minimumFractionDigits: 2,
                      })
                    }
                  />
                </InputGroup>
                <Button
                  colorScheme="blue"
                  leftIcon={<AiOutlineShoppingCart />}
                  px={10}
                  onClick={() => addToCartUnity()}
                >
                  Adicionar{" "}
                  <Kbd color={"ButtonText"} ml={2}>
                    F1
                  </Kbd>
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <PartitionSale
          isOpen={modalPartitionSale}
          onClose={setModalPartitionSale}
          productInfo={productInfo}
          partitionSale={partitionSaleInfo?.partitionSale || null}
          addictionalItems={partitionSaleInfo?.addictionalItems || null}
          onSuccess={handleProductPartitionSale}
        />

        <ProductInfo
          isOpen={modalProductInfo}
          productInfo={productInfo}
          onClose={setModalProductInfo}
        />

        <AddictionalItems
          isOpen={modalAddicionalItems}
          onClose={setModalAddicionalItems}
          onSuccess={() => {}}
          productInfo={productInfo}
          addictionalItems={partitionSaleInfo?.addictionalItems || null}
        />
      </Hotkeys>
    </Fragment>
  );
};

export default memo(PDV);
