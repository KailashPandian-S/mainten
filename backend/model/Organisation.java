package com.project.mainten.model;

public class Organisation {
    private String orgMailId;
    private String orgPass;

    public Organisation(String mId, String pass) {
        this.orgMailId = mId;
        this.orgPass = pass;
    }

    public Organisation(){
    }

    public String getOrgMailId() {
        return this.orgMailId;
    }

    public String getOrgPass() {
        return this.orgPass;
    }

    public void setOrgMailId(String mId) {
        this.orgMailId = mId;
    }

    public void setOrgPass(String pass) {
        this.orgPass = pass;
    }

}
