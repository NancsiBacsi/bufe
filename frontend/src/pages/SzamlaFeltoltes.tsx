import { useState, useEffect } from "react";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import "./../styles/Pages.css";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { BufeInfo, BufeUsrEgyenleg, BufeUsrEgyenlegResponse, BufeUsrFeltoltesRequest, ErrorResponse, LoginResponse } from "../types";
import { fetchJson, fetchVoid } from "utils/http";
import { useNavigate } from "react-router-dom";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  onLogout: () => void;
}
export default function SzamlaFeltoltes({ loginResponse, selectedBufe, onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [bufeUsrEgyenleg, setBufeUsrEgyenleg] = useState<BufeUsrEgyenleg[]>([]);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  // Napló betöltése
  useEffect(() => {
    const fetchBufeUsrEgyenleg = async () => {
      try {
        setLoading(true);   
        const data: BufeUsrEgyenlegResponse =
              await fetchJson<BufeUsrEgyenlegResponse>( "/api/bufeusr/listegyenleg",
                    { method: "POST", credentials: "include" } );
        setError(null);
        setBufeUsrEgyenleg(data.bufeUsrs);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchBufeUsrEgyenleg();
  }, [selectedBufe.bufeUsrId, forceRefresh, onLogout]);

  const addEgyenleg = async (bufeUsrId:number, feltoltes:number) => {
    try {
      setLoading(true);
      const req: BufeUsrFeltoltesRequest = { bufeUsrId:bufeUsrId, feltoltes:feltoltes };
      await fetchVoid( "/api/bufeusr/addegyenleg", { method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) } );
      setForceRefresh( forceRefresh+1 );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  };

  const feltoltesChanged = (bufeUsrId: number, value: number) => {
    setBufeUsrEgyenleg(prev =>
      prev.map(bu =>
        bu.bufeUsrid === bufeUsrId ? { ...bu, feltoltes: value } : bu
      )
    );
  };

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="Felhasználói egyenlegek:" forceRefresh={forceRefresh} />
      {error &&<p className="page-error">{error}</p>}
      <ul className="page-list">
        <li key={-1}>
          <button className="page-list-button blue-button" onClick={() => navigate("/menu")}>Menü</button>
        </li>
        {!loading&&bufeUsrEgyenleg.map((bu) => (
          <li key={bu.bufeUsrid} className="page-list-complex-item">
            <span className="flex-grow text-left">
              {bu.nev} ({bu.egyenleg} Ft)
            </span>
            <input type="number" min="0" max="99999" step={1}
              value={""+bu.feltoltes} className="w-20 border rounded px-2 py-1 text-right"
              onChange={(e) => feltoltesChanged(bu.bufeUsrid, Number(e.target.value))}/>
            <button className="page-list-complex-iconbutton"
              onClick={() => addEgyenleg(bu.bufeUsrid, bu.feltoltes)}>
              <CurrencyDollarIcon className="green-icon" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}