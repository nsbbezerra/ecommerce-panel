import {
  Box,
  Flex,
  Icon,
  Skeleton,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuDivider,
  Button,
  Tag,
  HStack,
  IconButton,
  Switch,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { useQuery, QueryClient, useMutation } from "react-query";
import { api } from "../../configs";
import { GiCardboardBox } from "react-icons/gi";
import { AiOutlineEdit, AiOutlineKey, AiOutlineTool } from "react-icons/ai";

type EmployeeProps = {
  id: string;
  name: string;
  phone: string;
  user: string;
  password: string;
  permission: "all" | "cashier" | "seller";
  active: boolean;
};

type UserProps = {
  token: string;
};

type CompanyProps = {
  id: string;
};

const ListEmployee = () => {
  const toast = useToast();

  const [user, setUser] = useState<UserProps>();
  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [company, setCompany] = useState<CompanyProps>();

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
    try {
      const company = localStorage.getItem("company");
      const user = sessionStorage.getItem("user");
      let userParse = JSON.parse(user || "");
      let companyParse = JSON.parse(company || "");
      if (userParse && companyParse) {
        setUser({ token: userParse.token });
        setCompany({ id: companyParse.id });
      }
      const { data } = await api.get(`/findEmployees/${companyParse.id}`, {
        headers: { "x-access-authorization": userParse?.token || "" },
      });
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const { data, isLoading, error } = useQuery("employees", getInformation, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (data) {
      setEmployees(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  return (
    <Fragment>
      <Box py={3}>
        <Box
          borderWidth={"1px"}
          rounded="md"
          shadow={"md"}
          h="min-content"
          p={3}
        >
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
              {employees.length === 0 ? (
                <Flex justify={"center"} align="center" direction={"column"}>
                  <Icon as={GiCardboardBox} fontSize="8xl" />
                  <Text>Nenhuma informação para mostrar</Text>
                </Flex>
              ) : (
                <Table size={"sm"}>
                  <Thead>
                    <Tr>
                      <Th>Nome</Th>
                      <Th>Telefone</Th>
                      <Th>Usuário</Th>
                      <Th>Ativo?</Th>
                      <Th>Permissão</Th>
                      <Th>Opções</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {employees.map((emp) => (
                      <Tr key={emp.id}>
                        <Td>{emp.name}</Td>
                        <Td>{emp.phone}</Td>
                        <Td>{emp.user}</Td>
                        <Td>
                          <Switch defaultChecked={emp.active} />
                        </Td>
                        <Td>
                          {emp.permission === "all" && (
                            <HStack>
                              <Tag colorScheme={"green"}>Geral</Tag>
                              <IconButton
                                size={"xs"}
                                icon={<AiOutlineEdit />}
                                aria-label="Editar permissão"
                                colorScheme={"blue"}
                                variant="outline"
                              />
                            </HStack>
                          )}
                          {emp.permission === "cashier" && (
                            <HStack>
                              <Tag colorScheme={"blue"}>Financeiro</Tag>
                              <IconButton
                                size={"xs"}
                                icon={<AiOutlineEdit />}
                                aria-label="Editar permissão"
                                colorScheme={"blue"}
                                variant="outline"
                              />
                            </HStack>
                          )}
                          {emp.permission === "seller" && (
                            <HStack>
                              <Tag colorScheme={"orange"}>Vendas</Tag>
                              <IconButton
                                size={"xs"}
                                icon={<AiOutlineEdit />}
                                aria-label="Editar permissão"
                                colorScheme={"blue"}
                                variant="outline"
                              />
                            </HStack>
                          )}
                        </Td>
                        <Td>
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
                              <MenuItem icon={<AiOutlineEdit />}>
                                Alterar Informações
                              </MenuItem>
                              <MenuItem icon={<AiOutlineKey />}>
                                Alterar Login
                              </MenuItem>
                            </MenuList>
                          </Menu>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </Fragment>
          )}
        </Box>
      </Box>
    </Fragment>
  );
};

export default ListEmployee;
