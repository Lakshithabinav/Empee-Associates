package com.example.empeeAssociation.ErrorClass;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Component;

import com.example.empeeAssociation.Service.InputDataService;

@Component
public class TeltonikaConnectionError extends Thread {
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private InputDataService inputDataService;
    
    private static final long CHECK_INTERVAL = 1500; // Checking interval in milliseconds
    private static final long ALERT_THRESHOLD = 15000; // Alert threshold in milliseconds

    private volatile boolean running = true;

    @Override
    public void run() {
        while (running) {
            try {
                Thread.sleep(CHECK_INTERVAL);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt(); // Restore the interrupted status
                e.printStackTrace();
                return; // Exit the loop if interrupted
            }

            long currentTime = System.currentTimeMillis();
            long dataReceivedTime = inputDataService.getDataReceivedTime();
            long timeElapsed = currentTime - dataReceivedTime;

            if (timeElapsed > ALERT_THRESHOLD) {
                messagingTemplate.convertAndSend("/topic/teltonikaError", false);
                System.out.println("No data received from Teltonika");
            }
            else{
                messagingTemplate.convertAndSend("/topic/teltonikaError",true);
            }
        }
    }

    public void stopThread() {
        running = false;
    }
}
