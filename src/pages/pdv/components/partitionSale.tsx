import {
  Box,
  Button,
  Checkbox,
  Flex,
  Grid,
  Heading,
  HStack,
  Icon,
  IconButton,
  Image,
  Input,
  InputGroup,
  InputLeftAddon,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { AiOutlineMinus, AiOutlinePlus, AiOutlineSave } from "react-icons/ai";
import { memo } from "react";
import { FaTrash } from "react-icons/fa";

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

interface Props {
  isOpen: boolean;
  onClose: (data: boolean) => void;
  productInfo: ProductsProps | null;
  partitionSale: PartitionInfoProps | null;
  addictionalItems?: AddictionalInfoProps | null;
}

const PartitionSale = ({
  isOpen,
  onClose,
  productInfo,
  partitionSale,
  addictionalItems,
}: Props) => {
  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="2xl">
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
                borderWidth="1px"
                p={2}
                h="fit-content"
                maxH={"100%"}
                overflow="auto"
              >
                <Flex
                  bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
                  p={1}
                  justify="center"
                  align={"center"}
                  rounded="md"
                >
                  OPÇÕES DO PEDIDO - Restam: {productInfo?.sale_options}{" "}
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
                      <Checkbox size={"lg"}>{part.name}</Checkbox>
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
              <Box rounded={"md"} borderWidth="1px" p={2} h="fit-content">
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
                      <Checkbox size={"lg"}>{part.name}</Checkbox>
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
                      <Flex justify={"space-between"} align="center">
                        <HStack>
                          <IconButton
                            aria-label="remover"
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="xs"
                          />
                          <Text>1/2 Pizza Calabresa</Text>
                        </HStack>
                        <Text fontWeight={"semibold"}>R$ 40,00</Text>
                      </Flex>
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
                      <Flex justify={"space-between"} align="center">
                        <HStack>
                          <IconButton
                            aria-label="remover"
                            icon={<FaTrash />}
                            colorScheme="red"
                            size="xs"
                          />
                          <Text>1/2 Pizza Calabresa</Text>
                        </HStack>
                        <Text fontWeight={"semibold"}>R$ 40,00</Text>
                      </Flex>
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
                    <Text>R$ 40,00</Text>
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

export default memo(PartitionSale);
