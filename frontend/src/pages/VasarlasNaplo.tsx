import { useState, useEffect } from "react";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import "styles/Pages.css";
import { TrashIcon } from "@heroicons/react/24/solid";
import { BufeInfo, ErrorResponse, ForgalomLogResponse, LoginResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function VasarlasNaplo({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [naplo, setNaplo] = useState<ForgalomLogResponse>({logItems:[]});
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
        setNaplo(data);
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
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="Itt tekintheted meg, kattintással ismételheted, vagy törölheted előző vásárlásaidat." forceRefresh={forceRefresh} />
      {error &&<p className="page-error">{error}</p>}
      <ul className="page-list">
        {!loading&&naplo.logItems.map((t) => (
          <li key={t.bufeForgalomId} className="page-list-complex-item">
            <button className="page-list-complex-button" disabled={t.nextEar === 0}
                    onClick={() => vasarlasByTermekId(t.termekId)}>
              {t.nev} ({t.orderDate.replace(' ', '\u00A0')}): {t.nextEar > 0 ? t.nextEar + "Ft" : "elfogyott"} ({t.ear}&nbsp;Ft)
            </button>
            <button className="page-list-complex-iconbutton" onClick={() => torlesByTermekId(t.bufeForgalomId)}>
              <TrashIcon className="red-icon" />
            </button>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}