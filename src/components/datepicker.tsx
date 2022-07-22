import { useRef, useState, useEffect, forwardRef } from "react";
import { Input } from "@chakra-ui/input";
import ReactDatePicker, {
  ReactDatePickerProps,
  registerLocale,
} from "react-datepicker";
import pt_br from "date-fns/locale/pt-BR";
import { useField } from "@unform/core";
import "react-datepicker/dist/react-datepicker.css";
interface Props extends Omit<ReactDatePickerProps, "onChange"> {
  name: string;
}
registerLocale("pt_br", pt_br);
export default function DatePicker({ name, ...rest }: Props) {
  const datepickerRef = useRef(null);
  const inputRef = useRef(null);
  const { fieldName, registerField, defaultValue, error } = useField(name);
  const [date, setDate] = useState(defaultValue || null);
  const CustomInput = forwardRef((props: any, ref) => {
    return <Input {...props} ref={ref} />;
  });
  useEffect(() => {
    registerField({
      name: fieldName,
      ref: datepickerRef.current,
      path: "props.selected",
      clearValue: (ref: any) => {
        ref.clear();
      },
    });
  }, [fieldName, registerField]);
  return (
    <ReactDatePicker
      ref={datepickerRef}
      selected={date}
      onChange={setDate}
      {...rest}
      locale="pt_br"
      dateFormat="dd/MM/yyyy"
      showPopperArrow={true}
      customInput={<CustomInput inputRef={inputRef} />}
    />
  );
}
