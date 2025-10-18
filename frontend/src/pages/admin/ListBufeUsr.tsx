import { useState, useEffect, JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "styles/Pages.css";
import { TrashIcon,  CheckIcon, PlusIcon } from "@heroicons/react/24/solid";
import { BufeUsrAddRequest, BufeUsrSetActiveRequest, ErrorResponse, UsrBufeRelationResponse } from "types";
import { fetchJson, fetchVoid } from "utils/http";
import { KEY_LIST_BUFE_USR_ACTIVE } from "./../../constants";
import { PageContainer } from "components/PageContainer";
import LoadingOverlay from "components/LoadingOverlay";
import { ListContainer } from "components/ListContainer";
import { ListComplexButtonContainer } from "components/ListComplexButtonContainer";
import ListButton from "components/ListButton";
import IconButton from "components/IconButton";

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
      {!error &&
        <ListContainer
          error={error}
          title="Büfé felhasznállók"
          beforeList={!error &&
            <div className="page-header text-center">
              <label>
                <input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)}/>
                &nbsp;Büfé kapcsolat aktív
              </label>
            </div>
          }
        >
          {usrBufeRelations.relations.map((relation) => {
            let labelButton: JSX.Element | null = null;
            let iconButton: JSX.Element | null = null;
            if( showActive ) {
              if( relation.bufeUsrId!=null && relation.bufeUsrActive ) {
                const bufeUsrId:number=relation.bufeUsrId;
                labelButton=
                  <ListButton
                    key={1}
                    title={relation.usrName}
                    onClick={() =>{navigate(`/admin/bufeuser/${relation.bufeUsrId}`);}}
                  />
                iconButton=
                  <IconButton 
                      key={2}
                      icon={
                        <TrashIcon className="w-5 h-5 red-600"/>
                      }
                      onClick={() => {setActive( bufeUsrId, false );}}
                      title="Törlés"
                    />
              }
            } else {
              if( relation.bufeUsrId==null || !relation.bufeUsrActive ) {
                labelButton=
                  <ListButton
                    key={3}
                    disabled={true}
                    title={relation.usrName}
                  />;
                if( relation.bufeUsrId==null ) {
                  iconButton=
                    <IconButton
                      key={4}
                      icon={
                        <PlusIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{addToBufe( relation.usrId );}}
                      title="Hozzáadás"
                    />;
                } else {
                  const bufeUsrId:number=relation.bufeUsrId;
                  iconButton=
                    <IconButton
                      key={5}
                      icon={
                        <CheckIcon className="w-5 h-5 green-600"/>
                      }
                      onClick={()=>{setActive( bufeUsrId, true );}}
                      title="Reaktiválás"
                    />;
                }
              }
            }
            return (
              labelButton&&
                <ListComplexButtonContainer key={relation.usrId}>
                  {labelButton}
                  {iconButton}
                </ListComplexButtonContainer>
            );
          })}
        </ListContainer>
      }
      </PageContainer>
  );
}