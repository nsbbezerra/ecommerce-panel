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
  Divider,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from "@chakra-ui/react";
import { forwardRef, Fragment, useEffect, useRef, useState, memo } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineEdit,
  AiOutlineEnter,
  AiOutlineMore,
  AiOutlineNumber,
  AiOutlinePartition,
  AiOutlinePercentage,
  AiOutlinePlus,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShoppingCart,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";
import { BiCode, BiCog, BiRename } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Scrollbars from "react-custom-scrollbars";
import { api, configs } from "../../configs";
import axios from "axios";
import { useHotkeys } from "react-hotkeys-hook";
import DatePicker, { registerLocale } from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { useQuery } from "react-query";
import { GiCardboardBox } from "react-icons/gi";

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
  name: string;
  quantity: number;
  unity: string;
  sale_value: number;
  sale_total: number;
  partition?: PartitionProps[];
  adictional?: AdicionalProps[];
  widths?: WidthsProps;
  height: number;
};

type WidthsProps = {
  id: string;
  width: string;
};

type PartitionProps = {
  id: string;
  quantity: number;
  partition_id: string;
  partition_name: string;
  value: number;
};

type AdicionalProps = {
  id: string;
  quantity: number;
  adictional_id: string;
  adictional_name: string;
  value: number;
};

type PartitionSaleProps = {
  id: string;
  name: string;
  value: string;
};

registerLocale("pt_br", pt_br);

const PDV = () => {
  const toast = useToast();
  const inputref = useRef(null);
  const { colorMode } = useColorMode();

  const [clients, setClients] = useState<ClientsProps[]>();
  const [clientsRef, setClientsRef] = useState<ClientsProps[]>();
  const [client, setClient] = useState<ClientsProps>();
  const [products, setProducts] = useState<ProductsProps[]>();
  const [modalClients, setModalClients] = useState<boolean>(false);
  const [searchClient, setSearchClient] = useState<string>("");
  const [saleDate, setSaleDate] = useState<Date>(new Date());
  const [saleProducts, setSaleProducts] = useState<ProductSaleProps[]>();
  const [loadingFind, setLoadingFind] = useState<boolean>(false);

  const [quantity, setQuantity] = useState<number>(1);
  const [modalWithUnity, setModalWithUnity] = useState<boolean>(false);
  const [modalAdictionalItems, setModalAdictionalItems] =
    useState<boolean>(true);
  const [modalPartitionSale, setModalPartitionSale] = useState<boolean>(false);
  const [refSaleValue, setRefSaleValue] = useState<number>(0);
  const [refWidthsList, setRefWidthsList] = useState<WidthsProps[]>();
  const [refWidth, setRefWidth] = useState<number>(0);
  const [refHeight, setRefHeight] = useState<number>(0);
  const [refProduct, setRefProduct] = useState<ProductsProps>();
  const [partitionSale, setPartitionSale] = useState<PartitionSaleProps[]>();
  const [adicionalItems, setAdictionalItems] = useState<PartitionSaleProps[]>();

  const [name, setName] = useState<string>("");
  const [barcode, setBarcode] = useState<string>("");
  const [sku, setSku] = useState<string>("");

  const [auth, setAuth] = useState<Props>();

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

  const findClients = async (id: string) => {
    try {
      const response = await api.get(`/pdv_clients/${id}`);
      setClients(response.data);
      setClientsRef(response.data);
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
      findClients(auth?.id || "");
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

  useHotkeys("F2", (e) => {
    setModalClients(true);
  });

  useHotkeys("F4", (e) => {
    const input = document.getElementById("name");
    input?.focus();
  });

  useHotkeys("F9", (e) => {
    const input = document.getElementById("barcode");
    input?.focus();
  });

  const TableRow = () => (
    <Tr>
      <Td>
        <Avatar
          src="https://img.freepik.com/psd-premium/fone-de-ouvido-cor-vermelha-marca-produto-midia-social-post-banner_154386-99.jpg?w=2000"
          size="xs"
          zIndex={-1}
        />
      </Td>
      <Td>10</Td>
      <Td>Pizza Calabresa G</Td>
      <Td>R$ 40,00</Td>
      <Td>R$ 400,00</Td>
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

            <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
              <PopoverArrow />
              <PopoverHeader textAlign={"justify"}>Confirmação</PopoverHeader>
              <PopoverCloseButton />
              <PopoverBody textAlign={"justify"}>
                Deseja excluir este item?
              </PopoverBody>
              <PopoverFooter display="flex" justifyContent={"end"}>
                <Button
                  leftIcon={<AiOutlineCheck />}
                  colorScheme="blue"
                  size="sm"
                >
                  Sim
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>
        </HStack>
      </Td>
    </Tr>
  );

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
    setRefProduct(result);
    console.log(un);
    if (
      un === "meter" ||
      un === "unity" ||
      un === "weight" ||
      un === "liter" ||
      un === "without"
    ) {
      setModalWithUnity(true);
      setRefSaleValue(parseFloat(result?.sale_value || ""));
    }
  }

  async function findAdictionalItems(id: string) {
    try {
      setLoadingFind(true);
      setModalAdictionalItems(true);
      const response = await api.get(`/adictionalItems/${id}`);
      setAdictionalItems(response.data);
      console.log(response.data);
      setLoadingFind(false);
    } catch (error) {
      setLoadingFind(false);
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
      <Box py={2} h="full" maxH={"full"} position="relative">
        <Grid
          templateColumns={"1fr 1fr"}
          gap={3}
          h={"55px"}
          position={"absolute"}
          top={2}
          right={0}
          left={0}
        >
          <HStack borderWidth="1px" rounded="md" px={2}>
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

            <Popover>
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

          <HStack borderWidth="1px" rounded="md" px={2}>
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
                <Kbd colorScheme={"blue"}>F9</Kbd>
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
              <InputLeftElement pointerEvents="none" children={<BiRename />} />
              <Input
                placeholder="Nome"
                id="name"
                value={name}
                onChange={(e) => searchProductByName(e.target.value)}
              />
              <InputRightAddon px={2}>
                <Kbd colorScheme={"blue"}>F4</Kbd>
              </InputRightAddon>
            </InputGroup>
            <Popover placement="bottom-end">
              <PopoverTrigger>
                <IconButton aria-label="Detalhes" icon={<BiCog />} />
              </PopoverTrigger>
              <PopoverContent shadow="lg" _focus={{ outline: "none" }}>
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

        <Box h="full" maxH="full" overflow={"hidden"} pt={"65px"}>
          <Grid templateColumns={"570px 1fr"} gap={3} h="full" maxH={"full"}>
            <Grid
              templateRows={"1fr 130px"}
              borderWidth="1px"
              overflow={"hidden"}
              rounded="md"
            >
              <Box maxH={"full"} h="full" overflow={"auto"}>
                <Scrollbars autoHide>
                  <Table size="sm">
                    <Thead
                      position="sticky"
                      top={0}
                      bg={useColorModeValue("white", "gray.800")}
                      shadow={"md"}
                      zIndex={1}
                    >
                      <Tr>
                        <Th py={3} w="5%">
                          Thumb
                        </Th>
                        <Th w="3%">Qtd</Th>
                        <Th>Descrição</Th>
                        <Th>Unit</Th>
                        <Th>Total</Th>
                        <Th w="3%" textAlign={"center"}>
                          Opções
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      <TableRow />
                    </Tbody>
                  </Table>
                </Scrollbars>
              </Box>
              <Flex
                bg={useColorModeValue("blackAlpha.50", "whiteAlpha.50")}
                justify="space-between"
                align={"center"}
                direction="column"
                boxShadow={
                  colorMode === "light"
                    ? "0px -2px 6px rgba(0,0,0,.1)"
                    : "0px -2px 6px rgba(0,0,0,.3)"
                }
              >
                <Flex
                  justify={"space-between"}
                  w="full"
                  borderTopWidth={"1px"}
                  borderTopStyle="dashed"
                  borderTopColor={useColorModeValue("gray.400", "gray.500")}
                  borderBottomWidth={"1px"}
                  borderBottomStyle="dashed"
                  borderBottomColor={useColorModeValue("gray.400", "gray.500")}
                  px={5}
                  h={"44px"}
                  align="center"
                >
                  <Text>SUB TOTAL</Text>
                  <Text>R$ 40,00</Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  w="full"
                  px={5}
                  h={"40px"}
                  align="center"
                >
                  <Text>DESCONTO</Text>
                  <Text>10%</Text>
                </Flex>
                <Flex
                  justify={"space-between"}
                  w="full"
                  fontSize={"lg"}
                  fontWeight="semibold"
                  bg={useColorModeValue("blue.500", "blue.300")}
                  color={useColorModeValue("white", "gray.800")}
                  borderTopStyle="dashed"
                  borderTopWidth={"1px"}
                  borderTopColor={useColorModeValue("white", "gray.800")}
                  px={5}
                  h={"45px"}
                  align="center"
                >
                  <Text>TOTAL A PAGAR</Text>
                  <Text>R$ 36,00</Text>
                </Flex>
              </Flex>
            </Grid>
            <Grid
              templateRows={"1fr 64px"}
              borderWidth="1px"
              overflow={"hidden"}
              rounded="md"
            >
              <Box maxH={"full"} h="full" overflow={"auto"} p={2}>
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
                        <Box
                          w="100%"
                          sx={{ columnCount: [1, 2, 3, 4], columnGap: 2 }}
                        >
                          {products?.map((prod) => (
                            <Box
                              rounded="md"
                              overflow={"hidden"}
                              borderWidth="1px"
                              position={"relative"}
                              h="fit-content"
                              key={prod.id}
                              mb={2}
                            >
                              {prod.in_promotion && (
                                <Tag
                                  position={"absolute"}
                                  top={3}
                                  left={3}
                                  colorScheme="red"
                                >
                                  -{prod.profit_percent}%
                                </Tag>
                              )}
                              <Image src={prod.thumbnail || ""} w="100%" />
                              <Box borderTopWidth={"1px"} p={1}>
                                <HStack spacing={1}>
                                  <Text
                                    fontSize={"xx-small"}
                                    fontWeight="thin"
                                    noOfLines={1}
                                  >
                                    {prod.sku || ""}
                                  </Text>
                                  <Text
                                    fontSize={"xx-small"}
                                    fontWeight="thin"
                                    noOfLines={1}
                                  >
                                    -
                                  </Text>
                                  <Text
                                    fontSize={"xx-small"}
                                    fontWeight="thin"
                                    noOfLines={1}
                                  >
                                    {prod.barcode || ""}
                                  </Text>
                                </HStack>
                                <Tooltip
                                  label="Barbeador Profissional para Barbas"
                                  hasArrow
                                >
                                  <Text
                                    fontWeight={"semibold"}
                                    fontSize="sm"
                                    noOfLines={2}
                                  >
                                    {prod.title || ""}
                                  </Text>
                                </Tooltip>
                                <Text
                                  fontSize={"xs"}
                                  fontWeight="thin"
                                  noOfLines={1}
                                >
                                  {prod.category?.title || ""}
                                </Text>
                                <Text
                                  fontSize={"xs"}
                                  fontWeight="thin"
                                  noOfLines={1}
                                >
                                  {prod.sub_category?.title || ""}
                                </Text>
                                {prod.in_promotion ? (
                                  <HStack spacing={2}>
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
                                    <Text fontSize={"sm"} fontWeight="semibold">
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
                                  <Text fontSize={"sm"} fontWeight="semibold">
                                    {parseFloat(prod.sale_value).toLocaleString(
                                      "pt-br",
                                      {
                                        style: "currency",
                                        currency: "BRL",
                                      }
                                    )}{" "}
                                    {prod.unit_desc}
                                  </Text>
                                )}

                                <Button
                                  isFullWidth
                                  colorScheme={"blue"}
                                  size="sm"
                                  mt={1}
                                  leftIcon={<AiOutlineShoppingCart />}
                                  onClick={() =>
                                    handleAddProduct(prod.id, prod.type_unit)
                                  }
                                >
                                  Adicionar
                                </Button>
                              </Box>
                            </Box>
                          ))}
                        </Box>
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
                borderTopWidth="1px"
                borderTopStyle={"dashed"}
                borderTopColor={useColorModeValue("gray.400", "gray.500")}
              >
                <Menu>
                  <MenuButton
                    as={Button}
                    aria-label="Oções"
                    leftIcon={<AiOutlineTool />}
                    size="lg"
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
                <Button
                  size="lg"
                  leftIcon={<AiOutlinePercentage />}
                  colorScheme="blue"
                >
                  Desconto
                </Button>
                <Button
                  size="lg"
                  leftIcon={<AiOutlineShoppingCart />}
                  colorScheme="green"
                >
                  Finalizar
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
              <Input
                value={quantity}
                onChange={(e) => setQuantity(parseFloat(e.target.value))}
                type="number"
              />
            </FormControl>

            {refProduct?.type_sale === "partition" ? (
              <>
                <Divider mt={3} mb={3} />

                <Button leftIcon={<AiOutlinePartition />} isFullWidth>
                  Venda Fracionada
                </Button>
              </>
            ) : (
              ""
            )}

            {refProduct?.have_adictional ? (
              <>
                <Divider mt={3} mb={3} />

                <Button
                  leftIcon={<AiOutlineAppstoreAdd />}
                  isFullWidth
                  onClick={() =>
                    findAdictionalItems(refProduct.adictional_items_id)
                  }
                >
                  Itens Adicionais
                </Button>
              </>
            ) : (
              ""
            )}
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
              >
                Adicionar
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={modalAdictionalItems}
        onClose={() => setModalAdictionalItems(false)}
        size="4xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Itens Adicionais</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={5}>
            <Grid templateColumns={"1fr 1fr"} gap={5}>
              <Box rounded="md" borderWidth={"1px"} p={2} h="fit-content">
                <InputGroup mb={3}>
                  <InputLeftAddon children="Quantidade" />
                  <NumberInput w="full">
                    <NumberInputField roundedLeft={"none"} />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                </InputGroup>
                {loadingFind ? (
                  <Stack>
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                    <Skeleton rounded={"sm"} h={5} />
                  </Stack>
                ) : (
                  <Table size={"sm"}>
                    <Thead>
                      <Tr>
                        <Th>Descrição</Th>
                        <Th isNumeric>Valor</Th>
                        <Th w="5%" textAlign={"center"}>
                          Ação
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {adicionalItems?.map((add) => (
                        <Tr key={add.id}>
                          <Td>{add.name}</Td>
                          <Td isNumeric>
                            {parseFloat(add.value).toLocaleString("pt-br", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </Td>
                          <Td textAlign={"center"}>
                            <IconButton
                              aria-label="Adicionar Itens"
                              icon={<AiOutlinePlus />}
                              size="xs"
                              colorScheme={"blue"}
                            />
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
              <Box rounded="md" borderWidth={"1px"} p={2} h="fit-content"></Box>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default memo(PDV);
