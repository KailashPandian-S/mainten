package com.project.mainten.service;

import com.project.mainten.model.Organisation;
import com.project.mainten.repository.AuthenticationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import com.project.mainten.model.User;
import com.project.mainten.model.UserRowMapper;
import com.project.mainten.model.OrganisationRowMapper;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService implements AuthenticationRepository{

    @Autowired
    private JdbcTemplate db;

  public Organisation getOrganisationFromDb(Organisation expected){
      try{
          Organisation org = db.queryForObject("SELECT * FROM org_details WHERE orgMailId = ?",new OrganisationRowMapper(),expected.getOrgMailId());
          return org;
      }
      catch(Exception e){
          return null;
      }

  }

  public User getUserFromDb(User expected){
      try{
          User u = db.queryForObject("SELECT u.userMailId,u.userPass,u.userType,o.orgId FROM user_details u LEFT JOIN user_org o ON  u.userMailId = o.userId WHERE u.userMailId = ?",new UserRowMapper(),expected.getUserMailId());
          return u;
      }
      catch(Exception e){
//          System.out.print("null returns from syntax error");
          return null;
      }
  }

  @Override
  public String loginOrganisation(Organisation org){
       Organisation fetched = getOrganisationFromDb(org);
       if(fetched == null) return "Failiure";
       if(!(fetched.getOrgPass()).equals(org.getOrgPass())) return "Password mismatch";
       return "Success";
  }

  @Override
    public String registerOrganisation(Organisation org){
      Organisation ex = getOrganisationFromDb(org);
      if(ex != null) return "Failiure";
      db.update("INSERT INTO org_details(orgMailId,orgPass) VALUES(?,?)",org.getOrgMailId(),org.getOrgPass());
      return "Success";
  }

  @Override
    public String loginUser(User user){
      User fetched = getUserFromDb(user);
      if(fetched == null) return "Failiure";
      if(!user.getUserType().equals(fetched.getUserType())) return "Failiure";
      if(!(fetched.getUserPass()).equals(user.getUserPass())) return "Password mismatch";
      return "Success";
  }

  @Override
    public String registerUser(User user){
      User ex = getUserFromDb(user);
      if(ex != null) return "Failiure";
      db.update("INSERT INTO user_details(userMailId,userPass,userType) VALUES (?,?,?)",user.getUserMailId(),user.getUserPass(),user.getUserType());
      db.update("INSERT INTO user_org(userId,orgId) VALUES(?,?)",user.getUserMailId(),user.getUserOrg());
      return "Success";
  }


}
