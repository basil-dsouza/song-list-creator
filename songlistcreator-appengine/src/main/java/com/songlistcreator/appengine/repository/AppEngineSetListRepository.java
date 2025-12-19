package com.songlistcreator.appengine.repository;

import com.songlistcreator.appengine.domain.SetListRecord;
import com.songlistcreator.core.setlist.SetList;
import com.songlistcreator.core.setlist.SetListRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Repository
@Profile("gcp")
@RequiredArgsConstructor
public class AppEngineSetListRepository implements SetListRepository {

    private final SetListRecordRepository setListRecordRepository;

    @Override
    public SetList save(SetList setList) {
        SetListRecord record = SetListRecord.fromDomain(setList);
        return setListRecordRepository.save(record).toDomain();
    }

    @Override
    public Optional<SetList> findById(Long id) {
        return setListRecordRepository.findById(id).map(SetListRecord::toDomain);
    }

    @Override
    public void deleteById(Long id) {
        setListRecordRepository.deleteById(id);
    }

    @Override
    public List<SetList> findByUserId(String userId) {
        return setListRecordRepository.findByUserId(userId).stream()
                .map(SetListRecord::toDomain)
                .collect(Collectors.toList());
    }
}
