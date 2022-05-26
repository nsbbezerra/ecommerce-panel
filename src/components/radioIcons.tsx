import { useRef, useEffect, ReactNode } from "react";
import { useField } from "@unform/core";
import { RadioGroup, RadioGroupProps } from "@chakra-ui/radio";
import { Stack } from "@chakra-ui/layout";

interface Props {
  name: string;
  children: ReactNode;
}

type InputProps = RadioGroupProps & Props;

export default function RadioIcons({ name, children, ...rest }: InputProps) {
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
    <RadioGroup {...rest} ref={inputRef} defaultValue={defaultValue}>
      <Stack>{children}</Stack>
    </RadioGroup>
  );
}
