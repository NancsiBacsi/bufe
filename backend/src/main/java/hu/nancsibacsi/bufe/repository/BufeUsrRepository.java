package hu.nancsibacsi.bufe.repository;

import hu.nancsibacsi.bufe.model.BufeUsr;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BufeUsrRepository extends JpaRepository<BufeUsr, Integer> {
	@Query( value = """
SELECT COALESCE(SUM(usr_valtozas), 0)
FROM bufe_forgalom
WHERE bufe_usr_id = :bufeUsrId""",
			nativeQuery = true )
	Integer getEgyenleg(@Param("bufeUsrId") Integer bufeUsrId);
	
	@Query(	"SELECT bu FROM BufeUsr bu " +
			"JOIN FETCH bu.bufe b " +
			"WHERE bu.usr.id = :usrId AND bu.aktiv = true")
	List<BufeUsr> findByUsrIdWithBufe(@Param("usrId") Integer usrId);
	
	Optional<BufeUsr> findByBufeIdAndUsrId(Integer bufeId, Integer usrId);
	
	Optional<BufeUsr> findById(Integer id);

	@Query(value = """
select u.id u_id, u.nev u_nev, bu.id bu_id, coalesce( bu.aktiv, '0' ) bu_aktiv
from usr u
left outer join bufe_usr bu on u.id=bu.usr_id and bu.bufe_id=:bufeId
where u.aktiv='1'
order by u.nev
""", nativeQuery = true )
	List<Object[]> findUsrBufeUsrRelations(@Param("bufeId") Integer bufeId);

	@Query(value = """
select * from (
  select u.id u_id, u.nev u_nev, bu.id bu_id, bu.aktiv bu_aktiv
  from usr u
  inner join bufe_usr bu on u.id=bu.usr_id and bu.bufe_id=:bufeId and u.aktiv='1'
  union
  select u.id u_id, u.nev u_nev, null bu_id, '0' bu_aktiv
  from usr u
  left outer join bufe_usr bu on u.id=bu.usr_id
  where u.aktiv='1' and bu.id is null
)
order by u_nev
""", nativeQuery = true )
	List<Object[]> findUsrBufeUsrRelationsDemo(@Param("bufeId") Integer bufeId);

	@Query(value = """
select b.id b_id, b.nev b_nev, bu.id bu_id, coalesce( bu.aktiv, '0' ) bu_aktiv
from bufe b
left outer join bufe_usr bu on b.id=bu.bufe_id and bu.usr_id=:usrId
where b.aktiv='1'
order by b.nev
""", nativeQuery = true )
	List<Object[]> findBufeBufeUsrRelations(@Param("usrId") Integer usrId);
	
	@Query(value = """
select bu.id, u.nev, coalesce( sum( bf.usr_valtozas ), 0 ) egyenleg
from usr u
inner join bufe_usr bu on u.id=bu.usr_id and bu.bufe_id=:bufeId and u.aktiv='1' and bu.aktiv='1'
left outer join bufe_forgalom bf on bf.bufe_usr_id=bu.id
group by bu.id, u.nev
order by u.nev
""", nativeQuery = true )
	List<Object[]> findBufeBufeEgyenleg(@Param("bufeId") Integer bufeId);
}