package com.songlistcreator.appengine.domain;

import com.google.cloud.spring.data.datastore.core.mapping.Entity;
import com.songlistcreator.core.setlist.SetList;
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

    public SetList toDomain() {
        return SetList.builder()
                .id(this.id)
                .userId(this.userId)
                .name(this.name)
                .songIds(this.songIds)
                .build();
    }

    public static SetListRecord fromDomain(SetList setList) {
        return SetListRecord.builder()
                .id(setList.getId())
                .userId(setList.getUserId())
                .name(setList.getName())
                .songIds(setList.getSongIds())
                .build();
    }
}
