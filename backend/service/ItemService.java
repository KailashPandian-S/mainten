package com.project.mainten.service;

import com.project.mainten.model.*;
import com.project.mainten.model.InvoiceItem;
import com.project.mainten.repository.ItemRepository;
import java.util.*;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import java.io.IOException;
import java.io.ByteArrayOutputStream;
import com.project.mainten.service.LlmConnectionService;



@Service
public class ItemService implements ItemRepository {
  @Autowired
  private JdbcTemplate db;

  @Autowired
  private LlmConnectionService aiService;


  @Override
    public ArrayList<Item> getAllItems(String orgId){
      try{
          System.out.print(orgId);
          List<Item> lst = db.query("SELECT * FROM item WHERE orgId = ?",new ItemRowMapper() , orgId);
          ArrayList<Item> res = new ArrayList<>(lst);
          System.out.print("success");
          return res;
      }
      catch(Exception e){
          ArrayList<Item> tmp = new ArrayList<>();
          return tmp;
      }
  }

  @Override
    public String addItem(String orgId,Item item){
      try{
          db.update("INSERT INTO item(itemName,orgId,itemAddedDate) VALUES (?,?,?)",item.getItemName(),orgId,item.getAddedDate());
          return "Success";
      }
      catch(Exception e){
          return "Failure";
      }
  }

  public ArrayList<DashboardItem> getAllOrgDashboardItems(String orgId){
      try{

          System.out.print(orgId);
          List<DashboardItem> lst = db.query(
                  "SELECT d.dashboardItemId AS dashboardItemId, i.itemName AS dashboardItemName, d.quantity AS quantity, d.dItemAddedDate AS addedDate FROM dashboard_item d LEFT JOIN item i ON i.itemId = d.itemId WHERE d.orgId = ?",
                  new DashboardItemRowMapper(),
                  orgId
          );
          ArrayList<DashboardItem> res = new ArrayList<>(lst);
          System.out.print("success");
          return res;
      }
      catch(Exception e){
          ArrayList<DashboardItem> lst = new ArrayList<>();
          return lst;
      }
  }

  public ArrayList<DashboardItem> getAllDashboardItems(String orgId,String userId){
      try{
          System.out.print("inside service");
          List<DashboardItem> lst = db.query(
                  "SELECT d.dashboardItemId, " +
                          "i.itemName AS dashboardItemName, " +
                          "d.quantity AS quantity, " +
                          "d.dItemAddedDate AS addedDate " +
                          "FROM dashboard_item d " +
                          "LEFT JOIN item i ON i.itemId = d.itemId " +
                          "WHERE d.orgId = ? AND d.userId = ?",
                  new DashboardItemRowMapper(),
                  orgId,
                  userId
          );

          ArrayList<DashboardItem> res = new ArrayList<>(lst);
          System.out.print("success");
          return res;
      }
      catch(Exception e){
          ArrayList<DashboardItem> tmp = new ArrayList<>();
          return tmp;
      }
  }

  public String addDashboardItem(String orgId,String userId,DashboardItem d){
      try{
          System.out.println(orgId);
          System.out.println(userId);
          Item itemToAdd = db.queryForObject("SELECT * FROM item WHERE itemName = ?",new ItemRowMapper(),d.getDashboardItemName());
          Integer itemid = itemToAdd.getItemId();
          System.out.println(itemid);
          db.update("INSERT INTO dashboard_item(itemId,orgId,dItemAddedDate,quantity,userId) VALUES(?,?,?,?,?)",itemid,itemToAdd.getOrgId(),d.getAddedDate(),d.getQuantity(),userId);
          return "Success";

      }
      catch(Exception e){
          return "Failure";
      }

  }

  public String clearOrgDashboard(String orgId){
      try{
          db.update("DELETE FROM dashboard_item WHERE orgId = ?",orgId);
          return "Success";
      }
      catch(Exception e){
          return "Failure";
      }
  }

public ArrayList<Item> getRequest(String orgId){
      try{
         List<Item> lst =  db.query("SELECT requestId AS itemId,itemName,rAddedDate AS itemAddedDate,orgId FROM request WHERE orgId = ?",new ItemRowMapper(),orgId);
         ArrayList<Item> res = new ArrayList<>(lst);
         return res;
      }
      catch(Exception e){
          ArrayList<Item> tmp = new ArrayList<>();
          return tmp;
      }
}

public String addRequest(String orgId,Item item){
      try{
          System.out.print(item.getAddedDate());
          db.update("INSERT INTO request(itemName,orgId,rAddedDate) VALUES(?,?,?)",item.getItemName(),item.getOrgId(),item.getAddedDate());
          return "Success";
      }
      catch (Exception e){
          return "Failure";
      }
}

public String deleteRequest(String orgId,Item item){
      try{
          db.update("DELETE FROM request WHERE itemName = ? AND orgId = ?",item.getItemName(),item.getOrgId());
          return "Success";
      }
      catch (Exception e){
          return "Failure";
      }
}

//@Override
//public byte[] estimatePdf(String orgId) {
//
//      LlmConnectionService aiService = new LlmConnectionService();
//      ArrayList<DashboardItem> orgDashboard = getAllOrgDashboardItems(orgId);
//      ArrayList<InvoiceItem> invoiceList = aiService.getEstimateFromLlm(orgDashboard);
//      PDDocument document = new PDDocument();
//      try{
//          PDPage page = new PDPage();
//          document.addPage(page);
//          PDPageContentStream contentStream = new PDPageContentStream(document,page);
//          contentStream.beginText();
//          contentStream.setFont(PDType1Font.HELVETICA_BOLD,20);
//          contentStream.setLeading(15f);
//          contentStream.newLineAtOffset(100,730);
//          contentStream.showText("Org : " + orgId);
//          contentStream.newLine();
//          contentStream.newLine();
//          for(InvoiceItem sample : invoiceList) {
//              contentStream.setFont(PDType1Font.HELVETICA, 10);
//              contentStream.showText((sample).getItemName());
//              contentStream.newLine();
//              contentStream.showText(sample.getItemPrice());
//              contentStream.newLine();
//              contentStream.showText(sample.getPlatform());
//              contentStream.newLine();
//              contentStream.showText(sample.getAvailableStockQuantity());
//              contentStream.newLine();
//              contentStream.newLine();
//          }
//
//          contentStream.showText(invoiceList.get(0).getTotalPrice());
//          PDRectangle pageSize = page.getMediaBox();
//
//          float marginLeft = 40;
//          float marginBottom = 40;
//          contentStream.setFont(PDType1Font.HELVETICA_BOLD, 17);
//          contentStream.newLineAtOffset(
//                  marginLeft,
//                  marginBottom
//          );
//          contentStream.showText(invoiceList.get(0).getTotalPrice());
//          contentStream.endText();
//          contentStream.close();
//          ByteArrayOutputStream baos = new ByteArrayOutputStream();
//          document.save(baos);
//          System.out.print("pdf generated successfully");
//          return baos.toByteArray();
//      }
//      catch(IOException e){
//          e.printStackTrace();
//          throw new RuntimeException("Pdf generation failed",e);
//      }
//
//
//}


    @Override
    public byte[] estimatePdf(String orgId) {


        ArrayList<DashboardItem> orgDashboard = getAllOrgDashboardItems(orgId);
        ArrayList<InvoiceItem> invoiceList = aiService.getEstimateFromLlm(orgDashboard);

        PDDocument document = new PDDocument();

        try {
            PDPage page = new PDPage();
            document.addPage(page);

            PDPageContentStream contentStream = new PDPageContentStream(document, page);
            PDRectangle pageSize = page.getMediaBox();

            // ---- Layout constants ----
            float marginLeft = 40;
            float marginRight = 40;
            float marginTop = pageSize.getHeight() - 50;
            float marginBottom = 40;

            float fontSize = 10;
            float leading = 14.5f;

            float yCursor = marginTop;

            /* ---------- HEADER (FIRST PAGE ONLY) ---------- */
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 16);
            contentStream.newLineAtOffset(marginLeft, yCursor);
            contentStream.showText("Org : " + orgId);
            contentStream.endText();

            yCursor -= 30;

            /* ---------- ITEMS LIST ---------- */
            contentStream.setFont(PDType1Font.HELVETICA, fontSize);

            for (InvoiceItem item : invoiceList) {

                // check page end (leave space for footer)
                if (yCursor <= marginBottom + 80) {
                    contentStream.close();

                    page = new PDPage();
                    document.addPage(page);
                    contentStream = new PDPageContentStream(document, page);
                    contentStream.setFont(PDType1Font.HELVETICA, fontSize);
                    pageSize = page.getMediaBox();

                    yCursor = pageSize.getHeight() - 50;
                }

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, yCursor);
                contentStream.showText("Item : " + item.getItemName());
                contentStream.endText();
                yCursor -= leading;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, yCursor);
                contentStream.showText("Cheapest Price : " + item.getItemPrice());
                contentStream.endText();
                yCursor -= leading;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, yCursor);
                contentStream.showText("Platform : " + item.getPlatform());
                contentStream.endText();
                yCursor -= leading;

                contentStream.beginText();
                contentStream.newLineAtOffset(marginLeft, yCursor);
                contentStream.showText("Available Stock : " + item.getAvailableStockQuantity());
                contentStream.endText();
                yCursor -= (leading * 1.5f); // extra spacing between items
            }

            /* ---------- TOTAL PRICE (LAST PAGE BOTTOM) ---------- */
            contentStream.beginText();
            contentStream.setFont(PDType1Font.HELVETICA_BOLD, 14);
            contentStream.newLineAtOffset(marginLeft, marginBottom);
            contentStream.showText("Total Price : " + invoiceList.get(0).getTotalPrice());
            contentStream.endText();

            contentStream.close();

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.save(baos);
            document.close();

            System.out.print("pdf generated successfully");
            return baos.toByteArray();

        } catch (IOException e) {
            e.printStackTrace();
            throw new RuntimeException("Pdf generation failed", e);
        }
    }



}
