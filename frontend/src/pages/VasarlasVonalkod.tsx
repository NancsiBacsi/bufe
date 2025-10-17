import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NevEsEgyenleg from "components/NevEsEgyenleg";
import BarcodeScanner from "components/BarcodeScanner";
import "styles/Pages.css";
import { BufeInfo, ErrorResponse, LoginResponse } from "types";
import { fetchVoid } from "utils/http";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  clearSession: () => void;
}
export default function VasarlasVonalkod({ loginResponse, selectedBufe, clearSession: onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage ]= useState<string>("");
  const [error, setError ]= useState<string|null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(true);
  const navigate = useNavigate();

  const vasarlasByVonalkod = async (vonalkod: string) => {
    try {
      setLoading(true);
      await fetchVoid( `/api/forgalom/vasarlasbyvonalkod/${vonalkod}`, { method: "POST", credentials: "include" } );
      navigate("/vasarlasnaplo");
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
      setIsScanning(true);
    }
  };
  const handleScan = (code: string) => {
    setIsScanning( false );
    setMessage( "Vonalkód: " + code );
    vasarlasByVonalkod( code );
  };

  return (
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <NevEsEgyenleg
        loginResponse={loginResponse}
        showEgyenleg={true}
        selectedBufe={selectedBufe}
        msgEnd="A zöld négyzetbe bűvészkedd be a vonalkódot, vízszintesen. A négyzetet (+)/(-)al méretezheted. Ha nem megy, nem te vagy az ügyetlen, hanem a vonalkód olvasó komponens az olcsó - használd a vásárlás menüpontot, ahol listából választhatsz."
      />
      <ErrorLine error={error}/>
      {!error && message && <p >{message}</p>}
      <BarcodeScanner
        onScan={handleScan}
        active={isScanning}
      />
   </PageContainer>
  )
}
