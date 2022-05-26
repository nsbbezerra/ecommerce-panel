import { useRef, useEffect } from "react";
import { useField } from "@unform/core";
import { Textarea, TextareaProps } from "@chakra-ui/textarea";

interface Props {
  name: string;
  rightElement?: boolean;
  leftElement?: boolean;
}

type InputProps = TextareaProps & Props;

export default function TextArea({
  name,
  rightElement = false,
  leftElement = false,
  ...rest
}: InputProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

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
    <Textarea
      {...rest}
      ref={inputRef}
      defaultValue={defaultValue}
      pl={leftElement ? 10 : ""}
      pr={rightElement ? 10 : ""}
    />
  );
}
