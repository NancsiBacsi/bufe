import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { BevasarloListaItem, BevasarloListaRequest, BevasarloListaResponse, BufeInfo, ErrorResponse, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function BevasarloLista({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [multNapok, setMultNapok] = useState<number>(60);
  const [jovoNapok, setJovoNapok] = useState<number>(14);
  const [bevasarloLista, setBevasarloLista] = useState<BevasarloListaItem[]>([]);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchBevasarloLista = async () => {
      try {
        setLoading(true);
        const req: BevasarloListaRequest = { multNapok:Math.max(1, multNapok), jovoNapok:Math.max(1, jovoNapok) };
        const data: BevasarloListaResponse =
              await fetchJson<BevasarloListaResponse>( "/api/forgalom/listbevasarlas",
                    { method: "POST", credentials: "include",
                      headers: { "Content-Type": "application/json" }, body: JSON.stringify(req) } );
        setError(null);
        setBevasarloLista(data.lista);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchBevasarloLista();
  }, [selectedBufe.bufeUsrId, multNapok, jovoNapok, onLogout]);

  const checkedChanged = (termekId: number, value: boolean) => {
    setBevasarloLista(prev =>
      prev.map(bl =>
        bl.termekId === termekId ? { ...bl, checked: value } : bl
      )
    );
  };

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} showEgyenleg={false} msgEnd="Termékek:" forceRefresh={0} />
      <input type="number" min="1" max="99999" step={1}
        value={""+multNapok} className="w-20 border rounded px-2 py-1 text-right" onChange={(e)=>setMultNapok(Number(e.target.value))}/>
      <input type="number" min="1" max="99999" step={1}
        value={""+jovoNapok} className="w-20 border rounded px-2 py-1 text-right" onChange={(e)=>setJovoNapok(Number(e.target.value))}/>
      <ErrorLine error={error}/>
      <ul className="page-list">
        {!loading&&bevasarloLista.map((bl) => (
          <li key={bl.termekId} className="page-list-complex-item">
            <span className="flex-grow text-left">
              {bl.nev}
            </span>
            <input type="number" disabled={true}
              value={""+bl.mennyiseg} className="w-20 border rounded px-2 py-1 text-right"/>
            <input type="checkbox" checked={bl.checked} onChange={(e) => checkedChanged(bl.termekId, e.target.checked)}/>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}