import {
  Box,
  Button,
  Divider,
  Grid,
  Image,
  Skeleton,
  Tag,
  Text,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  FormLabel,
  Stack,
  Flex,
  Icon,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useRef, useState } from "react";
import { AiOutlineCheck, AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useQuery, useMutation, QueryClient } from "react-query";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import { api, configs } from "../../configs";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import { GiCardboardBox } from "react-icons/gi";

const queryClient = new QueryClient();

type Props = {
  id: string;
  token: string;
};

type PromotionProps = {
  id: string;
  banner: string;
  banner_id: string;
  title: string;
  discount: string;
  description: string;
  active: boolean;
};

type PromotionUpdateProps = {
  id: string;
  title: string;
  discount: string;
  description: string;
};

export default function ListPromotions() {
  const toast = useToast();
  const formEditRef = useRef<FormHandles>(null);

  const [promotions, setPromotions] = useState<PromotionProps[]>();
  const [auth, setAuth] = useState<Props>();
  const [loading, setLoading] = useState<boolean>(false);

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
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }

    try {
      const { data } = await api.get(`/promotions/${companyParse?.id}`);
      return data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  const { data, isLoading, error } = useQuery(
    "list-promotions",
    getInformation,
    {
      refetchInterval: 4000,
    }
  );

  useEffect(() => {
    if (data) {
      setPromotions(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  const mutationUpdate = useMutation(
    (data: PromotionUpdateProps) => {
      return api.put(
        `/promotionsUpdate/${data.id}`,
        {
          title: data.title,
          description: data.description,
          discount: data.discount,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-promotions");
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

  const handleSubmit: SubmitHandler<PromotionUpdateProps> = async (data) => {
    mutationUpdate.mutate({
      id: data.id,
      title: data.title,
      description: data.description,
      discount: data.discount,
    });
  };

  async function deletePromotion(id: string, name: string) {
    try {
      setLoading(true);
      const response = await api.put(
        `/deletePromotions/${id}/${name}`,
        {},
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      const updated = promotions?.filter((obj) => obj.id !== id);
      setPromotions(updated);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        const message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  return (
    <Fragment>
      {isLoading ? (
        <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
          <Skeleton w="full" h="215px" rounded="md" />
          <Skeleton w="full" h="215px" rounded="md" />
          <Skeleton w="full" h="215px" rounded="md" />
          <Skeleton w="full" h="215px" rounded="md" />
        </Grid>
      ) : (
        <>
          {promotions?.length === 0 ? (
            <Flex justify={"center"} align="center" direction={"column"}>
              <Icon as={GiCardboardBox} fontSize="8xl" />
              <Text>Nenhuma informação para mostrar</Text>
            </Flex>
          ) : (
            <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
              {promotions?.map((pro) => (
                <Box
                  w="full"
                  borderWidth={"1px"}
                  rounded="md"
                  overflow={"hidden"}
                  key={pro.id}
                  h="fit-content"
                  shadow="md"
                >
                  <Image src={pro.banner} w="full" />
                  <Divider />
                  <Box p={2}>
                    <Tag size="lg" colorScheme={"orange"} mb={3}>
                      {pro.discount}%
                    </Tag>
                    <Text fontWeight={"bold"}>{pro.title}</Text>
                    <Text>{pro.description}</Text>
                  </Box>
                  <Grid templateColumns={"repeat(2, 1fr)"}>
                    <Form
                      ref={formEditRef}
                      onSubmit={handleSubmit}
                      initialData={{
                        title: pro.title,
                        discount: pro.discount,
                        description: pro.description,
                        id: pro.id,
                      }}
                    >
                      <Popover placement="auto">
                        <PopoverTrigger>
                          <Button
                            leftIcon={<AiOutlineEdit />}
                            rounded="none"
                            colorScheme={"blue"}
                            size="sm"
                            isFullWidth
                          >
                            Editar
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          shadow={"lg"}
                          _focus={{ outline: "none" }}
                        >
                          <PopoverArrow />
                          <PopoverHeader>Editar</PopoverHeader>
                          <PopoverCloseButton />
                          <PopoverBody>
                            <Stack spacing={3}>
                              <FormControl isRequired>
                                <FormLabel>Título</FormLabel>
                                <Input
                                  name="title"
                                  placeholder="Título"
                                  size="sm"
                                  autoFocus
                                />
                              </FormControl>
                              <FormControl isRequired>
                                <FormLabel>Desconto</FormLabel>
                                <Input
                                  name="discount"
                                  placeholder="Desconto"
                                  size="sm"
                                />
                              </FormControl>
                              <FormControl>
                                <FormLabel>Descrição</FormLabel>
                                <TextArea
                                  name="description"
                                  placeholder="Descrição"
                                  size="sm"
                                />
                              </FormControl>
                              <Input
                                name="id"
                                display={"none"}
                                placeholder="Desconto"
                                size="sm"
                              />
                            </Stack>
                          </PopoverBody>
                          <PopoverFooter display={"flex"} justifyContent="end">
                            <Button
                              leftIcon={<AiOutlineSave />}
                              type="submit"
                              size="sm"
                              colorScheme={"blue"}
                              isLoading={mutationUpdate.isLoading}
                            >
                              Salvar
                            </Button>
                          </PopoverFooter>
                        </PopoverContent>
                      </Popover>
                    </Form>

                    <Popover>
                      <PopoverTrigger>
                        <Button
                          leftIcon={<FaTrashAlt />}
                          rounded="none"
                          colorScheme={"red"}
                          size="sm"
                          isFullWidth
                        >
                          Excluir
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        shadow={"lg"}
                        _focus={{ outline: "none" }}
                      >
                        <PopoverArrow />
                        <PopoverHeader>Excluir Promoção</PopoverHeader>
                        <PopoverCloseButton />
                        <PopoverBody>Deseja remover esta promoção?</PopoverBody>
                        <PopoverFooter display={"flex"} justifyContent="end">
                          <Button
                            leftIcon={<AiOutlineCheck />}
                            type="submit"
                            size="sm"
                            colorScheme={"blue"}
                            isLoading={loading}
                            onClick={() =>
                              deletePromotion(pro.id, pro.banner_id)
                            }
                          >
                            Sim
                          </Button>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </Grid>
                </Box>
              ))}
            </Grid>
          )}
        </>
      )}
    </Fragment>
  );
}
