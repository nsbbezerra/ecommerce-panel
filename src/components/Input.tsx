import { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import {
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from "@chakra-ui/input";

interface Props {
  name: string;
  rightElement?: boolean;
  leftElement?: boolean;
}

type InputProps = ChakraInputProps & Props;

export default function Input({
  name,
  rightElement = false,
  leftElement = false,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const { fieldName, defaultValue, registerField } = useField(name);

  useEffect(() => {
    registerField({
      name: fieldName,
      ref: inputRef,
      getValue: (ref) => {
        return ref.current.value;
      },
      setValue: (ref, value) => {
        ref.current.value = value;
      },
      clearValue: (ref) => {
        ref.current.value = "";
      },
    });
  }, [fieldName, registerField]);

  return (
    <ChakraInput
      {...rest}
      ref={inputRef}
      defaultValue={defaultValue}
      pl={leftElement ? 10 : ""}
      pr={rightElement ? 10 : ""}
    />
  );
}
