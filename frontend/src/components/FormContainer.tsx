import React, { FormEvent } from "react";
import ErrorLine from "./ErrorLine";
import PageTitle from "./PageTitle";

interface Props {
  onSubmit?: ( e: FormEvent<HTMLFormElement> ) => void | Promise<void>;
  children: React.ReactNode;
  title?: string;
  error?: string | null;
}
export const FormContainer = ({ children, onSubmit, title, error }: Props) => (
  <div>
    <PageTitle title={title}/>
    <ErrorLine error={error}/>
    <form 
      className="flex w-full max-w-[400px] bg-white p-4 rounded shadow-lg flex-col gap-4"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  </div>
);