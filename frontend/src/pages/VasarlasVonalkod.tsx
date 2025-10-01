import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import BarcodeScanner from "../components/BarcodeScanner";
import "./../styles/Pages.css";
import { BufeInfo, ErrorResponse, LoginResponse } from "./../types";
import { fetchVoid } from "utils/http";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  onLogout: () => void;
}
export default function VasarlasVonalkod({ loginResponse, selectedBufe, onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [message, setMessage ]= useState<string>("Olvasson be egy vonalkódot...");
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
    console.log( "handleScan: " + code );
    setIsScanning( false );
    setMessage( "Vonalkód: " + code );
    vasarlasByVonalkod( code );
  };

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="A zöld négyzetet (+)/(-)al méretezheted. Csak a vonalkód legyen a zöld nézetben, és a vonalak függőlegesek legyenek!" forceRefresh={0}/>
      {error &&<p className="page-error">{error}</p>}
      {!error &&<p >{message}</p>}
      <BarcodeScanner onScan={handleScan} active={isScanning} />
   </div>
  )
}
