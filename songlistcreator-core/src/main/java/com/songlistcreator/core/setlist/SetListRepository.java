package com.songlistcreator.core.setlist;

import com.songlistcreator.core.setlist.SetList;
import java.util.List;
import java.util.Optional;

public interface SetListRepository {
    SetList save(SetList setList);

    Optional<SetList> findById(Long id);

    void deleteById(Long id);

    List<SetList> findByUserId(String userId);
}
