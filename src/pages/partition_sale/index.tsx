import {
  Box,
  Flex,
  Grid,
  Icon,
  Text,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Divider,
  useToast,
  Stack,
  Skeleton,
  RadioGroup,
  Radio,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  HStack,
  IconButton,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { GiCardboardBox } from "react-icons/gi";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Input from "../../components/Input";
import { useQuery, useMutation, QueryClient } from "react-query";
import { api, configs } from "../../configs";
import axios from "axios";
import { FaTrashAlt } from "react-icons/fa";

type Props = {
  id: string;
  token: string;
};

type PropsCategory = {
  id: string;
  name: string;
};

type PropsItems = {
  id: string;
  name: string;
  value: number;
};

const queryClient = new QueryClient();

export default function PartitionSale() {
  const toast = useToast();
  const formCategoryRef = useRef<FormHandles>(null);
  const formItemsRef = useRef<FormHandles>(null);
  const formCategoryEditRef = useRef<FormHandles>(null);
  const formItemsEditRef = useRef<FormHandles>(null);
  const [auth, setAuth] = useState<Props>();
  const [categories, setCategories] = useState<PropsCategory[]>();
  const [items, setItems] = useState<PropsItems[]>();
  const [loadingCategory, setLoadingCategory] = useState<boolean>(false);
  const [loadingItems, setLoadingItems] = useState<boolean>(false);
  const [idCategory, setIdCategory] = useState<string>("");

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

  const handleSubmitCategory: SubmitHandler<PropsCategory> = async (
    data,
    { reset }
  ) => {
    try {
      const scheme = Yup.object().shape({
        name: Yup.string().required("Insira um nome para a categoria"),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });
      setLoadingCategory(true);

      const response = await api.post(
        `/storeCategoryPartitionSale/${auth?.id}`,
        data,
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");

      setLoadingCategory(false);
      reset();
    } catch (error) {
      setLoadingCategory(false);
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

  const handleSubmitItems: SubmitHandler<PropsItems> = async (
    data,
    { reset }
  ) => {
    if (idCategory === "") {
      showToast("Selecione uma categoria para continuar", "warning", "Atenção");
      return false;
    }

    try {
      const scheme = Yup.object().shape({
        name: Yup.string().required("Insira um nome para o item"),
        value: Yup.string().required("Insira um valor para o item"),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });

      setLoadingItems(true);

      const response = await api.post(
        `/storeItemsPartitionSale/${idCategory}`,
        data,
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");

      setItems(response.data.partition_items);

      setLoadingItems(false);
      reset();
    } catch (error) {
      setLoadingItems(false);
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

  async function getInformation() {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
    try {
      const { data } = await api.get(
        `/showCategoryPartitionSale/${companyParse?.id}`
      );
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

  const { data, isLoading, error } = useQuery(
    "list_categories_partition",
    getInformation,
    {
      refetchInterval: 4000,
    }
  );

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setCategories(data);
    }
  }, [data]);

  useEffect(() => {
    if (idCategory !== "") {
      async function findItems() {
        try {
          const response = await api.get(
            `/showItemsPartitionSale/${idCategory}`
          );
          setItems(response.data);
        } catch (error) {
          if (axios.isAxiosError(error) && error.message) {
            showToast(error.response?.data.message, "error", "Erro");
          } else {
            let message = (error as Error).message;
            showToast(message, "error", "Erro");
          }
        }
      }
      findItems();
    }
  }, [idCategory]);

  async function deleteItem(id: string) {
    try {
      setLoadingCategory(true);
      const response = await api.delete(`/deleteItemPartition/${id}`, {
        headers: { "x-access-authorization": auth?.token || "" },
      });
      showToast(response.data.message, "success", "Sucesso");
      const updated = items?.filter((obj) => obj.id !== id);
      setItems(updated);
      setLoadingCategory(false);
    } catch (error) {
      setLoadingCategory(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  const mutation = useMutation(
    (data: PropsCategory) => {
      return api.put(
        `/updatePartitionCategory/${data.id}`,
        {
          name: data.name,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list_categories_partition");
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

  const editCategory: SubmitHandler<PropsCategory> = async (data) => {
    mutation.mutate({
      id: data.id,
      name: data.name,
    });
  };

  const editItems: SubmitHandler<PropsItems> = async (data) => {
    setLoadingCategory(true);

    try {
      const response = await api.put(
        `/updatePartitionItem/${data.id}`,
        {
          name: data.name,
          value: data.value,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      setLoadingCategory(false);
      const updated = items?.map((itm) => {
        if (itm.id === data.id) {
          return { ...itm, name: data.name, value: data.value };
        }
        return itm;
      });
      setItems(updated);
      showToast(response.data.message, "success", "Sucesso");
    } catch (error) {
      setLoadingCategory(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        const message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  return (
    <Fragment>
      <Box py={3}>
        <Box>
          <Grid templateColumns={"300px 1fr"} gap={5}>
            <Box h="fit-content">
              <Flex
                bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                p={1}
                justify="center"
                align={"center"}
                rounded="md"
                mb={3}
              >
                CATEGORIAS
              </Flex>

              <Box borderWidth="1px" rounded="md" py={2} px={3} shadow="md">
                {isLoading ? (
                  <Stack>
                    <Skeleton h={7} />
                    <Skeleton h={7} />
                    <Skeleton h={7} />
                    <Skeleton h={7} />
                    <Skeleton h={7} />
                  </Stack>
                ) : (
                  <Fragment>
                    {categories?.length === 0 || !categories ? (
                      <Flex
                        justify={"center"}
                        align="center"
                        direction={"column"}
                      >
                        <Icon as={GiCardboardBox} fontSize="4xl" />
                        <Text fontSize={"sm"}>
                          Nenhuma informação para mostrar
                        </Text>
                      </Flex>
                    ) : (
                      <RadioGroup
                        value={idCategory}
                        onChange={(e) => setIdCategory(e)}
                      >
                        <Stack>
                          {categories.map((cat) => (
                            <Radio key={cat.id} value={cat.id}>
                              <HStack>
                                <Text>{cat.name}</Text>
                                <Popover placement="right">
                                  <PopoverTrigger>
                                    <IconButton
                                      icon={<AiOutlineEdit />}
                                      aria-label="Editar Categoria"
                                      size="xs"
                                      colorScheme={"blue"}
                                    />
                                  </PopoverTrigger>
                                  <PopoverContent
                                    shadow={"lg"}
                                    _focus={{ outline: "none" }}
                                  >
                                    <Form
                                      ref={formCategoryEditRef}
                                      onSubmit={editCategory}
                                      initialData={{
                                        id: cat.id,
                                        name: cat.name,
                                      }}
                                    >
                                      <PopoverArrow />
                                      <PopoverCloseButton zIndex={100} />
                                      <PopoverBody>
                                        <FormControl isRequired>
                                          <FormLabel>
                                            Nome da Categoria (Clique aqui)
                                          </FormLabel>
                                          <Input
                                            name="name"
                                            placeholder="Nome da Categoria"
                                            size="sm"
                                          />
                                        </FormControl>
                                        <Input
                                          name="id"
                                          placeholder="Nome da Categoria"
                                          size="sm"
                                          display={"none"}
                                        />
                                      </PopoverBody>
                                      <PopoverFooter
                                        display="flex"
                                        justifyContent="flex-end"
                                      >
                                        <ButtonGroup size="sm">
                                          <Button
                                            colorScheme="blue"
                                            leftIcon={<AiOutlineSave />}
                                            type="submit"
                                            isLoading={mutation.isLoading}
                                          >
                                            Salvar
                                          </Button>
                                        </ButtonGroup>
                                      </PopoverFooter>
                                    </Form>
                                  </PopoverContent>
                                </Popover>
                              </HStack>
                            </Radio>
                          ))}
                        </Stack>
                      </RadioGroup>
                    )}
                  </Fragment>
                )}

                <Popover placement="right">
                  <PopoverTrigger>
                    <Button isFullWidth size="sm" mt={3}>
                      Adicionar Categoria
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent shadow={"lg"} _focus={{ outline: "none" }}>
                    <Form ref={formCategoryRef} onSubmit={handleSubmitCategory}>
                      <PopoverArrow />
                      <PopoverCloseButton zIndex={100} />
                      <PopoverBody>
                        <FormControl isRequired>
                          <FormLabel>Nome da Categoria</FormLabel>
                          <Input
                            name="name"
                            placeholder="Nome da Categoria"
                            size="sm"
                          />
                        </FormControl>
                      </PopoverBody>
                      <PopoverFooter display="flex" justifyContent="flex-end">
                        <ButtonGroup size="sm">
                          <Button
                            colorScheme="blue"
                            leftIcon={<AiOutlineSave />}
                            type="submit"
                            isLoading={loadingCategory}
                          >
                            Salvar
                          </Button>
                        </ButtonGroup>
                      </PopoverFooter>
                    </Form>
                  </PopoverContent>
                </Popover>
              </Box>
            </Box>

            <Box h="fit-content">
              <Flex
                bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                p={1}
                justify="center"
                align={"center"}
                rounded="md"
                mb={3}
              >
                ITENS DA VENDA FRACIONADA
              </Flex>
              <Box borderWidth="1px" rounded="md" py={2} px={4} shadow="md">
                <Form ref={formItemsRef} onSubmit={handleSubmitItems}>
                  <Grid
                    templateColumns={"1fr 1fr 150px"}
                    gap={3}
                    alignItems="end"
                  >
                    <FormControl isRequired>
                      <FormLabel>Nome do Item</FormLabel>
                      <Input name="name" placeholder="Nome do Item" />
                    </FormControl>
                    <FormControl isRequired>
                      <FormLabel>Preço do Item (R$)</FormLabel>
                      <Input
                        name="value"
                        type={"number"}
                        placeholder="Preço do Item (R$)"
                      />
                    </FormControl>
                    <Button
                      leftIcon={<AiOutlineSave />}
                      colorScheme="blue"
                      type="submit"
                      isLoading={loadingItems}
                    >
                      Salvar
                    </Button>
                  </Grid>
                  <Divider mt={3} mb={3} />
                </Form>

                {items?.length === 0 || !items ? (
                  <Flex
                    justify={"center"}
                    align="center"
                    direction={"column"}
                    mt={3}
                  >
                    <Icon as={GiCardboardBox} fontSize="4xl" />
                    <Text fontSize={"sm"}>Nenhuma informação para mostrar</Text>
                  </Flex>
                ) : (
                  <Table size="sm">
                    <Thead>
                      <Tr>
                        <Th>Descrição</Th>
                        <Th isNumeric>Valor</Th>
                        <Th textAlign={"center"} w="25%">
                          Opções
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {items.map((itm) => (
                        <Tr key={itm.id}>
                          <Td>{itm.name}</Td>
                          <Td isNumeric>
                            {parseFloat(itm.value.toString()).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </Td>
                          <Td textAlign={"center"}>
                            <Grid templateColumns={"1fr 1fr"} gap={3}>
                              <Form
                                ref={formItemsEditRef}
                                onSubmit={editItems}
                                initialData={{
                                  id: itm.id,
                                  name: itm.name,
                                  value: itm.value,
                                }}
                              >
                                <Popover placement="left">
                                  <PopoverTrigger>
                                    <Button
                                      leftIcon={<AiOutlineEdit />}
                                      size="xs"
                                      isFullWidth
                                    >
                                      Editar
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    shadow={"lg"}
                                    _focus={{ outline: "none" }}
                                  >
                                    <PopoverHeader textAlign={"justify"}>
                                      Editar Informações
                                    </PopoverHeader>
                                    <PopoverArrow />
                                    <PopoverCloseButton />
                                    <PopoverBody textAlign={"justify"}>
                                      <Stack spacing={3}>
                                        <FormControl isRequired>
                                          <FormLabel>Nome do Item</FormLabel>
                                          <Input
                                            name="name"
                                            placeholder="Nome do Item"
                                            size="sm"
                                          />
                                        </FormControl>
                                        <FormControl isRequired>
                                          <FormLabel>
                                            Valor do Item (R$)
                                          </FormLabel>
                                          <Input
                                            name="value"
                                            placeholder="Valor do Item (R$)"
                                            size="sm"
                                          />
                                        </FormControl>
                                        <Input
                                          name="id"
                                          placeholder="Valor do Item (R$)"
                                          size="sm"
                                          display="none"
                                        />
                                      </Stack>
                                    </PopoverBody>
                                    <PopoverFooter
                                      display="flex"
                                      justifyContent="flex-end"
                                    >
                                      <ButtonGroup size="sm">
                                        <Button
                                          colorScheme="blue"
                                          leftIcon={<AiOutlineSave />}
                                          isLoading={loadingCategory}
                                          type="submit"
                                        >
                                          Salvar
                                        </Button>
                                      </ButtonGroup>
                                    </PopoverFooter>
                                  </PopoverContent>
                                </Popover>
                              </Form>
                              <Popover placement="left">
                                <PopoverTrigger>
                                  <Button
                                    colorScheme={"red"}
                                    leftIcon={<FaTrashAlt />}
                                    size="xs"
                                    isFullWidth
                                  >
                                    Excluir
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  shadow={"lg"}
                                  _focus={{ outline: "none" }}
                                >
                                  <PopoverHeader textAlign={"justify"}>
                                    Confirmação
                                  </PopoverHeader>
                                  <PopoverArrow />
                                  <PopoverCloseButton />
                                  <PopoverBody textAlign={"justify"}>
                                    Tem certeza que deseja remover este item?
                                  </PopoverBody>
                                  <PopoverFooter
                                    display="flex"
                                    justifyContent="flex-end"
                                  >
                                    <ButtonGroup size="sm">
                                      <Button
                                        colorScheme="blue"
                                        leftIcon={<AiOutlineCheck />}
                                        isLoading={loadingCategory}
                                        onClick={() => deleteItem(itm.id)}
                                      >
                                        Sim
                                      </Button>
                                    </ButtonGroup>
                                  </PopoverFooter>
                                </PopoverContent>
                              </Popover>
                            </Grid>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </Box>
            </Box>
          </Grid>
        </Box>
      </Box>
    </Fragment>
  );
}
