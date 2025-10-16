import { useEffect, useState } from "react";
import "styles/Pages.css";
import { BufeInfo, EgyenlegResponse, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { Bars3Icon } from "@heroicons/react/24/solid";
import { useNavigate } from "react-router-dom";
import FormatedTxt from "./FormatedText";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  msgEnd: string;
  forceRefresh: number;
}
export default function NevEsEgyenleg({loginResponse, selectedBufe, msgEnd, forceRefresh}:Props) {
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
    <header className="flex items-center p-4 bg-gray-100 shadow-md">
      <button className="p-2 rounded bg-gray-400 hover:bg-gray-200">
        <Bars3Icon className="w-6 h-6 text-gray-700" onClick={() => navigate("/menu")}/>
      </button>
      <div className="flex-1 page-header">
        <FormatedTxt className="page-center" formatedTxt={`Üdv **${loginResponse.nev}**, egyenleged **${egyenleg} Ft.**`}/>
        <FormatedTxt className="page-center" formatedTxt={`${msgEnd}`}/>
      </div>
    </header>
  );
}