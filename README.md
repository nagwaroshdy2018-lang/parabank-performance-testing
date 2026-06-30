\# ParaBank Performance Testing Project



\## Project Overview



This project contains performance testing for the ParaBank demo banking website using Apache JMeter.



The objective of this project is to evaluate the application performance under normal load and high stress conditions by measuring response time, throughput, and error rate.



Website under test:



https://parabank.parasoft.com/parabank/overview.htm



\---



\## Tools Used



\* Apache JMeter 5.6.3

\* JMeter HTML Dashboard Report

\* PowerShell / Command Line

\* Git \& GitHub



\---



\## Test Scenarios



The JMeter test plan simulates basic user actions on the ParaBank website, including:



\* Opening the home page

\* Logging in

\* Logging out



Timers were added to simulate more realistic user behavior between requests.



\---



\## Test Types



\### 1. Load Testing



The load test was executed to verify that the application remains stable under normal expected traffic.



\#### Load Test Configuration



| Metric          |      Value |

| --------------- | ---------: |

| Number of Users |         10 |

| Ramp-up Period  | 60 seconds |

| Loop Count      |          3 |



\#### Load Test Result Summary



| Metric                |   Result |

| --------------------- | -------: |

| Total Samples         |      210 |

| Failed Requests       |        0 |

| Error Rate            |       0% |

| Average Response Time |  \~870 ms |

| Maximum Response Time | \~2485 ms |



\#### Load Test Conclusion



The application remained stable under the applied normal load. No failed requests were recorded, and the error rate was 0%.



\---



\### 2. Stress Testing



The stress test was executed to observe how the application behaves under higher traffic and to identify its limitation under pressure.



\#### Stress Test Configuration



| Metric          |      Value |

| --------------- | ---------: |

| Number of Users |         50 |

| Ramp-up Period  | 60 seconds |

| Loop Count      |          3 |



\#### Stress Test Result Summary



| Metric                |  Result |

| --------------------- | ------: |

| Total Samples         |     450 |

| Failed Requests       |     236 |

| Error Rate            |  52.44% |

| Average Response Time |  256 ms |

| Maximum Response Time | 1085 ms |



\#### Stress Test Conclusion



The application became unstable under high load. The error rate reached 52.44%, which indicates that the system started failing or rejecting many requests under stress conditions.



\---



\## Project Structure



```text

parabank-performance-project/

│

├── test-plans/

│   ├── parabank-load-test.jmx

│   └── parabank-stress-test.jmx

│

├── results/

│   ├── load-results.jtl

│   └── stress-results.jtl

│

├── reports/

│   ├── load-report/

│   └── stress-report/

│

├── screenshots/

│

├── README.md

└── .gitignore

```



\---



\## How to Run the Tests



\### Run Load Test



```bash

jmeter -n -t test-plans/parabank-load-test.jmx -l results/load-results.jtl -e -o reports/load-report

```



\### Run Stress Test



```bash

jmeter -n -t test-plans/parabank-stress-test.jmx -l results/stress-results.jtl -e -o reports/stress-report

```



\---



\## Reports



The generated HTML reports are available in:



```text

reports/load-report/index.html

reports/stress-report/index.html

```



To view each report, open the `index.html` file in a browser.



\---



\## Final Conclusion



The load test showed that the ParaBank application was stable under normal traffic with 10 users and 0% error rate.



The stress test showed that the application became unstable under higher traffic with 50 users, where the error rate reached 52.44%.



This demonstrates the difference between normal load behavior and high-stress behavior, and helps identify the application's performance limitation under heavy traffic.



