import { useState } from "react";
import "./../styles/Pages.css";
import { BufeInfo, ErrorResponse } from "types";
import { fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  bufeInfos:BufeInfo[],
  onSelect: (bufeInfo: BufeInfo) => void;
  clearSession: () => void;
}
export default function BufeValaszto({ bufeInfos, onSelect, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const selectBufe = async ( bufeInfo: BufeInfo ) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/auth/selectbufe/${bufeInfo.bufeId}`,
        { method: "POST", credentials: "include" } );
      setError(null);
      onSelect( bufeInfo );
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
      <h2 className="page-title">Büfé választása</h2>
      <ErrorLine error={error}/>
      <ul className="page-list">
        {bufeInfos.map((bufe) => (
          <li key={bufe.bufeId}>
            <button className="page-list-button" onClick={() => selectBufe(bufe)}>
              {bufe.bufeNev}
            </button>
          </li>
        ))}
      </ul>
    </PageContainer>
  );
}