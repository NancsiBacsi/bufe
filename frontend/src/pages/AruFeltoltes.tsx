import { useState, useEffect, useMemo } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { BoltFeltoltes, BoltFeltoltesRequest, BufeInfo, ErrorResponse, LoginResponse, TermekEgysegar, TermekEgysegarResponse } from "../types";
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
      <NevEsEgyenleg
        loginResponse={loginResponse}
        selectedBufe={selectedBufe}
        showEgyenleg={false}
        msgEnd={`Az áruk feltöltéséhez írd be a bal oldali oszlopokba az árat, a jobb oldaliakba a mennyiséget, majd kattins a feltöltés gombra!
Beszerzett áruk: **${beszerzesOsszesen} Ft**`}/>
      <ErrorLine error={error}/>
      {!loading&&
        <ListContainer>
          <ListButton
            key={-1}
            title="Feltöltés"
            onClick={() => saveFeltoltes()}
            disabled={!saveEnabled}
            className="bg-blue-600 hover:bg-blue-400 small-caps"
          />
          {termekEgysegar.map((te) => (
            <ListComplexButtonContainer key={te.termekId}>
              <div className="flex-grow text-left">
                {te.nev}
              </div>
              <IntegerInput
                min={0}
                max={999}
                value={te.ear}
                onChange={(newValue) => earChanged(te.termekId, newValue)}
              />
              <span className="mr-4">Ft</span>
              <IntegerInput
                min={0}
                max={99999}
                value={te.mennyiseg}
                onChange={(newValue) => mennyisegChanged(te.termekId, newValue)}
              />
              <span>db</span>
            </ListComplexButtonContainer>
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}