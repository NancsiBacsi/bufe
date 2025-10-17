import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { BufeInfo, ErrorResponse, LeltarRequest, LeltarTermekMennyiseg, LoginResponse, TermekMennyiseg, TermekMennyisegResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/ListContainer";
import ListButton from "components/ListButton";
import { ListComplexButtonContainer } from "components/ListComplexButtonContainer";
import IntegerInput from "components/IntegerInput";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function Leltar({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [termekMennyiseg, setTermekMennyiseg] = useState<TermekMennyiseg[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

  useEffect(() => {
    const fetchTermekMennyiseg = async () => {
      try {
        setLoading(true);   
        const data: TermekMennyisegResponse =
              await fetchJson<TermekMennyisegResponse>( "/api/forgalom/listmennyiseg",
                    { method: "POST", credentials: "include" } );
        setError(null);
        setTermekMennyiseg(data.termekek);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchTermekMennyiseg();
  }, [selectedBufe.bufeUsrId, forceRefresh, onLogout]);

  useEffect(() => {
    setSaveEnabled(termekMennyiseg.some(tm => tm.mennyiseg!==tm.talaltMennyiseg));
  }, [termekMennyiseg]);

  const saveLeltar = async () => {
    try {
      setLoading(true);
      const termekek: LeltarTermekMennyiseg[] = termekMennyiseg
          .filter( tm=>tm.mennyiseg!==tm.talaltMennyiseg )
          .map( tm=> ({
            termekId: tm.termekId, talaltMennyiseg:tm.talaltMennyiseg
          }));
      const req: LeltarRequest = { termekek:termekek };
      await fetchVoid( "/api/forgalom/leltar", { method: "POST", credentials: "include",
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

  const talaltMennyisegChanged = (termekId: number, value: number) => {
    setTermekMennyiseg(prev =>
      prev.map(tm =>
        tm.termekId === termekId ? { ...tm, talaltMennyiseg: value } : tm
      )
    );
  };

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} showEgyenleg={false} msgEnd="Írja be a jobb oldali oszlopba a talált mennyiségeket, majd kattintson a **Leltár könyvelése** gombra"/>
      <ErrorLine error={error}/>
      {!loading&&
        <ListContainer>
          <ListButton
            key={-1}
            title="Leltár könyvelése"
            onClick={() => saveLeltar()}
            disabled={!saveEnabled}
            className="bg-blue-600 hover:bg-blue-400 small-caps"
          />
          {termekMennyiseg.map((tm) => (
            <ListComplexButtonContainer key={tm.termekId}>
              <div className="flex-grow text-left">
                {tm.nev}
              </div>
              <IntegerInput
                min={0}
                max={999}
                value={tm.mennyiseg}
                disabled={true}
              />
              <span className="mr-4">db</span>
              <IntegerInput
                min={0}
                max={999}
                value={tm.talaltMennyiseg}
                onChange={(newValue) => talaltMennyisegChanged(tm.termekId, newValue)}/>
              <span>talált</span>
            </ListComplexButtonContainer>            
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}