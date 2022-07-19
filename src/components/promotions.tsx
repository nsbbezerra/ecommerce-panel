import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Image,
  Input,
  Select,
  Stack,
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
  price: number;
  promo_id: string;
  isPromotional: boolean;
};

type AuthProps = {
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

export default function AdminPromotions({
  productId,
  price,
  promo_id,
  isPromotional,
}: Props) {
  const toast = useToast();

  const [auth, setAuth] = useState<AuthProps>();
  const [promotions, setPromotions] = useState<PromotionProps[]>();
  const [selectedPromotion, setSelectedPromotion] = useState<PromotionProps>();
  const [promotionId, setPromotionId] = useState<string>("");
  const [in_promotion, setIn_promotion] = useState<boolean>(false);
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

  useEffect(() => {
    if (promotions?.length) {
      const find = promotions?.find((obj) => obj.id === promo_id);
      setSelectedPromotion(find);
      setPromotionId(promo_id);
    }
  }, [promotions]);

  useEffect(() => {
    setIn_promotion(isPromotional);
  }, [isPromotional]);

  useEffect(() => {
    if (in_promotion === false) {
      setPromotionId("");
      setSelectedPromotion(undefined);
    }
  }, [in_promotion]);

  async function getInformation(id: string, token: string) {
    try {
      const { data } = await api.get(`/promotions/${id}`);
      setPromotions(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    const company = localStorage.getItem("company");
    const userToken = sessionStorage.getItem("user");
    let companyParse = JSON.parse(company || "");
    let userParse = JSON.parse(userToken || "");

    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
      getInformation(companyParse.id, userParse.token);
    } else {
      showToast(
        "Informações da empresa e do usuário ausentes",
        "warning",
        "Atenção"
      );
    }
  }, []);

  function handleChangePromotion(id: string) {
    const find = promotions?.find((obj) => obj.id === id);
    setSelectedPromotion(find);
    setPromotionId(id);
  }

  function calcPercent() {
    let discount = selectedPromotion?.discount || "";
    let calc = (price * parseFloat(discount)) / 100;
    let final = price - calc;
    return parseFloat(final.toFixed(2));
  }

  async function setPromotionalProduct() {
    try {
      setLoading(true);
      const response = await api.put(
        `/setPromotionalProduct/${productId}`,
        {
          in_promotion,
          promotions: promotionId,
          profit_percent: selectedPromotion?.discount || 0,
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
      <FormControl>
        <HStack spacing={3}>
          <Switch
            size="lg"
            defaultChecked={in_promotion || isPromotional}
            onChange={(e) => setIn_promotion(e.target.checked)}
          />
          <Select
            placeholder="Selecione uma opção"
            value={promotionId}
            onChange={(e) => handleChangePromotion(e.target.value)}
            isDisabled={!in_promotion}
          >
            {promotions?.map((pro) => (
              <option key={pro.id} value={pro.id}>
                {pro.title}
              </option>
            ))}
          </Select>
        </HStack>
      </FormControl>
      {promotionId !== "" && in_promotion !== false ? (
        <>
          <Divider mt={3} mb={3} />

          <Image src={selectedPromotion?.banner} w="full" rounded={"md"} />

          <Stack spacing={3} mt={3}>
            <Grid templateColumns={"2fr 1fr"} gap={3}>
              <FormControl>
                <FormLabel>Título</FormLabel>
                <Input
                  placeholder="Título"
                  isReadOnly
                  value={selectedPromotion?.title}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Desconto (%)</FormLabel>
                <Input
                  placeholder="Desconto"
                  isReadOnly
                  value={selectedPromotion?.discount}
                />
              </FormControl>
            </Grid>
            <Grid templateColumns={"1fr 1fr"} gap={3}>
              <FormControl>
                <FormLabel>Preço Atual (R$)</FormLabel>
                <Input
                  placeholder="Preço Atual (R$)"
                  isReadOnly
                  value={price}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Preço com Desconto (R$)</FormLabel>
                <Input
                  placeholder="Preço com Desconto (R$)"
                  isReadOnly
                  value={calcPercent()}
                />
              </FormControl>
            </Grid>
          </Stack>
        </>
      ) : (
        ""
      )}
      <Flex justify={"end"} mt={5}>
        <Button
          leftIcon={<AiOutlineSave />}
          colorScheme="blue"
          isLoading={loading}
          onClick={() => setPromotionalProduct()}
        >
          Salvar
        </Button>
      </Flex>
    </Fragment>
  );
}
