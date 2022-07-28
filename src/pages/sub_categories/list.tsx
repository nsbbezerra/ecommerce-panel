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
  RadioGroup,
  Radio,
  HStack,
  Input as ChakraInput,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import * as Icons from "react-icons/all";
import { icons } from "../../configs/icons";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import { useMutation, useQuery, QueryClient } from "react-query";
import axios from "axios";
import { api, configs } from "../../configs";
import { GiCardboardBox } from "react-icons/gi";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlinePaperClip,
  AiOutlineSave,
  AiOutlineTool,
} from "react-icons/ai";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";

const queryClient = new QueryClient();

type IconProps = {
  icon: string;
  title: string;
  category: string;
};

type IconUnitProps = {
  icon: keyof typeof Icons;
};

type Props = {
  id: string;
  token: string;
};

type SubCategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  category: CategorieProps;
  title: string;
  description: string;
};

type CategorieProps = {
  title: string;
};

type UpdateProps = {
  title: string;
  description: string;
};

type IconChangeProps = {
  icon: string;
};

type ActiveProps = {
  id: string;
  active: boolean;
};

const ListSubCategories = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);

  const [myIcons, setMyIcons] = useState<IconProps[]>();
  const [search, setSearch] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [auth, setAuth] = useState<Props>();
  const [subCategories, setSubCategories] = useState<SubCategoryProps[]>();
  const [subCategory, setSubCategory] = useState<SubCategoryProps>();
  const [page, setPage] = useState<number>(0);
  const [pages, setPages] = useState<number>(0);
  const [information, setInformation] = useState<boolean>(false);
  const [changeIcon, setChangeIcon] = useState<boolean>(false);

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

  const paginateGood = (array: SubCategoryProps[], page_size: number) => {
    const pag = array.slice(page * page_size, page * page_size + page_size);
    setSubCategories(pag);
  };

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

  async function getInformation() {
    const company = localStorage.getItem("company");
    const companyParse = JSON.parse(company || "");
    try {
      const { data } = await api.get(
        `/findSubCategoryByCompany/${companyParse.id}`
      );

      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const { data, isLoading, error } = useQuery(
    "sub-categories",
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

  const handleUpdateInfo = (id: string, type: "info" | "icon") => {
    const result = subCategories?.find((obj) => obj.id === id);
    setSubCategory(result);
    if (type === "info") {
      setInformation(true);
    } else {
      setChangeIcon(true);
    }
  };

  const mutationInfo = useMutation(
    (data: UpdateProps) => {
      return api.put(`/subCategories/${subCategory?.id}`, data, {
        headers: { "x-access-authorization": auth?.token || "" },
      });
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("sub-categories");
        setInformation(false);
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const sendUpdate: SubmitHandler<UpdateProps> = async (data, { reset }) => {
    try {
      const scheme = Yup.object().shape({
        title: Yup.string().required("Insira um título para a sub categoria"),
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

  const mutationIcon = useMutation(
    (data: IconChangeProps) => {
      return api.put(
        `/updateSubCategoriesIcon/${subCategory?.id}`,
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
        queryClient.invalidateQueries("sub-categories");
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
        `/subCategoriesActive/${data.id}`,
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
        queryClient.invalidateQueries("sub-categories");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

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
          {subCategories?.length === 0 ? (
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
                      Ativo?
                    </Th>
                    <Th w="5%" textAlign={"center"}>
                      Ícone
                    </Th>
                    <Th>Título</Th>
                    <Th>Descrição</Th>
                    <Th>Categoria</Th>
                    <Th w="10%" textAlign={"center"}>
                      Opções
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {subCategories?.map((sbc) => (
                    <Tr key={sbc.id}>
                      <Td textAlign={"center"}>
                        <Switch
                          defaultChecked={sbc.active}
                          onChange={(e) =>
                            mutationActive.mutate({
                              id: sbc.id,
                              active: e.target.checked,
                            })
                          }
                        />
                      </Td>
                      <Td textAlign={"center"}>
                        <Icon
                          as={getIcon({ icon: sbc.icon as keyof typeof Icons })}
                          fontSize="xl"
                        />
                      </Td>
                      <Td>{sbc.title}</Td>
                      <Td>{sbc.description}</Td>
                      <Td>{sbc.category.title}</Td>
                      <Td textAlign={"center"}>
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
                              onClick={() => handleUpdateInfo(sbc.id, "info")}
                            >
                              Alterar Informações
                            </MenuItem>
                            <MenuItem
                              icon={<AiOutlinePaperClip />}
                              onClick={() => handleUpdateInfo(sbc.id, "icon")}
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
            onSubmit={sendUpdate}
            initialData={{
              title: subCategory?.title,
              description: subCategory?.description,
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

export default ListSubCategories;
