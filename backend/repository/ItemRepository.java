package com.project.mainten.repository;

import com.project.mainten.model.Item;
import com.project.mainten.model.DashboardItem;
import java.util.*;

public interface ItemRepository {

    ArrayList<Item> getAllItems(String orgId);
    String addItem(String orgId,Item item);
    ArrayList<DashboardItem> getAllDashboardItems(String orgId,String userId);
    ArrayList<DashboardItem> getAllOrgDashboardItems(String orgId);
    String clearOrgDashboard(String orgId);
    String addDashboardItem(String orgId,String userId,DashboardItem item);
    ArrayList<Item> getRequest(String orgId);
    String addRequest(String orgId,Item item);
    String deleteRequest(String orgId,Item item);
    byte[] estimatePdf(String orgId);


}
