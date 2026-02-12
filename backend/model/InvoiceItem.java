package com.project.mainten.model;

public class InvoiceItem {
    private String itemName;
    private String itemPrice;
    private String platform;
    private String availableStockQuantity;
    private String totalPrice;
    public InvoiceItem(String itemName,String itemPrice,String platform,String availableStockQuantity,String totalPrice){
        this.itemName = itemName;
        this.itemPrice = itemPrice;
        this.platform = platform;
        this.availableStockQuantity = availableStockQuantity;
        this.totalPrice = totalPrice;
    }

    public String getItemName(){
        return this.itemName;
    }

    public String getItemPrice(){
        return this.itemPrice;
    }

    public String getPlatform(){
        return this.platform;
    }

    public String getAvailableStockQuantity(){
        return this.availableStockQuantity;
    }

    public String getTotalPrice(){
        return this.totalPrice;
    }


}
