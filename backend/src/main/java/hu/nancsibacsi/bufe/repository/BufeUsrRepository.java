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
}