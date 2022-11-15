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
  Input,
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
} from "@chakra-ui/react";
import { memo, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { FaTrash } from "react-icons/fa";
import { GiCardboardBox } from "react-icons/gi";

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

interface Props {
  isOpen: boolean;
  onClose: (data: boolean) => void;
  productInfo: ProductsProps | null;
  addictionalItems?: AddictionalInfoProps | null;
  onSuccess: (
    id: string,
    partition: PartitionSaleProps[] | null,
    addicional: PartitionSaleProps[] | null,
    totalPartition: number
  ) => void;
}

const AddictionalItems = ({
  isOpen,
  onClose,
  onSuccess,
  addictionalItems,
  productInfo,
}: Props) => {
  const [addicional, setAddictional] = useState<PartitionSaleProps[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [quantity, setQuantity] = useState<number | string>(1);

  useEffect(() => {
    if (isOpen === false) {
      setAddictional([]);
      setQuantity(1);
    }
  }, [isOpen]);

  useEffect(() => {
    const sumAdd = addicional.reduce((a, b) => +a + +b.value, 0);
    setTotal(sumAdd);
  }, [addicional]);

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
          <Button leftIcon={<AiOutlineSave />} colorScheme="blue">
            Salvar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default memo(AddictionalItems);
