import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./../../styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BufeUsrAddRequest, BufeUsrRelationResponse, BufeUsrSetActiveRequest, ErrorResponse } from "../../types";
import { fetchJson, fetchVoid } from "utils/http";
import { KEY_LIST_USR_BUFE_ACTIVE } from "../../constants";

interface Props {
  onLogout: () => void;
}
export default function ListUsrBufe({ onLogout }:Props) {
  const { usrId } = useParams<{ usrId: string }>();
  const [showActive, setShowActive] = useState<boolean>(() => {
    const saved = localStorage.getItem( KEY_LIST_USR_BUFE_ACTIVE );
    return saved==="1";
  });
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [usrBufeRelations, setUsrBufeRelations] = useState<BufeUsrRelationResponse>({relations:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem( KEY_LIST_USR_BUFE_ACTIVE, showActive ? "1" : "0" );
  }, [ showActive ]);
  useEffect(() => {
    const fetchBufes = async () => {
      try {
        setLoading(true);
        const data: BufeUsrRelationResponse = 
              await fetchJson<BufeUsrRelationResponse>( `/api/usr/${usrId}/bufes`, { method: "POST", credentials: "include" } );
        setError(null);
        setUsrBufeRelations(data);
        console.log( data );
        setLoading(false);
      } catch (err) {
        const error = err as ErrorResponse;
        setError( error.message );
        if( error.error==="UNAUTHORIZED" )
          onLogout();
      } finally {
        setLoading(false);
      }
    };
    fetchBufes();
  }, [forceRefresh, usrId, onLogout]);

  const addToBufe = async ( bufeId: number ) => {
    try {
      setLoading(true);
      const req: BufeUsrAddRequest = {bufeId:bufeId, usrId:Number(usrId)};
      await fetchVoid( "/api/bufeusr/addtobufe",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( req ) } );
      setForceRefresh( forceRefresh+1 );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  }
  const setActive = async( bufeUsrId:number, aktiv:boolean ) => {
    try {
      setLoading(true);
      const req: BufeUsrSetActiveRequest = {bufeUsrId:bufeUsrId, active:aktiv};
      await fetchVoid( "/api/bufeusr/setactive",
        { method: "POST", credentials: "include", headers: { "Content-Type": "application/json" }, body: JSON.stringify( req ) } );
      setForceRefresh( forceRefresh+1 );
    } catch (err) {
      const error = err as ErrorResponse;
      setError( error.message );
      if( error.error==="UNAUTHORIZED" )
        onLogout();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page-container">
      {loading && (
        <div className="overlay">
          <div className="spinner"></div>
        </div>
      )}
      {error &&<p className="page-error">{error}</p>}
      {!error &&<div className="page-header page-center">
        <label>
          <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
          &nbsp;Felhasználói kapcsolat aktív
        </label>
      </div>}
      {!error &&<ul className="page-list">
        <li key={-1}>
          <button className="page-list-button blue-button" onClick={() => navigate("/menu")}>Menü</button>
        </li>
        {usrBufeRelations.relations.map((relation) => {
          let labelButton: JSX.Element | null = null;
          let iconButton: JSX.Element | null = null;
          if( showActive ) {
            console.log( "sha");
            if( relation.bufeUsrId!=null && relation.bufeUsrActive ) {
            console.log( "sha if");
              const bufeUsrId:number=relation.bufeUsrId;
              labelButton=
                <button className="page-list-complex-button"
                  onClick={() =>{navigate("/admin/bufeuser/"+relation.bufeUsrId);}}>{relation.bufeName}</button>;
              iconButton=
                <button className="page-list-complex-iconbutton"
                  onClick={() => {setActive( bufeUsrId, false );}}>
                  <TrashIcon className="red-icon"/>
                </button>;
            }
          } else {
            console.log( "else");
            if( relation.bufeUsrId==null || !relation.bufeUsrActive ) {
            console.log( "else if");
              labelButton=
                <button className="page-list-complex-button" disabled={true}>{relation.bufeName}</button>;
              if( relation.bufeUsrId==null ) {
                iconButton=
                  <button className="page-list-complex-iconbutton"
                    onClick={()=>{addToBufe( relation.bufeId );}}>
                    <PlusIcon className="green-icon" />
                  </button>;
              } else {
                const bufeUsrId:number=relation.bufeUsrId;
                iconButton=
                  <button className="page-list-complex-iconbutton"
                    onClick={()=>{setActive( bufeUsrId, true );}}>
                    <CheckIcon className="green-icon" />
                  </button>;               
              }
            }
          }
          return (
            labelButton&&
            <li key={relation.bufeId} className="page-list-complex-item">
              {labelButton}
              {iconButton}
            </li>
          );
        })}
      </ul>}
    </div>
  );
}