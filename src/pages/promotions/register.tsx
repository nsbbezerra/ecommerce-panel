import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Icon,
  IconButton,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AiOutlinePicture, AiOutlineSave } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "../../configs";

type Props = {
  id: string;
  token: string;
};

export default function RegisterPromotions() {
  const toast = useToast();
  const [thumbnail, setThumbnail] = useState<any>(undefined);
  const [title, setTitle] = useState<string>("");
  const [discount, setDiscount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [auth, setAuth] = useState<Props>();

  function clear() {
    setThumbnail(undefined);
    setTitle("");
    setDiscount("");
    setDescription("");
    removeThumbnail();
  }

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
      position: "top-right",
      duration: 8000,
      isClosable: true,
    });
  }

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail);
    setThumbnail(undefined);
  }

  function handelThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  async function storePromotion() {
    if (!thumbnail) {
      showToast("Insira uma imagem para a promoção", "error", "Erro");
      return false;
    }
    if (!title) {
      showToast("Insira um título para a promoção", "error", "Erro");
      return false;
    }

    let data = new FormData();

    data.append("banner", thumbnail);
    data.append("title", title);
    data.append("discount", discount);
    data.append("description", description);

    setLoading(true);

    try {
      const response = await api.post(`/promotions/${auth?.id}`, data, {
        headers: { "x-access-authorization": auth?.token || "" },
      });

      showToast(response.data.message, "success", "Sucesso");
      clear();
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
      <Flex justify={"center"} align="center" direction={"row"}>
        <Box w="1140px">
          {thumbnail ? (
            <Flex
              w="1140px"
              direction={"column"}
              justify="center"
              align="center"
              position={"relative"}
            >
              <Box
                w="1140px"
                h="215px"
                overflow={"hidden"}
                borderWidth="1px"
                rounded={"md"}
              >
                <Image
                  w="1140px"
                  h="215px"
                  objectFit={"cover"}
                  src={previewThumbnail}
                />
              </Box>
              <IconButton
                aria-label="remover banner"
                icon={<FaTrashAlt />}
                colorScheme="red"
                w="fit-content"
                position={"absolute"}
                bottom={5}
                onClick={() => removeThumbnail()}
              />
            </Flex>
          ) : (
            <FormLabel
              display={"flex"}
              rounded={"md"}
              overflow="hidden"
              position={"relative"}
              borderWidth="1px"
              borderStyle={"dashed"}
              borderColor={useColorModeValue("gray.900", "gray.100")}
              _hover={{ borderWidth: "2px" }}
              w="1140px"
              h="215px"
              justifyContent={"center"}
              alignItems="center"
              flexDirection={"column"}
              gap={3}
              cursor="pointer"
            >
              <Input
                type={"file"}
                display="none"
                onChange={(e) => handelThumbnail(e.target.files)}
              />
              <Icon as={AiOutlinePicture} fontSize="4xl" />
              <Text userSelect={"none"}>
                Insira sua imagem aqui, o tamanho deve ser 1140px por 215px
              </Text>
            </FormLabel>
          )}

          <Stack spacing={3} mt={3}>
            <Grid templateColumns={"3fr 1fr"} gap={3}>
              <FormControl isRequired>
                <FormLabel>Título da Promoção</FormLabel>
                <Input
                  placeholder="Título da Promoção"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </FormControl>
              <FormControl isRequired>
                <FormLabel>Valor do Desconto (%)</FormLabel>
                <Input
                  placeholder="Valor do Desconto (%)"
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(e.target.value)}
                />
              </FormControl>
            </Grid>
            <FormControl>
              <FormLabel>Descrição da Promoção</FormLabel>
              <Textarea
                rows={5}
                resize="none"
                placeholder="Descrição da Promoção"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </FormControl>

            <Button
              leftIcon={<AiOutlineSave />}
              size="lg"
              colorScheme="blue"
              w="fit-content"
              px={10}
              isLoading={loading}
              onClick={() => storePromotion()}
            >
              Salvar
            </Button>
          </Stack>
        </Box>
      </Flex>
    </Fragment>
  );
}
