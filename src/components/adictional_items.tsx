import {
  Button,
  FormControl,
  FormLabel,
  Grid,
  Select,
  Switch,
  ToastPositionWithLogical,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { api, configs } from "../configs";

type Props = {
  productId: string;
  adictional: boolean;
  category: string;
};

type AdicionalItemsProps = {
  id: string;
  title: string;
};

type AuthProps = {
  id: string;
  token: string;
};

export default function AdictionalItemsAdmin({
  productId,
  adictional,
  category,
}: Props) {
  const toast = useToast();
  const [adicionalItems, setAdictionalItems] =
    useState<AdicionalItemsProps[]>();
  const [have_adictional, setHave_adictional] = useState<boolean>(false);
  const [adicionalItemsId, setAdicionalItemsId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<AuthProps>();

  useEffect(() => {
    setAdicionalItemsId(category);
    setHave_adictional(adictional);
  }, [category, adictional]);

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

  async function findAdicionalItems(id: string, token: string) {
    try {
      const response = await api.get(`/categoryAdictionalItems/${id}`, {
        headers: { "x-access-authorization": token || "" },
      });
      setAdictionalItems(response.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      findAdicionalItems(companyParse.id, userParse.token);
      setAuth({ id: companyParse.id, token: userParse.token });
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  async function storeAddctionalItems() {
    if (productId === "") {
      showToast("Você precisa salvar o produto primeiro", "warning", "Atenção");
      return false;
    }
    if (adicionalItemsId === "") {
      showToast(
        "Selecione uma opção de itens adicionais",
        "warning",
        "Atenção"
      );
      return false;
    }
    setLoading(true);
    try {
      const response = await api.put(
        `/setAdicionalItems/${productId}`,
        {
          adictional: adicionalItemsId,
          have_adictional,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");
      setLoading(false);
    } catch (error) {
      setLoading(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  return (
    <Fragment>
      <Grid templateColumns={"1fr 100px"} gap={3} alignItems="end">
        <FormControl>
          <FormLabel>
            Itens Adicionais{" "}
            <Switch
              mt={1}
              mb={1}
              defaultChecked={have_adictional || adictional}
              onChange={(e) => setHave_adictional(e.target.checked)}
            />
          </FormLabel>
          <Select
            value={adicionalItemsId}
            onChange={(e) => setAdicionalItemsId(e.target.value)}
            placeholder="Selecione uma opção"
            isDisabled={!have_adictional}
          >
            {adicionalItems?.map((add) => (
              <option key={add.id} value={add.id}>
                {add.title}
              </option>
            ))}
          </Select>
        </FormControl>
        <Button
          leftIcon={<AiOutlineSave />}
          colorScheme="blue"
          isLoading={loading}
          onClick={() => storeAddctionalItems()}
        >
          Salvar
        </Button>
      </Grid>
    </Fragment>
  );
}
