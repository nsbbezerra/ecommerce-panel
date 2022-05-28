import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Grid,
  HStack,
  Icon,
  Input as ChakraInput,
  Radio,
  RadioGroup,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { Fragment, useEffect, useRef, useState } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import * as Icons from "react-icons/all";
import { AiOutlineSave } from "react-icons/ai";
import { icons } from "../../configs/icons";
import Select from "../../components/Select";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import axios from "axios";
import { api, configs } from "../../configs";

type Props = {
  id: string;
  token: string;
};

type IconUnitProps = {
  icon: keyof typeof Icons;
};

type IconProps = {
  icon: string;
  title: string;
  category: string;
};

type SubCategoryProps = {
  category_id: string;
  title: string;
  description: string;
};

type CategoryProps = {
  id: string;
  title: string;
};

const RegisterSubCategories = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [auth, setAuth] = useState<Props>();
  const [myIcons, setMyIcons] = useState<IconProps[]>();
  const [search, setSearch] = useState<string>("");
  const [icon, setIcon] = useState<string>("");
  const [categories, setCategories] = useState<CategoryProps[]>();
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
      position: "top-right",
      duration: 8000,
      isClosable: true,
    });
  }

  async function findCategories(id: string) {
    try {
      const { data } = await api.get(`/categories/${id}`);
      setCategories(data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      }
    }
  }

  useEffect(() => {
    setMyIcons(icons);
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");
    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
    findCategories(companyParse.id);
  }, []);

  const handleSubmit: SubmitHandler<SubCategoryProps> = async (
    data,
    { reset }
  ) => {
    try {
      const scheme = Yup.object().shape({
        category_id: Yup.string().required("Selecione uma categoria"),
        title: Yup.string().required("Insira um título para a sub categoria"),
        description: Yup.string(),
      });

      await scheme.validate(data, {
        abortEarly: false,
      });

      setLoading(true);

      const response = await api.post(
        `/subCategories/${auth?.id}/${data.category_id}`,
        {
          title: data.title,
          description: data.description,
          icon: icon === "" ? configs.defaultIcon.icon : icon,
        },
        {
          headers: { "x-access-authorization": auth?.token || "" },
        }
      );

      showToast(response.data.message, "success", "Sucesso");
      reset();
      setSearch("");
      setIcon("");
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

  const getIcon = ({ icon }: IconUnitProps) => {
    const tag = Icons[icon];
    return tag;
  };

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

  return (
    <Fragment>
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
                              as={getIcon({
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

          <Box>
            <Stack spacing={3}>
              <Grid templateColumns={"1fr 3fr"} gap={3}>
                <FormControl isRequired>
                  <FormLabel>Categoria</FormLabel>
                  <Select
                    name="category_id"
                    placeholder="Selecione uma opção"
                    isDisabled={categories?.length === 0}
                    autoFocus
                  >
                    {categories?.map((cat) => (
                      <option value={cat.id} key={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Título</FormLabel>
                  <Input name="title" placeholder="Título" />
                </FormControl>
              </Grid>

              <FormControl>
                <FormLabel>Descrição</FormLabel>
                <TextArea
                  name="description"
                  placeholder="Descrição"
                  rows={4}
                  resize="none"
                />
              </FormControl>
            </Stack>
          </Box>
        </Grid>

        <Button
          leftIcon={<AiOutlineSave />}
          colorScheme="blue"
          size="lg"
          mt={3}
          type="submit"
          isLoading={loading}
        >
          Cadastrar
        </Button>
      </Form>
    </Fragment>
  );
};

export default RegisterSubCategories;
