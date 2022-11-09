import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  IconButton,
  Image,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  Button,
  useDisclosure,
  ButtonGroup,
  Stack,
  useToast,
  Skeleton,
  Icon,
  Text,
  Input as ChakraInput,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import { Form } from "@unform/web";
import { FormHandles, SubmitHandler } from "@unform/core";
import * as Yup from "yup";

import { useQuery, useMutation, QueryClient } from "react-query";
import Input from "../components/Input";
import InputMask from "../components/InputMask";
import Select from "../components/Select";
import { AiOutlinePicture, AiOutlineSave } from "react-icons/ai";
import axios from "axios";
import { api, configs } from "../configs";
import Uploader from "../components/uploader";

const queryClient = new QueryClient();

type CompanyProps = {
  id: string;
  name: string;
  fantasy_name: string;
  comp?: string;
  district: string;
  email?: string;
  phone: string;
  municipal_registration?: string;
  state_registration: string;
  number: string;
  street: string;
  state: string;
  zip_code: string;
  cnpj: string;
  city: string;
  thumbnail?: string;
  thumbnail_id?: string;
};

type LoadingProps = {
  action: "finding" | "save";
  loading: boolean;
};

type UserProps = {
  token: string;
};

export default function Company() {
  const toast = useToast();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const formRef = useRef<FormHandles>(null);
  const [company, setCompany] = useState<CompanyProps>();
  const [loading, setLoading] = useState<LoadingProps>();
  const [userToken, setUserToken] = useState<UserProps>();
  const [showThumb, setShowThumb] = useState<boolean>(true);
  const [thumbnail, setThumbnail] = useState<any>(null);
  const [loadingDel, setLoadingDel] = useState<boolean>(false);

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail);
    setThumbnail(undefined);
  }

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

  async function fetchingData() {
    const result = await localStorage.getItem("company");
    const parsed = JSON.parse(result || "");
    const { data } = await api.get(`/findCompanyById/${parsed.id}`);
    return data;
  }

  const { data, isLoading, error } = useQuery("company", fetchingData, {
    refetchInterval: 5000,
  });

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setCompany(data);
      formRef.current?.setData(data);
    }
  }, [data]);

  useEffect(() => {
    const token = sessionStorage.getItem("user");
    const tokenParsed = JSON.parse(token || "");
    if (token) {
      setUserToken({ token: tokenParsed.token });
    }
  }, []);

  const handleUpdate: SubmitHandler<CompanyProps> = async (data) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Insira a Razão Social"),
        city: Yup.string().required("Insira a cidade"),
        cnpj: Yup.string().required("Insira o CNPJ"),
        district: Yup.string().required("Insira o bairro"),
        fantasy_name: Yup.string().required("Insira o nome fantasia"),
        number: Yup.string().required("Insira o número do estabelecimento"),
        state: Yup.string().required("Selecione o estado"),
        street: Yup.string().required("Insira o nome da rua"),
        zip_code: Yup.string().required("Insira o CEP"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading({ action: "save", loading: true });
      const response = await api.put(
        `/updateCompanyInfo/${company?.id}`,
        {
          name: data.name,
          fantasy_name: data.fantasy_name,
          cnpj: data.cnpj,
          phone: data.phone,
          email: data.email,
          municipal_registration: data.municipal_registration,
          state_registration: data.state_registration,
          street: data.street,
          number: data.number,
          comp: data.comp,
          district: data.district,
          zip_code: data.zip_code,
          city: data.city,
          state: data.state,
        },
        {
          headers: { "x-access-authorization": userToken?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading({ action: "save", loading: false });
    } catch (error) {
      setLoading({ action: "save", loading: false });
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

  function handleThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  const mutation = useMutation(
    (thumb: File) => {
      let thumbData = new FormData();
      thumbData.append("thumbnail", thumb);
      return api.put(`/companyThumb/${company?.id}`, thumbData);
    },
    {
      onSuccess: async (data) => {
        showToast(data.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("company");
        removeThumbnail();
        setShowThumb(true);
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const handleRemoveThumbnail = async (id: string, name: string) => {
    try {
      setLoadingDel(true);
      const response = await api.put(
        `/deleteThumbnailCompany/${id}`,
        {
          name,
        },
        {
          headers: { "x-access-authorization": userToken?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setShowThumb(false);
      setLoadingDel(false);
    } catch (error) {
      setLoadingDel(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  return (
    <Fragment>
      <Box py={3}>
        {isLoading ? (
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "280px 1fr",
              "280px 1fr",
              "280px 1fr",
            ]}
            gap={10}
          >
            <Skeleton w="250px" h="250px" />
            <Stack spacing={3}>
              <Skeleton h={10} />
              <Skeleton h={10} />
              <Skeleton h={10} />
              <Skeleton h={10} />
              <Skeleton h={10} />
              <Skeleton h={10} />
              <Skeleton h={10} />
            </Stack>
          </Grid>
        ) : (
          <Grid
            templateColumns={[
              "1fr",
              "1fr",
              "250px 1fr",
              "250px 1fr",
              "250px 1fr",
            ]}
            gap={5}
          >
            <Box h="min-content" w="250px">
              {company?.thumbnail ? (
                <FormControl>
                  <FormLabel>Logo da Empresa</FormLabel>
                  <Flex
                    direction={"column"}
                    align="center"
                    justify={"center"}
                    pb={3}
                  >
                    <Box rounded="md" w="250px" h="250px">
                      <Image
                        src={company?.thumbnail}
                        w="250px"
                        h="250px"
                        objectFit={"cover"}
                        rounded="md"
                      />
                    </Box>

                    <Popover
                      isOpen={isOpen}
                      onOpen={onOpen}
                      onClose={onClose}
                      placement="right"
                    >
                      <PopoverTrigger>
                        <IconButton
                          aria-label="Alterar logo da empresa"
                          icon={<FaTrashAlt />}
                          colorScheme={"red"}
                          mt={"-45px"}
                          size="sm"
                        />
                      </PopoverTrigger>
                      <PopoverContent
                        shadow={"md"}
                        _focus={{ outline: "none" }}
                      >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader>Atenção!</PopoverHeader>
                        <PopoverBody>
                          Tem certeza que deseja remover esta imagem?
                        </PopoverBody>
                        <PopoverFooter
                          d="flex"
                          alignItems="center"
                          justifyContent="flex-end"
                        >
                          <ButtonGroup size="sm">
                            <Button onClick={onClose}>Não</Button>
                            <Button
                              colorScheme="blue"
                              onClick={() =>
                                handleRemoveThumbnail(
                                  company?.id || "",
                                  company?.thumbnail_id || ""
                                )
                              }
                              isLoading={loadingDel}
                            >
                              Sim
                            </Button>
                          </ButtonGroup>
                        </PopoverFooter>
                      </PopoverContent>
                    </Popover>
                  </Flex>
                </FormControl>
              ) : (
                <Uploader
                  title={true}
                  name="thumbnail"
                  url={`/companyThumb/${company?.id}`}
                  height={250}
                  width={250}
                />
              )}
            </Box>
            <Box>
              <Form ref={formRef} onSubmit={handleUpdate}>
                <Stack spacing={3}>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "1fr",
                      "1fr",
                      "1fr 1fr",
                      "1fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>Razão Social</FormLabel>
                      <Input name="name" autoFocus />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Nome Fantasia</FormLabel>
                      <Input name="fantasy_name" />
                    </FormControl>
                  </Grid>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "1fr",
                      "1fr",
                      "1fr 1fr 1fr",
                      "1fr 1fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>CNPJ</FormLabel>
                      <InputMask mask="99.999.999/9999-99" name="cnpj" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Telefone</FormLabel>
                      <InputMask mask="(99) 99999-9999" name="phone" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Email</FormLabel>
                      <Input name="email" />
                    </FormControl>
                  </Grid>
                  <Grid templateColumns={"1fr 1fr"} gap={3}>
                    <FormControl>
                      <FormLabel>Inscrição Municipal</FormLabel>
                      <Input name="municipal_registration" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Inscrição Estadual</FormLabel>
                      <Input name="state_registration" />
                    </FormControl>
                  </Grid>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "3fr 1fr",
                      "3fr 1fr",
                      "3fr 1fr",
                      "3fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>Logradouro</FormLabel>
                      <Input name="street" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Número</FormLabel>
                      <Input name="number" />
                    </FormControl>
                  </Grid>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                      "2fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>Complemento</FormLabel>
                      <Input name="comp" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Bairro</FormLabel>
                      <Input name="district" />
                    </FormControl>
                  </Grid>
                  <Grid
                    templateColumns={[
                      "1fr",
                      "1fr 2fr 1fr",
                      "1fr 2fr 1fr",
                      "1fr 2fr 1fr",
                      "1fr 2fr 1fr",
                    ]}
                    gap={3}
                  >
                    <FormControl>
                      <FormLabel>CEP</FormLabel>
                      <InputMask mask={"99999-999"} name="zip_code" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Cidade</FormLabel>
                      <Input name="city" />
                    </FormControl>
                    <FormControl>
                      <FormLabel>Estado</FormLabel>
                      <Select name="state">
                        <option value="AC">AC</option>
                        <option value="AL">AL</option>
                        <option value="AP">AP</option>
                        <option value="AM">AM</option>
                        <option value="BA">BA</option>
                        <option value="CE">CE</option>
                        <option value="DF">DF</option>
                        <option value="ES">ES</option>
                        <option value="GO">GO</option>
                        <option value="MA">MA</option>
                        <option value="MT">MT</option>
                        <option value="MS">MS</option>
                        <option value="MG">MG</option>
                        <option value="PA">PA</option>
                        <option value="PB">PB</option>
                        <option value="PR">PR</option>
                        <option value="PE">PE</option>
                        <option value="PI">PI</option>
                        <option value="RJ">RJ</option>
                        <option value="RN">RN</option>
                        <option value="RS">RS</option>
                        <option value="RO">RO</option>
                        <option value="RR">RR</option>
                        <option value="SC">SC</option>
                        <option value="SP">SP</option>
                        <option value="SE">SE</option>
                        <option value="TO">TO</option>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Button
                    leftIcon={<AiOutlineSave />}
                    colorScheme="blue"
                    isFullWidth={false}
                    size="lg"
                    type="submit"
                    w="fit-content"
                    isLoading={
                      loading?.action === "save" && loading.loading === true
                    }
                  >
                    Salvar
                  </Button>
                </Stack>
              </Form>
            </Box>
          </Grid>
        )}
      </Box>
    </Fragment>
  );
}
