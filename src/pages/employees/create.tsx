import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { api } from "../../configs";
import { Form } from "@unform/web";
import { SubmitHandler, FormHandles } from "@unform/core";
import * as Yup from "yup";

import Input from "../../components/Input";
import InputMask from "../../components/InputMask";
import Select from "../../components/Select";
import { AiOutlineSave } from "react-icons/ai";
import axios from "axios";

type EmployeeProps = {
  name: string;
  phone: string;
  user: string;
  password: string;
  permission: "all" | "cashier" | "seller";
};

type UserProps = {
  token: string;
};

type CompanyProps = {
  id: string;
};

const EmployeeCreate = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps>();
  const [company, setCompany] = useState<CompanyProps>();

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
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");
    if (companyParse && userParse) {
      setUser({ token: userParse.token });
      setCompany({ id: companyParse.id });
    }
  }, []);

  const handleCreate: SubmitHandler<EmployeeProps> = async (
    data,
    { reset }
  ) => {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required("Insira um nome"),
        phone: Yup.string(),
        user: Yup.string().required("Insira um usuário"),
        password: Yup.string().required("Insira uma senha"),
        permission: Yup.string().required("Selecione uma opção de permissão"),
      });

      await schema.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      const response = await api.post(`/employees/${company?.id}`, data, {
        headers: { "x-access-authorization": user?.token || "" },
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
      reset();
    } catch (error) {
      setLoading(false);
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
          <Form onSubmit={handleCreate} ref={formRef}>
            <Stack spacing={3}>
              <Grid
                templateColumns={[
                  "1fr",
                  "1fr",
                  "3fr 1fr",
                  "3fr 1fr",
                  "3fr 1fr",
                ]}
                gap={3}
              >
                <FormControl isRequired>
                  <FormLabel>Nome</FormLabel>
                  <Input name="name" placeholder="Nome" autoFocus />
                </FormControl>
                <FormControl>
                  <FormLabel>Telefone</FormLabel>
                  <InputMask
                    mask="(99) 99999-9999"
                    name="phone"
                    placeholder="Telefone"
                  />
                </FormControl>
              </Grid>
              <Grid
                templateColumns={[
                  "repeat(1, 1fr)",
                  "repeat(1, 1fr)",
                  "repeat(3, 1fr)",
                  "repeat(3, 1fr)",
                  "repeat(3, 1fr)",
                ]}
                gap={3}
              >
                <FormControl isRequired>
                  <FormLabel>Usuário</FormLabel>
                  <Input name="user" placeholder="Usuário" />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Senha</FormLabel>
                  <Input
                    name="password"
                    placeholder="Senha"
                    type={"password"}
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Permissão</FormLabel>
                  <Select name="permission" placeholder="Selecione uma opção">
                    <option value="all">Geral</option>
                    <option value="cashier">Financeiro</option>
                    <option value="seller">Vendas</option>
                  </Select>
                </FormControl>
              </Grid>

              <Button
                leftIcon={<AiOutlineSave />}
                size="lg"
                w="fit-content"
                colorScheme={"blue"}
                type="submit"
                isLoading={loading}
              >
                Cadastrar
              </Button>
            </Stack>
          </Form>
        </Box>
      </Box>
    </Fragment>
  );
};

export default EmployeeCreate;
