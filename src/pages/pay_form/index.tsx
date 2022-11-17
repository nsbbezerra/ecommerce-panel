import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Skeleton,
  Stack,
  Switch,
  Table,
  Tag,
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
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { useQuery, useMutation, QueryClient } from "react-query";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Input from "../../components/Input";
import Select from "../../components/Select";
import { AiOutlineEdit, AiOutlineSave } from "react-icons/ai";
import axios from "axios";
import { api, configs } from "../../configs";
import { GiCardboardBox } from "react-icons/gi";

const queryClient = new QueryClient();

type PayFormProps = {
  id: string;
  name: string;
  tag: "money" | "credit_card" | "debit_card" | "ticket" | "duplicata" | "pix";
  is_installments: boolean;
  installments: number;
  interval_days: string;
  active: boolean;
};

type Props = {
  id: string;
  token: string;
};

type ActiveProps = {
  id: string;
  active: boolean;
};

export default function PayForms() {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const formEditRef = useRef<FormHandles>(null);
  const [payForms, setPayForms] = useState<PayFormProps[]>();
  const [auth, setAuth] = useState<Props>();
  const [loading, setLoading] = useState<boolean>(false);
  const [is_installments, setIs_installments] = useState<boolean>(false);

  const [modalEdit, setModalEdit] = useState<boolean>(false);
  const [payForm, setPayForm] = useState<PayFormProps>();

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
    let companyId;
    let userToken;
    if (auth?.id && auth.token) {
      companyId = auth.id;
      userToken = auth.token;
    } else {
      const company = localStorage.getItem("company");
      const user = sessionStorage.getItem("user");
      const companyParse = JSON.parse(company || "");
      const userParse = JSON.parse(user || "");
      if (companyParse && userParse) {
        setAuth({ id: companyParse.id, token: userParse.token });
        companyId = companyParse.id;
        userToken = userParse.token;
      }
    }

    try {
      const { data } = await api.get(`/pay_form/${companyId}`);
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
    "list_pay_forms",
    getInformation,
    {
      refetchInterval: 4000,
    }
  );

  useEffect(() => {
    if (data) {
      setPayForms(data);
    }
  }, [data]);

  const handleStorePayForm: SubmitHandler<PayFormProps> = async (
    data,
    { reset }
  ) => {
    try {
      const scheme = Yup.object().shape({
        name: Yup.string().required("Insira um Título"),
        tag: Yup.string().required("Selecione uma Tag"),
        installments: Yup.string().required(
          "Insira uma quantidade de parcelas"
        ),
        interval_days: Yup.string().required("Insira um intervalo de dias"),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });

      setLoading(true);
      const response = await api.post(
        `/pay_form/${auth?.id}`,
        {
          name: data.name,
          tag: data.tag,
          is_installments: is_installments,
          installments: data.installments,
          interval_days: data.interval_days,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      reset();
      setIs_installments(false);
    } catch (error) {
      setLoading(false);
      if (error instanceof Yup.ValidationError) {
        error.inner.forEach((err) => {
          showToast(err.message, "error", "Erro");
        });
      }
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  };

  function handlePayForm(id: string) {
    const result = payForms?.find((obj) => obj.id === id);
    setIs_installments(result?.is_installments || false);
    setPayForm(result);
    setModalEdit(true);
  }

  const mutation = useMutation(
    (data: PayFormProps) => {
      return api.put(
        `/pay_form/${payForm?.id}`,
        {
          name: data.name,
          tag: data.tag,
          interval_days: data.interval_days,
          installments: data.installments,
          is_installments: is_installments,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list_pay_forms");
        setModalEdit(false);
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
        `/pay_form_active/${data.id}`,
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
        queryClient.invalidateQueries("list_pay_forms");
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  const updatePayForm: SubmitHandler<PayFormProps> = async (data) => {
    mutation.mutate(data);
  };

  return (
    <Fragment>
      <Box py={3}>
        <Box>
          <Form ref={formRef} onSubmit={handleStorePayForm}>
            <Stack spacing={3}>
              <Grid templateColumns={"3fr 1fr"} gap={3}>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input name="name" placeholder="Título" autoFocus />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Tag</FormLabel>
                  <Select name="tag" placeholder="Selecione uma opção">
                    <option value="money">Dinheiro</option>
                    <option value="credit_card">Cartão de Crédito</option>
                    <option value="debit_card">Cartão de Débito</option>
                    <option value="ticket">Boleto</option>
                    <option value="pix">PIX</option>
                    <option value="duplicata">Duplicata</option>
                  </Select>
                </FormControl>
              </Grid>

              <Grid templateColumns={"100px 1fr 1fr 1fr"} gap={3}>
                <FormControl>
                  <FormLabel>Parcelado?</FormLabel>
                  <Switch
                    defaultChecked={is_installments}
                    onChange={(e) => setIs_installments(e.target.checked)}
                    size="lg"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Intervalo em Dias</FormLabel>
                  <Input
                    name="interval_days"
                    placeholder="Intervalo em Dias"
                    type="number"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Total de Parcelas</FormLabel>
                  <Input
                    name="installments"
                    placeholder="Total de Parcelas"
                    type="number"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel color="transparent">q</FormLabel>
                  <Button
                    leftIcon={<AiOutlineSave />}
                    colorScheme="blue"
                    isFullWidth
                    type="submit"
                    isLoading={loading}
                  >
                    Salvar
                  </Button>
                </FormControl>
              </Grid>
            </Stack>
          </Form>

          <Box
            rounded={"md"}
            shadow="md"
            borderWidth={"1px"}
            mt={5}
            overflow="hidden"
          >
            {isLoading ? (
              <Stack spacing={3}>
                <Skeleton h={7} />
                <Skeleton h={7} />
                <Skeleton h={7} />
                <Skeleton h={7} />
                <Skeleton h={7} />
              </Stack>
            ) : (
              <>
                {payForms?.length === 0 || !payForms ? (
                  <Flex justify={"center"} align="center" direction={"column"}>
                    <Icon as={GiCardboardBox} fontSize="8xl" />
                    <Text>Nenhuma informação para mostrar</Text>
                  </Flex>
                ) : (
                  <Table size={"sm"}>
                    <Thead>
                      <Tr>
                        <Th>Ativo?</Th>
                        <Th>Título</Th>
                        <Th>Tag</Th>
                        <Th>Parcelado?</Th>
                        <Th>Intervalo</Th>
                        <Th>Parcelas</Th>
                        <Th w="12%" textAlign={"center"}>
                          Opções
                        </Th>
                      </Tr>
                    </Thead>
                    <Tbody>
                      {payForms.map((pay) => (
                        <Tr key={pay.id}>
                          <Td>
                            <Switch
                              defaultChecked={pay.active}
                              onChange={(e) =>
                                mutationActive.mutate({
                                  id: pay.id,
                                  active: e.target.checked,
                                })
                              }
                            />
                          </Td>
                          <Td>{pay.name}</Td>
                          <Td>
                            <Tag>
                              {pay.tag === "money" && "Dinheiro"}
                              {pay.tag === "credit_card" && "Cartão de Crédito"}
                              {pay.tag === "debit_card" && "Cartão de Débito"}
                              {pay.tag === "duplicata" && "Duplicata"}
                              {pay.tag === "pix" && "PIX"}
                              {pay.tag === "ticket" && "Boleto"}
                            </Tag>
                          </Td>
                          <Td>
                            {pay.is_installments === true && (
                              <Tag colorScheme={"green"}>SIM</Tag>
                            )}
                            {pay.is_installments === false && (
                              <Tag colorScheme={"red"}>NÃO</Tag>
                            )}
                          </Td>
                          <Td>{pay.interval_days} dias</Td>
                          <Td>{pay.installments}x</Td>
                          <Td w="12%" textAlign={"center"}>
                            <Button
                              leftIcon={<AiOutlineEdit />}
                              size="xs"
                              isFullWidth
                              onClick={() => handlePayForm(pay.id)}
                            >
                              Editar
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                )}
              </>
            )}
          </Box>
        </Box>
      </Box>

      <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)} size="5xl">
        <ModalOverlay />
        <Form
          ref={formEditRef}
          onSubmit={updatePayForm}
          initialData={{
            id: payForm?.id,
            name: payForm?.name,
            tag: payForm?.tag,
            interval_days: payForm?.interval_days,
            installments: payForm?.installments,
          }}
        >
          <ModalContent>
            <ModalHeader>Editar Informações</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <Grid templateColumns={"3fr 1fr"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>Título</FormLabel>
                    <Input name="name" placeholder="Título" autoFocus />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Tag</FormLabel>
                    <Select name="tag" placeholder="Selecione uma opção">
                      <option value="money">Dinheiro</option>
                      <option value="credit_card">Cartão de Crédito</option>
                      <option value="debit_card">Cartão de Débito</option>
                      <option value="ticket">Boleto</option>
                      <option value="pix">PIX</option>
                      <option value="duplicata">Duplicata</option>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid templateColumns={"100px 1fr 1fr"} gap={3}>
                  <FormControl>
                    <FormLabel>Parcelado?</FormLabel>
                    <Switch
                      defaultChecked={is_installments}
                      onChange={(e) => setIs_installments(e.target.checked)}
                      size="lg"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Intervalo em Dias</FormLabel>
                    <Input
                      name="interval_days"
                      placeholder="Intervalo em Dias"
                      type="number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Total de Parcelas</FormLabel>
                    <Input
                      name="installments"
                      placeholder="Total de Parcelas"
                      type="number"
                    />
                  </FormControl>
                </Grid>
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                leftIcon={<AiOutlineSave />}
                colorScheme="blue"
                type="submit"
                isLoading={mutation.isLoading}
              >
                Salvar
              </Button>
            </ModalFooter>
          </ModalContent>
        </Form>
      </Modal>
    </Fragment>
  );
}
