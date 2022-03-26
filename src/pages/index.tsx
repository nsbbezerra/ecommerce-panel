import {
  Box,
  Button,
  Flex,
  Grid,
  Icon,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  TableCaption,
  Tag,
  Tbody,
  Td,
  Th,
  Thead,
  theme,
  Tr,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Image,
  Text,
  Stack,
  FormControl,
  FormLabel,
  InputLeftElement,
  InputGroup,
  Avatar,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useRef, useState, useEffect } from "react";
import {
  AiOutlineKey,
  AiOutlineLogin,
  AiOutlineSave,
  AiOutlineShop,
  AiOutlineShopping,
  AiOutlineTags,
  AiOutlineUser,
  AiOutlineUsergroupAdd,
} from "react-icons/ai";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Input from "../components/Input";
import { Form } from "@unform/web";
import logo from "../assets/logo.svg";
import { FormHandles, SubmitHandler } from "@unform/core";
import axios from "axios";
import { api } from "../configs/index";
import pt_br from "date-fns/locale/pt-BR";
import { format, differenceInDays } from "date-fns";
import * as Yup from "yup";

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
  action: "login" | "auth";
};

type CompanyProps = {
  id: string;
  thumbnail: string;
  fantasy_name: string;
  company_code: string;
  expires_code_date: Date;
};

export default function Index() {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const data = [
    {
      name: "Page A",
      despesas: 4000,
      receitas: 2400,
      amt: 2400,
    },
    {
      name: "Page B",
      despesas: 3000,
      receitas: 1398,
      amt: 2210,
    },
    {
      name: "Page C",
      despesas: 2000,
      receitas: 9800,
      amt: 2290,
    },
    {
      name: "Page D",
      despesas: 2780,
      receitas: 3908,
      amt: 2000,
    },
    {
      name: "Page E",
      despesas: 1890,
      receitas: 4800,
      amt: 2181,
    },
    {
      name: "Page F",
      despesas: 2390,
      receitas: 3800,
      amt: 2500,
    },
    {
      name: "Page G",
      despesas: 3490,
      receitas: 4300,
      amt: 2100,
    },
  ];

  const [login, setLogin] = useState<boolean>(true);
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<LoadingProps>();
  const [company, setCompany] = useState<CompanyProps>();

  useEffect(() => {
    const result = localStorage.getItem("company");
    const companyParsed = JSON.parse(result || "");
    setCompany(companyParsed);
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

  const handleLogin: SubmitHandler<LoginData> = (data) => {
    console.log(data);
  };

  const handleAuth: SubmitHandler<AuthData> = async (data) => {
    console.log(data);

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

      setCompany(response.data);

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
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <Grid templateColumns={"1fr 1fr 1fr 1fr"} gap={5}>
        <Flex
          align={"center"}
          borderWidth="1px"
          shadow={"md"}
          rounded="md"
          p={2}
        >
          <Icon as={AiOutlineUser} fontSize="4xl" mx={3} />
          <Stat ml={3}>
            <StatLabel>Clientes Cadastrados</StatLabel>
            <StatNumber>1000</StatNumber>
          </Stat>
        </Flex>
        <Flex
          align={"center"}
          borderWidth="1px"
          shadow={"md"}
          rounded="md"
          p={2}
        >
          <Icon as={AiOutlineUsergroupAdd} fontSize="4xl" mx={3} />
          <Stat ml={3}>
            <StatLabel>Funcionários Ativos</StatLabel>
            <StatNumber>1000</StatNumber>
          </Stat>
        </Flex>
        <Flex
          align={"center"}
          borderWidth="1px"
          shadow={"md"}
          rounded="md"
          p={2}
        >
          <Icon as={AiOutlineTags} fontSize="4xl" mx={3} />
          <Stat ml={3}>
            <StatLabel>Produtos Ativos</StatLabel>
            <StatNumber>1000</StatNumber>
          </Stat>
        </Flex>
        <Flex
          align={"center"}
          borderWidth="1px"
          shadow={"md"}
          rounded="md"
          p={2}
        >
          <Icon as={AiOutlineShopping} fontSize="4xl" mx={3} />
          <Stat ml={3}>
            <StatLabel>Vendas Realizadas</StatLabel>
            <StatNumber>1000</StatNumber>
          </Stat>
        </Flex>
      </Grid>

      <Grid
        templateColumns={"250px 1fr 1fr"}
        gap={5}
        borderWidth="1px"
        rounded="md"
        shadow={"md"}
        p={3}
        mt={5}
      >
        <Box w="250px" h="250px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="0" />
              <XAxis dataKey="name" fontSize={theme.fontSizes.xs} />
              <YAxis fontSize={theme.fontSizes.xs} />
              <Tooltip
                contentStyle={{
                  background: useColorModeValue(
                    "white",
                    theme.colors.gray["900"]
                  ),
                  borderRadius: theme.radii.md,
                }}
              />
              <Legend />
              <Bar
                dataKey="despesas"
                fill={useColorModeValue(
                  theme.colors.red["600"],
                  theme.colors.red["300"]
                )}
              />
              <Bar
                dataKey="receitas"
                fill={useColorModeValue(
                  theme.colors.green["600"],
                  theme.colors.green["300"]
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Table size={"sm"} variant="striped" colorScheme={"green"}>
            <TableCaption>
              Receitas para Hoje{" "}
              <Button size="xs" ml={2} colorScheme="blue">
                Veja Mais
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>DESCRIÇÃO</Th>
                <Th isNumeric>Valor</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>

        <Box>
          <Table size={"sm"} variant="striped" colorScheme={"red"}>
            <TableCaption>
              Despesas para Hoje{" "}
              <Button size="xs" ml={2} colorScheme="blue">
                Veja Mais
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>DESCRIÇÃO</Th>
                <Th isNumeric>Valor</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Grid>

      <Grid
        templateColumns={"250px 1fr"}
        gap={5}
        borderWidth="1px"
        rounded="md"
        shadow={"md"}
        p={3}
        mt={5}
      >
        <Box w="250px" h="250px">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid stroke="0" />
              <XAxis dataKey="name" fontSize={theme.fontSizes.xs} />
              <YAxis fontSize={theme.fontSizes.xs} />
              <Tooltip
                contentStyle={{
                  background: useColorModeValue(
                    "white",
                    theme.colors.gray["900"]
                  ),
                  borderRadius: theme.radii.md,
                }}
              />
              <Legend />
              <Bar
                dataKey="despesas"
                fill={useColorModeValue(
                  theme.colors.red["600"],
                  theme.colors.red["300"]
                )}
              />
              <Bar
                dataKey="receitas"
                fill={useColorModeValue(
                  theme.colors.green["600"],
                  theme.colors.green["300"]
                )}
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>

        <Box>
          <Table size={"sm"} variant="striped">
            <TableCaption>
              Últimas Vendas de Hoje{" "}
              <Button size="xs" ml={2} colorScheme="blue">
                Veja Mais
              </Button>
            </TableCaption>
            <Thead>
              <Tr>
                <Th>DESCRIÇÃO</Th>
                <Th isNumeric>Valor</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
              <Tr>
                <Td>Recebimento de Aluguel</Td>
                <Td isNumeric>R$ 1200,00</Td>
                <Td>
                  <Tag colorScheme={"yellow"}>Aguardando</Tag>
                </Td>
              </Tr>
            </Tbody>
          </Table>
        </Box>
      </Grid>

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
                        )}
                      </Tag>
                    ) : (
                      <Tag colorScheme={"green"} size="sm">
                        Expira em{" "}
                        {differenceInDays(
                          new Date(company?.expires_code_date || new Date()),
                          new Date()
                        )}
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
