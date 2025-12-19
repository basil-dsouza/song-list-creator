package com.songlistcreator.appengine.domain;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.songlistcreator.core.setlist.SetList;
import com.songlistcreator.core.setlist.SetListEntry;
import java.util.ArrayList;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;

import java.util.List;

@Entity(name = "setlists")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetListRecord {

    @Id
    private Long id;
    private String userId;
    private String name;
    private List<Long> songIds;
    private List<Integer> transpositions;

    public SetList toDomain() {
        List<SetListEntry> songs = new ArrayList<>();
        if (songIds != null) {
            for (int i = 0; i < songIds.size(); i++) {
                int transposition = 0;
                if (transpositions != null && i < transpositions.size()) {
                    transposition = transpositions.get(i);
                }
                songs.add(new SetListEntry(songIds.get(i), transposition));
            }
        }

        return SetList.builder()
                .id(this.id)
                .userId(this.userId)
                .name(this.name)
                .songs(songs)
                .build();
    }

    public static SetListRecord fromDomain(SetList setList) {
        List<Long> ids = new ArrayList<>();
        List<Integer> trans = new ArrayList<>();

        if (setList.getSongs() != null) {
            for (SetListEntry entry : setList.getSongs()) {
                ids.add(entry.getSongId());
                trans.add(entry.getTransposition());
            }
        }

        return SetListRecord.builder()
                .id(setList.getId())
                .userId(setList.getUserId())
                .name(setList.getName())
                .songIds(ids)
                .transpositions(trans)
                .build();
    }
}
