import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BufeUsrAddRequest, BufeUsrSetActiveRequest, ErrorResponse, UsrBufeRelationResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { KEY_LIST_BUFE_USR_ACTIVE } from "./../../constants";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import ErrorLine from "components/ErrorLine";

interface Props {
  clearSession: () => void;
}
export default function ListBufeUsr({ clearSession: onLogout }:Props) {
  const { bufeId } = useParams<{ bufeId: string }>();
  const [showActive, setShowActive] = useState<boolean>(() => {
    const saved = localStorage.getItem( KEY_LIST_BUFE_USR_ACTIVE );
    return saved==="1";
  });
  const [forceRefresh, setForceRefresh] = useState<number>(0);
  const [usrBufeRelations, setUsrBufeRelations] = useState<UsrBufeRelationResponse>({relations:[]});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string|null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem( KEY_LIST_BUFE_USR_ACTIVE, showActive ? "1" : "0" );
  }, [ showActive ]);
  useEffect(() => {
    const fetchUsrs = async () => {
      try {
        setLoading(true);
        const data: UsrBufeRelationResponse = 
              await fetchJson<UsrBufeRelationResponse>( `/api/bufe/${bufeId}/usrs`, { method: "POST", credentials: "include" } );
        setError(null);
        setUsrBufeRelations(data);
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
    fetchUsrs();
  }, [forceRefresh, bufeId, onLogout]);

  const addToBufe = async ( usrId: number ) => {
    try {
      setLoading(true);
      const req: BufeUsrAddRequest = {bufeId:Number(bufeId), usrId:usrId};
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
    <PageContainer>
      <LoadingOverlay loading={loading}/>
      <ErrorLine error={error}/>
      {!error &&<div className="page-header text-center">
        <label>
          <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
          &nbsp;Büfé kapcsolat aktív
        </label>
      </div>}
      {!error &&<ul className="page-list">
        {usrBufeRelations.relations.map((relation) => {
          let labelButton: JSX.Element | null = null;
          let iconButton: JSX.Element | null = null;
          if( showActive ) {
            if( relation.bufeUsrId!=null && relation.bufeUsrActive ) {
              const bufeUsrId:number=relation.bufeUsrId;
              labelButton=
                <button className="page-list-complex-button"
                  onClick={() =>{navigate("/admin/bufeuser/"+relation.bufeUsrId);}}>{relation.usrName}</button>;
              iconButton=
                <button className="page-list-complex-iconbutton"
                  onClick={() => {setActive( bufeUsrId, false );}}>
                  <TrashIcon className="red-icon"/>
                </button>;
            }
          } else {
            if( relation.bufeUsrId==null || !relation.bufeUsrActive ) {
              labelButton=
                <button className="page-list-complex-button" disabled={true}>{relation.usrName}</button>;
              if( relation.bufeUsrId==null ) {
                iconButton=
                  <button className="page-list-complex-iconbutton"
                    onClick={()=>{addToBufe( relation.usrId );}}>
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
            <li key={relation.usrId} className="page-list-complex-item">
              {labelButton}
              {iconButton}
            </li>
          );
        })}
      </ul>}
    </PageContainer>
  );
}