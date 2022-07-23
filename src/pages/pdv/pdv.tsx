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
} from "@chakra-ui/react";
import { Fragment, useEffect, useState } from "react";
import {
  AiOutlineBarcode,
  AiOutlineCheck,
  AiOutlineEnter,
  AiOutlineFilter,
  AiOutlineMore,
  AiOutlinePercentage,
  AiOutlineSave,
  AiOutlineSearch,
  AiOutlineShopping,
  AiOutlineShoppingCart,
  AiOutlineTool,
  AiOutlineUser,
} from "react-icons/ai";
import { BiRename } from "react-icons/bi";
import { BsPrinter } from "react-icons/bs";
import { FaTrashAlt } from "react-icons/fa";
import Scrollbars from "react-custom-scrollbars";
import { api, configs } from "../../configs";
import axios from "axios";
import { TiPhoneOutline } from "react-icons/ti";

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
};

type CatProps = {
  title: string;
};

type Props = {
  id: string;
  token: string;
};

export default function PDV() {
  const toast = useToast();
  const { colorMode } = useColorMode();

  const [clients, setClients] = useState<ClientsProps[]>();
  const [client, setClient] = useState<ClientsProps>();
  const [products, setProducts] = useState<ProductsProps[]>();
  const [modalClients, setModalClients] = useState<boolean>(false);

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

  const ProductShow = () => (
    <Box
      rounded="md"
      overflow={"hidden"}
      borderWidth="1px"
      position={"relative"}
      h="fit-content"
    >
      <Image
        src="https://img.freepik.com/psd-premium/fone-de-ouvido-cor-vermelha-marca-produto-midia-social-post-banner_154386-99.jpg?w=2000"
        w="100%"
      />
      <Box borderTopWidth={"1px"} p={2}>
        <Tooltip label="Barbeador Profissional para Barbas" hasArrow>
          <Text fontWeight={"semibold"} fontSize="sm" noOfLines={1}>
            Barbeador Profissional para Barbas
          </Text>
        </Tooltip>
        <Text fontSize={"xs"} fontWeight="thin" noOfLines={1}>
          Barbeiro
        </Text>
        <Grid templateColumns={"2fr 1fr"} mt={1} gap={2}>
          <Tag justifyContent={"center"} w="100%">
            R$ 40,00
          </Tag>
          <IconButton
            aria-label="Adicionar Produto"
            icon={<AiOutlineShopping />}
            size="xs"
            colorScheme={"blue"}
          />
        </Grid>
      </Box>
    </Box>
  );

  function handleClient(id: string) {
    const result = clients?.find((obj) => obj.id === id);
    setClient(result);
    setModalClients(false);
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
              px={5}
              onClick={() => setModalClients(true)}
            >
              Buscar
            </Button>
          </HStack>

          <HStack borderWidth="1px" rounded="md" px={2}>
            <InputGroup w="72">
              <Input placeholder="QTD" />
              <InputRightAddon px={2}>QTD</InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftElement
                pointerEvents="none"
                children={<AiOutlineBarcode />}
                zIndex={1}
              />
              <Input placeholder="Código de Barras" />
              <InputRightAddon px={2}>
                <Kbd colorScheme={"blue"}>F9</Kbd>
              </InputRightAddon>
            </InputGroup>
            <InputGroup>
              <InputLeftElement pointerEvents="none" children={<BiRename />} />
              <Input placeholder="Nome" />
              <InputRightAddon px={2}>
                <Kbd colorScheme={"blue"}>F6</Kbd>
              </InputRightAddon>
            </InputGroup>
            <IconButton aria-label="Detalhes" icon={<AiOutlineFilter />} />
          </HStack>
        </Grid>

        <Box h="full" maxH="full" overflow={"hidden"} pt={"65px"}>
          <Grid templateColumns={"1fr 1fr"} gap={3} h="full" maxH={"full"}>
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
                  <Grid templateColumns={"repeat(4, 1fr)"} gap={2}>
                    <ProductShow />
                  </Grid>
                </Scrollbars>
              </Box>
              <Grid
                templateColumns="1fr 2fr 2fr"
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
                    as={IconButton}
                    aria-label="Oções"
                    icon={<AiOutlineTool />}
                    size="lg"
                    variant="outline"
                    colorScheme="blue"
                  />
                  <MenuList>
                    <MenuItem icon={<AiOutlineSave />}>
                      Salvar como Orçamento
                    </MenuItem>
                    <MenuItem icon={<BsPrinter />}>Imprimir Venda</MenuItem>
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
                  variant="outline"
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
    </Fragment>
  );
}
