import { useState } from "react";
import "./../styles/Pages.css";
import { BufeInfo, ErrorResponse } from "types";
import { fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import { ListContainer } from "components/ListContainer";
import ListButton from "components/ListButton";

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
      <ListContainer title="Felhasználó büféi" error={error}>
        {bufeInfos.map((bufe) => (
          <ListButton
            key={bufe.bufeId}
            title={bufe.bufeNev}
            onClick={() => selectBufe(bufe)}
          />
        ))}
      </ListContainer>
    </PageContainer>
  );
}