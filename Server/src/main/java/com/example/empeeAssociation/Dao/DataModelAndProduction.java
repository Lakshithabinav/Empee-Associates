package com.example.empeeAssociation.Dao;

import java.util.List;

import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;

public class DataModelAndProduction {
    
    private List<DataModel> dataModel;
    private List<HourRecordOfPackageReport> productionOfToday;

    public List<DataModel> getDataModel() {
        return dataModel;
    }
    public void setDataModel(List<DataModel> dataModel) {
        this.dataModel = dataModel;
    }
    public List<HourRecordOfPackageReport> getProductionOfToday() {
        return productionOfToday;
    }
    public void setProductionOfToday(List<HourRecordOfPackageReport> productionOfToday) {
        this.productionOfToday = productionOfToday;
    } 

}
