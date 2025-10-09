import { useState, useEffect } from "react";
import NevEsEgyenleg from "../components/NevEsEgyenleg";
import "./../styles/Pages.css";
import { BufeInfo, ErrorResponse, LeltarRequest, LeltarTermekMennyiseg, LoginResponse, TermekMennyiseg, TermekMennyisegResponse } from "../types";
import { fetchJson, fetchVoid } from "utils/http";
import { useNavigate } from "react-router-dom";

interface Props {
  loginResponse: LoginResponse;
  selectedBufe: BufeInfo;
  onLogout: () => void;
}
export default function Leltar({ loginResponse, selectedBufe, onLogout }:Props) {
  const [loading, setLoading] = useState<boolean>(true);
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [termekMennyiseg, setTermekMennyiseg] = useState<TermekMennyiseg[]>([]);
  const [error, setError] = useState<string|null>(null);
  const [saveEnabled, setSaveEnabled] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermekMennyiseg = async () => {
      try {
        setLoading(true);   
        const data: TermekMennyisegResponse =
              await fetchJson<TermekMennyisegResponse>( "/api/forgalom/listmennyiseg",
                    { method: "POST", credentials: "include" } );
        setError(null);
        setTermekMennyiseg(data.termekek);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchTermekMennyiseg();
  }, [selectedBufe.bufeUsrId, forceRefresh, onLogout]);

  useEffect(() => {
    setSaveEnabled(termekMennyiseg.some(tm => tm.mennyiseg!==tm.talaltMennyiseg));
  }, [termekMennyiseg]);

  const saveLeltar = async () => {
    try {
      setLoading(true);
      const termekek: LeltarTermekMennyiseg[] = termekMennyiseg
          .filter( tm=>tm.mennyiseg!==tm.talaltMennyiseg )
          .map( tm=> ({
            termekId: tm.termekId, talaltMennyiseg:tm.talaltMennyiseg
          }));
      const req: LeltarRequest = { termekek:termekek };
      await fetchVoid( "/api/forgalom/leltar", { method: "POST", credentials: "include",
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

  const talaltMennyisegChanged = (termekId: number, value: number) => {
    setTermekMennyiseg(prev =>
      prev.map(tm =>
        tm.termekId === termekId ? { ...tm, talaltMennyiseg: value } : tm
      )
    );
  };

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      <NevEsEgyenleg loginResponse={loginResponse} selectedBufe={selectedBufe} msgEnd="Termékek:" forceRefresh={forceRefresh} />
      {error &&<p className="page-error">{error}</p>}
      <ul className="page-list">
        <li key={-1}>
          <button className="page-list-button blue-button" onClick={() => navigate("/menu")}>Menü</button>
        </li>
        <li key={-1}>
          <button className="page-list-button blue-button" disabled={!saveEnabled} onClick={() => saveLeltar()}>Leltár könyvelése</button>
        </li>
        {!loading&&termekMennyiseg.map((tm) => (
          <li key={tm.termekId} className="page-list-complex-item">
            <span className="flex-grow text-left">
              {tm.nev}
            </span>
            <input type="number" min="0" max="99999" step={1} disabled={true}
              value={""+tm.mennyiseg} className="w-20 border rounded px-2 py-1 text-right"/>
            <input type="number" min="0" max="99999" step={1}
              value={""+tm.talaltMennyiseg} className="w-20 border rounded px-2 py-1 text-right"
              onChange={(e) => talaltMennyisegChanged(tm.termekId, Number(e.target.value))}/>
          </li>
        ))}
      </ul>
    </div>
  );
}