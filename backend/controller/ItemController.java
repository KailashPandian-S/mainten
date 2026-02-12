package com.project.mainten.controller;

import java.io.IOException;
import java.util.*;
import org.springframework.web.bind.annotation.*;
import com.project.mainten.model.Item;
import com.project.mainten.model.DashboardItem;
import com.project.mainten.service.ItemService;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.ArrayList;

@CrossOrigin(origins = "*")
@RestController
public class ItemController {

    @Autowired
    public ItemService s;

    @GetMapping("/items")
    public ArrayList<Item> getAllItems(@RequestParam("orgId") String orgId){
        return s.getAllItems(orgId);
    }

    @PostMapping("/items")
    public String addItem(@RequestParam("orgId") String orgId,@RequestBody Item item){
//        System.out.print(item.getItemId()  + " " + item.getItemName() + " " + item.getAddedDate() + " " + item.getOrgId());
        return s.addItem(orgId,item);
    }

    @GetMapping("/dashboard")
    public ArrayList<DashboardItem> getAllDashboardItems(@RequestParam("orgId") String orgId,@RequestParam("userId") String userId){
        System.out.print("dashboardItem get");
        return s.getAllDashboardItems(orgId,userId);
    }

    @GetMapping("/dashboard/org")
    public ArrayList<DashboardItem> getAllOrgDashboardItems(@RequestParam("orgId") String orgId){
        return s.getAllOrgDashboardItems(orgId);
    }

    @DeleteMapping("/dashboard/org")
    public String clearOrgDashboard(@RequestParam("orgId") String orgId){
        return s.clearOrgDashboard(orgId);
    }

    @PostMapping("/dashboard")
    public String addDashboardItem(@RequestParam("orgId") String orgId,@RequestParam("userId")String userId,@RequestBody DashboardItem item){
        return s.addDashboardItem(orgId,userId,item);
    }


    @GetMapping("/request")
    public ArrayList<Item> getRequest(@RequestParam("orgId") String orgId){
        return s.getRequest(orgId);
    }

    @PostMapping("/request")
    public String addRequest(@RequestParam("orgId") String orgId,@RequestBody Item item){
        return s.addRequest(orgId,item);
    }

    @DeleteMapping("/request")
    public String deleteRequest(@RequestParam("orgId") String orgId,@RequestBody Item item){
        return s.deleteRequest(orgId,item);
    }

    @GetMapping(
            value = "/estimate",
            produces = "application/pdf"
    )
    public byte[] estimatePdf(@RequestParam("orgId") String orgId )  {
        return s.estimatePdf(orgId);
    }


}
