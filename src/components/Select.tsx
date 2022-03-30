import { useRef, useEffect, ReactChildren, ReactNode } from "react";
import { useField } from "@unform/core";
import {
  Select as ChakraSelect,
  SelectProps as ChakraSelectProps,
} from "@chakra-ui/select";

interface Props {
  name: string;
  rightElement?: boolean;
  leftElement?: boolean;
  children: ReactNode;
}

type InputProps = ChakraSelectProps & Props;

export default function Select({
  name,
  rightElement = false,
  leftElement = false,
  children,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLSelectElement>(null);

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
    <ChakraSelect
      {...rest}
      ref={inputRef}
      defaultValue={defaultValue}
      pl={leftElement ? 10 : ""}
      pr={rightElement ? 10 : ""}
    >
      {children}
    </ChakraSelect>
  );
}
