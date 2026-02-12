package com.project.mainten.repository;

import com.project.mainten.model.*;


public interface AuthenticationRepository {

    String loginOrganisation(Organisation org);
    String registerOrganisation(Organisation org);
    String loginUser(User user);
    String registerUser(User user);


}
