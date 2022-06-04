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
  Select as ChakraSelect,
  Tooltip,
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
import { dataTrib } from "../../configs/data";

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
              <Stack spacing={3}>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>CEST</FormLabel>
                    <ChakraInput placeholder="CEST" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>NCM</FormLabel>
                    <ChakraInput placeholder="NCM" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CFOP</FormLabel>
                    <ChakraInput placeholder="CFOP" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>ICMS Origem</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      <option value={"0"}>0 - Nacional</option>
                      <option value={"1"}>
                        1 - Estrangeira (importação direta)
                      </option>
                      <option value={"2"}>
                        2 - Estrangeira (adquirida no mercado interno)
                      </option>
                      <option value={"3"}>
                        3 - Nacional com mais de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"4"}>
                        4 - Nacional produzida através de processos produtivos
                        básicos
                      </option>
                      <option value={"5"}>
                        5 - Nacional com menos de 40% de conteúdo estrangeiro
                      </option>
                      <option value={"6"}>
                        6 - Estrangeira (importação direta) sem produto nacional
                        similar
                      </option>
                      <option value={"7"}>
                        7 - Estrangeira (adquirida no mercado interno) sem
                        produto nacional similar
                      </option>
                      <option value={"8"}>
                        8 - Nacional, mercadoria ou bem com Conteúdo de
                        Importação superior a 70%;
                      </option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS CSOSN</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      <option value={"101"}>
                        101 - Tributada pelo Simples Nacional com permissão de
                        crédito
                      </option>
                      <option value={"102"}>
                        102 - Tributada pelo Simples Nacional sem permissão de
                        crédito
                      </option>
                      <option value={"103"}>
                        103 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta
                      </option>
                      <option value={"201"}>
                        201 - Tributada pelo Simples Nacional com permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"202"}>
                        202 - Tributada pelo Simples Nacional sem permissão de
                        crédito e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"203"}>
                        203 - Isenção do ICMS no Simples Nacional para faixa de
                        receita bruta e com cobrança do ICMS por substituição
                        tributária
                      </option>
                      <option value={"300"}>300 - Imune</option>
                      <option value={"400"}>
                        400 - Não tributada pelo Simples Nacional
                      </option>
                      <option value={"500"}>
                        500 - ICMS cobrado anteriormente por substituição
                        tributária (substituído) ou por antecipação
                      </option>
                      <option value={"900"}>900 - Outros</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="ICMS Alíquota" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="ICMS Base de Cálculo" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>
                      <Tooltip label="Margem de valor agregado" hasArrow>
                        <Text>ICMS MVA (%)</Text>
                      </Tooltip>
                      <ChakraInput placeholder="Margem de valor agregado" />
                    </FormLabel>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="ICMS ST Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Modalidade de Cálculo (%)</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      <option value={"0"}>
                        Preço tabelado ou máximo sugerido
                      </option>
                      <option value={"1"}>Lista Negativa (valor)</option>
                      <option value={"2"}>Lista Positiva (valor)</option>
                      <option value={"3"}>Lista Neutra (valor)</option>
                      <option value={"4"}>Margem Valor Agregado (%)</option>
                      <option value={"5"}>Pauta (valor)</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="ICMS ST Base de Cálculo" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(5, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>FCP Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="FCP Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="FCP ST Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Ret. Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="FCP Ret. Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="FCP Base de Cálculo" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="FCP ST Base de Cálculo" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>IPI CST</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      <option value={""}>Nenhum</option>
                      <option value={"00"}>
                        00 – Entrada com Recuperação de Crédito
                      </option>
                      <option value={"01"}>
                        01 – Entrada Tributada com Alíquota Zero
                      </option>
                      <option value={"02"}>02 – Entrada Isenta</option>
                      <option value={"03"}>03 – Entrada Não Tributada</option>
                      <option value={"04"}>04 – Entrada Imune</option>
                      <option value={"05"}>05 – Entrada com Suspensão</option>
                      <option value={"49"}>49 – Outras Entradas</option>
                      <option value={"50"}>50 – Saída Tributada</option>
                      <option value={"51"}>
                        51 – Saída Tributável com Alíquota Zero
                      </option>
                      <option value={"52"}>52 – Saída Isenta</option>
                      <option value={"53"}>53 – Saída Não Tributada</option>
                      <option value={"54"}>54 – Saída Imune</option>
                      <option value={"55"}>55 – Saída com Suspensão</option>
                      <option value={"99"}>99 – Outras Saídas</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="IPI Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Código</FormLabel>
                    <ChakraInput placeholder="IPI Código" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>PIS CST</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      {dataTrib.map((dt) => (
                        <option key={dt.code}>{dt.desc}</option>
                      ))}
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="PIS Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="PIS Base de Cálculo" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>COFINS CST</FormLabel>
                    <ChakraSelect placeholder="Selecione uma opção">
                      {dataTrib.map((dt) => (
                        <option key={dt.code}>{dt.desc}</option>
                      ))}
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Alíquota (%)</FormLabel>
                    <ChakraInput placeholder="COFINS Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Base de Cálculo</FormLabel>
                    <ChakraInput placeholder="COFINS Base de Cálculo" />
                  </FormControl>
                </Grid>
                <Button
                  rightIcon={<CgArrowRight />}
                  isFullWidth={false}
                  w="fit-content"
                  onClick={() => setIndex(2)}
                >
                  Próximo
                </Button>
              </Stack>
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
