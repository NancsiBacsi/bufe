import React, { useEffect, useState } from "react";
import "./../styles/Pages.css";
import { BufeInfo, BufeUsrEgyenlegResponse, LoginResponse } from "./../types";
import { fetchJson } from "utils/http";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  msgEnd: string;
  forceRefresh: number;
}
export default function NevEsEgyenleg({loginResponse, selectedBufe, msgEnd, forceRefresh}:Props) {
  const [egyenleg, setEgyenleg] = useState<string>("...");

  useEffect(() => {
    const fetchEgyenleg = async () => {
      try {
        const bufeUsrEgyenleg: BufeUsrEgyenlegResponse = 
            await fetchJson<BufeUsrEgyenlegResponse>( "/api/bufeusr/egyenleg", { method: "POST", credentials: "include" } );
        setEgyenleg(""+bufeUsrEgyenleg.egyenleg);
      } catch (err) {
        setEgyenleg("!hiba!");
      }      
    };
    fetchEgyenleg();
  }, [selectedBufe.bufeUsrId, forceRefresh]);

  return (
    <div className="page-header">
      <p className="page-center">Üdv <strong>{loginResponse.nev}</strong>, egyenleged <strong>{egyenleg}&nbsp;Ft.</strong></p>
      <p>{msgEnd}</p>
    </div>
  );
}