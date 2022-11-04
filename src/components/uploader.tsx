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
} from "@chakra-ui/react";
import axios from "axios";
import { Fragment, useMemo, useState } from "react";
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
  title: string;
}

export default function Uploader({
  url,
  name,
  width,
  height,
  image,
  title,
}: Props) {
  const [thumbnail, setThumbnail] = useState<any>(null);
  const toast = useToast();
  const preview = useMemo(() => {
    return thumbnail ? URL.createObjectURL(thumbnail) : undefined;
  }, [thumbnail]);

  function removeThumbnail() {
    URL.revokeObjectURL(thumbnail);
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

  const mutation = useMutation(
    (thumb: File) => {
      let thumbData = new FormData();
      thumbData.append(name, thumb);
      return api.put(url, thumbData);
    },
    {
      onSuccess: async (data) => {
        showToast(data.data.message, "success", "Sucesso");
        removeThumbnail();
      },
      onError: (err) => {
        if (axios.isAxiosError(err) && err.message) {
          showToast(err.response?.data.message, "error", "Erro");
        }
      },
    }
  );

  return (
    <Fragment>
      <>
        {thumbnail ? (
          <FormControl w={width} h={height}>
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
          </FormControl>
        ) : (
          <FormControl w={width} h={height}>
            <FormLabel htmlFor="image">
              Insira uma imagem
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
                <ChakraInput
                  type={"file"}
                  id="image"
                  d="none"
                  onChange={(e) => {
                    handleThumbnail(e.target.files);
                  }}
                />
              </Flex>
            </FormLabel>
          </FormControl>
        )}
      </>
    </Fragment>
  );
}
