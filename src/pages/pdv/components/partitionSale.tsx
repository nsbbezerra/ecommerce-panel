import {
  Box,
  Button,
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
  console.log({ productInfo, partitionSale, addictionalItems });

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="4xl" isCentered>
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
                  OPÇÕES DO PEDIDO
                </Flex>

                <Flex direction={"column"} gap={2} mt={3}>
                  {partitionSale?.PartitionSale.map((part) => (
                    <Grid
                      templateColumns={"120px 1fr 70px"}
                      gap={2}
                      key={part.id}
                      alignItems="center"
                    >
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="menos"
                          icon={<AiOutlineMinus />}
                          size="sm"
                        />
                        <Input size={"sm"} />
                        <IconButton
                          aria-label="menos"
                          icon={<AiOutlinePlus />}
                          size="sm"
                        />
                      </HStack>
                      <Text noOfLines={1}>{part.name}</Text>
                      <Text textAlign={"right"} fontWeight={"semibold"}>
                        {parseFloat(part.value.toString()).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </Text>
                    </Grid>
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
                    <Grid
                      templateColumns={"120px 1fr 70px"}
                      gap={2}
                      key={part.id}
                      alignItems="center"
                    >
                      <HStack spacing={1}>
                        <IconButton
                          aria-label="menos"
                          icon={<AiOutlineMinus />}
                          size="sm"
                        />
                        <Input size={"sm"} />
                        <IconButton
                          aria-label="menos"
                          icon={<AiOutlinePlus />}
                          size="sm"
                        />
                      </HStack>
                      <Text noOfLines={1}>{part.name}</Text>
                      <Text textAlign={"right"} fontWeight={"semibold"}>
                        {parseFloat(part.value.toString()).toLocaleString(
                          "pt-br",
                          {
                            style: "currency",
                            currency: "BRL",
                          }
                        )}
                      </Text>
                    </Grid>
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
                  PEDIDO
                </Flex>
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
