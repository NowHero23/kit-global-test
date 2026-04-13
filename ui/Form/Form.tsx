"use client";

import z from "zod";
import React, { createContext, useContext, useState } from "react";
import { ErrorList } from "./ErrorList";
import { cn } from "../classNames";

type FormActionState = {
  errors?: {
    general?: string[];
  };
};

type FormOnChangeEvent = Parameters<
  NonNullable<React.ComponentProps<"form">["onChange"]>
>[0];

type FormOnSubmitEvent = Parameters<
  NonNullable<React.ComponentProps<"form">["onSubmit"]>
>[0];

export const FormContext = createContext({
  wasSubmitted: false,
});
export const useFormContext = () => useContext(FormContext);

type FormProps = React.ComponentProps<"form"> & {
  schema?: z.ZodTypeAny; // Zod схема для валідації
  actionState?: FormActionState; // Стейт з useActionState (щоб дістати errors.general)
};

export function Form({
  schema,
  actionState,
  children,
  onChange,
  onSubmit,
  className,
  ...props
}: FormProps) {
  const [wasSubmitted, setWasSubmitted] = useState(false);
  const [localGeneralError, setLocalGeneralError] = useState<
    string[] | undefined
  >(undefined);

  const generalError = localGeneralError ?? actionState?.errors?.general;

  // Очищаємо глобальну помилку при будь-якому вводі
  const handleFormChange = (e: FormOnChangeEvent) => {
    if (generalError) setLocalGeneralError(undefined);
    if (onChange) onChange(e); // Якщо передали кастомний onChange, викликаємо і його
  };

  // Перевірка Zod перед відправкою
  const handleSubmit = (e: FormOnSubmitEvent) => {
    setWasSubmitted(true);

    if (schema) {
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData);
      const validationResult = schema.safeParse(data);

      if (!validationResult.success) {
        e.preventDefault(); // Зупиняємо Server Action, якщо є помилки валідації
      }
    }

    if (onSubmit) onSubmit(e);
  };

  return (
    <FormContext.Provider value={{ wasSubmitted }}>
      <form
        onChange={handleFormChange}
        onSubmit={handleSubmit}
        {...props}
        className={cn("space-y-4 md:space-y-6", className)}
      >
        <ErrorList errors={generalError} />
        {children}
      </form>
    </FormContext.Provider>
  );
}
