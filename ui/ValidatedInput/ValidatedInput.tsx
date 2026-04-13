import { useState, useCallback } from "react";
import z from "zod";
import { Input } from "../Input";
import { Textarea } from "../Textarea";
import { ErrorList } from "../Form/ErrorList";
import { useFormContext } from "../Form/Form";

type ValidatedInputProps = {
  maxLength?: number;
  type: string;
  name: string;
  errors?: string[];
  fieldSchema: z.ZodTypeAny;
  defaultValue?: string | number;
  placeholder?: string;
  isMultiline?: boolean;
};

const ValidatedInput = (props: ValidatedInputProps) => {
  const { wasSubmitted } = useFormContext();
  const { isMultiline, fieldSchema, ...rest } = props;

  const [value, setValue] = useState(String(props.defaultValue || ""));
  const [touched, setTouched] = useState(false);

  const getErrors = useCallback(() => {
    const validationResult = fieldSchema.safeParse(value);
    return validationResult.success
      ? []
      : validationResult.error.flatten().formErrors;
  }, [fieldSchema, value]);

  const fieldErrors = props.errors || getErrors();
  const shouldRenderErrors =
    (fieldErrors.length > 0 && touched) ||
    (fieldErrors.length > 0 && wasSubmitted);

  const handleBlur = () => setTouched(true);
  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
  ) => setValue(e.target.value);

  const currentInput = isMultiline ? (
    <Textarea
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={props.placeholder || ""}
      className={shouldRenderErrors ? "border-red-500!" : ""}
      {...rest}
    />
  ) : (
    <Input
      onBlur={handleBlur}
      onChange={handleChange}
      placeholder={props.placeholder || ""}
      className={shouldRenderErrors ? "border-red-500!" : ""}
      {...rest}
    />
  );

  return (
    <>
      {currentInput}
      {shouldRenderErrors && <ErrorList errors={fieldErrors} />}
    </>
  );
};
export { ValidatedInput };
