import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  ToastPositionWithLogical,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Input from "../../components/Input";
import DatePicker from "../../components/datepicker";
import TextArea from "../../components/textArea";
import Select from "../../components/Select";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";
import { api, configs } from "../../configs";

type ExpensesProps = {
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
  value: number;
};

type Props = {
  id: string;
  token: string;
};

export default function RegisterExpenses() {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<Props>();

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

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

  const handleSubmit: SubmitHandler<ExpensesProps> = async (
    data,
    { reset }
  ) => {
    try {
      const scheme = Yup.object().shape({
        title: Yup.string().required("Insira um título para a despesa"),
        due_date: Yup.date().required("Insira uma data para a despesa"),
        value: Yup.string().required("Insira um valor para a despesa"),
        payment_method: Yup.string().required("Insira uma forma de pagamento"),
        payment_status: Yup.string().required(
          "Selecione um status para o pagamento"
        ),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      const response = await api.post(`/expenses/${auth?.id}`, data, {
        headers: { "x-access-authorization": auth?.token || "" },
      });

      setLoading(false);

      showToast(response.data.message, "success", "Sucesso");

      reset();
    } catch (error) {
      setLoading(false);
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
      <Form ref={formRef} onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <Grid templateColumns={"3fr 1fr"} gap={3}>
            <FormControl isRequired>
              <FormLabel>Título da Despesa</FormLabel>
              <Input placeholder="Título da Despesa" name="title" />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Data do Pagamento</FormLabel>
              <DatePicker name="due_date" />
            </FormControl>
          </Grid>
          <FormControl>
            <FormLabel>Descrição da Despesa</FormLabel>
            <TextArea placeholder="Descrição da Despesa" name="description" />
          </FormControl>
          <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
            <FormControl isRequired>
              <FormLabel>Valor da Despesa (R$)</FormLabel>
              <Input
                placeholder="Valor da Despesa (R$)"
                name="value"
                type="number"
              />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Forma de Pagamento</FormLabel>
              <Select name="payment_method" placeholder="Selecione uma opção">
                <option value="money">Dinheiro</option>
                <option value="credit_card">Cartão de Crédito</option>
                <option value="debit_card">Cartão de Débito</option>
                <option value="ticket">Boleto</option>
                <option value="duplicata">Duplicata</option>
                <option value="pix">PIX</option>
              </Select>
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Status do Pagamento</FormLabel>
              <Select name="payment_status" placeholder="Selecione uma opção">
                <option value="wait">Aguardando Pagamento</option>
                <option value="refused">Pagamento Recusado</option>
                <option value="cancel">Pagamento Cancelado</option>
                <option value="paid_out">Pagamento Efetuado</option>
              </Select>
            </FormControl>
          </Grid>

          <Button
            leftIcon={<AiOutlineSave />}
            size="lg"
            colorScheme={"blue"}
            w="fit-content"
            px={10}
            type="submit"
            isLoading={loading}
          >
            Salvar Despesa
          </Button>
        </Stack>
      </Form>
    </Fragment>
  );
}
