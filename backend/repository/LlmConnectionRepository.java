package com.project.mainten.repository;
import com.project.mainten.model.InvoiceItem;
import com.project.mainten.model.DashboardItem;
import java.util.*;

import java.util.ArrayList;

public interface LlmConnectionRepository {

     ArrayList<InvoiceItem> getEstimateFromLlm(ArrayList<DashboardItem> orgDashboard);


}
