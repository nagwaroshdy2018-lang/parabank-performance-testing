/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 70.03058103975535, "KoPercent": 29.96941896024465};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.6498470948012233, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5555555555555556, 500, 1500, "03 - Account Overview"], "isController": false}, {"data": [1.0, 500, 1500, "05 - Logout-0"], "isController": false}, {"data": [1.0, 500, 1500, "05 - Logout-1"], "isController": false}, {"data": [0.6, 500, 1500, "01 - Home Page"], "isController": false}, {"data": [0.4777777777777778, 500, 1500, "05 - Logout"], "isController": false}, {"data": [0.3111111111111111, 500, 1500, "02 - Login"], "isController": false}, {"data": [0.5333333333333333, 500, 1500, "04 - Transfer Funds"], "isController": false}, {"data": [0.9655172413793104, 500, 1500, "02 - Login-1"], "isController": false}, {"data": [1.0, 500, 1500, "02 - Login-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 327, 98, 29.96941896024465, 258.9724770642201, 56, 1131, 284.0, 537.1999999999996, 590.5999999999999, 677.7599999999998, 3.7342408185638587, 12.94303293226407, 0.9000259976532523], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["03 - Account Overview", 45, 20, 44.44444444444444, 195.33333333333343, 56, 332, 285.0, 319.4, 329.09999999999997, 332.0, 0.5745658835546475, 2.048511914262002, 0.11791817623212462], "isController": false}, {"data": ["05 - Logout-0", 22, 0, 0.0, 216.09090909090904, 208, 223, 216.5, 220.7, 222.7, 223.0, 0.5272239263803681, 0.20234277643309048, 0.08649767542177914], "isController": false}, {"data": ["05 - Logout-1", 22, 0, 0.0, 227.50000000000003, 214, 313, 222.0, 240.0, 302.49999999999983, 313.0, 0.5268325390933691, 2.3674022740606815, 0.09312176716396466], "isController": false}, {"data": ["01 - Home Page", 45, 16, 35.55555555555556, 250.88888888888894, 57, 1131, 222.0, 497.1999999999996, 699.9999999999998, 1131.0, 0.5720023896988725, 2.3184468387334594, 0.06367995354069479], "isController": false}, {"data": ["05 - Logout", 45, 23, 51.111111111111114, 247.95555555555555, 57, 531, 71.0, 448.2, 456.29999999999995, 531.0, 0.5716681275963261, 1.497837486661077, 0.13266968221603975], "isController": false}, {"data": ["02 - Login", 45, 17, 37.77777777777778, 399.6444444444444, 56, 680, 576.0, 621.4, 639.5999999999999, 680.0, 0.5780940880244598, 2.385353203444156, 0.2532799814046402], "isController": false}, {"data": ["04 - Transfer Funds", 45, 21, 46.666666666666664, 193.91111111111107, 57, 365, 287.0, 323.2, 337.5999999999999, 365.0, 0.5752489549643984, 2.5741267201541667, 0.14670845743796898], "isController": false}, {"data": ["02 - Login-1", 29, 1, 3.4482758620689653, 290.10344827586215, 59, 346, 293.0, 324.0, 337.0, 346.0, 0.6020219634219759, 3.525728978534803, 0.1281648320566316], "isController": false}, {"data": ["02 - Login-0", 29, 0, 0.0, 295.3103448275862, 278, 371, 289.0, 314.0, 345.5, 371.0, 0.598913694471407, 0.1748781197724128, 0.19125466610561534], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["429/Too Many Requests", 98, 100.0, 29.96941896024465], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 327, 98, "429/Too Many Requests", 98, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": ["03 - Account Overview", 45, 20, "429/Too Many Requests", 20, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["01 - Home Page", 45, 16, "429/Too Many Requests", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["05 - Logout", 45, 23, "429/Too Many Requests", 23, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02 - Login", 45, 17, "429/Too Many Requests", 17, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["04 - Transfer Funds", 45, 21, "429/Too Many Requests", 21, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["02 - Login-1", 29, 1, "429/Too Many Requests", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
