import { useState, useEffect, useMemo } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { BoltFeltoltes, BoltFeltoltesRequest, BufeInfo, ErrorResponse, LoginResponse, TermekEgysegar, TermekEgysegarResponse } from "../types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function AruFeltoltes({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [termekEgysegar, setTermekEgysegar] = useState<TermekEgysegar[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);

  const beszerzesOsszesen = useMemo(() => {
    return termekEgysegar.reduce(
      (acc, t) => acc + ( t.ear && t.mennyiseg ? t.ear * t.mennyiseg : 0 ),
      0
    );
  }, [termekEgysegar]);

  useEffect(() => {
    const fetchTermekEgysegar = async () => {
      try {
        setLoading(true);   
        const data: TermekEgysegarResponse =
              await fetchJson<TermekEgysegarResponse>( "/api/forgalom/listear",
                    { method: "POST", credentials: "include" } );
        setError(null);
        setTermekEgysegar(data.termekek);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchTermekEgysegar();
  }, [selectedBufe.bufeUsrId, forceRefresh, onLogout]);

  useEffect(() => {
    setSaveEnabled(termekEgysegar.some(te => te.ear > 0 && te.mennyiseg > 0));
  }, [termekEgysegar]);

  const saveFeltoltes = async () => {
    try {
      setLoading(true);
      const termekek: BoltFeltoltes[] = termekEgysegar
          .filter( te=>te.ear>0 && te.mennyiseg>0 )
          .map( te=> ({
            termekId: te.termekId, mennyiseg: te.mennyiseg, ear:te.ear
          }));
      const req: BoltFeltoltesRequest = { termekek:termekek };
      await fetchVoid( "/api/forgalom/boltfeltoltes", { method: "POST", credentials: "include",
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

  const earChanged = (termekId: number, value: number) => {
    setTermekEgysegar(prev =>
      prev.map(te =>
        te.termekId === termekId ? { ...te, ear: value } : te
      )
    );
  };

  const mennyisegChanged = (termekId: number, value: number) => {
    setTermekEgysegar(prev =>
      prev.map(te =>
        te.termekId === termekId ? { ...te, mennyiseg: value } : te
      )
    );
  };

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd={`Az áruk feltöltéséhez írd be a bal oldali oszlopba az árat, a jobb oldali oszlopba a mennyiséget. Ha megvagy, kattins a feltöltés gombra!
Áruk ára összesen **${beszerzesOsszesen} Ft**`} forceRefresh={forceRefresh} />
      {error &&<p className="page-error">{error}</p>}
      <ul className="page-list">
        <li key={-1}>
          <button className="page-list-button blue-button" disabled={!saveEnabled} onClick={() => saveFeltoltes()}>Feltöltés</button>
        </li>
        {!loading&&termekEgysegar.map((te) => (
          <li key={te.termekId} className="page-list-complex-item">
            <span className="flex-grow text-left">
              {te.nev}
            </span>
            <input type="number" min="0" max="99999" step={1}
              value={""+te.ear} className="w-20 border rounded px-2 py-1 text-right"
              onChange={(e) => earChanged(te.termekId, Number(e.target.value))}/>
            <input type="number" min="0" max="99999" step={1}
              value={""+te.mennyiseg} className="w-20 border rounded px-2 py-1 text-right"
              onChange={(e) => mennyisegChanged(te.termekId, Number(e.target.value))}/>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}