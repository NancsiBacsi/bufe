import React, { FormEvent } from "react";
import ErrorLine from "../ErrorLine";
import PageTitle from "../page/PageTitle";
import IconButton from "components/IconButton";
import { HomeIcon } from "@heroicons/react/24/solid";

interface Props {
  onSubmit?: ( e: FormEvent<HTMLFormElement> ) => void | Promise<void>;
  children: React.ReactNode;
  title?: string;
  error?: string | null;
  showMenu?: boolean;
  onMenuClick?: () => void | Promise<void>; 
}
export const FormContainer = ({ children, onSubmit, title, error, showMenu, onMenuClick }: Props) => (
  <div>
    <div className="flex flex-row w-full items-center">
      { showMenu &&
        <IconButton icon={<HomeIcon className="w-5 h-5"/>}
            onClick={onMenuClick}
            title="Menü"/>
      }
      <div className="flex-1">
        <PageTitle title={title}/>
      </div>
    </div>
    <ErrorLine error={error}/>
    <form 
      className="flex w-full max-w-[400px] bg-white p-4 rounded shadow-lg flex-col gap-4"
      onSubmit={onSubmit}
    >
      {children}
    </form>
  </div>
);