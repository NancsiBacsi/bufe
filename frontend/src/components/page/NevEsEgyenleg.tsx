import { useEffect, useState } from "react";
import { BufeInfo, EgyenlegResponse, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { HomeIcon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import FormatedTxt from "../FormatedText";
import IconButton from "../IconButton";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  showEgyenleg: boolean;
  msgEnd: string;
  forceRefresh?: number | null;
}
export default function NevEsEgyenleg({loginResponse, selectedBufe, showEgyenleg, msgEnd, forceRefresh}:Props) {
  const [egyenleg, setEgyenleg] = useState<string>("...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEgyenleg = async () => {
      try {
        const bufeUsrEgyenleg: EgyenlegResponse = 
          await fetchJson<EgyenlegResponse>( "/api/bufeusr/egyenleg",
            { method: "POST", credentials: "include" } );
        setEgyenleg(""+bufeUsrEgyenleg.egyenleg);
      } catch (err) {
        setEgyenleg("!hiba!");
      }      
    };
    fetchEgyenleg();
  }, [selectedBufe.bufeUsrId, forceRefresh]);

  return (
    <header className="flex w-full max-w-[400px] box-border items-center p-4 bg-white rounded shadow-lg]">
      <IconButton icon={<HomeIcon className="w-5 h-5"/>}
            onClick={() => navigate("/menu")}
            title="Menü"/>
      <div className="flex-1 box-border items-center p-4 bg-white rounded-md shadow-lg">
        {showEgyenleg
          ? <FormatedTxt
              className="text-center"
              formatedTxt={`Üdv **${loginResponse.nev}**, egyenleged **${egyenleg} Ft.**`}
            />
          : null
        }
        <FormatedTxt className="text-center" formatedTxt={`${msgEnd}`} />
      </div>
    </header>
  );
}