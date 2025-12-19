package com.songlistcreator.appengine.repository;

import com.songlistcreator.core.setlist.SetList;
import com.songlistcreator.core.setlist.SetListRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Repository;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Repository
@Profile("local")
public class InMemorySetListRepository implements SetListRepository {

    private final Map<Long, SetList> store = new ConcurrentHashMap<>();
    private final AtomicLong idGenerator = new AtomicLong(1);

    @Override
    public SetList save(SetList setList) {
        if (setList.getId() == null) {
            setList.setId(idGenerator.getAndIncrement());
        }
        store.put(setList.getId(), setList);
        return setList;
    }

    @Override
    public Optional<SetList> findById(Long id) {
        return Optional.ofNullable(store.get(id));
    }

    @Override
    public void deleteById(Long id) {
        store.remove(id);
    }

    @Override
    public List<SetList> findByUserId(String userId) {
        return store.values().stream()
                .filter(sl -> Objects.equals(sl.getUserId(), userId))
                .collect(Collectors.toList());
    }
}
