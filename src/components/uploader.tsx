import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Icon,
  IconButton,
  Image,
  Text,
  Input as ChakraInput,
  useToast,
  ToastPositionWithLogical,
  useColorModeValue,
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useEffect, useMemo, useState } from "react";
import { AiOutlinePicture, AiOutlineSave } from "react-icons/ai";
import { FaTrashAlt } from "react-icons/fa";
import { useMutation } from "react-query";
import { api, configs } from "../configs";

interface Props {
  url: string;
  name: string;
  width: number | string;
  height: number | string;
  image?: string | null;
  title?: boolean;
  type?: "PUT" | "POST";
  onSuccess?: () => void;
}

export default function Uploader({
  url,
  name,
  width,
  height,
  title = true,
  type = "PUT",
  onSuccess = undefined,
}: Props) {
  const [thumbnail, setThumbnail] = useState<File | undefined>(undefined);
  const toast = useToast();

  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail as any);
    setThumbnail(undefined);
  }
  function handleThumbnail(file: FileList | null) {
    if (file) {
      setThumbnail(file[0]);
    }
  }

  function showToast(
    message: string,
    status: "error" | "info" | "warning" | "success" | undefined,
    titleToast: string
  ) {
    toast({
      title: titleToast,
      description: message,
      status: status,
      position: configs.toastPosition as ToastPositionWithLogical,
      duration: 8000,
      isClosable: true,
    });
  }

  const mutation = useMutation(
    (thumb: File) => {
      let thumbData = new FormData();
      thumbData.append(name, thumb);
      return type === "PUT"
        ? api.put(url, thumbData)
        : api.post(url, thumbData);
    },
    {
      onSuccess: async (data) => {
        showToast(data.data.message, "success", "Sucesso");
        removeThumbnail();
        onSuccess !== undefined && onSuccess();
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  function convertArchiveSize(size: number) {
    let sum = size / 1024;
    if (sum > 500) {
      showToast(
        "Arquivo muito grande insira um arquivo de até 500kb",
        "warning",
        "Atenção"
      );
    }
    return parseFloat(sum.toFixed(2));
  }

  return (
    <Fragment>
      <>
        {thumbnail ? (
          <FormControl w={width} position="relative">
            <FormLabel>{title}</FormLabel>
            <Flex direction={"column"} align="center" justify={"center"} mb={3}>
              <Box rounded="md" w={width} h={height} overflow={"hidden"}>
                <Image src={preview} w={width} h={height} objectFit={"cover"} />
              </Box>

              <IconButton
                aria-label={`Alterar ${title}`}
                icon={<FaTrashAlt />}
                colorScheme={"red"}
                mt={"-45px"}
                size="sm"
                onClick={() => removeThumbnail()}
              />
            </Flex>
            <Button
              isFullWidth
              colorScheme={"blue"}
              leftIcon={<AiOutlineSave />}
              mt={3}
              isLoading={mutation.isLoading}
              onClick={() => {
                mutation.mutate(thumbnail);
              }}
            >
              Salvar Imagem
            </Button>
            <Text fontSize={"sm"}>{thumbnail.name}</Text>
            <Text
              fontSize={"sm"}
              color={
                convertArchiveSize(thumbnail.size) > 500
                  ? useColorModeValue("red.600", "red.300")
                  : ""
              }
            >
              Tamanho: {convertArchiveSize(thumbnail.size)}kb
            </Text>
          </FormControl>
        ) : (
          <FormControl w={width}>
            <FormLabel htmlFor="image">
              {title && "Insira uma imagem"}
              <Flex
                w={width}
                h={height}
                rounded={"md"}
                borderWidth="1px"
                borderStyle={"dashed"}
                direction="column"
                justify={"center"}
                align="center"
                cursor={"pointer"}
                _hover={{ borderWidth: "2px" }}
                mt={2}
              >
                <Icon as={AiOutlinePicture} fontSize="4xl" />
                <Text textAlign={"center"} fontSize="md" mt={2}>
                  Insira uma imagem
                </Text>
                <Text textAlign={"center"} fontSize="sm" fontWeight={"light"}>
                  Dimensões: {width}px X {height}px
                </Text>
                <Text
                  textAlign={"center"}
                  fontSize="sm"
                  fontWeight={"light"}
                  color={useColorModeValue("red.600", "red.300")}
                >
                  Tamanho máximo: 500kb
                </Text>
                <ChakraInput
                  type={"file"}
                  id="image"
                  d="none"
                  onChange={(e) => {
                    handleThumbnail(e.target.files);
                  }}
                  accept="image/*"
                />
              </Flex>
            </FormLabel>
          </FormControl>
        )}
      </>
    </Fragment>
  );
}
