import { useRef, useEffect } from "react";
import ReactInputMask, { Props as InputMaskProps } from "react-input-mask";
import { useField } from "@unform/core";
import { Input, InputProps as ChakraInputProps } from "@chakra-ui/react";

interface Props extends InputMaskProps {
  name: string;
}

type PropsDefault = ChakraInputProps & Props;

export default function InputMask({ name, ...rest }: PropsDefault) {
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef.current,
      path: "value",
      setValue(ref: any, value: string) {
        ref.setInputValue(value);
      },
      clearValue(ref: any) {
        ref.setInputValue("");
      },
    });
  }, [fieldName, registerField]);

  return (
    <Input
      as={ReactInputMask}
      ref={inputRef}
      defaultValue={defaultValue}
      {...rest}
    />
  );
}
