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
  RadioGroup,
  Radio,
  Grid,
  FormControl,
  FormLabel,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState, useRef } from "react";
import { useQuery, QueryClient, useMutation } from "react-query";
import { api, configs } from "../../configs";
import { GiCardboardBox } from "react-icons/gi";
import {
  AiOutlineEdit,
  AiOutlineTool,
  AiOutlineClose,
  AiOutlineSave,
} from "react-icons/ai";
import * as Yup from "yup";
import Input from "../../components/Input";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";

type EmployeeProps = {
  id: string;
  name: string;
  phone: string;
  user: string;
  password: string;
  permission: "all" | "cashier" | "seller";
  active: boolean;
};

type EmployeeUpdateProps = {
  name: string;
  phone: string;
  user: string;
  password: string;
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

type AuthUpdateProps = {
  user: string;
  password: string;
};

const queryClient = new QueryClient();

const ListEmployee = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [user, setUser] = useState<UserProps>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [employees, setEmployees] = useState<EmployeeProps[]>([]);
  const [employeesAll, setEmployeesAll] = useState<EmployeeProps[]>([]);
  const [company, setCompany] = useState<CompanyProps>();
  const [modalInfo, setModalInfo] = useState<boolean>(false);
  const [permission, setPermission] = useState<string>();
  const [employee, setEmployee] = useState<EmployeeProps>();

  const paginateGood = (array: EmployeeProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setEmployees(pag);
  };

  useEffect(() => {
    paginateGood(employeesAll, configs.pagination);
  }, [page]);

  useEffect(() => {
    setPages(Math.ceil(employeesAll.length / configs.pagination));
  }, [employeesAll]);

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
      paginateGood(data, configs.pagination);
      setEmployeesAll(data);
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
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const mutationAuth = useMutation(
    (data: AuthUpdateProps) => {
      return api.put(`/changeAuthInfo/${employee?.id}`, data, {
        headers: { "x-access-authorization": user?.token || "" },
      });
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("employees");
        setModalInfo(false);
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const handleUpdateInfo: SubmitHandler<EmployeeUpdateProps> = async (data) => {
    try {
      const schema = Yup.object().shape({
        user: Yup.string().required("Insira um usuário"),
        password: Yup.string().required("Insira  uma senha"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      mutationAuth.mutate({
        user: data.user,
        password: data.password,
      });
    } catch (error) {
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  const handeToUpdate = (emp: string) => {
    const result = employees.find((obj) => obj.id === emp);
    setEmployee(result);
    setModalInfo(true);
  };

  return (
    <Fragment>
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
                            (emp.permission === "cashier" && "Financeiro") ||
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
                          <PopoverContent
                            _focus={{ outline: "none" }}
                            shadow="lg"
                          >
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
                                <HStack spacing={3}>
                                  <Radio value="all">Geral</Radio>
                                  <Radio value="cashier">Financeiro</Radio>
                                  <Radio value="seller">Vendas</Radio>
                                </HStack>
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
                            onClick={() => handeToUpdate(emp.id)}
                          >
                            Alterar Informações
                          </MenuItem>
                        </MenuList>
                      </Menu>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
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

      <Modal isOpen={modalInfo} onClose={() => setModalInfo(false)} size="3xl">
        <ModalOverlay />
        <ModalContent>
          <Form
            ref={formRef}
            onSubmit={handleUpdateInfo}
            initialData={{ user: employee?.user }}
          >
            <ModalHeader>Informações do Colaborador</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <Grid templateColumns={"1fr 1fr"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>Usuário</FormLabel>
                    <Input placeholder="Usuário" name="user" autoFocus />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Senha</FormLabel>
                    <Input
                      placeholder="Senha"
                      name="password"
                      type="password"
                    />
                  </FormControl>
                </Grid>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                mr={3}
                onClick={() => setModalInfo(false)}
                leftIcon={<AiOutlineClose />}
              >
                Fechar
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<AiOutlineSave />}
                type="submit"
                isLoading={mutationAuth.isLoading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ListEmployee;
