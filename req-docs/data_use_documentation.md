# **DATA USE DOCUMENTATION**

## 1. Data Sources

### A. Challenge & Public Datasets
*   **Dataset Name**: IDinsight Urgency Detection Maternal Health Dataset
*   **Source**: Ingested via public machine learning hubs.
*   **Description**: Contains synthetic text logs of maternal health queries in English and dialect translations, representing various gestational symptoms and risk levels.
*   **Role in Project**: Used as the mass training set to pre-train the model's understanding of general urgency indicators before clinical anchor fine-tuning.

### B. Externally Sourced / Local Datasets
*   **Dataset Name**: Ghana Health Service Clinical Anchor Set
*   **Source**: Manually compiled from the official GHS **[National Safe Motherhood Protocol (Revised Edition)](https://platform.who.int/docs/default-source/mca-documents/policy-documents/operational-guidance/GHA-CC-10-02-OPERATIONALGUIDANCE-eng-National-Safe-Motherhood-Protocol.pdf)**.
*   **Description**: A specialized multilingual dataset mapping core clinical warning signs (such as postpartum hemorrhage, pre-eclampsia, convulsions, sepsis) in English and Twi (e.g., *"mogya gu me ho"*, *"me ti pae me paa"*) directly to urgency triage labels (LOW, MEDIUM, HIGH).
*   **Role in Project**: Acts as the semantic clustering constraints for the Guideline-Driven Few-Shot Fine-Tuning (GDF-FT) paradigm.

---

## 2. Data Management

### A. Data Cleaning Procedures
*   **Text Normalization**: Stripped HTML, extra whitespace, and special characters from voice transcript logs to prevent tokenization noise.
*   **Case Sensitivity**: Maintained case-cased tokenization parameters (`distilbert-base-multilingual-cased`) to capture emphasis or capitalization indicating urgency.

### B. Feature Engineering Methods
*   **Label Mapping & Consolidation**: Mapped heterogeneous labels from the public dataset into a standardized 3-level triage classification:
    *   `0`: LOW RISK (routine guidance/discomforts)
    *   `1`: MEDIUM RISK (mild symptoms requiring review)
    *   `2`: HIGH RISK (immediate emergency danger signs)
*   **Dialect Expansion**: Synthesized multilingual parallel pairs matching Twi phrases with English warning signs to align the multilingual embedding spaces.

### C. Data Quality Checks & Balance
*   **Oversampling**: Because clinical anchors are highly precise but low in volume (28 rows), they were oversampled by a factor of 10 (expanding to 280 rows) to ensure the training loop does not ignore critical, life-threatening symptoms in favor of more frequent routine queries.
*   **Split Validation**: Evaluated on an independent, clinical-grade test set (`triage_test_data.json`) containing balanced representations of all risk levels to compute final precision, recall, and F1 metrics.

---

## 3. Data Governance

### A. Data Permissions and Licenses
*   **Public Datasets**: The IDinsight synthetic urgency detection dataset is released under open licenses, allowing reuse for research and prototype development.
*   **Clinical Protocols**: The GHS Safe Motherhood Protocol is a public policy guideline released for national health services and training contexts.

### B. Privacy Protection Measures
*   **Anonymization**: All training datasets are fully synthetic or anonymized, containing zero personally identifiable information (PII), phone numbers, or real patient history.
*   **Encrypted Storage**: Staged patient voice transcripts on the backend use SHA-256 end-to-end encryption in transit and AES-256 encryption at rest.

### C. Compliance with Ethical Standards
*   **Informed Consent**: The data pipeline is built to ingest data only after verbal, localized consent is logged.
*   **Non-Discriminatory Triage**: Risk models classify urgency based solely on reported clinical symptoms rather than patient age, location, or socioeconomic attributes.
