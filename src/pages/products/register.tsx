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
  Tooltip,
  Select as ChakraSelect,
  Divider,
  Input as ChakraInput,
  Table,
} from "@chakra-ui/react";
import { SubmitHandler, FormHandles } from "@unform/core";
import { Form } from "@unform/web";
import * as Yup from "yup";
import Select from "../../components/Select";
import Input from "../../components/Input";
import TextArea from "../../components/textArea";
import {
  AiOutlineCalculator,
  AiOutlinePlus,
  AiOutlineSave,
} from "react-icons/ai";
import { FaRuler, FaTrashAlt } from "react-icons/fa";
import RichTextEditor from "react-rte";
import { CgArrowRight } from "react-icons/cg";
import { dataTrib } from "../../configs/data";
import MaskedInput from "react-input-mask";
import axios from "axios";
import { api } from "../../configs";

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
  tags: TagsProps[];
  thumbnail: string;
};

type TagsProps = {
  title: string;
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

type ShippingProps = {
  Codigo: string;
  Valor: string;
  PrazoEntrega: string;
};

const RegisterProduct = () => {
  const toast = useToast();
  const formRef = useRef<FormHandles>(null);
  const [index, setIndex] = useState<number>(0);
  const [indexUnit, setIndexUnit] = useState<number>(2);
  const [width, setWidth] = useState<WidthProps[]>([]);
  const [widthNumber, setWidthNumber] = useState<string>("");
  const [text, setText] = useState(RichTextEditor.createEmptyValue());
  const [cost, setCost] = useState<number>(0);
  const [otherCost, setOtherCost] = useState<number>(0);
  const [sale, setSale] = useState<number>(0);
  const [marge, setMarge] = useState<number>(0);
  const [cardTax, setCardTax] = useState<number>(0);
  const [tax, setTax] = useState<number>(0);
  const [comission, setComission] = useState<number>(0);
  const [freightValue, setFreightValue] = useState<number>(0);
  const [originCep, setOriginCep] = useState<string>("");
  const [destinyCep, setDestinyCep] = useState<string>("");
  const [weight, setWeight] = useState<string>("");
  const [format, setFormat] = useState<string>("");
  const [length, setLength] = useState<number>(0);
  const [widthFreight, setWidthFreight] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [diameter, setDiameter] = useState<number>(0);
  const [shipping, setShipping] = useState<ShippingProps[]>();
  const [loadingShipping, setLoadingShipping] = useState<boolean>(false);

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
    try {
      console.log(data);
    } catch (error) {
      console.log((error as Error).cause, "Errou");
    }
  };

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

  const calcSaleVale = () => {
    let costPrices = cost + otherCost + freightValue;
    let calcTaxes = costPrices * (tax / 100);
    let calcCardTax = costPrices * (cardTax / 100);
    let comissionCalc = costPrices * (comission / 100);
    let totalCalcs = costPrices + calcTaxes + calcCardTax + comissionCalc;
    let calcMarge = totalCalcs * (marge / 100);
    let finalCalc = totalCalcs + calcMarge;
    setSale(parseFloat(finalCalc.toFixed(2)));
  };

  async function calcShipping() {
    setLoadingShipping(true);
    try {
      const response = await api.post("/shipping", {
        weight,
        format,
        length,
        width: widthFreight,
        height,
        diameter,
        originCep,
        destinyCep,
      });
      setShipping(response.data);
      setLoadingShipping(true);
    } catch (error) {
      setLoadingShipping(true);
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
      <Tabs
        onChange={(e) => setIndex(e)}
        index={index}
        isFitted
        variant={"enclosed-colored"}
      >
        <TabList>
          <Tab roundedTop={"md"}>Dados</Tab>
          <Tab roundedTop={"md"}>Fiscal</Tab>
          <Tab roundedTop={"md"}>Preço</Tab>
          <Tab roundedTop={"md"}>Frete</Tab>
          <Tab roundedTop={"md"}>Imagens</Tab>
          <Tab roundedTop={"md"}>Adicionais</Tab>
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
                  <FormLabel>Unidade de Medida</FormLabel>
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
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Cálculo de Medidas</FormLabel>
                  <Tabs
                    mt={2}
                    variant="enclosed"
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
                          templateColumns={"1fr 1fr"}
                          gap={3}
                          position="relative"
                        >
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
                        <Grid templateColumns={"1fr"} gap={3}>
                          <FormControl>
                            <FormLabel>Comprimento (Metros)</FormLabel>
                            <Input name="length" placeholder="Comprimento" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr"} gap={3}>
                          <FormControl>
                            <FormLabel>Total de Unidades</FormLabel>
                            <Input
                              name="unity"
                              placeholder="Total de Unidades"
                              type="number"
                            />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr"} gap={3}>
                          <FormControl>
                            <FormLabel>Peso (Kg)</FormLabel>
                            <Input name="weight" placeholder="Peso" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                      <TabPanel>
                        <Grid templateColumns={"1fr"} gap={3}>
                          <FormControl>
                            <FormLabel>Volume (Lt / Ml)</FormLabel>
                            <Input name="liter" placeholder="Volume" />
                          </FormControl>
                        </Grid>
                      </TabPanel>
                    </TabPanels>
                  </Tabs>
                </FormControl>
                <Divider />
                <FormControl>
                  <FormLabel>Detalhes do Produto</FormLabel>
                  <RichTextEditor
                    value={text}
                    onChange={(e) => setText(e)}
                    placeholder="Insira seu texto aqui"
                    editorStyle={{
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
                    <Input placeholder="CEST" name="cest" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>NCM</FormLabel>
                    <Input placeholder="NCM" name="ncm" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>CFOP</FormLabel>
                    <Input placeholder="CFOP" name="cfop" />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>ICMS Origem</FormLabel>
                    <Select
                      placeholder="Selecione uma opção"
                      name="icms_origin"
                    >
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
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS CSOSN</FormLabel>
                    <Select name="icms_csosn" placeholder="Selecione uma opção">
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
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Alíquota (%)</FormLabel>
                    <Input name="icms_rate" placeholder="ICMS Alíquota" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS Base de Cálculo</FormLabel>
                    <Input
                      name="icms_base_calc"
                      placeholder="ICMS Base de Cálculo"
                    />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(4, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>
                      <Tooltip label="Margem de valor agregado" hasArrow>
                        <Text>ICMS MVA (%)</Text>
                      </Tooltip>
                      <Input
                        name="icms_marg_val_agregate"
                        placeholder="Margem de valor agregado"
                      />
                    </FormLabel>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Alíquota (%)</FormLabel>
                    <Input
                      name="icms_st_rate"
                      placeholder="ICMS ST Alíquota (%)"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Modalidade de Cálculo (%)</FormLabel>
                    <Select
                      name="icms_st_mod_bc"
                      placeholder="Selecione uma opção"
                    >
                      <option value={"0"}>
                        Preço tabelado ou máximo sugerido
                      </option>
                      <option value={"1"}>Lista Negativa (valor)</option>
                      <option value={"2"}>Lista Positiva (valor)</option>
                      <option value={"3"}>Lista Neutra (valor)</option>
                      <option value={"4"}>Margem Valor Agregado (%)</option>
                      <option value={"5"}>Pauta (valor)</option>
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>ICMS ST Base de Cálculo</FormLabel>
                    <Input
                      name="imcs_st_base_calc"
                      placeholder="ICMS ST Base de Cálculo"
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(5, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>FCP Alíquota (%)</FormLabel>
                    <Input name="fcp_rate" placeholder="FCP Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Alíquota (%)</FormLabel>
                    <Input
                      name="fcp_st_rate"
                      placeholder="FCP ST Alíquota (%)"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Ret. Alíquota (%)</FormLabel>
                    <Input
                      name="fcp_ret_rate"
                      placeholder="FCP Ret. Alíquota (%)"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP Base de Cálculo</FormLabel>
                    <Input
                      name="fcp_base_calc"
                      placeholder="FCP Base de Cálculo"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>FCP ST Base de Cálculo</FormLabel>
                    <Input
                      name="fcp_st_base_calc"
                      placeholder="FCP ST Base de Cálculo"
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>IPI CST</FormLabel>
                    <Select name="ipi_cst" placeholder="Selecione uma opção">
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
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Alíquota (%)</FormLabel>
                    <Input name="ipi_rate" placeholder="IPI Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>IPI Código</FormLabel>
                    <Input name="ipi_code" placeholder="IPI Código" />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>PIS CST</FormLabel>
                    <Select name="pis_cst" placeholder="Selecione uma opção">
                      {dataTrib.map((dt) => (
                        <option key={dt.code}>{dt.desc}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Alíquota (%)</FormLabel>
                    <Input name="pis_rate" placeholder="PIS Alíquota (%)" />
                  </FormControl>
                  <FormControl>
                    <FormLabel>PIS Base de Cálculo</FormLabel>
                    <Input
                      name="pis_base_calc"
                      placeholder="PIS Base de Cálculo"
                    />
                  </FormControl>
                </Grid>
                <Divider />
                <Grid templateColumns={"repeat(3, 1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>COFINS CST</FormLabel>
                    <Select name="cofins_cst" placeholder="Selecione uma opção">
                      {dataTrib.map((dt) => (
                        <option key={dt.code}>{dt.desc}</option>
                      ))}
                    </Select>
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Alíquota (%)</FormLabel>
                    <Input
                      name="cofins_rate"
                      placeholder="COFINS Alíquota (%)"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>COFINS Base de Cálculo</FormLabel>
                    <Input
                      name="cofins_base_calc"
                      placeholder="COFINS Base de Cálculo"
                    />
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
              <Grid templateColumns={"repeat(5,1fr)"} gap={3} alignItems="end">
                <FormControl>
                  <FormLabel>Valor de Custo (R$)</FormLabel>
                  <ChakraInput
                    placeholder="Valor de Custo (R$)"
                    type={"number"}
                    value={cost}
                    onChange={(e) => setCost(parseFloat(e.target.value))}
                    name="cost"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Outros Custos (R$)</FormLabel>
                  <ChakraInput
                    placeholder="Outros Custos (R$)"
                    type={"number"}
                    value={otherCost}
                    onChange={(e) => setOtherCost(parseFloat(e.target.value))}
                    name="other_cost"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Valor do Frete (R$)</FormLabel>
                  <ChakraInput
                    placeholder="Margem de Lucro Desejada (%)"
                    type={"number"}
                    value={freightValue}
                    onChange={(e) =>
                      setFreightValue(parseFloat(e.target.value))
                    }
                    name="freight_value"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Impostos (%)</FormLabel>
                  <ChakraInput
                    placeholder="Impostos (%)"
                    type={"number"}
                    value={tax}
                    onChange={(e) => setTax(parseFloat(e.target.value))}
                    name="tax_value"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Taxa de Cartão (%)</FormLabel>
                  <ChakraInput
                    placeholder="Taxa de Cartão (%)"
                    type={"number"}
                    value={cardTax}
                    onChange={(e) => setCardTax(parseFloat(e.target.value))}
                    name="tax_card"
                  />
                </FormControl>
              </Grid>
              <Grid
                templateColumns={"repeat(4,1fr)"}
                gap={3}
                alignItems="end"
                mt={3}
              >
                <FormControl>
                  <FormLabel>Comissões (%)</FormLabel>
                  <ChakraInput
                    placeholder="Comissões (%)"
                    type={"number"}
                    value={comission}
                    onChange={(e) => setComission(parseFloat(e.target.value))}
                    name="comission"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Margem de Lucro Desejada (%)</FormLabel>
                  <ChakraInput
                    placeholder="Margem de Lucro Desejada (%)"
                    type={"number"}
                    value={marge}
                    onChange={(e) => setMarge(parseFloat(e.target.value))}
                    name="marge"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Preço de Venda (R$)</FormLabel>
                  <ChakraInput
                    placeholder="Preço de Venda (R$)"
                    type={"number"}
                    value={sale}
                    onChange={(e) => setSale(parseFloat(e.target.value))}
                    name="sale_value"
                  />
                </FormControl>
                <Button
                  leftIcon={<AiOutlineCalculator />}
                  colorScheme="blue"
                  variant="outline"
                  onClick={() => calcSaleVale()}
                >
                  Calcular
                </Button>
              </Grid>
              <Button
                rightIcon={<CgArrowRight />}
                isFullWidth={false}
                w="fit-content"
                onClick={() => setIndex(3)}
                mt={3}
              >
                Próximo
              </Button>
            </TabPanel>
            <TabPanel>
              <Stack spacing={3}>
                <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>Peso (kg)</FormLabel>
                    <ChakraInput
                      placeholder="Peso (kg)"
                      name="freight_weight"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Formato</FormLabel>
                    <ChakraSelect
                      placeholder="Selecione um opção"
                      name="format"
                      value={format}
                      onChange={(e) => setFormat(e.target.value)}
                    >
                      <option value={1}>Caixa / Pacote</option>
                      <option value={2}>Rolo / Prisma</option>
                      <option value={3}>Envelope</option>
                    </ChakraSelect>
                  </FormControl>
                  <FormControl>
                    <FormLabel>Comprimento (cm)</FormLabel>
                    <ChakraInput
                      placeholder="Comprimento (cm)"
                      name="freight_lenght"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                    />
                  </FormControl>
                </Grid>
                <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
                  <FormControl>
                    <FormLabel>Altura (cm)</FormLabel>
                    <ChakraInput
                      placeholder="Altura (cm)"
                      name="freight_height"
                      value={height}
                      onChange={(e) => setHeight(parseFloat(e.target.value))}
                      type="number"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Largura (cm)</FormLabel>
                    <ChakraInput
                      placeholder="Largura (cm)"
                      name="freight_width"
                      value={widthFreight}
                      onChange={(e) =>
                        setWidthFreight(parseFloat(e.target.value))
                      }
                      type="number"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel>Diâmetro (cm)</FormLabel>
                    <ChakraInput
                      placeholder="Diâmetro (cm)"
                      name="freight_diameter"
                      value={diameter}
                      onChange={(e) => setDiameter(parseFloat(e.target.value))}
                      type="number"
                    />
                  </FormControl>
                </Grid>

                <Divider />

                <FormControl>
                  <FormLabel>Simular Frete</FormLabel>
                  <Grid templateColumns={"repeat(3,1fr)"} gap={3}>
                    <ChakraInput
                      as={MaskedInput}
                      mask="99999-999"
                      placeholder="CEP de Origem"
                      name="freight_cep_origin"
                      value={originCep}
                      onChange={(e) => setOriginCep(e.target.value)}
                    />
                    <ChakraInput
                      as={MaskedInput}
                      mask="99999-999"
                      placeholder="CEP de Destino"
                      value={destinyCep}
                      onChange={(e) => setDestinyCep(e.target.value)}
                      name="freight_cep_destiny"
                    />
                    <Button
                      leftIcon={<AiOutlineCalculator />}
                      onClick={() => calcShipping()}
                      isLoading={loadingShipping}
                    >
                      Calcular Frete
                    </Button>
                  </Grid>
                </FormControl>
                {shipping?.length !== 0 && <Table></Table>}
                <Divider />
                <Button
                  leftIcon={<AiOutlineSave />}
                  size="lg"
                  colorScheme={"blue"}
                  w="fit-content"
                  type="submit"
                >
                  Salvar Produto
                </Button>
              </Stack>
            </TabPanel>
          </TabPanels>
        </Form>
      </Tabs>
    </Fragment>
  );
};

export default RegisterProduct;
