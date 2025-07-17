import { TextareaHTMLAttributes } from "react";

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function TextArea(props: TextAreaProps) {
  return (
    <textarea
      className="w-full p-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
      {...props}
    />
  );
}
