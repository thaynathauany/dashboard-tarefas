import { ButtonHTMLAttributes, PropsWithChildren } from "react";

type BtnFormProps = PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>;

export const BtnForm = ({ children, ...props }: BtnFormProps) => {
  return (
    <button
      className={`px-4 py-2 rounded bg-primary text-black transition-colors ${
        props.disabled
          ? "cursor-not-allowed opacity-50"
          : "cursor-pointer hover:bg-secondary"
      }`}
      {...props}
    >
      {children}
    </button>
  );
};
