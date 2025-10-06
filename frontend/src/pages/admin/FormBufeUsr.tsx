import { useState, useEffect, FormEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../styles/Pages.css";
import { BufeUsr, ErrorResponse } from "../../types";
import { fetchJson, fetchVoid } from "utils/http";

interface Props {
  onLogout: () => void;
}
export default function FormBufeUsr({ onLogout }:Props ) {
  const { bufeUsrId } = useParams<{ bufeUsrId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string|null>(null);
  const [bufeUsr, setBufeUsr ] = useState<BufeUsr>({id:-1,aktiv:true,bufe:{id:-1,aktiv:true,nev:""},hitelKeret:0,minusArres:20,plusArres:10,penztaros:false,usr:{id:-1,admin:false,aktiv:true,bufeUsrs:[],email:"",jelszo:"",nev:"",teljesNev:""}});

  useEffect(() => {
    const fetchBufeUsr = async () => {
      if(bufeUsrId!=="-1") {
        try {
          setLoading(true);   
          const data: BufeUsr = 
              await fetchJson<BufeUsr>( `/api/bufeusr/${bufeUsrId}`, { method: "POST", credentials: "include" } );
          setError(null);
          setBufeUsr(data);
          setLoading(false);
        } catch (err) {
          const error = err as ErrorResponse;
          setError( error.message );
          if( error.error==="UNAUTHORIZED" )
            onLogout();
        } finally {
          setLoading(false);
        }
      }
    };
    fetchBufeUsr();
  }, [bufeUsrId, onLogout]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLoading(true);
      await fetchVoid( "/api/bufeusr/save",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify(bufeUsr) });
      setError(null);
      navigate(`/admin/bufe/${bufeUsr.bufe.id}/user`);
    } catch (err) {
      const error = err as ErrorResponse;
      setError(error.message);
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
      <h2 className="page-title">Büfé felhasználó szerkesztése</h2>
      {error && <p className="page-error">{error}</p>}
      <form className="page-form" onSubmit={handleSubmit}>
        <label htmlFor="nev">Hitelkeret</label>
        <input id="nev" type="number" min="0" step="1" placeholder="Hitelkeret"
          value={bufeUsr.hitelKeret}  onChange={(e) => setBufeUsr({ ...bufeUsr, hitelKeret:Number(e.target.value) })} required
        />
        <label htmlFor="plusArres">Pozitív árrés</label>
        <input id="plusArres" type="number" min="0" step="1" placeholder="Pozitív árrés"
          value={bufeUsr.plusArres}  onChange={(e) => setBufeUsr({ ...bufeUsr, plusArres:Number(e.target.value) })} required
        />
        <label htmlFor="minusArres">Negatív árrés</label>
        <input id="minusArres" type="number" min="0" step="1" placeholder="Negatív árrés"
          value={bufeUsr.minusArres}  onChange={(e) => setBufeUsr({ ...bufeUsr, minusArres:Number(e.target.value) })} required
        />
        <label htmlFor="penztaros" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <input id="penztaros" type="checkbox"
            checked={bufeUsr.penztaros} onChange={(e) => setBufeUsr({ ...bufeUsr, penztaros: e.target.checked })}/>
          Pénztáros
        </label>   
        <button type="submit">Mentés</button>
      </form>
    </div>
  );
}