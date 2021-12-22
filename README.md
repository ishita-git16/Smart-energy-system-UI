# Energy Monitoring System
This login page  design was made using Figma Tool, for the login page design. 

![image](https://user-images.githubusercontent.com/54357950/147107796-2c9372bc-5817-4202-a590-2290f4134f7f.png)


* The dashboard application consists of several masters like panels where data can be fetched in manner as the user likes. 
* On the top-right hand side, the dropdown consists of filtered panel list where the admin could select the organisation which would display the panel data of all the sites within that organisation. 
* Search and sorting filters have been deployed for the easy navigation and searching purposes using ANT design library. 
* Application is designed in such a way where  Super Admin would have selected access to the particular page where the panels that fall within his organisation could be added, deleted, updated likewise according to his requirements.
* Under locations panel. There is hierarchical mapping as the following : Area -> Region -> Site -> Subsites -> Inputs 
* The inputs are to be mapped manually with the corresponding tag, tags being voltage, current, power factor, energy etc. This would later help on in fetching data to the dashboard. 

![image](https://user-images.githubusercontent.com/54357950/147108191-b803906e-a907-40de-a3a5-0dab8b31c108.png)

The graph with draggable x axis would show the hourly energy consumption upon the selected timeline. The tooltip upon hovering over the element will display the additional data. In case the needle exceeds the maximum value, it will all come down to zero. But the original value would be displayed underneath to prevent any data loss.

![image](https://user-images.githubusercontent.com/54357950/147107887-35fa149f-92bb-42b1-98a0-d373a1ca3bb7.png)

The widgets shown indicate the battery voltage status out of the threshold and in what region it lies precisely. The red region embarks danger when the voltage exceeds too much or the fuel drops down to the lowest minimum. 

![image](https://user-images.githubusercontent.com/54357950/147107943-538934e7-fdee-4426-b8f7-506fb9cd59f9.png)

## Heartbeat Reports 
It depicts the health of the device throughout the 24 hours. The colours are rendered upon the setting of the threshold. There are different constraints for different Panel Types. The  HB data could be easily fetched by selecting site, date, and the respective Panel Type. 
![image](https://user-images.githubusercontent.com/54357950/147108105-09468959-f5e4-4068-b828-8f7931888b34.png)
