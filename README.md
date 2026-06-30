# ParaBank Performance Testing Project

[![JMeter](https://img.shields.io/badge/Apache%20JMeter-5.6.3-D22128?logo=apache&logoColor=white)](https://jmeter.apache.org/)
[![Java](https://img.shields.io/badge/Java-OpenJDK%2025-007396?logo=openjdk&logoColor=white)](https://adoptium.net/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](#)

## Project Overview

This project is a complete performance testing suite for the [ParaBank](https://parabank.parasoft.com/parabank/) demo banking application using **Apache JMeter 5.6.3**.

The goal is to evaluate the application's behaviour under realistic banking traffic by measuring **response time, throughput, and error rate** across a full user journey — from landing on the home page to logging out after transferring funds.

**Website under test:** <https://parabank.parasoft.com/parabank/>

---

## Tools & Environment

| Tool | Purpose |
|------|---------|
| **Apache JMeter 5.6.3** | Performance testing engine |
| **JMeter HTML Dashboard Report** | Visualisation and analysis |
| **PowerShell (CLI)** | Non-GUI test execution |
| **OpenJDK 25 (Temurin)** | Java runtime |
| **Git & GitHub** | Version control and CI |

---

## Test Scenarios

The JMeter test plan simulates a complete banking user journey with **5 sequential requests** that mirror what a real customer would do during a session:

| # | Step | Method | Endpoint |
|---|------|--------|----------|
| 1 | Open the home page | `GET` | `/parabank/index.htm` |
| 2 | Log in with credentials | `POST` | `/parabank/login.htm` |
| 3 | View account overview | `GET` | `/parabank/overview.htm` |
| 4 | Transfer funds between accounts | `POST` | `/parabank/transfer.htm` |
| 5 | Log out | `GET` | `/parabank/logout.htm` |

### Key features of the test plan

* **HTTP Cookie Manager** — maintains the login session across all five requests
* **HTTP Header Manager** — sends realistic browser headers (User-Agent, Accept, Referer)
* **Regular Expression Extractor** — dynamically captures the account ID from the Account Overview response and reuses it inside the Transfer Funds request
* **Uniform Random Timer** — adds 1–3 seconds of think-time between requests to mimic real user behaviour
* **Response Assertion** — validates that the login response contains expected content

---

## Test Types

### 1. Load Testing — Normal Traffic

The load test verifies that the application remains stable under expected day-to-day traffic.

#### Configuration

| Setting | Value |
|---------|-------|
| Number of Users | **10** |
| Ramp-up Period | 60 seconds |
| Loop Count | 3 |
| Total Samples | 210 |

#### Results

| Metric | Result |
|--------|-------:|
| Total Samples | 210 |
| Failed Requests | 0 |
| **Error Rate** | **0%** ✅ |
| Average Response Time | ~870 ms |
| Maximum Response Time | ~2485 ms |

#### Conclusion

The application remained **fully stable** under normal load. No failed requests were recorded, and the error rate was 0% across all five steps of the user journey.

---

### 2. Stress Testing — Heavy Traffic

The stress test pushes load past expected levels to identify the application's breaking point.

#### Configuration

| Setting | Value |
|---------|-------|
| Number of Users | **20** |
| Ramp-up Period | 60 seconds |
| Loop Count | 3 |
| Total Samples | 300 |

#### Results

| Metric | Result |
|--------|-------:|
| Total Samples | 300 |
| Failed Requests | 300 |
| **Error Rate** | **100%** ❌ |
| Average Response Time | 82 ms |
| Maximum Response Time | 713 ms |
| Throughput | 3.3 req/sec |

> **Note:** The low average response time is misleading on its own — failed requests return server errors faster than successful page renders. Response time must always be interpreted alongside the error rate.

#### Conclusion

The application became **completely unavailable** under stress load. Every single request failed, indicating that the system has no spare capacity beyond ~10 concurrent users.

---

## Performance Breaking Point

**Breaking point: ~10 concurrent users**

| Users | Error Rate | Status |
|------:|----------:|--------|
| 10 | 0% | ✅ Stable — safe operational ceiling |
| 20 | 100% | ❌ Catastrophic failure |

The application has **no graceful degradation** between safe and unsafe load levels. Above 10 concurrent users, performance becomes unpredictable and ultimately fails entirely.

---

## Project Structure

```
parabank-performance-project/
│
├── .github/
│   └── workflows/
│       └── jmeter-performance.yml    # CI workflow
│
├── test-plans/
│   ├── parabank-load-test.jmx        # 10-user load test
│   └── parabank-stress-test.jmx      # 20-user stress test
│
├── results/
│   ├── load-results.jtl              # Raw load test samples
│   └── stress-results.jtl            # Raw stress test samples
│
├── reports/
│   ├── load-report/                  # HTML dashboard
│   └── stress-report/                # HTML dashboard
│
├── README.md
└── .gitignore
```

---

## How to Run the Tests

Tests are executed from the command line in **non-GUI mode** for accuracy and lower resource consumption. The JMeter GUI is used for *building* test plans only — never for running them.

### Run the Load Test

```bash
jmeter -n -t test-plans/parabank-load-test.jmx \
       -l results/load-results.jtl \
       -e -o reports/load-report
```

### Run the Stress Test

```bash
jmeter -n -t test-plans/parabank-stress-test.jmx \
       -l results/stress-results.jtl \
       -e -o reports/stress-report
```

### Command flags

| Flag | Purpose |
|------|---------|
| `-n` | Non-GUI mode (required for accurate runs) |
| `-t` | Test plan file (`.jmx`) |
| `-l` | Output log of raw samples (`.jtl`) |
| `-e` | Generate HTML report after the test completes |
| `-o` | Output folder for the HTML report |

---

## Viewing the Reports

Open the generated HTML dashboards in any modern browser:

```
reports/load-report/index.html
reports/stress-report/index.html
```

Each report includes:
* APDEX (Application Performance Index) score
* Per-request statistics with percentiles (50th, 90th, 95th, 99th)
* Response times over time
* Throughput graphs
* Detailed error breakdown

---

## Final Conclusion

The performance testing of ParaBank revealed a clear picture of the application's capacity:

* **Load test (10 users):** ParaBank was fully stable with **0% errors** and an average response time of ~870 ms — well within acceptable limits for a banking application.
* **Stress test (20 users):** ParaBank became completely unavailable with **100% errors** — every single request failed.
* **Breaking point:** approximately **10 concurrent users**. Above this limit the application offers no safe operational margin.

This demonstrates the difference between normal-load and stress-load behaviour, and identifies a concrete performance limitation that would need to be addressed in any real production banking environment.

---

## Author

**Nagwa Roshdy** — QA & Performance Testing
