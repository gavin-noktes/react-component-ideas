import React from "react";
import {
  UseFormRegister,
  Control,
  FieldValues,
  Controller,
} from "react-hook-form";
import InputMask from "react-input-mask";

interface InputProps
  extends React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  register?: UseFormRegister<any>;
  name: string;
}

export const Input = ({ register, name, ...rest }: InputProps) => {
  if (!register)
    throw new Error(
      "<Input> Component must be inside a <Form> component or be passed the register attribute"
    );
  return <input {...register(name)} {...rest} />;
};

interface PhoneInputProps
  extends Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    "ref"
  > {
  register?: UseFormRegister<any>;
  name: string;
}

// TODO Don't use react-input-mask
export const PhoneInput = ({ register, name, ...rest }: PhoneInputProps) => {
  if (!register)
    throw new Error(
      "<PhoneInput> Component must be inside a <Form> component or be passed the register attribute"
    );
  return <InputMask {...register(name)} {...rest} mask="(999) 999-9999" />;
};

const handleMoneyInputChange = (
  e: React.ChangeEvent<HTMLInputElement>,
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
) => {
  const val = e.target.value.replace(/\D/g, "").split(",").join("");
  let newLoanAmount = Number(val).toLocaleString("en-US");
  e.target.value = newLoanAmount;
  handleChange(e);
};

export const MoneyInput = ({ register, name, ...rest }: InputProps) => {
  if (!register)
    throw new Error(
      "<MoneyInput> Component must be inside a <Form> component or be passed the control attribute"
    );

  const field = register(name);
  return (
    <input
      {...field}
      {...rest}
      onChange={(event) => handleMoneyInputChange(event, field.onChange)}
    ></input>
  );
};
