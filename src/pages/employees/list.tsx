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
  Button,
  Tag,
  HStack,
  IconButton,
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
  PopoverAnchor,
  RadioGroup,
  Radio,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery, QueryClient, useMutation } from "react-query";
import { api } from "../../configs";
import { GiCardboardBox } from "react-icons/gi";
import {
  AiOutlineEdit,
  AiOutlineKey,
  AiOutlineTool,
  AiOutlineClose,
  AiOutlineSave,
} from "react-icons/ai";

import { Form } from "@unform/web";
import { SubmitHandler, FormHandles } from "@unform/core";

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

type PermissionProps = {
  id: string;
  permission: string;
};

type AuthProps = {
  id: string;
  active: boolean;
};

const queryClient = new QueryClient();

const ListEmployee = () => {
  const toast = useToast();
  const formRefPermission = useRef<FormHandles>(null);
  const [user, setUser] = useState<UserProps>();
  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [company, setCompany] = useState<CompanyProps>();
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [modalAuth, setModalAuth] = useState<boolean>(false);
  const [permission, setPermission] = useState<string>();

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

  const mutationPermission = useMutation(
    (data: PermissionProps) => {
      return api.put(
        `/changeEmployeePermission/${data.id}`,
        {
          permission: data.permission,
        },
        {
          headers: { "x-access-authorization": user?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("employees");
        setPermission("");
      },
      onError: (err) => {
        if (axios.isAxiosError(error) && error.message) {
          showToast(error.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const mutationActive = useMutation(
    (data: AuthProps) => {
      return api.put(
        `/activeEmployee/${data.id}`,
        {
          active: data.active,
        },
        {
          headers: { "x-access-authorization": user?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("employees");
        setPermission("");
      },
      onError: (err) => {
        if (axios.isAxiosError(error) && error.message) {
          showToast(error.response?.data.message, "error", "Erro");
        }
      },
    }
  );

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
                          <Switch
                            defaultChecked={emp.active}
                            onChange={(e) =>
                              mutationActive.mutate({
                                id: emp.id,
                                active: e.target.checked,
                              })
                            }
                          />
                        </Td>
                        <Td>
                          <HStack>
                            <Tag
                              colorScheme={
                                (emp.permission === "all" && "green") ||
                                (emp.permission === "cashier" && "blue") ||
                                (emp.permission === "seller" && "gray") ||
                                "gray"
                              }
                            >
                              {(emp.permission === "all" && "Geral") ||
                                (emp.permission === "cashier" &&
                                  "Financeiro") ||
                                (emp.permission === "seller" && "Vendas") ||
                                "Geral"}
                            </Tag>
                            <Popover>
                              <PopoverTrigger>
                                <IconButton
                                  size={"xs"}
                                  icon={<AiOutlineEdit />}
                                  aria-label="Editar permissão"
                                  colorScheme={"blue"}
                                  variant="outline"
                                />
                              </PopoverTrigger>
                              <PopoverContent>
                                <PopoverArrow />
                                <PopoverCloseButton />
                                <PopoverHeader fontWeight={"bold"}>
                                  Permissão
                                </PopoverHeader>
                                <PopoverBody>
                                  Selecione uma opção:
                                  <RadioGroup
                                    name="permission"
                                    value={permission}
                                    onChange={(e) => setPermission(e)}
                                    mt={3}
                                  >
                                    <Stack>
                                      <Radio value="all">Geral</Radio>
                                      <Radio value="cashier">Financeiro</Radio>
                                      <Radio value="seller">Vendas</Radio>
                                    </Stack>
                                  </RadioGroup>
                                </PopoverBody>
                                <PopoverFooter
                                  display="flex"
                                  justifyContent="flex-end"
                                >
                                  <Button
                                    colorScheme={"blue"}
                                    size="sm"
                                    leftIcon={<AiOutlineSave />}
                                    onClick={() =>
                                      mutationPermission.mutate({
                                        id: emp.id,
                                        permission: permission || "",
                                      })
                                    }
                                    isLoading={mutationPermission.isLoading}
                                  >
                                    Salvar
                                  </Button>
                                </PopoverFooter>
                              </PopoverContent>
                            </Popover>
                          </HStack>
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
                              <MenuItem
                                icon={<AiOutlineEdit />}
                                onClick={() => setModalInfo(true)}
                              >
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

      <Modal isOpen={modalInfo} onClose={() => setModalInfo(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Informações do Colaborador</ModalHeader>
          <ModalCloseButton />
          <ModalBody></ModalBody>

          <ModalFooter>
            <Button
              mr={3}
              onClick={() => setModalInfo(false)}
              leftIcon={<AiOutlineClose />}
            >
              Fechar
            </Button>
            <Button colorScheme="blue" leftIcon={<AiOutlineSave />}>
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ListEmployee;
