import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";
import "styles/Pages.css";
import { BufeInfo, BufeTermek, BufeUsrTermekListaResponse, ErrorResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/list/ListContainer";
import ListButton from "components/list/ListButton";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function Vasarlas({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [termekek, setTermekek] = useState<BufeTermek[]>([]);
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
        setTermekek(data.termekek);
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
      <NevEsEgyenleg
        loginResponse={loginResponse}
        showEgyenleg={true}
        selectedBufe={selectedBufe}
        msgEnd="Vásárláshoz kattints a termékre!"
      />
      <ErrorLine error={error}/>
      {!loading&&
        <ListContainer>
          {termekek.map((t) => (
            <ListButton
              onClick={() => vasarlasByTermekId(t.termekId)}
              title={`${t.nev}: ${t.ear} Ft`}
            />
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}