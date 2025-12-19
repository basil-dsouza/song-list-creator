package com.songlistcreator.core.setlist;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SetList {
    private Long id;
    private String userId; // Owner
    private String name;
    private List<Long> songIds;
}
