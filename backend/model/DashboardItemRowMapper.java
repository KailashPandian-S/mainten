package com.project.mainten.model;
import org.springframework.jdbc.core.RowMapper;
import java.sql.SQLException;
import java.sql.ResultSet;

public class DashboardItemRowMapper implements RowMapper<DashboardItem> {

    @Override
    public DashboardItem mapRow(ResultSet rs,int rowId) throws SQLException{
        System.out.print("inside row mapper");
        return new DashboardItem(
                rs.getInt("dashboardItemId"),
                rs.getString("dashboardItemName"),
                rs.getInt("quantity"),
                rs.getString("addedDate")
        );
    }

}
