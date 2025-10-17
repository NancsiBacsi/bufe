import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { TrashIcon } from "@heroicons/react/24/solid";
import { BufeInfo, ErrorResponse, ForgalomLogItem, ForgalomLogResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";
import { ListContainer } from "components/ListContainer";
import { ListComplexButtonContainer } from "components/ListComplexButtonContainer";
import ListButton from "components/ListButton";
import IconButton from "components/IconButton";
import { NBSP } from "./../constants";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function VasarlasNaplo({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [naplo, setNaplo] = useState<ForgalomLogItem[]>([]);
  const [error, setError] = useState<string|null>(null);

  // Napló betöltése
  useEffect(() => {
    const fetchNaplo = async () => {
      try {
        setLoading(true);   
        const data: ForgalomLogResponse =
              await fetchJson<ForgalomLogResponse>( `/api/forgalom/vasarlasnaplo/${selectedBufe.bufeUsrId}`,
                    { method: "POST", credentials: "include" } );
        setError(null);
        setNaplo(data.logItems);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchNaplo();
  }, [selectedBufe.bufeUsrId, forceRefresh, onLogout]);

  const vasarlasByTermekId = async (termekId:number) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/forgalom/vasarlas/${termekId}`, { method: "POST", credentials: "include" } );
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

  const torlesByTermekId = async (bufeForgalomId:number) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/forgalom/vasarlasstorno/${bufeForgalomId}`, { method: "POST", credentials:"include" } );
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

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg
        loginResponse={loginResponse}
        showEgyenleg={true}
        selectedBufe={selectedBufe}
        msgEnd="A bal oldali gombra kattintva megismételheted a vásárlásodat, a törlés gombbal törölheted azt."
        forceRefresh={forceRefresh}
      />
      <ErrorLine error={error}/>
      {!loading&&
        <ListContainer>
          {naplo.map((t) => {
            const orderDate = t.orderDate.replace(' ', NBSP);
            const nextEar = t.nextEar > 0 ? t.nextEar + NBSP + 'Ft' : 'elfogyott';
            return (
              <ListComplexButtonContainer key={t.bufeForgalomId}>
                <ListButton
                  title={`**${t.nev}: ${nextEar}**
(${orderDate}${NBSP}${t.ear}${NBSP}Ft)`}
                  key={1}
                  onClick={() => vasarlasByTermekId(t.termekId)}
                />
                <IconButton 
                  icon={<TrashIcon
                  className="w-5 h-5"/>}
                  onClick={() => torlesByTermekId(t.bufeForgalomId)}
                  title="Vásárlás visszavonása"
                />
              </ListComplexButtonContainer>
            );
          })}
        </ListContainer>
      }          
    </PageContainer>
  );
}