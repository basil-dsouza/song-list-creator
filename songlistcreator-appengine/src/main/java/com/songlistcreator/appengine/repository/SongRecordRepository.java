package com.songlistcreator.appengine.repository;

import com.google.cloud.spring.data.datastore.repository.DatastoreRepository;
import com.songlistcreator.appengine.domain.SongRecord;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SongRecordRepository extends DatastoreRepository<SongRecord, Long> {
    List<SongRecord> findByUserId(String userId);

    List<SongRecord> findByUserIdAndTitle(String userId, String title);

    List<SongRecord> findByUserIdAndArtist(String userId, String artist);

    // Datastore doesn't support easy "contains" on list without custom index config
    // or ancestor queries sometimes,
    // but basic equality on list property means "list contains value".
    List<SongRecord> findByUserIdAndTags(String userId, String tag);
}
