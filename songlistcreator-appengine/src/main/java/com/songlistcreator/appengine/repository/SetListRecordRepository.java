package com.songlistcreator.appengine.repository;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.songlistcreator.appengine.domain.SetListRecord;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SetListRecordRepository extends DatastoreRepository<SetListRecord, Long> {
    List<SetListRecord> findByUserId(String userId);
}
