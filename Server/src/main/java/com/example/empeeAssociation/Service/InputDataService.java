package com.example.empeeAssociation.Service;

import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.empeeAssociation.Dao.DataModel;
import com.example.empeeAssociation.Dao.DataModelAndProduction;
import com.example.empeeAssociation.Entity.HourRecordOfPackageReport;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class InputDataService {

    @Autowired
    private final FetchData fetchData;
    private final DataToDatabase dataToDatabase;
    private final ObjectMapper objectMapper;
    public static volatile long dataReceivedTime;
    

    @Autowired
    public InputDataService(DataToDatabase dataToDatabase, ObjectMapper objectMapper) {
        this.fetchData = new FetchData();
        this.dataToDatabase = dataToDatabase;
        this.objectMapper = objectMapper;
    }
    public long getDataReceivedTime() {
        return dataReceivedTime;
    }

    public DataModelAndProduction decodeThedata(String encodedData) throws Exception {
        String decodedData = URLDecoder.decode(encodedData, StandardCharsets.UTF_8.toString());
        decodedData = decodedData.replaceAll("=$", "");
        decodedData = decodedData.replaceAll("\\\\", "");

        DataModel[] dataModelsArray = objectMapper.readValue(decodedData, DataModel[].class);
        List<DataModel> dataModels = Arrays.asList(dataModelsArray);

        System.out.println("Data received at: " + System.currentTimeMillis());
        dataReceivedTime = System.currentTimeMillis();

        for (DataModel dataModel : dataModels) {
            System.out.print(dataModel.getName() + ":" + dataModel.getData() + "," + dataModel.getTime() + ",");
        }
        System.out.println();
        System.out.println("Data Models: " + dataModels);
        dataToDatabase.dataSaveInDB(dataModels);
        List<HourRecordOfPackageReport> productionOfToday = fetchData.getDataOfaDay(LocalDate.now());
        DataModelAndProduction dataModelAndProduction = new DataModelAndProduction();
        dataModelAndProduction.setDataModel(dataModels);
        dataModelAndProduction.setProductionOfToday(productionOfToday);
        return dataModelAndProduction;
    }
}
