import { memo, useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Grid,
  Box,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Tag,
  useToast,
  ToastPositionWithLogical,
} from "@chakra-ui/react";
import { AiOutlineSave } from "react-icons/ai";
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
  onSuccess: (itens: ProductSaleProps) => void;
}

const Sizes = ({ isOpen, onClose, productInfo, onSuccess }: Props) => {
  const toast = useToast();
  const [quantity, setQuantity] = useState<number | string>(1);
  const [size, setSize] = useState<SizeProps | null>(null);
  const [total, setTotal] = useState<number>(0);

  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  useEffect(() => {
    if (isNaN(quantity as number) || quantity === "") {
      setTotal(0);
    } else {
      const productPrice =
        productInfo?.in_promotion === true
          ? calcPercent(productInfo?.sale_value, productInfo?.profit_percent)
          : parseFloat(productInfo?.sale_value as string);

      setTotal(productPrice * parseInt(quantity as string));
    }
  }, [quantity, productInfo]);

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

    if (!size) {
      showToast("Selecione um tamanho", "warning", "Atenção");
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
      sale_value:
        productInfo?.in_promotion === true
          ? calcPercent(productInfo?.sale_value, productInfo?.profit_percent)
          : parseFloat(productInfo?.sale_value as string),
      sale_total: total,
      unity: productInfo?.unit_desc || "",
      type: productInfo?.type_unit || "unity",
      partition: null,
      adictional: null,
      height: 0,
      widths: null,
      size: size,
    };
    onSuccess(info);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tamanhos Personalizados</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={5}>
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
          <Grid
            templateColumns={"repeat(auto-fit, minmax(90px, 90px))"}
            gap={3}
            justifyItems="center"
            justifyContent={"center"}
          >
            {productInfo?.Sizes.map((siz) => (
              <Flex
                w="100%"
                h="90px"
                rounded="md"
                borderWidth={
                  siz.inventory <= 0
                    ? "0px"
                    : size && size.id === siz.id
                    ? "0px"
                    : "1px"
                }
                cursor={siz.inventory <= 0 ? "not-allowed" : "pointer"}
                userSelect={"none"}
                direction="column"
                align={"center"}
                opacity={siz.inventory <= 0 ? 0.5 : 1}
                justify="center"
                _hover={{
                  bg:
                    siz.inventory <= 0
                      ? ""
                      : size && size.id === siz.id
                      ? ""
                      : useColorModeValue("blackAlpha.50", "whiteAlpha.50"),
                }}
                bg={
                  siz.inventory <= 0
                    ? useColorModeValue("red.500", "red.300")
                    : size && size.id === siz.id
                    ? useColorModeValue("blue.500", "blue.300")
                    : ""
                }
                color={
                  siz.inventory <= 0
                    ? useColorModeValue("white", "gray.800")
                    : size && size.id === siz.id
                    ? useColorModeValue("white", "gray.800")
                    : ""
                }
                key={siz.id}
                onClick={siz.inventory > 0 ? () => setSize(siz) : () => {}}
              >
                <Heading>{siz.description}</Heading>
                <Text fontSize={"sm"} fontWeight="light">
                  Restam: {siz.inventory}
                </Text>
              </Flex>
            ))}
          </Grid>

          <Box
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            py={2}
            px={4}
            rounded="md"
            mt={5}
          >
            <Flex
              align={"center"}
              justify="space-between"
              fontSize={"lg"}
              fontWeight="semibold"
            >
              <Text>Total</Text>
              <Text>
                {productInfo?.in_promotion === true && (
                  <Tag colorScheme={"red"} mr={2}>
                    -{productInfo?.profit_percent}%
                  </Tag>
                )}
                {total.toLocaleString("pt-br", {
                  style: "currency",
                  currency: "BRL",
                })}
              </Text>
            </Flex>
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

export default memo(Sizes);
