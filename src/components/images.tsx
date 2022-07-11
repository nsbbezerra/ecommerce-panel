import {
  Box,
  Flex,
  Grid,
  useColorModeValue,
  Image,
  Button,
  FormLabel,
  Icon,
  Text,
  useToast,
  Input,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  PopoverCloseButton,
  FormControl,
  IconButton,
  ButtonGroup,
} from "@chakra-ui/react";
import axios from "axios";
import { useEffect, useMemo, useState } from "react";
import { AiOutlinePicture, AiOutlineSave } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { api } from "../configs";

type Props = {
  productId: string;
  thumbnailUrl: string | undefined;
  thumbnailId: string;
  imagesProduct: ImageProps[] | [];
};

type ImageProps = {
  id: string;
  image: string;
  image_id: string;
};

export default function HandleImages({
  productId,
  thumbnailUrl,
  imagesProduct,
  thumbnailId,
}: Props) {
  const toast = useToast();
  const [loadingThumbnail, setLoadingThumbnail] = useState<boolean>(false);
  const [loadingImage, setLoadingImage] = useState<boolean>(false);
  const [thumbnail, setThumbnail] = useState<any>(undefined);
  const [productImage, setProductImage] = useState<any>(undefined);
  const [images, setImages] = useState<ImageProps[]>();
  const [loadingDel, setLoadingDel] = useState<boolean>(false);
  const [showThumb, setShowThumb] = useState<boolean>(true);
  const [thumbnail_url, setThumbnail_url] = useState<string>("");
  const [thumbnail_url_id, setThumbnail_url_id] = useState<string>("");

  useEffect(() => {
    setImages(imagesProduct);
  }, [imagesProduct]);

  useEffect(() => {
    if (thumbnailUrl) {
      setShowThumb(true);
      setThumbnail_url(thumbnailUrl);
      setThumbnail_url_id(thumbnailId);
    } else {
      setShowThumb(false);
    }
  }, [thumbnailUrl]);

  const previewThumbnail = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  const previewProductImage = useMemo(() => {
    return productImage ? URL.createObjectURL(productImage) : undefined;
  }, [productImage]);

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

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail);
    setThumbnail(undefined);
  }

  function removeProductImage() {
    URL.revokeObjectURL(productImage);
    setProductImage(undefined);
  }

  function handelThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  function handelProductImage(file: FileList | null) {
    if (file) {
      setProductImage(file[0]);
    }
  }

  async function storeThumbnail() {
    if (productId === "") {
      showToast("Você precisa salvar o produto primeiro", "warning", "Atenção");
      return false;
    }
    if (!thumbnail) {
      showToast("Selecione uma imagem para salvar", "warning", "Atenção");
      return false;
    }
    setLoadingThumbnail(true);

    try {
      let data = new FormData();
      data.append("thumbnail", thumbnail);

      const response = await api.put(`/productsThumbnail/${productId}`, data);

      showToast(response.data.message, "success", "Sucesso");

      setLoadingThumbnail(false);
      setShowThumb(true);
      setThumbnail(undefined);
      removeThumbnail();
      setThumbnail_url(response.data.url);
      setThumbnail_url_id(response.data.url_id);
    } catch (error) {
      setLoadingThumbnail(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function storeImageProduct() {
    if (productId === "") {
      showToast("Você precisa salvar o produto primeiro", "warning", "Atenção");
      return false;
    }
    if (!productImage) {
      showToast("Selecione uma imagem para salvar", "warning", "Atenção");
      return false;
    }
    setLoadingImage(true);
    try {
      let data = new FormData();
      data.append("image", productImage);

      const response = await api.post(`/storeImagesProduct/${productId}`, data);

      showToast(response.data.message, "success", "Sucesso");
      setImages(response.data.images);
      setLoadingImage(false);
      removeProductImage();
      setProductImage(undefined);
    } catch (error) {
      setLoadingImage(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function deleteThumbnail() {
    setLoadingDel(true);

    try {
      const response = await api.put(`/deleteThumbnail/${productId}`, {
        name: thumbnail_url_id,
      });
      showToast(response.data.message, "success", "Sucesso");
      setLoadingDel(false);
      setShowThumb(false);
    } catch (error) {
      setLoadingDel(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  async function deletImage(id: string, name: string) {
    setLoadingDel(true);

    try {
      const response = await api.delete(`/deleteProductImage/${id}/${name}`);
      showToast(response.data.message, "success", "Sucesso");
      const updated = images?.filter((obj) => obj.id !== id);
      setImages(updated);
      setLoadingDel(false);
    } catch (error) {
      setLoadingDel(false);
      if (axios.isAxiosError(error) && error.message) {
        showToast(error.response?.data.message, "error", "Erro");
      } else {
        let message = (error as Error).message;
        showToast(message, "error", "Erro");
      }
    }
  }

  return (
    <Grid templateColumns={"260px 1fr"} gap={5}>
      <Box>
        <Flex
          bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
          p={1}
          justify="center"
          align={"center"}
          rounded="md"
          mb={3}
        >
          IMAGEM PRINCIPAL
        </Flex>

        {showThumb ? (
          <FormControl>
            <Flex direction={"column"} align="center" justify={"center"} pb={3}>
              <Box rounded="md" w="250px" h="250px">
                <Image
                  src={thumbnail_url}
                  w="260px"
                  h="260px"
                  objectFit={"cover"}
                  rounded="md"
                />
              </Box>

              <Popover>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Alterar logo da empresa"
                    icon={<FaTrashAlt />}
                    colorScheme={"red"}
                    mt={"-40px"}
                    size="sm"
                  />
                </PopoverTrigger>
                <PopoverContent shadow={"md"}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Atenção!</PopoverHeader>
                  <PopoverBody>
                    Tem certeza que deseja remover esta imagem?
                  </PopoverBody>
                  <PopoverFooter
                    d="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="blue"
                        onClick={() => deleteThumbnail()}
                        isLoading={loadingDel}
                      >
                        Sim
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </Flex>
          </FormControl>
        ) : (
          <>
            {thumbnail ? (
              <Box
                w="260px"
                h="260px"
                rounded={"md"}
                borderWidth="1px"
                position={"relative"}
                overflow="hidden"
              >
                <Image
                  w="260px"
                  h="260px"
                  objectFit={"cover"}
                  src={previewThumbnail}
                />
                <Grid
                  templateColumns={"1fr 1fr"}
                  position="absolute"
                  bottom={0}
                  left={0}
                  right={0}
                  zIndex={100}
                >
                  <Button
                    colorScheme={"red"}
                    rounded="none"
                    size={"sm"}
                    leftIcon={<FaTrashAlt />}
                    onClick={() => removeThumbnail()}
                    opacity={0.85}
                  >
                    Excluir
                  </Button>
                  <Button
                    colorScheme={"blue"}
                    rounded="none"
                    size={"sm"}
                    leftIcon={<AiOutlineSave />}
                    opacity={0.85}
                    isLoading={loadingThumbnail}
                    onClick={() => storeThumbnail()}
                  >
                    Salvar
                  </Button>
                </Grid>
              </Box>
            ) : (
              <FormLabel
                display={"flex"}
                rounded={"md"}
                overflow="hidden"
                position={"relative"}
                borderWidth="1px"
                borderStyle={"dashed"}
                borderColor={useColorModeValue("gray.900", "gray.100")}
                _hover={{ borderWidth: "2px" }}
                w="260px"
                h="260px"
                justifyContent={"center"}
                alignItems="center"
                flexDirection={"column"}
                gap={3}
                cursor="pointer"
              >
                <Input
                  type={"file"}
                  display="none"
                  onChange={(e) => handelThumbnail(e.target.files)}
                />
                <Icon as={AiOutlinePicture} fontSize="4xl" />
                <Text userSelect={"none"}>Insira sua imagem aqui</Text>
              </FormLabel>
            )}
          </>
        )}
      </Box>
      <Box>
        <Flex
          bg={useColorModeValue("blackAlpha.200", "whiteAlpha.200")}
          p={1}
          justify="center"
          align={"center"}
          rounded="md"
          mb={3}
        >
          MAIS IMAGENS DO PRODUTO
        </Flex>

        <Grid
          templateColumns={"repeat(auto-fit, minmax(260px, 260px))"}
          gap={2}
          justifyContent="center"
        >
          {images?.map((img) => (
            <Flex direction={"column"} align="center" justify={"center"} pb={3}>
              <Box
                key={img.id}
                w="260px"
                h="260px"
                rounded="md"
                borderWidth={"1px"}
                overflow="hidden"
                position={"relative"}
              >
                <Image w="260px" h="260px" src={img.image} objectFit="cover" />
              </Box>
              <Popover>
                <PopoverTrigger>
                  <IconButton
                    aria-label="Alterar logo da empresa"
                    icon={<FaTrashAlt />}
                    colorScheme={"red"}
                    mt={"-45px"}
                    size="sm"
                  />
                </PopoverTrigger>
                <PopoverContent shadow={"md"}>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverHeader>Atenção!</PopoverHeader>
                  <PopoverBody>
                    Tem certeza que deseja remover esta imagem?
                  </PopoverBody>
                  <PopoverFooter
                    d="flex"
                    alignItems="center"
                    justifyContent="flex-end"
                  >
                    <ButtonGroup size="sm">
                      <Button
                        colorScheme="blue"
                        onClick={() => deletImage(img.id, img.image_id)}
                        isLoading={loadingDel}
                      >
                        Sim
                      </Button>
                    </ButtonGroup>
                  </PopoverFooter>
                </PopoverContent>
              </Popover>
            </Flex>
          ))}
          {productImage ? (
            <Box
              w="260px"
              h="260px"
              rounded={"md"}
              borderWidth="1px"
              position={"relative"}
              overflow="hidden"
            >
              <Image
                w="260px"
                h="260px"
                objectFit={"cover"}
                src={previewProductImage}
              />
              <Grid
                templateColumns={"1fr 1fr"}
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                zIndex={100}
              >
                <Button
                  colorScheme={"red"}
                  rounded="none"
                  size={"sm"}
                  leftIcon={<FaTrashAlt />}
                  onClick={() => removeProductImage()}
                  opacity={0.85}
                >
                  Excluir
                </Button>
                <Button
                  colorScheme={"blue"}
                  rounded="none"
                  size={"sm"}
                  leftIcon={<AiOutlineSave />}
                  opacity={0.85}
                  isLoading={loadingImage}
                  onClick={() => storeImageProduct()}
                >
                  Salvar
                </Button>
              </Grid>
            </Box>
          ) : (
            <FormLabel
              display={"flex"}
              rounded={"md"}
              overflow="hidden"
              position={"relative"}
              borderWidth="1px"
              borderStyle={"dashed"}
              borderColor={useColorModeValue("gray.900", "gray.100")}
              _hover={{ borderWidth: "2px" }}
              w="260px"
              h="260px"
              justifyContent={"center"}
              alignItems="center"
              flexDirection={"column"}
              gap={3}
              cursor="pointer"
            >
              <Input
                type={"file"}
                display="none"
                onChange={(e) => handelProductImage(e.target.files)}
              />
              <Icon as={AiOutlinePicture} fontSize="4xl" />
              <Text userSelect={"none"}>Insira sua imagem aqui</Text>
            </FormLabel>
          )}
        </Grid>
      </Box>
    </Grid>
  );
}
