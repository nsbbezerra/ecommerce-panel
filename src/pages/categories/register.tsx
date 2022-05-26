import { useEffect, useRef, useState } from "react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import * as icons from "react-icons/all";

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
} from "@chakra-ui/react";
import { AiOutlineSave } from "react-icons/ai";
import TextArea from "../../components/textArea";
import Select from "../../components/Select";

type Props = {
  id: string;
  token: string;
};

const RegisterCategories = () => {
  const [auth, setAuth] = useState<Props>();
  const formRef = useRef<FormHandles>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const company = localStorage.getItem("company");
    const user = sessionStorage.getItem("user");
    const companyParse = JSON.parse(company || "");
    const userParse = JSON.parse(user || "");

    if (companyParse && userParse) {
      setAuth({ id: companyParse.id, token: userParse.token });
    }
  }, []);

  const handleSubmit: SubmitHandler = async (data) => {
    console.log(data);
  };

  return (
    <Form ref={formRef} onSubmit={handleSubmit}>
      <Grid templateColumns={"250px 1fr"} gap={3}>
        <Box>
          <FormControl isRequired h="full">
            <FormLabel>Ícone</FormLabel>
            <Box
              rounded="md"
              borderWidth={"1px"}
              h="184px"
              maxH={"184px"}
              overflow="auto"
              p={2}
            >
              <RadioGroup size={"lg"}>
                <Stack>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                  <Radio>
                    <HStack>
                      <Icon as={icons["FaPizzaSlice"]} />
                      <Text>Ícone</Text>
                    </HStack>
                  </Radio>
                </Stack>
              </RadioGroup>
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
        Salvar
      </Button>
    </Form>
  );
};

export default RegisterCategories;
