import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  Select as ChakraSelect,
  Skeleton,
  Stack,
  Table,
  Tag,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  ToastPositionWithLogical,
  Tr,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverArrow,
  PopoverCloseButton,
  useColorModeValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { api, configs } from "../../configs";
import { useQuery, useMutation, QueryClient } from "react-query";
import axios from "axios";
import { GiCardboardBox } from "react-icons/gi";
import { format } from "date-fns";
import { AiOutlineEdit, AiOutlineSave, AiOutlineZoomIn } from "react-icons/ai";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Input from "../../components/Input";
import DatePicker from "../../components/datepicker";
import TextArea from "../../components/textArea";
import Select from "../../components/Select";

type Props = {
  id: string;
  token: string;
};

type RevenueProps = {
  id: string;
  title: string;
  description: string;
  due_date: Date;
  payment_method:
    | "money"
    | "credit_card"
    | "debit_card"
    | "ticket"
    | "duplicata"
    | "pix";
  payment_status: "wait" | "paid_out" | "refused" | "cancel";
  value: string;
};

const queryClient = new QueryClient();

export default function ListRevenues() {
  const formRef = useRef<FormHandles>(null);
  const toast = useToast();
  const [month, setMonth] = useState<string>(
    new Date().toLocaleString("pt-Br", { month: "long" })
  );
  const [year, setYear] = useState<string>(new Date().getFullYear().toString());
  const [type, setType] = useState<string>("actual");

  const [auth, setAuth] = useState<Props>();

  const [revenues, setRevenues] = useState<RevenueProps[]>();
  const [revenue, setRevenue] = useState<RevenueProps>();

  const [modalEdit, setModalEdit] = useState<boolean>(false);

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
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");
    const dateToNow = new Date();
    setMonth(dateToNow.toLocaleString("pt-Br", { month: "long" }));
    setYear(dateToNow.getFullYear().toString());

    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    } else {
      showToast(
        "Informa????es da empresa e do usu??rio ausentes",
        "warning",
        "Aten????o"
      );
    }
  }, []);

  function handleYear() {
    const dateNow = new Date();
    let yearMinusThree = dateNow.getFullYear() - 3;
    let yearMinusTwo = dateNow.getFullYear() - 2;
    let yearMinusOne = dateNow.getFullYear() - 1;
    let yearDate = dateNow.getFullYear();
    let yearPlusOne = dateNow.getFullYear() + 1;
    let yearPlusTwo = dateNow.getFullYear() + 2;
    let yearPlusThree = dateNow.getFullYear() + 3;
    let years = [
      yearMinusThree.toString(),
      yearMinusTwo.toString(),
      yearMinusOne.toString(),
      yearDate.toString(),
      yearPlusOne.toString(),
      yearPlusTwo.toString(),
      yearPlusThree.toString(),
    ];

    return years;
  }

  function handlePaymentMethod(method: string) {
    switch (method) {
      case "money":
        return "Dinheiro";

      case "credit_card":
        return "Cart??o de Cr??dito";

      case "debit_card":
        return "Cart??o de D??bito";

      case "ticket":
        return "Boleto";

      case "duplicata":
        return "Duplicata";

      case "PIX":
        return "PIX";
      default:
        return "Dinheiro";
    }
  }

  function handleStatusPay(status: string) {
    switch (status) {
      case "wait":
        return "Aguardando";

      case "paid_out":
        return "Pago";

      case "refused":
        return "Recusado";

      case "cancel":
        return "Cancelado";

      default:
        return "Aguardando";
    }
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
      const { data } = await api.get(
        `/revenues/${companyParse?.id}/${type}/${month}/${year}`
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

  const { data, isLoading, error } = useQuery("list-revenues", getInformation, {
    refetchInterval: 4000,
  });

  useEffect(() => {
    if (error) {
      const message = (error as Error).message;
      showToast(message, "error", "Erro");
    }
  }, [error]);

  useEffect(() => {
    if (data) {
      setRevenues(data);
    }
  }, [data]);

  const mutationUpdate = useMutation(
    (data: RevenueProps) => {
      return api.put(
        `/revenues/${data.id}`,
        {
          title: data.title,
          description: data.description,
          due_date: data.due_date,
          payment_method: data.payment_method,
          payment_status: data.payment_status,
          value: data.value,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );
    },
    {
      onSuccess: async (response) => {
        showToast(response.data.message, "success", "Sucesso");
        queryClient.invalidateQueries("list-revenues");
        setModalEdit(false);
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

  function handleRevenue(id: string) {
    const result = revenues?.find((obj) => obj.id === id);
    setRevenue(result);
    setModalEdit(true);
  }

  const handleUpdate: SubmitHandler<RevenueProps> = async (data) => {
    mutationUpdate.mutate({
      id: data.id,
      title: data.title,
      description: data.description,
      due_date: data.due_date,
      payment_method: data.payment_method,
      payment_status: data.payment_status,
      value: data.value,
    });
  };

  return (
    <Fragment>
      <Grid templateColumns={"1fr 1fr 1fr"} gap={3}>
        <FormControl>
          <FormLabel>Op????o de busca</FormLabel>
          <ChakraSelect
            placeholder="Selecione uma op????o"
            value={type}
            onChange={(e) => setType(e.target.value)}
          >
            <option value="actual">M??s Atual</option>
            <option value="period">Por Per??odo</option>
          </ChakraSelect>
        </FormControl>
        <FormControl>
          <FormLabel>M??s</FormLabel>
          <ChakraSelect
            placeholder="Selecione uma op????o"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            isDisabled={type === "actual" ? true : false}
          >
            <option value={"janeiro"}>Janeiro</option>
            <option value={"fevereiro"}>Fevereiro</option>
            <option value={"mar??o"}>Mar??o</option>
            <option value={"abril"}>Abril</option>
            <option value={"maio"}>Maio</option>
            <option value={"junho"}>Junho</option>
            <option value={"julho"}>Julho</option>
            <option value={"agosto"}>Agosto</option>
            <option value={"setembro"}>Setembro</option>
            <option value={"outubro"}>Outubro</option>
            <option value={"novembro"}>Novembro</option>
            <option value={"dezembro"}>Dezembro</option>
          </ChakraSelect>
        </FormControl>
        <FormControl>
          <FormLabel>Ano</FormLabel>
          <ChakraSelect
            placeholder="Selecione uma op????o"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            isDisabled={type === "actual" ? true : false}
          >
            {handleYear().map((yr) => (
              <option value={yr} key={yr}>
                {yr}
              </option>
            ))}
          </ChakraSelect>
        </FormControl>
      </Grid>

      <Divider mt={3} mb={3} />

      {isLoading ? (
        <Stack spacing={4}>
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
          <Skeleton h={7} />
        </Stack>
      ) : (
        <Fragment>
          {!revenues || revenues.length === 0 ? (
            <Flex justify={"center"} align="center" direction={"column"}>
              <Icon as={GiCardboardBox} fontSize="8xl" />
              <Text>Nenhuma informa????o para mostrar</Text>
            </Flex>
          ) : (
            <Fragment>
              <Table size={"sm"}>
                <Thead>
                  <Tr>
                    <Th>T??tulo</Th>
                    <Th w="12%">Descri????o</Th>
                    <Th w="12%" textAlign={"center"}>
                      Pagamento
                    </Th>
                    <Th w="10%" textAlign={"center"}>
                      Status
                    </Th>
                    <Th w="10%">Vencimento</Th>
                    <Th w="10%" isNumeric>
                      Valor
                    </Th>
                    <Th w="10%" textAlign={"center"}>
                      Op????es
                    </Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {revenues.map((rv) => (
                    <Tr
                      key={rv.id}
                      bg={
                        new Date(rv.due_date) < new Date() &&
                        rv.payment_status !== "paid_out"
                          ? useColorModeValue("red.50", "red.900")
                          : ""
                      }
                    >
                      <Td>{rv.title}</Td>
                      <Td>
                        <Popover>
                          <PopoverTrigger>
                            <Button
                              isFullWidth
                              leftIcon={<AiOutlineZoomIn />}
                              size="xs"
                              colorScheme={"blue"}
                              variant="outline"
                            >
                              Visualizar
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent
                            shadow="lg"
                            _focus={{ outline: "none" }}
                          >
                            <PopoverArrow />
                            <PopoverCloseButton />
                            <PopoverHeader>Descri????o</PopoverHeader>
                            <PopoverBody>{rv.description}</PopoverBody>
                          </PopoverContent>
                        </Popover>
                      </Td>
                      <Td>
                        <Tag
                          w="full"
                          justifyContent={"center"}
                          colorScheme="green"
                        >
                          {handlePaymentMethod(rv.payment_method)}
                        </Tag>
                      </Td>
                      <Td>
                        {rv.payment_status === "cancel" && (
                          <Tag
                            w="full"
                            justifyContent={"center"}
                            colorScheme="red"
                          >
                            {handleStatusPay(rv.payment_status)}
                          </Tag>
                        )}
                        {rv.payment_status === "paid_out" && (
                          <Tag
                            w="full"
                            justifyContent={"center"}
                            colorScheme="green"
                          >
                            {handleStatusPay(rv.payment_status)}
                          </Tag>
                        )}
                        {rv.payment_status === "refused" && (
                          <Tag
                            w="full"
                            justifyContent={"center"}
                            colorScheme="gray"
                          >
                            {handleStatusPay(rv.payment_status)}
                          </Tag>
                        )}
                        {rv.payment_status === "wait" && (
                          <Tag
                            w="full"
                            justifyContent={"center"}
                            colorScheme="yellow"
                          >
                            {handleStatusPay(rv.payment_status)}
                          </Tag>
                        )}
                      </Td>
                      <Td>{format(new Date(rv.due_date), "dd/MM/yyyy")}</Td>
                      <Td isNumeric>
                        {parseFloat(rv.value).toLocaleString("pt-br", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </Td>
                      <Td>
                        {
                          <Button
                            leftIcon={<AiOutlineEdit />}
                            size="xs"
                            isFullWidth
                            onClick={() => handleRevenue(rv.id)}
                          >
                            Alterar
                          </Button>
                        }
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Fragment>
          )}
        </Fragment>
      )}

      <Modal isOpen={modalEdit} onClose={() => setModalEdit(false)} size="5xl">
        <ModalOverlay />
        <Form
          ref={formRef}
          onSubmit={handleUpdate}
          initialData={{
            title: revenue?.title,
            description: revenue?.description,
            due_date: new Date(revenue?.due_date || new Date()),
            value: revenue?.value,
            payment_method: revenue?.payment_method,
            payment_status: revenue?.payment_status,
            id: revenue?.id,
          }}
        >
          <ModalContent>
            <ModalHeader>Editar Informa????es</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Stack spacing={3}>
                <Grid templateColumns={"3fr 1fr"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>T??tulo da Receita</FormLabel>
                    <Input placeholder="T??tulo da Receita" name="title" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Data do Pagamento</FormLabel>
                    <DatePicker name="due_date" />
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel>Descri????o da Receita</FormLabel>
                  <TextArea
                    placeholder="Descri????o da Receita"
                    name="description"
                  />
                </FormControl>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>Valor da Receita (R$)</FormLabel>
                    <Input
                      placeholder="Valor da Receita (R$)"
                      name="value"
                      type="number"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Forma de Pagamento</FormLabel>
                    <Select
                      name="payment_method"
                      placeholder="Selecione uma op????o"
                    >
                      <option value="money">Dinheiro</option>
                      <option value="credit_card">Cart??o de Cr??dito</option>
                      <option value="debit_card">Cart??o de D??bito</option>
                      <option value="ticket">Boleto</option>
                      <option value="duplicata">Duplicata</option>
                      <option value="pix">PIX</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Status do Pagamento</FormLabel>
                    <Select
                      name="payment_status"
                      placeholder="Selecione uma op????o"
                    >
                      <option value="wait">Aguardando Pagamento</option>
                      <option value="refused">Pagamento Recusado</option>
                      <option value="cancel">Pagamento Cancelado</option>
                      <option value="paid_out">Pagamento Efetuado</option>
                    </Select>
                  </FormControl>
                </Grid>
                <Input name="id" display={"none"} />
              </Stack>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme={"blue"}
                leftIcon={<AiOutlineSave />}
                type="submit"
                isLoading={mutationUpdate.isLoading}
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
