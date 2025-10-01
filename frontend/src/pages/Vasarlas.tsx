import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import "./../styles/Pages.css";
import { BufeInfo, BufeUsrTermekListaResponse, ErrorResponse, LoginResponse } from "./../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  onLogout: () => void;
}
export default function Vasarlas({ loginResponse, selectedBufe, onLogout }:Props) {
  const [termekek, setTermekek] = useState<BufeUsrTermekListaResponse>({termekek:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchTermekek = async () => {
      try {
        setLoading(true);   
        const data: BufeUsrTermekListaResponse = 
            await fetchJson<BufeUsrTermekListaResponse>( "/api/termek/bufeusrtermekek", { method: "POST", credentials: "include" } );
        setError(null);
        setTermekek(data);
        setLoading(false);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchTermekek();
  }, [selectedBufe.bufeUsrId, onLogout]);

  const vasarlasByTermekId = async (termekId:number) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/forgalom/vasarlas/${termekId}`, { method: "POST", credentials: "include" });
      navigate("/vasarlasnaplo");
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="Vásárláshoz kattints a termékre!" forceRefresh={0} />
      {error &&<p className="page-error">{error}</p>}
      <ul className="page-list">
        {termekek.termekek.map((t) => (
          <li key={t.termekId}>
            <button className="page-list-button" onClick={() => vasarlasByTermekId(t.termekId)}>{t.nev}: {t.ear}&nbsp;Ft</button>
          </li>
        ))}
      </ul>
    </div>
  );
}