import { useEffect, useState } from "react";
import { BufeInfo, EgyenlegResponse, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import FormatedTxt from "./FormatedText";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  showEgyenleg: boolean;
  msgEnd: string;
  forceRefresh: number;
}
export default function NevEsEgyenleg({loginResponse, selectedBufe, showEgyenleg, msgEnd, forceRefresh}:Props) {
  const [egyenleg, setEgyenleg] = useState<string>("...");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEgyenleg = async () => {
      try {
        const bufeUsrEgyenleg: EgyenlegResponse = 
          await fetchJson<EgyenlegResponse>( "/api/bufeusr/egyenleg", { method: "POST", credentials: "include" } );
        setEgyenleg(""+bufeUsrEgyenleg.egyenleg);
      } catch (err) {
        setEgyenleg("!hiba!");
      }      
    };
    fetchEgyenleg();
  }, [selectedBufe.bufeUsrId, forceRefresh]);

  return (
    <header className="flex w-full max-w-[400px] box-border items-center p-4 bg-white rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
      <button className="p-2 rounded bg-gray-400 hover:bg-gray-200 shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        <Bars3Icon className="w-6 h-6 text-gray-700" onClick={() => navigate("/menu")}/>
      </button>
      <div className="flex-1 box-border items-center p-4 bg-white rounded-md shadow-[0_4px_10px_rgba(0,0,0,0.2)]">
        {showEgyenleg?<FormatedTxt className="text-center" formatedTxt={`Üdv **${loginResponse.nev}**, egyenleged **${egyenleg} Ft.**`}/>:null}
        <FormatedTxt className="text-center" formatedTxt={`${msgEnd}`}/>
      </div>
    </header>
  );
}