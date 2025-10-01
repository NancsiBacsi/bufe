import { useState } from "react";
import "./../styles/Pages.css";
import { BufeInfo, ErrorResponse } from "./../types";
import { fetchVoid } from "utils/http";

interface Props {
  bufeInfos:BufeInfo[],
  onSelect: (bufeInfo: BufeInfo) => void;
  onLogout: () => void;
}
export default function BufeValaszto({ bufeInfos, onSelect, onLogout }:Props) {
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
    <div className="page-container">
       {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <h2 className="page-title">Büfé választása</h2>
      {error && <p className="page-error">{error}</p>}
      <ul className="page-list">
        {bufeInfos.map((bufe) => (
          <li key={bufe.bufeId}>
            <button className="page-list-button" onClick={() => selectBufe(bufe)}>
              {bufe.bufeNev}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}