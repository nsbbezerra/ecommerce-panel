import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  InputGroup,
  Input,
  InputLeftAddon,
  InputRightAddon,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Box,
  useColorModeValue,
  Flex,
  Text,
  Button,
  useToast,
  ToastPositionWithLogical,
  HStack,
  Tag,
} from "@chakra-ui/react";
import { nanoid } from "nanoid";
import { memo, useEffect, useState } from "react";
import { AiOutlineSave } from "react-icons/ai";
import { configs } from "../../../configs";

type WidthProps = {
  id: string;
  width: string;
};

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
  width: string;
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

const SquareMeter = ({ isOpen, onClose, productInfo, onSuccess }: Props) => {
  const toast = useToast();
  const [widths, setWidths] = useState<WidthProps[]>([]);
  const [quantity, setQuantity] = useState<number | string>(1);
  const [total, setTotal] = useState<number>(0);
  const [unityTotal, setUnityTotal] = useState<number>(0);
  const [width, setWidth] = useState<string>("");
  const [height, setHeight] = useState<number>(0);

  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  useEffect(() => {
    if (isOpen === false) {
      setQuantity(1);
      setTotal(0);
      setUnityTotal(0);
      setWidth("");
      setHeight(0);
    }
  }, [isOpen]);

  useEffect(() => {
    if (width === "") {
      setTotal(0);
    } else {
      const widtToNumber = parseFloat(width);
      const calcSquareMeter = widtToNumber * height;
      if (isNaN(calcSquareMeter)) {
        setTotal(0);
      } else {
        setUnityTotal(
          calcSquareMeter *
            parseFloat(
              productInfo?.in_promotion === true
                ? calcPercent(
                    productInfo?.sale_value,
                    productInfo.profit_percent
                  ).toString()
                : (productInfo?.sale_value as string)
            )
        );
        const sum =
          calcSquareMeter *
          parseFloat(
            isNaN(quantity as number) || quantity === ""
              ? "1"
              : (quantity as string)
          );
        const lastPrice =
          sum *
          parseFloat(
            productInfo?.in_promotion === true
              ? calcPercent(
                  productInfo?.sale_value,
                  productInfo.profit_percent
                ).toString()
              : (productInfo?.sale_value as string)
          );
        setTotal(lastPrice);
      }
    }
  }, [width, height, quantity]);

  useEffect(() => {
    if (productInfo) {
      const parsedWidths = JSON.parse(productInfo.width);
      setWidths(parsedWidths);
    }
  }, [productInfo]);

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
    if (width === "") {
      showToast("Selecione uma largura", "warning", "Atenção");
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
      sale_total: total,
      unity: productInfo?.unit_desc || "",
      type: productInfo?.type_unit || "unity",
      partition: null,
      adictional: null,
      height: height,
      widths: parseFloat(width),
      size: null,
    };
    onSuccess(info);
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Metro Quadrado</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mb={2}>
            <FormLabel>Quantidade</FormLabel>
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
          <FormControl>
            <FormLabel>Largura em metros</FormLabel>
            <Select
              placeholder="Selecione uma opção"
              size={"lg"}
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            >
              {widths.map((wdt) => (
                <option key={wdt.id} value={wdt.width}>
                  {wdt.width}m
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl mt={2}>
            <FormLabel>Altura em metros</FormLabel>
            <InputGroup size={"lg"}>
              <Input
                type={"number"}
                value={height}
                onChange={(e) => setHeight(parseFloat(e.target.value))}
              />
              <InputRightAddon children="MT" />
            </InputGroup>
          </FormControl>

          <Flex
            direction={"column"}
            bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
            py={2}
            px={4}
            rounded="md"
            mt={5}
            gap={2}
          >
            <Flex align={"center"} justify="space-between" fontSize={"lg"}>
              <Text>Valor do Metro</Text>
              {productInfo?.in_promotion === true ? (
                <HStack>
                  <Tag colorScheme={"red"}>-{productInfo?.profit_percent}%</Tag>
                  <Text
                    fontWeight={"light"}
                    textDecor="line-through"
                    fontSize={"md"}
                  >
                    {parseFloat(
                      productInfo?.sale_value as string
                    ).toLocaleString("pt-br", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </Text>
                  <Text>
                    {calcPercent(
                      productInfo.sale_value.toString(),
                      productInfo.profit_percent
                    )}
                  </Text>
                </HStack>
              ) : (
                <Text>
                  {parseFloat(productInfo?.sale_value as string).toLocaleString(
                    "pt-br",
                    {
                      style: "currency",
                      currency: "BRL",
                    }
                  )}
                </Text>
              )}
            </Flex>
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
          </Flex>
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

export default memo(SquareMeter);
