
package com.project.mainten.model;
import org.springframework.jdbc.core.RowMapper;
import  java.sql.SQLException;
import  java.sql.ResultSet;

public class UserRowMapper implements RowMapper<User>{

    @Override
    public User mapRow(ResultSet rs,int rowId) throws SQLException{
        return new User(
                rs.getString("userMailId"),
                rs.getString("userPass"),
                rs.getString("userType"),
                rs.getString("orgId")
        );
    }



}