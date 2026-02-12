package com.project.mainten.model;

import org.springframework.jdbc.core.RowMapper;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.util.Locale;

public class ItemRowMapper implements RowMapper<Item>{
    @Override
    public Item mapRow(ResultSet rs, int rowId) throws SQLException{



        return new Item(
                rs.getInt("itemId"),
                rs.getString("itemName"),
                rs.getString("itemAddedDate"),
                rs.getString("orgId"));

    }


}
