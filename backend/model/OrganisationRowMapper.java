package com.project.mainten.model;
import org.springframework.jdbc.core.RowMapper;
import  java.sql.SQLException;
import  java.sql.ResultSet;

public class OrganisationRowMapper implements RowMapper<Organisation>{

    @Override
    public Organisation mapRow(ResultSet rs,int rowId) throws SQLException{
        return new Organisation(
                rs.getString("orgMailId"),
                rs.getString("orgPass")
        );
    }



}
