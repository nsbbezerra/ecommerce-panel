import {
  Box,
  Flex,
  Heading,
  HStack,
  Icon,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { GiCardboardBox } from "react-icons/gi";

type CatProps = {
  title: string;
};

type SizeProps = {
  id: string;
  description: string;
  inventory: number;
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

interface Props {
  isOpen: boolean;
  productInfo: ProductsProps | null;
  onClose: (data: boolean) => void;
}

export default function ProductInfo({ isOpen, productInfo, onClose }: Props) {
  function calcPercent(price: string, discount: number) {
    let calc = (parseFloat(price) * discount) / 100;
    let final = parseFloat(price) - calc;
    return parseFloat(final.toFixed(2));
  }

  return (
    <Modal isOpen={isOpen} onClose={() => onClose(false)} size="xs">
      <ModalOverlay />
      <ModalContent p={0} overflow="hidden">
        <ModalCloseButton />
        <ModalBody p={0}>
          {!productInfo ? (
            <Flex justify={"center"} align="center" direction={"column"}>
              <Icon as={GiCardboardBox} fontSize="8xl" />
              <Text>Nenhuma informação para mostrar</Text>
            </Flex>
          ) : (
            <>
              <Image w={"100%"} src={productInfo.thumbnail} />
              <Box p={3} borderTopWidth="1px">
                <Heading fontSize={"2xl"} noOfLines={2} mb={2}>
                  {productInfo.title}
                </Heading>
                <Text fontWeight={"light"}>SKU: {productInfo?.sku}</Text>
                <Text fontWeight={"light"}>
                  COD. BARRAS: {productInfo?.barcode}
                </Text>
                <Text fontWeight={"light"}>
                  FORMATO DE VENDA: {productInfo?.unit_desc}
                </Text>
                <Text fontWeight={"light"}>
                  DEPARTAMENTO: {productInfo?.category.title}
                </Text>
                <Text fontWeight={"light"}>
                  CATEGORIA: {productInfo?.sub_category.title}
                </Text>

                {productInfo.in_promotion ? (
                  <HStack spacing={2} mt={3}>
                    <Text
                      fontSize={"2xl"}
                      textDecor="line-through"
                      color={useColorModeValue("gray.600", "gray.400")}
                    >
                      {parseFloat(productInfo.sale_value).toLocaleString(
                        "pt-br",
                        {
                          style: "currency",
                          currency: "BRL",
                        }
                      )}
                    </Text>
                    <Text fontSize={"2xl"} fontWeight="semibold">
                      {calcPercent(
                        productInfo.sale_value,
                        productInfo.profit_percent
                      ).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                      })}
                    </Text>
                  </HStack>
                ) : (
                  <Text fontSize={"2xl"} fontWeight="semibold" mt={3}>
                    {parseFloat(productInfo.sale_value).toLocaleString(
                      "pt-br",
                      {
                        style: "currency",
                        currency: "BRL",
                      }
                    )}
                  </Text>
                )}
              </Box>
            </>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
}
