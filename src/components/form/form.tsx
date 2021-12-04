import { Children, createElement } from "react";
import { SubmitHandler, useForm } from "react-hook-form";

interface FormProps<T>
  extends Omit<
    React.DetailedHTMLProps<
      React.FormHTMLAttributes<HTMLFormElement>,
      HTMLFormElement
    >,
    "onSubmit"
  > {
  children: JSX.Element[];
  onSubmit: SubmitHandler<T>;
  defaultValues: T;
}

const Form = <T extends object = any>(props: FormProps<T>) => {
  const defaultValuesAsAny = props.defaultValues as any;
  const methods = useForm<T>(props.defaultValues);
  const { handleSubmit } = methods;

  return (
    <form onSubmit={handleSubmit(props.onSubmit)}>
      {Children.map(props.children, (child) => {
        let control;
        if (child.type.name == "MoneyInput") control = methods.control;
        return child.props.name
          ? createElement(child.type, {
              ...{
                ...child.props,
                register: methods.register,
                control,
                key: child.props.name,
                defaultValue: defaultValuesAsAny[child.props.name],
              },
            })
          : child;
      })}
    </form>
  );
};

export default Form;
