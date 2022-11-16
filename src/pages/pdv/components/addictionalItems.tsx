import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
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
  Text,
  useColorModeValue,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  ToastPositionWithLogical,
  Tag,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { memo, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";
import { configs } from "../../../configs";

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
  addictionalItems?: AddictionalInfoProps | null;
  onSuccess: (itens: ProductSaleProps) => void;
}

const AddictionalItems = ({
  isOpen,
  onClose,
  onSuccess,
  addictionalItems,
  productInfo,
}: Props) => {
  const toast = useToast();
  const [addicional, setAddictional] = useState<PartitionSaleProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [unityTotal, setUnityTotal] = useState<number>(0);
  const [totalProduct, setTotalProduct] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | string>(1);

  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  useEffect(() => {
    if (isOpen === false) {
      setAddictional([]);
      setQuantity(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const productValue =
      productInfo?.in_promotion === true
        ? calcPercent(productInfo?.sale_value, productInfo?.profit_percent)
        : parseFloat(productInfo?.sale_value as string);
    const sumAdd = addicional.reduce((a, b) => +a + +b.value, 0);
    const unityCalc = sumAdd + productValue;
    setTotal(sumAdd);
    setUnityTotal(unityCalc);
    setTotalProduct(
      isNaN(quantity as number) || quantity === ""
        ? 0
        : unityCalc * parseFloat(quantity as string)
    );
  }, [addicional, quantity]);

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

  function removeAddictional(id: string) {
    const result = addicional.filter((obj) => obj.id !== id);
    setAddictional(result);
  }

  function handleSetToCart() {
    if (quantity === "" || isNaN(quantity as number)) {
      showToast(
        "A quantidade não pode ser nula ou menor que 1",
        "warning",
        "Atenção"
      );
      setQuantity(1);
      return false;
    }
    let info: ProductSaleProps = {
      id: nanoid() || "",
      product_id: productInfo?.id || "",
      thumbnail: productInfo?.thumbnail || "",
      in_promotion: productInfo?.in_promotion || false,
      profit_percent: productInfo?.profit_percent || 0,
      name: productInfo?.title || "",
      quantity: quantity as number,
      sale_value: unityTotal,
      sale_total: totalProduct,
      unity: productInfo?.unit_desc || "",
      type: productInfo?.type_unit || "unity",
      partition: null,
      adictional: addicional,
      height: 0,
      widths: null,
      size: null,
    };
    onSuccess(info);
  }

  function handleTotalValue() {
    if (isNaN(totalProduct)) {
      if (productInfo?.in_promotion === true) {
        return calcPercent(
          productInfo?.sale_value,
          productInfo?.profit_percent
        ).toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL",
        });
      } else {
        return parseFloat(productInfo?.sale_value as string).toLocaleString(
          "pt-br",
          {
            style: "currency",
            currency: "BRL",
          }
        );
      }
    } else {
      return totalProduct.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL",
      });
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Itens Adicionais</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={5}>
          <FormControl mb={3}>
            <FormLabel>Quantidade de {productInfo?.title}:</FormLabel>
            <NumberInput
              size={"lg"}
              value={quantity.toString()}
              onChange={(e) => setQuantity(e === "" ? e : parseFloat(e))}
            >
              <NumberInputField />
              <NumberInputStepper>
                <NumberIncrementStepper />
                <NumberDecrementStepper />
              </NumberInputStepper>
            </NumberInput>
          </FormControl>
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
                                {isNaN(quantity as number) ? 0 : quantity}x -{" "}
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
                    mb={2}
                  >
                    <Text>Itens Adicionais</Text>
                    <Text>
                      {quantity}x -{" "}
                      {total.toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </Flex>
                  <Flex
                    align={"center"}
                    justify="space-between"
                    fontSize={"lg"}
                    mb={2}
                  >
                    <Text>{productInfo?.title}</Text>
                    <Text>
                      {productInfo?.in_promotion === true && (
                        <Tag colorScheme={"red"} mr={2}>
                          -{productInfo?.profit_percent}%
                        </Tag>
                      )}
                      {productInfo?.in_promotion === true
                        ? calcPercent(
                            productInfo?.sale_value,
                            productInfo?.profit_percent
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : parseFloat(
                            productInfo?.sale_value as string
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                    </Text>
                  </Flex>
                  <Flex
                    align={"center"}
                    justify="space-between"
                    fontSize={"lg"}
                    borderTopWidth={"1px"}
                    pt={2}
                    borderTopColor={useColorModeValue("white", "gray.500")}
                  >
                    <Text>Total Unitário</Text>
                    <Text>
                      {isNaN(unityTotal)
                        ? parseFloat(
                            productInfo?.sale_value as string
                          ).toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })
                        : unityTotal.toLocaleString("pt-br", {
                            style: "currency",
                            currency: "BRL",
                          })}
                    </Text>
                  </Flex>
                  <Flex
                    align={"center"}
                    justify="space-between"
                    fontSize={"lg"}
                    fontWeight="semibold"
                    mt={2}
                  >
                    <Text>Total</Text>
                    <Text>{handleTotalValue()}</Text>
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
            onClick={() => handleSetToCart()}
          >
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(AddictionalItems);
