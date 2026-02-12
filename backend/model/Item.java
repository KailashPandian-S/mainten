package com.project.mainten.model;

public class Item {

    private Integer itemId;
    private String itemName;
    private String addedDate;
    private String orgId;

    public Item(Integer id, String name, String dt,String orgId) {
        this.itemId = id;
        this.itemName = name;
        this.addedDate = dt;
        this.orgId = orgId;
    }

    public Item(){}

    public int getItemId() {
        return this.itemId;
    }

    public String getItemName() {
        return this.itemName;
    }

    public String getAddedDate() {
        return this.addedDate;
    }

    public String getOrgId(){
        return this.orgId;
    }

    public void setItemId(Integer id) {
        this.itemId = id;
    }

    public void setItemName(String name) {
        this.itemName = name;
    }

    public void setAddedDate(String date) {
        this.addedDate = date;
    }

    public void setOrgId(String orgId) {
        this.orgId = orgId;
    }


}
