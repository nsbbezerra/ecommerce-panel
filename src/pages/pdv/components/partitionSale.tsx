import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  HStack,
  Icon,
  IconButton,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Text,
  ToastPositionWithLogical,
  useColorModeValue,
  useToast,
} from "@chakra-ui/react";
import { AiOutlineSave } from "react-icons/ai";
import { memo, useEffect, useState } from "react";
import { FaTrash } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import { configs } from "../../../configs";
import { nanoid } from "nanoid";

type CatProps = {
  title: string;
};

type SizeProps = {
  id: string;
  description: string;
  inventory: number;
};

type PartitionSaleProps = {
  id: string;
  name: string;
  value: number;
};

type ProductsProps = {
  id: string;
  title: string;
  thumbnail: string;
  barcode: string;
  sku: string;
  in_promotion: boolean;
  sale_value: string;
  profit_percent: number;
  unit_desc: string;
  type_unit:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without"
    | "sizes";
  have_adictional: boolean;
  type_sale: "unique" | "partition";
  sub_category: CatProps;
  category: CatProps;
  sale_options?: string;
  sale_options_category: string;
  adictional_items_id: string;
  Sizes: SizeProps[];
  inventory: number;
};

type PartitionInfoProps = {
  id: string;
  name: string;
  value: number;
  PartitionSale: PartitionSaleProps[];
};

type AddictionalInfoProps = {
  id: string;
  name: string;
  value: number;
  AddictionalItem: PartitionSaleProps[];
};

type ProductSaleProps = {
  id: string;
  product_id: string;
  thumbnail: string;
  name: string;
  quantity: number;
  in_promotion: boolean;
  profit_percent: number;
  type:
    | "square_meter"
    | "meter"
    | "unity"
    | "weight"
    | "liter"
    | "without"
    | "sizes";
  unity: string;
  sale_value: number;
  sale_total: number;
  partition: PartitionSaleProps[] | null;
  adictional: PartitionSaleProps[] | null;
  widths: number | null;
  height: number;
  size: SizeProps | null;
};

interface Props {
  isOpen: boolean;
  onClose: (data: boolean) => void;
  productInfo: ProductsProps | null;
  partitionSale: PartitionInfoProps | null;
  addictionalItems?: AddictionalInfoProps | null;
  onSuccess: (itens: ProductSaleProps) => void;
}

const PartitionSale = ({
  isOpen,
  onClose,
  productInfo,
  partitionSale,
  addictionalItems,
  onSuccess,
}: Props) => {
  const toast = useToast();
  const [partition, setPartition] = useState<PartitionSaleProps[]>([]);
  const [addicional, setAddictional] = useState<PartitionSaleProps[]>([]);
  const [total, setTotal] = useState<number>(0);

  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  useEffect(() => {
    if (isOpen === false) {
      setPartition([]);
      setAddictional([]);
      setTotal(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const sumPart = partition.reduce((a, b) => +a + +b.value, 0);
    const sumAdd = addicional.reduce((a, b) => +a + +b.value, 0);
    setTotal(sumPart + sumAdd);
  }, [partition, addicional]);

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

  function handleSetPartition(id: string, check: boolean) {
    if (check === true) {
      if (partition.length >= parseInt(productInfo?.sale_options || "0")) {
        showToast(
          "Você já escolheu todas as opções para este pedido",
          "warning",
          "Atenção"
        );
        return false;
      }
      const result = partitionSale?.PartitionSale.find((obj) => obj.id === id);
      setPartition((older) => [
        ...older,
        {
          id: result?.id || "",
          name: result?.name || "",
          value:
            productInfo?.in_promotion === true
              ? calcPercent(
                  result?.value.toString() || "",
                  productInfo.profit_percent
                )
              : result?.value || 0,
        },
      ]);
    } else {
      const result = partition.filter((obj) => obj.id !== id);
      setPartition(result);
    }
  }
  function handleSetAddictional(id: string, check: boolean) {
    if (check === true) {
      const result = addictionalItems?.AddictionalItem.find(
        (obj) => obj.id === id
      );
      setAddictional((older) => [
        ...older,
        {
          id: result?.id || "",
          name: result?.name || "",
          value: result?.value || 0,
        },
      ]);
    } else {
      const result = addicional.filter((obj) => obj.id !== id);
      setAddictional(result);
    }
  }

  function removePartition(id: string) {
    const result = partition.filter((obj) => obj.id !== id);
    setPartition(result);
  }

  function removeAddictional(id: string) {
    const result = addicional.filter((obj) => obj.id !== id);
    setAddictional(result);
  }

  function handleProductPartitionSale() {
    if (partition === null) {
      showToast(
        "Complete seu pedido, ainda falta selecionar outras opções",
        "warning",
        "Atenção"
      );
      return false;
    } else if (
      (partition?.length as number) <
      parseInt(productInfo?.sale_options as string)
    ) {
      showToast(
        "Complete seu pedido, ainda falta selecionar outras opções",
        "warning",
        "Atenção"
      );
      return false;
    }

    let info: ProductSaleProps = {
      id: nanoid() || "",
      product_id: productInfo?.id || "",
      thumbnail: productInfo?.thumbnail || "",
      name: productInfo?.title || "",
      in_promotion: productInfo?.in_promotion || false,
      profit_percent: productInfo?.profit_percent || 0,
      quantity: 1,
      sale_value: total,
      sale_total: total * 1,
      unity: productInfo?.unit_desc || "",
      type: productInfo?.type_unit || "unity",
      partition: partition.length === 0 ? null : partition,
      adictional: addicional.length === 0 ? null : addicional,
      height: 0,
      widths: null,
      size: null,
    };
    onSuccess(info);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Venda Fracionada</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>
          <Box>
            <Grid
              templateColumns={"1fr"}
              gap={3}
              h="100%"
              maxH={"100%"}
              position={"relative"}
            >
              <Box
                rounded={"md"}
                borderWidth="2px"
                p={2}
                h="fit-content"
                maxH={"100%"}
                overflow="auto"
                borderColor={useColorModeValue("blue.500", "blue.300")}
              >
                <Flex
                  bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                  p={1}
                  justify="center"
                  align={"center"}
                  rounded="md"
                >
                  OPÇÕES DO PEDIDO - Restam:{" "}
                  {parseInt(productInfo?.sale_options || "0") -
                    partition.length}{" "}
                  escolhas
                </Flex>

                <Flex direction={"column"} gap={2} mt={3}>
                  {partitionSale?.PartitionSale.map((part) => (
                    <Flex
                      gap={2}
                      key={part.id}
                      alignItems="center"
                      justify={"space-between"}
                    >
                      <Checkbox
                        size={"lg"}
                        onChange={(e) =>
                          handleSetPartition(part.id, e.target.checked)
                        }
                        isChecked={
                          partition.find((obj) => obj.id === part.id)
                            ? true
                            : false
                        }
                      >
                        {part.name}
                      </Checkbox>
                      <Box
                        textAlign={"right"}
                        fontWeight={"semibold"}
                        fontSize="lg"
                      >
                        {productInfo?.in_promotion === true ? (
                          <HStack>
                            <Tag colorScheme={"red"} mr={1} size="sm">
                              -{productInfo.profit_percent}%
                            </Tag>
                            <Flex gap={1} align="center">
                              <Text
                                fontWeight={"light"}
                                textDecor="line-through"
                                fontSize={"md"}
                              >
                                {parseFloat(
                                  part.value.toString()
                                ).toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Text>
                              <Text>
                                {calcPercent(
                                  part.value.toString(),
                                  productInfo.profit_percent
                                ).toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Text>
                            </Flex>
                          </HStack>
                        ) : (
                          <>
                            {parseFloat(part.value.toString()).toLocaleString(
                              "pt-br",
                              {
                                style: "currency",
                                currency: "BRL",
                              }
                            )}
                          </>
                        )}
                      </Box>
                    </Flex>
                  ))}
                </Flex>
              </Box>
              <Box
                rounded={"md"}
                borderWidth="2px"
                p={2}
                h="fit-content"
                borderColor={useColorModeValue("blue.500", "blue.300")}
              >
                <Flex
                  bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                  p={1}
                  justify="center"
                  align={"center"}
                  rounded="md"
                >
                  ITENS ADICIONAIS
                </Flex>
                <Flex direction={"column"} gap={2} mt={3}>
                  {addictionalItems?.AddictionalItem.map((part) => (
                    <Flex
                      gap={2}
                      key={part.id}
                      alignItems="center"
                      justify={"space-between"}
                    >
                      <Checkbox
                        size={"lg"}
                        isChecked={
                          addicional.find((obj) => obj.id === part.id)
                            ? true
                            : false
                        }
                        onChange={(e) =>
                          handleSetAddictional(part.id, e.target.checked)
                        }
                      >
                        {part.name}
                      </Checkbox>
                      <Text
                        textAlign={"right"}
                        fontWeight={"semibold"}
                        fontSize="lg"
                      >
                        {parseFloat(part.value.toString()).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </Text>
                    </Flex>
                  ))}
                </Flex>
              </Box>
              <Box h="fit-content">
                <Box>
                  <Box rounded="md" borderWidth={"1px"}>
                    <Box
                      py={1}
                      px={3}
                      fontWeight="semibold"
                      borderBottomWidth={"1px"}
                    >
                      PARTES DO PEDIDO
                    </Box>

                    <Flex direction={"column"} gap={2} p={2}>
                      {partition.length === 0 ? (
                        <Flex
                          justify={"center"}
                          align="center"
                          direction={"column"}
                        >
                          <Icon as={GiCardboardBox} fontSize="3xl" />
                          <Text>Nenhum item na venda</Text>
                        </Flex>
                      ) : (
                        <>
                          {partition.map((part) => (
                            <Flex
                              justify={"space-between"}
                              align="center"
                              key={part.id}
                            >
                              <HStack>
                                <IconButton
                                  aria-label="remover"
                                  icon={<FaTrash />}
                                  colorScheme="red"
                                  size="xs"
                                  onClick={() => removePartition(part.id)}
                                />
                                <Text>{part.name}</Text>
                              </HStack>
                              <Text fontWeight={"semibold"}>
                                {parseFloat(
                                  part.value.toString()
                                ).toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Text>
                            </Flex>
                          ))}
                        </>
                      )}
                    </Flex>
                  </Box>
                </Box>

                <Box mt={2}>
                  <Box rounded="md" borderWidth={"1px"}>
                    <Box
                      py={1}
                      px={3}
                      fontWeight="semibold"
                      borderBottomWidth={"1px"}
                    >
                      ITENS ADICIONAIS
                    </Box>

                    <Flex direction={"column"} gap={2} p={2}>
                      {addicional.length === 0 ? (
                        <Flex
                          justify={"center"}
                          align="center"
                          direction={"column"}
                        >
                          <Icon as={GiCardboardBox} fontSize="3xl" />
                          <Text>Nenhum item na venda</Text>
                        </Flex>
                      ) : (
                        <>
                          {addicional.map((part) => (
                            <Flex
                              justify={"space-between"}
                              align="center"
                              key={part.id}
                            >
                              <HStack>
                                <IconButton
                                  aria-label="remover"
                                  icon={<FaTrash />}
                                  colorScheme="red"
                                  size="xs"
                                  onClick={() => removeAddictional(part.id)}
                                />
                                <Text>{part.name}</Text>
                              </HStack>
                              <Text fontWeight={"semibold"}>
                                {parseFloat(
                                  part.value.toString()
                                ).toLocaleString("pt-br", {
                                  style: "currency",
                                  currency: "BRL",
                                })}
                              </Text>
                            </Flex>
                          ))}
                        </>
                      )}
                    </Flex>
                  </Box>
                </Box>

                <Box
                  bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                  py={2}
                  px={4}
                  rounded="md"
                  mt={2}
                >
                  <Flex
                    align={"center"}
                    justify="space-between"
                    fontSize={"lg"}
                    fontWeight="semibold"
                  >
                    <Text>Total</Text>
                    <Text>
                      {total.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </Flex>
                </Box>
              </Box>
            </Grid>
          </Box>
        </ModalBody>
        <ModalFooter>
          <Button
            leftIcon={<AiOutlineSave />}
            colorScheme="blue"
            onClick={() => handleProductPartitionSale()}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(PartitionSale);
