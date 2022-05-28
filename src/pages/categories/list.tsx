import {
  Button,
  Flex,
  Icon,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Skeleton,
  Stack,
  Switch,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Box,
  Input as ChakraInput,
  RadioGroup,
  Radio,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { GiCardboardBox } from "react-icons/gi";
import { useQuery } from "react-query";
import { api, configs } from "../../configs";
import * as Icons from "react-icons/all";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePaperClip,
  AiOutlineSave,
  AiOutlineTool,
} from "react-icons/ai";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import { useMutation, QueryClient } from "react-query";
import { icons } from "../../configs/icons";

const queryClient = new QueryClient();

type Props = {
  id: string;
  token: string;
};

type CategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  title: string;
  description: string;
};

type IconUnitProps = {
  icon: keyof typeof Icons;
};

type InfoProps = {
  title: string;
  description: string;
};

type IconProps = {
  icon: string;
  title: string;
  category: string;
};

type IconChangeProps = {
  icon: string;
};

type ActiveProps = {
  id: string;
  active: boolean;
};

const ListCategories = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [auth, setAuth] = useState<Props>();
  const [categories, setCategories] = useState<CategoryProps[]>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [information, setInformation] = useState<boolean>(false);
  const [changeIcon, setChangeIcon] = useState<boolean>(false);
  const [category, setCategory] = useState<CategoryProps>();
  const [icon, setIcon] = useState<string>("");
  const [myIcons, setMyIcons] = useState<IconProps[]>();
  const [search, setSearch] = useState<string>("");

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

  useEffect(() => {
    setMyIcons(icons);
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
  }, []);

  async function getInformation() {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
    try {
      const { data } = await api.get(`/categories/${companyParse?.id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const paginateGood = (array: CategoryProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setCategories(pag);
  };

  const { data, isLoading, error } = useQuery(
    "list-categories",
    getInformation,
    {
      refetchInterval: 4000,
    }
  );

  useEffect(() => {
    if (data) {
      paginateGood(data, configs.pagination);
      setPages(Math.ceil(data.length / configs.pagination));
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      paginateGood(data, configs.pagination);
    }
  }, [page]);

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  const getIcon = ({ icon }: IconUnitProps) => {
    const tag = Icons[icon];
    return tag;
  };

  const updateSearch = (text: string) => {
    setSearch(text.toLowerCase());
    if (text === "") {
      setMyIcons(icons);
    } else {
      const result = icons.filter((obj) =>
        obj.title.toLowerCase().includes(text.toLowerCase())
      );
      setMyIcons(result);
    }
  };

  const mutationInfo = useMutation(
    (data: InfoProps) => {
      return api.put(`/categories/${category?.id}`, data, {
        headers: { "x-access-authorization": auth?.token || "" },
      });
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-categories");
        setInformation(false);
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const mutationIcon = useMutation(
    (data: IconChangeProps) => {
      return api.put(
        `/updateIconCategory/${category?.id}`,
        {
          icon: data.icon,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-categories");
        setChangeIcon(false);
        setIcon("");
        setSearch("");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const mutationActive = useMutation(
    (data: ActiveProps) => {
      return api.put(
        `/activeCategory/${data.id}`,
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
        queryClient.invalidateQueries("list-categories");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const updateInfo: SubmitHandler<InfoProps> = async (data) => {
    try {
      const scheme = Yup.object().shape({
        title: Yup.string().required("Insira um título para a categoria"),
        description: Yup.string(),
      });
      await scheme.validate(data, {
        abortEarly: false,
      });

      mutationInfo.mutate({ title: data.title, description: data.description });
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

  const handleCategory = (id: string, mode: "icon" | "information") => {
    const result = categories?.find((obj) => obj.id === id);
    setCategory(result);
    if (mode === "icon") {
      setChangeIcon(true);
    } else {
      setInformation(true);
    }
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
          {categories?.length === 0 ? (
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
                      Ícone
                    </Th>
                    <Th>Título</Th>
                    <Th>Descrição</Th>
                    <Th w="10%" textAlign={"center"}>
                      Ativo?
                    </Th>
                    <Th w="10%">Opções</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {categories?.map((cat) => (
                    <Tr key={cat.id}>
                      <Td textAlign={"center"}>
                        <Icon
                          as={getIcon({ icon: cat.icon as keyof typeof Icons })}
                          fontSize="xl"
                        />
                      </Td>
                      <Td>{cat.title}</Td>
                      <Td>{cat.description}</Td>
                      <Td textAlign={"center"}>
                        <Switch
                          defaultChecked={cat.active}
                          onChange={(e) =>
                            mutationActive.mutate({
                              id: cat.id,
                              active: e.target.checked,
                            })
                          }
                        />
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
                              onClick={() => {
                                handleCategory(cat.id, "information");
                              }}
                            >
                              Alterar Informações
                            </MenuItem>
                            <MenuItem
                              icon={<AiOutlinePaperClip />}
                              onClick={() => handleCategory(cat.id, "icon")}
                            >
                              Alterar Ícone
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

      <Modal
        isOpen={information}
        onClose={() => setInformation(false)}
        size="2xl"
      >
        <ModalOverlay />
        <ModalContent>
          <Form
            ref={formRef}
            onSubmit={updateInfo}
            initialData={{
              title: category?.title,
              description: category?.description,
            }}
          >
            <ModalHeader>Alterar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input placeholder="Título" name="title" autoFocus />
                </FormControl>
                <FormControl>
                  <FormLabel>Descrição</FormLabel>
                  <TextArea
                    rows={5}
                    placeholder="Descrição"
                    resize={"none"}
                    name="description"
                  />
                </FormControl>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<AiOutlineClose />}
                mr={3}
                onClick={() => setInformation(false)}
              >
                Fechar
              </Button>
              <Button
                colorScheme="blue"
                leftIcon={<AiOutlineSave />}
                type="submit"
                isLoading={mutationInfo.isLoading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>

      <Modal
        isOpen={changeIcon}
        onClose={() => setChangeIcon(false)}
        scrollBehavior="inside"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Alterar Ícone</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box position={"relative"}>
              <FormControl h="full">
                <Box h="210px" maxH={"210px"} position="relative" p={"1px"}>
                  <RadioGroup value={icon} onChange={(e) => setIcon(e)}>
                    <Stack>
                      {myIcons?.map((ico) => (
                        <Radio key={ico.title} value={ico.icon}>
                          <HStack>
                            <Icon
                              as={getIcon({
                                icon: ico.icon as keyof typeof Icons,
                              })}
                            />
                            <Text>{ico.title}</Text>
                          </HStack>
                        </Radio>
                      ))}
                    </Stack>
                  </RadioGroup>
                </Box>
              </FormControl>
            </Box>
          </ModalBody>

          <ModalFooter>
            <ChakraInput
              placeholder="Digite para buscar"
              value={search}
              onChange={(e) => updateSearch(e.target.value)}
              mr={3}
            />
            <Button
              leftIcon={<AiOutlineClose />}
              mr={3}
              onClick={() => setChangeIcon(false)}
              px={8}
            >
              Fechar
            </Button>
            <Button
              colorScheme="blue"
              leftIcon={<AiOutlineSave />}
              isLoading={mutationIcon.isLoading}
              px={8}
              onClick={() => {
                mutationIcon.mutate({ icon: icon });
              }}
            >
              Salvar
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default ListCategories;
