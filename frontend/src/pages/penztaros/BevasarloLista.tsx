import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/page/NevEsEgyenleg";
import "styles/Pages.css";
import { BevasarloListaItem, BevasarloListaRequest, BevasarloListaResponse, BufeInfo, ErrorResponse, LoginResponse } from "types";
import { fetchJson } from "utils/http";
import { PageContainer } from "components/page/PageContainer";
import LoadingOverlay from "components/page/LoadingOverlay";
import ListInputInteger from "components/list/ListInputInteger";
import { ListContainer } from "components/list/ListContainer";
import { ListComplexButtonContainer } from "components/list/ListComplexButtonContainer";
import { FormContainer } from "components/form/FormContainer";

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
      <NevEsEgyenleg
        loginResponse={loginResponse}
        selectedBufe={selectedBufe}
        showEgyenleg={false}
        msgEnd="A bevásárlásban segít ez a lista. Az előző N nap fogyása alapján megjósolja a következő M nap fogyasztását, és ha kevés a készlet, a különbséget listázza.
A pipák nem mentődnek el, csak bevásárláskor pipálhatod ami megvan!"
      />
      <FormContainer
        error={error}
      >
        <label htmlFor="multNapok">Előző hány nap alapján</label>
        <ListInputInteger
          id="multNapok"
          min={1}
          max={999}
          value={multNapok}
          onChange={(newValue)=>setMultNapok(Number(newValue))}
          required={true}
        />
        <label htmlFor="jovoNapok">Hány napra elég</label>
        <ListInputInteger
          id="jovoNapok"
          min={1}
          max={999}
          value={jovoNapok}
          onChange={(newValue)=>setJovoNapok(Number(newValue))}
          required={true}
        />
      </FormContainer>
      {!loading&& 
        <ListContainer>
          {bevasarloLista.map((bl) => (
            <ListComplexButtonContainer key={bl.termekId}>
              <div className="flex-grow text-left">
                {bl.nev}
              </div>
              <ListInputInteger
                max={999}
                disabled={true}
                value={bl.mennyiseg}
              />
              <input
                type="checkbox"
                checked={bl.checked}
                onChange={(e) => checkedChanged(bl.termekId, e.target.checked)}
              />
            </ListComplexButtonContainer>
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}