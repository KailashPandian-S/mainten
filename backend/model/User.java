package com.project.mainten.model;

public class User {
    private String userMailId;
    private String userPass;
    private String userType;
    private String userOrg;

    public User(String mId, String pass, String type, String org) {
        this.userMailId = mId;
        this.userPass = pass;
        this.userType = type;
        this.userOrg = org;
    }
    public User() {

    }


    public String getUserMailId() {
        return this.userMailId;
    }

    public String getUserPass() {
        return this.userPass;
    }

    public String getUserType() {
        return this.userType;
    }

    public String getUserOrg() {
        return this.userOrg;
    }

    public void setUserMailId(String id) {
        this.userMailId = id;
    }

    public void setUserPass(String pass) {
        this.userPass = pass;
    }

    public void setUserType(String type) {
        this.userType = type;
    }

    public void setUserOrg(String org) {
        this.userOrg = org;
    }

}
