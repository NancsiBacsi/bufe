import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { CurrencyDollarIcon } from "@heroicons/react/24/solid";
import { BufeInfo, BufeUsrEgyenleg, BufeUsrEgyenlegResponse, BufeUsrFeltoltesRequest, ErrorResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/ListContainer";
import { ListComplexButtonContainer } from "components/ListComplexButtonContainer";
import IconButton from "components/IconButton";
import IntegerInput from "components/IntegerInput";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function SzamlaFeltoltes({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [bufeUsrEgyenleg, setBufeUsrEgyenleg] = useState<BufeUsrEgyenleg[]>([]);
  const [error, setError] = useState<string|null>(null);

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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} showEgyenleg={false} msgEnd="Írd be a felhasználó neve mellé a feltöltendő összeget, majd kattints a jobb oldali gombra!" forceRefresh={forceRefresh} />
      <ErrorLine error={error}/>
      {!loading&&
        <ListContainer>
          {bufeUsrEgyenleg.map((bu) => (
          <ListComplexButtonContainer key={bu.bufeUsrid}>
            <div className="flex-grow text-left">
              {bu.nev} ({bu.egyenleg} Ft)
            </div>
            <IntegerInput min={0} max={99999} value={bu.feltoltes}
              onChange={(newValue) => feltoltesChanged(bu.bufeUsrid, newValue)}/>
            <IconButton icon={<CurrencyDollarIcon className="w-5 h-5"/>}
              onClick={() => addEgyenleg(bu.bufeUsrid, bu.feltoltes)}
              title="Egyenleg feltöltése"/>
          </ListComplexButtonContainer>
          ))}
        </ListContainer>
      }
    </PageContainer>
  );
}