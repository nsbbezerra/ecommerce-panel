import {
  Box,
  Button,
  Flex,
  HStack,
  Image,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  useColorMode,
  Tooltip,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Stack,
  FormControl,
  FormLabel,
  Input as ChakraInput,
  Grid,
  Switch,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  InputLeftElement,
  InputGroup,
  Avatar,
  Tag,
  Icon,
  Skeleton,
  MenuGroup,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import {
  AiOutlineAppstoreAdd,
  AiOutlineAreaChart,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineFall,
  AiOutlineFileText,
  AiOutlineHome,
  AiOutlineImport,
  AiOutlineLogout,
  AiOutlinePercentage,
  AiOutlineProfile,
  AiOutlineRise,
  AiOutlineShopping,
  AiOutlineTag,
  AiOutlineTags,
  AiOutlineTool,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
  AiOutlineKey,
  AiOutlineLogin,
  AiOutlineSave,
  AiOutlineShop,
  AiOutlineMenu,
} from "react-icons/ai";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FaRegSun, FaRegMoon } from "react-icons/fa";
import Input from "../components/Input";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";
import axios from "axios";
import { api } from "../configs/index";
import pt_br from "date-fns/locale/pt-BR";
import { format, differenceInDays } from "date-fns";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";

import logo from "../assets/logo.svg";

interface LoginData {
  user: string;
  password: string;
}

interface AuthData {
  company_id: string;
  code: string;
}

type LoadingProps = {
  loading: boolean;
  action: "login" | "auth" | "finding";
};

type CompanyProps = {
  id: string;
  thumbnail: string;
  fantasy_name: string;
  company_code: string;
  expires_code_date: Date;
};

export default function Header() {
  const navigate = useNavigate();
  const btnRef = useRef(null);
  const cancelRef = useRef(null);
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const { toggleColorMode, colorMode } = useColorMode();
  const [drawer, setDrawer] = useState<boolean>(false);
  const [alert, setAlert] = useState<boolean>(false);
  const [globalMenu, setGlobalMenu] = useState<boolean>(false);

  const [login, setLogin] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingProps>();
  const [company, setCompany] = useState<CompanyProps>();

  async function findCompanyInformation(id: string) {
    setLoading({ action: "finding", loading: true });
    try {
      const response = await api.get(`/findCompanyById/${id}`);
      setCompany(response.data);
      setLoading({ action: "finding", loading: false });
    } catch (error) {
      setLoading({ action: "finding", loading: false });
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    const result = localStorage.getItem("company");
    if (result) {
      const companyParsed = JSON.parse(result || "");
      findCompanyInformation(companyParsed.id);
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
      position: "top-right",
      duration: 8000,
      isClosable: true,
    });
  }

  const handleLogin: SubmitHandler<LoginData> = async (data) => {
    try {
      const schema = Yup.object().shape({
        user: Yup.string().required("Insira o seu usuário"),
        password: Yup.string().required("Insira sua senha"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading({ action: "login", loading: true });

      const response = await api.post(`/login/${company?.id}`, {
        user: data.user,
        password: data.password,
      });

      sessionStorage.setItem("user", JSON.stringify(response.data));

      setLogin(false);

      setLoading({ action: "login", loading: false });
    } catch (error) {
      setLoading({ action: "login", loading: false });
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      }
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  };

  const handleAuth: SubmitHandler<AuthData> = async (data) => {
    try {
      const schema = Yup.object().shape({
        company_id: Yup.string().required("Insira o ID da empresa"),
        code: Yup.string().required("Insira o código de ativação da empresa"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading({ action: "auth", loading: true });

      const response = await api.post(
        `/findCompanyInformation/${data.company_id}`,
        {
          code: data.code,
        }
      );

      localStorage.setItem("company", JSON.stringify(response.data));

      findCompanyInformation(response.data.id);

      setLoading({ action: "auth", loading: false });
      setShow(false);
    } catch (error) {
      setLoading({ action: "auth", loading: false });
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      }
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  };

  const logout = () => {
    sessionStorage.clear();
    setAlert(false);
    setLogin(true);
  };

  return (
    <Fragment>
      <Box h="60px" w={"100%"} shadow="sm" borderBottomWidth={"1px"}>
        <Flex align={"center"} justify="space-between" h="100%" px={7}>
          <HStack>
            {company?.thumbnail ? (
              <Avatar
                src={company.thumbnail}
                borderWidth="1px"
                borderColor={"GrayText"}
              />
            ) : (
              <Image src={logo} h="40px" />
            )}

            <Box h="45px" borderRightWidth={"1px"} px={1} />

            <HStack pl={3} d={["none", "none", "none", "none", "flex"]}>
              <Button
                leftIcon={<AiOutlineHome />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
                onClick={() => navigate("/")}
              >
                Início
              </Button>
              <Button
                leftIcon={<AiOutlineShop />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
                onClick={() => navigate("/empresa")}
              >
                Empresa
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineUsergroupAdd />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Colaboradores
                </MenuButton>
                <MenuList>
                  <MenuItem
                    icon={<AiOutlineSave />}
                    onClick={() => navigate("/criar_colaborador")}
                  >
                    Cadastro
                  </MenuItem>
                  <MenuItem
                    icon={<AiOutlineTool />}
                    onClick={() => navigate("/listar_colaboradores")}
                  >
                    Gerenciar
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineUser />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
                onClick={() => navigate("/clientes")}
              >
                Clientes
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineTags />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Produtos
                </MenuButton>
                <MenuList>
                  <MenuGroup title="Cadastro">
                    <MenuItem
                      icon={<AiOutlineTag />}
                      onClick={() => navigate("/categorias")}
                    >
                      Categorias
                    </MenuItem>
                    <MenuItem
                      icon={<AiOutlineTags />}
                      onClick={() => navigate("/sub_categorias")}
                    >
                      Sub-Categorias
                    </MenuItem>
                    <MenuItem icon={<AiOutlineTags />}>Produtos</MenuItem>
                    <MenuItem icon={<AiOutlineTags />}>Tags</MenuItem>
                    <MenuItem icon={<AiOutlineAppstoreAdd />}>
                      Itens Adicionais
                    </MenuItem>
                  </MenuGroup>
                  <MenuDivider />
                  <MenuGroup title="Faturamento">
                    <MenuItem icon={<AiOutlineImport />}>Importar XML</MenuItem>
                  </MenuGroup>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineShopping />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Vendas
              </Button>
              <Menu>
                <MenuButton
                  as={Button}
                  rightIcon={<MdKeyboardArrowDown />}
                  leftIcon={<AiOutlineAreaChart />}
                  colorScheme="blue"
                  variant={"ghost"}
                  size="sm"
                >
                  Financeiro
                </MenuButton>
                <MenuList>
                  <MenuItem icon={<AiOutlineRise />}>Receitas</MenuItem>
                  <MenuItem icon={<AiOutlineFall />}>Despesas</MenuItem>
                  <MenuDivider />
                  <MenuItem icon={<AiOutlinePercentage />}>Promoções</MenuItem>
                  <MenuItem icon={<AiOutlineProfile />}>
                    Cupons de Desconto
                  </MenuItem>
                </MenuList>
              </Menu>
              <Button
                leftIcon={<AiOutlineFileText />}
                colorScheme="blue"
                variant={"ghost"}
                size="sm"
              >
                Notas Fiscais
              </Button>
            </HStack>
          </HStack>

          <HStack>
            <Tooltip hasArrow label="Menu Global">
              <IconButton
                aria-label="Abrir menu global"
                icon={<AiOutlineMenu />}
                onClick={() => setGlobalMenu(true)}
                colorScheme="blue"
                d={["flex", "flex", "flex", "flex", "none"]}
              />
            </Tooltip>
            <Tooltip hasArrow label="Alterar o tema">
              <IconButton
                aria-label="Alterar o tema do aplicativo"
                icon={colorMode === "light" ? <FaRegMoon /> : <FaRegSun />}
                onClick={toggleColorMode}
              />
            </Tooltip>
            <Tooltip hasArrow label="Configurações">
              <IconButton
                aria-label="Abrir configurações gerais"
                icon={<AiOutlineTool />}
                onClick={() => setDrawer(true)}
              />
            </Tooltip>
            <Tooltip hasArrow label="Logout">
              <IconButton
                aria-label="Sair do aplicativo"
                icon={<AiOutlineLogout />}
                colorScheme="red"
                onClick={() => setAlert(true)}
              />
            </Tooltip>
          </HStack>
        </Flex>
      </Box>

      <Drawer
        isOpen={drawer}
        placement="right"
        onClose={() => setDrawer(false)}
        finalFocusRef={btnRef}
        size="lg"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Configurações Gerais</DrawerHeader>

          <DrawerBody>
            <Stack spacing={3}>
              <Grid templateColumns={"1fr 1fr"} gap={3}>
                <FormControl>
                  <FormLabel>Máximo de Parcelas com Boleto</FormLabel>
                  <ChakraInput />
                </FormControl>
                <FormControl>
                  <FormLabel>Máximo de Parcelas com Cartões</FormLabel>
                  <ChakraInput />
                </FormControl>
              </Grid>
              <Grid templateColumns={"1fr 1fr"} gap={3}>
                <FormControl>
                  <FormLabel>Valor Mínimo para Parcelar com Boleto</FormLabel>
                  <ChakraInput />
                </FormControl>
                <FormControl>
                  <FormLabel>Valor Mínimo para Parcelar com Cartões</FormLabel>
                  <ChakraInput />
                </FormControl>
              </Grid>
              <FormControl>
                <FormLabel>Chave API de Pagamentos</FormLabel>
                <ChakraInput />
              </FormControl>
              <FormControl>
                <FormLabel>Chave API de Notas Fiscais</FormLabel>
                <ChakraInput />
              </FormControl>
              <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                <FormControl>
                  <FormLabel>Emite Notas Fiscais?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Boleto?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Cartões de Crédito?</FormLabel>
                  <Switch />
                </FormControl>
              </Grid>
              <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                <FormControl>
                  <FormLabel>Aceita PIX?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Pagamento Digital?</FormLabel>
                  <Switch />
                </FormControl>
                <FormControl>
                  <FormLabel>Aceita Cripto Moedas?</FormLabel>
                  <Switch />
                </FormControl>
              </Grid>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button
              mr={3}
              onClick={() => setDrawer(false)}
              leftIcon={<AiOutlineClose />}
            >
              Cancelar
            </Button>
            <Button colorScheme="blue" leftIcon={<AiOutlineSave />}>
              Salvar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      <Drawer
        isOpen={globalMenu}
        placement="left"
        onClose={() => setGlobalMenu(false)}
        finalFocusRef={btnRef}
        size="xs"
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu Global</DrawerHeader>

          <DrawerBody></DrawerBody>
        </DrawerContent>
      </Drawer>

      <AlertDialog
        isOpen={alert}
        leastDestructiveRef={cancelRef}
        onClose={() => setAlert(false)}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Logout
            </AlertDialogHeader>

            <AlertDialogBody>Deseja realmente sair?</AlertDialogBody>

            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setAlert(false)}
                leftIcon={<AiOutlineClose />}
              >
                Não
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => logout()}
                ml={3}
                leftIcon={<AiOutlineCheck />}
              >
                Sim
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <Modal
        isOpen={login}
        closeOnOverlayClick={false}
        closeOnEsc={false}
        onClose={() => setLogin(false)}
        size="2xl"
        isCentered
      >
        <ModalOverlay />
        <ModalContent>
          <ModalBody mt={5} mb={5}>
            <Grid templateColumns={"1fr 1fr"} gap={5}>
              <Box borderWidth="1px" rounded="md">
                <Flex justify={"center"} align="center" mt={2}>
                  <Image src={logo} w="50%" />
                </Flex>

                {loading?.action === "finding" && loading.loading === true ? (
                  <Stack mt={3} p={3}>
                    <Skeleton w="100%" h={5} />
                    <Skeleton w="100%" h={5} />
                    <Skeleton w="100%" h={5} />
                    <Skeleton w="100%" h={5} />
                    <Skeleton w="100%" h={5} />
                    <Skeleton w="100%" h={5} />
                  </Stack>
                ) : (
                  <Stack mt={3} p={3}>
                    <Text fontSize="xs">
                      <strong>ID da Empresa:</strong> {company?.id || ""}
                    </Text>
                    <Text fontSize="xs">
                      <strong>Nome da Empresa:</strong>{" "}
                      {company?.fantasy_name || ""}
                    </Text>
                    <Text fontSize="xs">
                      <strong>Código de Ativação:</strong>{" "}
                      {company?.company_code || ""}
                    </Text>
                    <Text fontSize="xs">
                      <strong>Data de Expiração:</strong>{" "}
                      {format(
                        new Date(company?.expires_code_date || new Date()),
                        "dd/MM/yyyy 'às' HH:mm'h'",
                        {
                          locale: pt_br,
                        }
                      )}
                    </Text>
                    <Text fontSize="xs">
                      <strong>Status da Ativação:</strong>{" "}
                      {new Date(company?.expires_code_date || new Date()) <
                      new Date() ? (
                        <Tag colorScheme={"red"} size="sm">
                          Expirou há{" "}
                          {differenceInDays(
                            new Date(),
                            new Date(company?.expires_code_date || new Date())
                          )}{" "}
                          dias
                        </Tag>
                      ) : (
                        <Tag colorScheme={"green"} size="sm">
                          Expira em{" "}
                          {differenceInDays(
                            new Date(company?.expires_code_date || new Date()),
                            new Date()
                          )}{" "}
                          dias
                        </Tag>
                      )}
                    </Text>

                    <Button
                      size="sm"
                      leftIcon={<AiOutlineShop />}
                      variant="outline"
                      colorScheme={"blue"}
                      onClick={() => setShow(true)}
                    >
                      Configurar Empresa
                    </Button>
                  </Stack>
                )}
              </Box>

              <Box>
                <Form onSubmit={handleLogin} ref={formRef}>
                  <Flex
                    justify={"center"}
                    align="center"
                    direction={"column"}
                    h="100%"
                  >
                    <Avatar icon={<AiOutlineLogin />} size="lg" />

                    <FormControl mt={10}>
                      <InputGroup size={"lg"}>
                        <InputLeftElement>
                          <Icon as={AiOutlineUser} />
                        </InputLeftElement>
                        <Input
                          placeholder="Usuário"
                          name="user"
                          leftElement={true}
                        />
                      </InputGroup>
                    </FormControl>
                    <FormControl mt={5}>
                      <InputGroup size={"lg"}>
                        <InputLeftElement>
                          <Icon as={AiOutlineKey} />
                        </InputLeftElement>
                        <Input
                          placeholder="Senha"
                          type={"password"}
                          name="password"
                          leftElement={true}
                        />
                      </InputGroup>
                    </FormControl>
                    <Button
                      colorScheme={"blue"}
                      leftIcon={<AiOutlineLogin />}
                      isFullWidth
                      mt={5}
                      size="lg"
                      type="submit"
                      isLoading={
                        loading?.action === "login" && loading.loading === true
                      }
                    >
                      Login
                    </Button>
                  </Flex>
                </Form>
              </Box>
            </Grid>
          </ModalBody>
        </ModalContent>
      </Modal>

      <Modal isOpen={show} onClose={() => setShow(false)} isCentered>
        <ModalOverlay />
        <ModalContent>
          <Form
            onSubmit={handleAuth}
            ref={formRef}
            initialData={{
              company_id: company?.id || "",
              code: "",
            }}
          >
            <ModalHeader>Configurar Empresa</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl>
                  <FormLabel>ID da Empresa</FormLabel>
                  <Input name="company_id" />
                </FormControl>
                <FormControl>
                  <FormLabel>Código de Ativação</FormLabel>
                  <Input name="code" />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={"blue"}
                leftIcon={<AiOutlineSave />}
                type="submit"
                isLoading={
                  loading?.action === "auth" && loading.loading === true
                }
              >
                Salvar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </Fragment>
  );
}
