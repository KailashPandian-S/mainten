package com.project.mainten.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.project.mainten.model.DashboardItem;
import com.project.mainten.model.InvoiceItem;
import java.util.*;
import com.project.mainten.repository.LlmConnectionRepository;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.JsonNode;


@Service
public class LlmConnectionService implements LlmConnectionRepository{

    @Autowired
    private RestTemplate restTemplate;


    public String getAiResponseString(String s){
        try {
            String url = "https://api.openai.com/v1/chat/completions";

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + "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");

            Map<String, String> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", s);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-5-nano");
            body.put("messages", List.of(message));

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    request,
                    String.class
            );

            System.out.println("Status code: " + response.getStatusCode());
            System.out.println("Headers: " + response.getHeaders());
            System.out.println("Body: " + response.getBody());


            ObjectMapper mapper = new ObjectMapper();
            JsonNode root = mapper.readTree(response.getBody());

            String aiText = root
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();

            return aiText;
        }
        catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to parse OpenAI response", e);
        }
        catch (Exception e){
            e.printStackTrace();
            throw new RuntimeException("Failed to parse OpenAI response", e);
        }


    }

    public String encodeData(ArrayList<DashboardItem> d) {
        //name,qty|name,qty|name,qty|
        StringBuilder sb = new StringBuilder();
        for (DashboardItem i : d) {
            sb.append(i.getDashboardItemName() + "," + i.getQuantity() + "|");
        }
        String s = sb.toString();
        System.out.println(s);
        return s;
    }


    public ArrayList<InvoiceItem> decodeData(String s){
        //name>price>platform>stock>totalprice#
        String itemName = "";
        boolean nameOn = true;
        String price = "";
        boolean priceOn = false;
        String qty = "";
        boolean qtyOn = false;
        String platform = "";
        boolean platformOn = false;
        String total = "";
        boolean totalOn = false;

        ArrayList<InvoiceItem> lst = new ArrayList<>();
        for(int i = 0 ; i < s.length();i++){
            if(s.charAt(i) == '#'){
                //end of the item
                InvoiceItem temp = new InvoiceItem(itemName,price,platform,qty,total);
                totalOn = false;
                nameOn = true;
                itemName = "";
                price = "";
                qty = "";
                platform = "";
                total = "";
                lst.add(temp);

            }
            else if(s.charAt(i) == '>'){
                //end of a var
                if(nameOn == true){

                    nameOn = false;
                    priceOn = true;
                }
                else if(priceOn == true){


                    priceOn = false;
                    platformOn = true;
                }
                else if(platformOn == true){

                    platformOn = false;
                    qtyOn = true;
                }
                else if(qtyOn == true){
                    qtyOn = false;
                    totalOn = true;
                }

            }
            else if(nameOn){
                itemName+= s.charAt(i);
            }
            else if(priceOn){
                price+= s.charAt(i);
            }
            else if(platformOn){
                platform+= s.charAt(i);
            }
            else if(totalOn){
               total += s.charAt(i);
            }
            else if(qtyOn){
                qty+= s.charAt(i);
            }
        }
        return lst;
    }

    @Override
    public ArrayList<InvoiceItem> getEstimateFromLlm(ArrayList<DashboardItem> orgDashboard){
//        ArrayList<InvoiceItem> lst = new ArrayList<>();
        String prompt = "Act as an E-commerce Search & Purchase Optimization Bot. Follow all rules exactly and in order. Rule 1: Your goal is to search e-commerce platforms and select the best possible purchase for each item using this strict priority order: good quality first, good ratings second, and cheapest price that satisfies good quality and good ratings last. Rule 2: For each product, select exactly one best item unless quantity constraints force partial selection. Rule 3: The input will be provided in the format itemName,quantity|itemName,quantity|itemName,quantity| and may contain duplicate item names. Item names in the input may contain whitespaces and must be read as-is; only the format-specifying characters comma and vertical bar define structure. Rule 4: Before searching, merge duplicate items by adding their quantities; for example item1,3|item2,4|item1,5| must be treated as item1 with quantity 8 and item2 with quantity 4, and each item must be searched only once after merging. Rule 5: If specifications are provided for an item, search for the exact same item only; if the item name is generic, search common versions. Rule 6: Always compare across all platforms and respect quality and ratings before price. Rule 7: If a single platform provides the full required quantity, select it; if not, select the cheapest available partial quantity and search other platforms for the remaining quantity. Rule 8: Do not choose alternative products unless the item is unavailable cheaper anywhere. Rule 9: TotalCost is defined as the sum of the cost of all items provided in the input list; calculate TotalCost once and repeat the same TotalCost value in every item entry for decoding purposes. Rule 10: Return only one output string with no spaces, no new lines, no explanations, no labels, and no extra characters outside the output format; your response is considered the encoded output. Rule 11: The output format is mandatory and must be exactly itemName>cheapestPrice>platform>quantityThatCanBeBought(number)>TotalCost#itemName2>cheapestPrice>platform>quantityThatCanBeBought(number)>TotalCost#. Item names in the output may also contain whitespaces; only the format-specifying characters greater-than sign and hash symbol define structure. The TotalCost value must be identical in every entry. Important before the string is returned you must check it twice to ensure whether you made any mistake and ensure fairness. You already gave wrong price and wrong platform names you gave as Platform A, Platform B instead of giving real platform names as amazon,flipkart etc.. Kindly ensure it twice or thrice. Check if you have followed the rules and regulations. INPUT: ";
        String promptContent = encodeData(orgDashboard);
        prompt += promptContent;
        System.out.println(prompt);
        String responseString = getAiResponseString(prompt);
        System.out.println(responseString);
        ArrayList<InvoiceItem> lst = decodeData(responseString);
//        for(DashboardItem d : orgDashboard){
//            lst.add(
//                    new InvoiceItem(d.getDashboardItemName(),
//                            "1000 INR",
//                            "Flipkart",
//                            "3",
//                            "10000 INR"
//                            )
//            );
//        }
        return lst;
    }
}
