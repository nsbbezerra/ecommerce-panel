import { Fragment, useRef, useState } from "react";
import {
  Box,
  Flex,
  Grid,
  FormControl,
  FormLabel,
  Button,
  Stack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input as ChakraInput,
  HStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  IconButton,
  Text,
  Icon,
  useToast,
  useColorModeValue,
  theme,
} from "@chakra-ui/react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Select from "../../components/Select";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import { AiOutlinePlus } from "react-icons/ai";
import { FaRuler, FaTrashAlt } from "react-icons/fa";
import RichTextEditor from "react-rte";
import { CgArrowRight } from "react-icons/cg";

type CostValueProps = {
  title: string;
  value: number;
};

type ProductProps = {
  category_id: string;
  sub_category_id: string;
  title: string;
  description: string;
  sku: string;
  barcode: string;
  internal_code: string;
  calc_price: "marge" | "markup";
  cost_value: CostValueProps[];
  profit_percent: number;
  sale_value: number;
  markup_factor: number;
  type_unit: "square_meter" | "meter" | "unity" | "weight" | "liter";
  unit_desc: string;
  inventory: number;
  weight: number;
  liter: number;
  length: number;
  width: number;
  unity: number;
  details: string;
  taxes: TaxesProps;
  tags: TagsProps[];
  thumbnail: string;
};

type TagsProps = {
  title: string;
};

type TaxesProps = {
  cfop: string;
  ncm: string;
  icms_rate: number;
  icms_origin: string;
  icms_csosn: string;
  icms_st_rate: number;
  icms_marg_val_agregate: number;
  icms_st_mod_bc: string;
  icms_base_calc: number;
  imcs_st_base_calc: number;
  fcp_rate: number;
  fcp_st_rate: number;
  fcp_ret_rate: number;
  fcp_base_calc: number;
  fcp_st_base_calc: number;
  ipi_cst: string;
  ipi_rate: number;
  ipi_code: string;
  pis_cst: string;
  pis_rate: number;
  pis_base_calc: number;
  cofins_cst: string;
  cofins_rate: number;
  cofins_base_calc: number;
  cest: string;
};

type CategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  title: string;
  description: string;
};

type SubCategoryProps = {
  id: string;
  active: boolean;
  icon: string;
  category: CategoriesProps;
  title: string;
  description: string;
};

type CategoriesProps = {
  title: string;
};

type WidthProps = {
  id: string;
  width: string;
};

const RegisterProduct = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [index, setIndex] = useState<number>(0);
  const [indexUnit, setIndexUnit] = useState<number>(2);
  const [width, setWidth] = useState<WidthProps[]>([]);
  const [widthNumber, setWidthNumber] = useState<string>("");
  const [text, setText] = useState(RichTextEditor.createEmptyValue());

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

  const handleSubmit: SubmitHandler = async (data, { reset }) => {
    console.log(data);
  };

  const SelectUni = () => (
    <Select name="unit_desc" placeholder="Selecione uma opção">
      <option value="KG">Quilograma</option>
      <option value="GR">Grama</option>
      <option value="UN">Unidade</option>
      <option value="MT">Metro</option>
      <option value="CM">Centímetro</option>
      <option value="MM">Milímetro</option>
      <option value="PC">Peça</option>
      <option value="CX">Caixa</option>
      <option value="DZ">Duzia</option>
      <option value="EM">Embalagem</option>
      <option value="FD">Fardo</option>
      <option value="KT">KIT</option>
      <option value="JG">Jogo</option>
      <option value="PT">Pacote</option>
      <option value="LATA">Lata</option>
      <option value="LT">Litro</option>
      <option value="ML">Mililitro</option>
      <option value="SC">Saco</option>
      <option value="ROLO">Rolo</option>
      <option value="VD">Vidro</option>
      <option value="CE">Centro</option>
      <option value="CJ">Conjunto</option>
      <option value="GF">Garrafa</option>
    </Select>
  );

  const handleWidth = () => {
    let myWidths = width;
    const result = width.find((obj) => obj.id === widthNumber);
    if (result) {
      showToast("Medida já inserida", "warning", "Atenção");
      return false;
    }
    let info: WidthProps = { id: widthNumber, width: widthNumber };
    myWidths?.push(info);
    setWidth(myWidths);
    setWidthNumber("");
  };

  const removeWidth = (id: string) => {
    const result = width.filter((obj) => obj.id !== id);
    setWidth(result);
  };

  return (
    <Fragment>
      <Tabs onChange={(e) => setIndex(e)} index={index}>
        <TabList>
          <Tab>Dados</Tab>
          <Tab>Fiscal</Tab>
          <Tab>Preço</Tab>
          <Tab>Frete</Tab>
          <Tab isDisabled>Imagens</Tab>
          <Tab isDisabled>Adicionais</Tab>
        </TabList>
        <Form ref={formRef} onSubmit={handleSubmit}>
          <TabPanels>
            <TabPanel>
              <Stack spacing={3}>
                <Grid templateColumns={"1fr 1fr 3fr"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      placeholder="Selecione uma categoria"
                      name="category_id"
                      autoFocus
                    >
                      <option value="1">Categoria</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Sub Categoria</FormLabel>
                    <Select
                      placeholder="Selecione uma categoria"
                      name="sub_category_id"
                    >
                      <option value="1">Categoria</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Nome do Produto</FormLabel>
                    <Input name="title" placeholder="Nome do Produto" />
                  </FormControl>
                </Grid>
                <FormControl>
                  <FormLabel>Descrição Curta</FormLabel>
                  <TextArea
                    rows={3}
                    placeholder="Descrição Curta"
                    name="description"
                    resize={"none"}
                  />
                </FormControl>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl isRequired>
                    <FormLabel>SKU</FormLabel>
                    <Input placeholder="SKU" name="sku" />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Código de Barras</FormLabel>
                    <Input
                      placeholder="Código de Barras / SEM GTIN"
                      name="barcode"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Código Interno</FormLabel>
                    <Input placeholder="Código Interno" name="internal_code" />
                  </FormControl>
                </Grid>
                <FormControl isRequired>
                  <FormLabel>Cálculo de Medidas</FormLabel>
                  <Tabs
                    variant={"soft-rounded"}
                    size="sm"
                    defaultIndex={indexUnit}
                    onChange={(e) => setIndexUnit(e)}
                  >
                    <TabList>
                      <Tab>Metro Quadrado</Tab>
                      <Tab>Comprimento</Tab>
                      <Tab>Unidade</Tab>
                      <Tab>Peso</Tab>
                      <Tab>Litro</Tab>
                    </TabList>

                    <TabPanels>
                      <TabPanel>
                        <Grid
                          templateColumns={"1fr 1fr 1fr"}
                          gap={3}
                          position="relative"
                        >
                          {indexUnit === 0 && (
                            <FormControl isRequired>
                              <FormLabel>Unidade de Medida</FormLabel>
                              <SelectUni />
                            </FormControl>
                          )}
                          <FormControl>
                            <FormLabel>Largura</FormLabel>
                            <HStack>
                              <NumberInput
                                w="100%"
                                value={widthNumber}
                                onChange={(e) => setWidthNumber(e)}
                              >
                                <NumberInputField />
                                <NumberInputStepper>
                                  <NumberIncrementStepper />
                                  <NumberDecrementStepper />
                                </NumberInputStepper>
                              </NumberInput>
                              <IconButton
                                aria-label="Inserir largura"
                                icon={<AiOutlinePlus />}
                                onClick={() => handleWidth()}
                              />
                            </HStack>
                            <Box
                              borderWidth={"1px"}
                              rounded="md"
                              py={1}
                              mt={3}
                              px={3}
                            >
                              {width?.length === 0 ? (
                                <Text>Insira uma altura</Text>
                              ) : (
                                <Stack spacing={1}>
                                  {width?.map((wd) => (
                                    <HStack key={wd.id}>
                                      <Icon as={FaRuler} />
                                      <Text>{wd.width}m</Text>
                                      <IconButton
                                        aria-label="Remover Altura"
                                        icon={<FaTrashAlt />}
                                        variant="link"
                                        colorScheme={"red"}
                                        size="sm"
                                        onClick={() => removeWidth(wd.id)}
                                      />
                                    </HStack>
                                  ))}
                                </Stack>
                              )}
                            </Box>
                          </FormControl>
                          <FormControl>
                            <FormLabel>Altura</FormLabel>
                            <Flex
                              borderWidth={"1px"}
                              rounded="md"
                              p={4}
                              justify={"center"}
                              align="center"
                              textAlign={"center"}
                            >
                              <Text>A Altura ficará a critério do cliente</Text>
                            </Flex>
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr 1fr"} gap={3}>
                          {indexUnit === 1 && (
                            <FormControl isRequired>
                              <FormLabel>Unidade de Medida</FormLabel>
                              <SelectUni />
                            </FormControl>
                          )}
                          <FormControl>
                            <FormLabel>Comprimento (Metros)</FormLabel>
                            <Input name="length" placeholder="Comprimento" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr 1fr"} gap={3}>
                          {indexUnit === 2 && (
                            <FormControl isRequired>
                              <FormLabel>Unidade de Medida</FormLabel>
                              <SelectUni />
                            </FormControl>
                          )}
                          <FormControl>
                            <FormLabel>Total de Unidades</FormLabel>
                            <Input
                              name="unity"
                              placeholder="Total de Unidades"
                            />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr 1fr"} gap={3}>
                          {indexUnit === 3 && (
                            <FormControl isRequired>
                              <FormLabel>Unidade de Medida</FormLabel>
                              <SelectUni />
                            </FormControl>
                          )}
                          <FormControl>
                            <FormLabel>Peso (Kg)</FormLabel>
                            <Input name="weight" placeholder="Peso" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr 1fr"} gap={3}>
                          {indexUnit === 4 && (
                            <FormControl isRequired>
                              <FormLabel>Unidade de Medida</FormLabel>
                              <SelectUni />
                            </FormControl>
                          )}
                          <FormControl>
                            <FormLabel>Volume (Lt / Ml)</FormLabel>
                            <Input name="liter" placeholder="Volume" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </FormControl>
                <FormControl>
                  <FormLabel>Detalhes do Produto</FormLabel>
                  <RichTextEditor
                    value={text}
                    onChange={(e) => setText(e)}
                    placeholder="Insira seu texto aqui"
                    editorStyle={{
                      minHeight: "200px",
                      background: "transparent",
                    }}
                    rootStyle={{
                      background: "transparent",
                      borderColor: useColorModeValue(
                        theme.colors.gray["300"],
                        theme.colors.gray["600"]
                      ),
                    }}
                    toolbarStyle={{
                      borderColor: useColorModeValue(
                        theme.colors.gray["300"],
                        theme.colors.gray["600"]
                      ),
                    }}
                  />
                </FormControl>
                <Button
                  rightIcon={<CgArrowRight />}
                  isFullWidth={false}
                  w="fit-content"
                  onClick={() => setIndex(1)}
                >
                  Próximo
                </Button>
              </Stack>
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Form>
      </Tabs>
    </Fragment>
  );
};

export default RegisterProduct;
