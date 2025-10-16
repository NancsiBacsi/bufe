import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { BufeInfo, BufeUsrTermekListaResponse, ErrorResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function Vasarlas({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} showEgyenleg={true} selectedBufe={selectedBufe} msgEnd="Vásárláshoz kattints a termékre!" forceRefresh={0} />
      <ErrorLine error={error}/>
      <ul className="page-list">
        {termekek.termekek.map((t) => (
          <li key={t.termekId}>
            <button className="page-list-button" onClick={() => vasarlasByTermekId(t.termekId)}>{t.nev}: {t.ear}&nbsp;Ft</button>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}