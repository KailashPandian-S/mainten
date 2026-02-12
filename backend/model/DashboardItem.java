package com.project.mainten.model;

public class DashboardItem {

    private Integer dashboardItemId;
    private String dashboardItemName;
    private Integer quantity;
    private String addedDate;

    public DashboardItem(Integer id, String name, Integer q, String date) {
        this.dashboardItemId = id;
        this.dashboardItemName = name;
        this.quantity = q;
        this.addedDate = date;
    }

    public DashboardItem(){}

    public Integer getDashboardItemId() {
        return this.dashboardItemId;
    }

    public String getDashboardItemName() {
        return this.dashboardItemName;
    }

    public Integer getQuantity() {
        return this.quantity;
    }

    public String getAddedDate() {
        return this.addedDate;
    }

    public void setDashboardItemId(Integer id) {
        this.dashboardItemId = id;
    }

    public void setDashboardItemName(String name) {
        this.dashboardItemName = name;
    }

    public void setQuantity(Integer q) {
        this.quantity = q;
    }

    public void setAddedDate(String date) {
        this.addedDate = date;
    }

}
