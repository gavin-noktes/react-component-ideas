import { UseFormRegister } from "react-hook-form";

interface OptionProps {
  name: string;
  key: string;
}

interface SelectProps
  extends React.DetailedHTMLProps<
    React.SelectHTMLAttributes<HTMLSelectElement>,
    HTMLSelectElement
  > {
  register?: UseFormRegister<any>;
  name: string;
  options: OptionProps[];
}

export const Select = ({ register, options, name, ...rest }: SelectProps) => {
  if (!register)
    throw new Error(
      "<Select> Component must be inside a <Form> component or be passed the register attribute"
    );
  return (
    <select {...register(name)} {...rest}>
      {options.map((option) => (
        <option key={`option-${option.key}`} value={option.key}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
