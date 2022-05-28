import { useEffect, useRef, useState } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import * as Icons from "react-icons/all";

import Input from "../../components/Input";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Input as ChakraInput,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineSave } from "react-icons/ai";
import TextArea from "../../components/textArea";
import { icons } from "../../configs/icons";
import axios from "axios";
import { api, configs } from "../../configs";

type Props = {
  id: string;
  token: string;
};

type IconProps = {
  icon: string;
  title: string;
  category: string;
};

type IconUnitProps = {
  icon: keyof typeof Icons;
};

type FormProps = {
  title: string;
  description: string;
};

const RegisterCategories = () => {
  const toast = useToast();
  const [auth, setAuth] = useState<Props>();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [myIcons, setMyIcons] = useState<IconProps[]>();
  const [search, setSearch] = useState<string>("");
  const [icon, setIcon] = useState<string>("");

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

  const handleSubmit: SubmitHandler<FormProps> = async (data, { reset }) => {
    try {
      const scheme = Yup.object().shape({
        title: Yup.string().required("Insira um título para a categoria"),
        description: Yup.string(),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });
      setLoading(true);

      const response = await api.post(
        `/categories/${auth?.id}`,
        {
          icon: icon === "" ? configs.defaultIcon.icon : icon,
          title: data.title,
          description: data.description,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");
      setIcon("");
      setSearch("");
      setMyIcons(icons);
      reset();
      setLoading(false);
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

  const GetIcon = ({ icon }: IconUnitProps) => {
    const tag = Icons[icon];
    return tag;
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Grid templateColumns={"250px 1fr"} gap={3}>
        <Box h="fit-content" overflow={"hidden"}>
          <FormControl h="full">
            <FormLabel>Ícone</FormLabel>
            <Box h="184px" maxH={"184px"} position="relative" p={"1px"}>
              <ChakraInput
                placeholder="Digite para buscar"
                value={search}
                onChange={(e) => updateSearch(e.target.value)}
              />
              <Box
                h="134px"
                maxH={"134px"}
                overflow="auto"
                borderWidth={"1px"}
                rounded="md"
                mt={2}
                p={2}
              >
                <RadioGroup value={icon} onChange={(e) => setIcon(e)}>
                  <Stack>
                    {myIcons?.map((ico) => (
                      <Radio key={ico.title} value={ico.icon}>
                        <HStack>
                          <Icon
                            as={GetIcon({
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
            </Box>
          </FormControl>
        </Box>
        <Stack spacing={3}>
          <FormControl isRequired>
            <FormLabel>Título</FormLabel>
            <Input placeholder="Título" name="title" />
          </FormControl>
          <FormControl>
            <FormLabel>Descrição</FormLabel>
            <TextArea
              name="description"
              placeholder="Descrição"
              resize={"none"}
              rows={4}
            />
          </FormControl>
        </Stack>
      </Grid>
      <Button
        colorScheme={"blue"}
        size="lg"
        leftIcon={<AiOutlineSave />}
        mt={3}
        type="submit"
        isLoading={loading}
      >
        Cadastrar
      </Button>
    </Form>
  );
};

export default RegisterCategories;
