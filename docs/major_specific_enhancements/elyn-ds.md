# Admin Training Analytics Dashboard for Decision Support

The **Admin Training Analytics Dashboard** provides a centralized view of park guide training data to support administrative decision-making.  
Rather than reviewing individual records manually, administrators can monitor key metrics, observe trends, and use their judgement to improve training outcomes.

This dashboard focuses on **descriptive and trend analytics**, enabling administrators to make informed, experience-based decisions without relying on predictive models.

---

## Key Features and Insights

### 1. Guide Participation Overview  
Displays overall participation in the training program.

**Metrics:**
- Total enrolled guides: 120  
- Active guides: 95  
- Inactive guides: 25  

**Insight:**  
Helps administrators track engagement levels and identify participation drop-offs that may require follow-up.

---

### 2. Pass and Fail Distribution  
Summarizes training outcomes based on quiz results.

**Metrics:**
- Passed: 82 guides  
- Failed: 18 guides  
- In progress: 20 guides  

**Insight:**  
Provides a clear view of overall performance and allows administrators to assess training effectiveness based on assessment results.

---

### 3. Module Pass Rate Analysis  
Analyzes module difficulty using pass rates from quiz attempts grouped by module.

**Metrics:**
- Highest pass rate: *Eco-Tourism Basics*  
- Lowest pass rate: *Emergency Response*  

**Insight:**  
Highlights which modules are easier or more challenging, helping administrators decide where improvements or additional support materials may be needed.

---

### 4. Guide Progress Monitoring  
Tracks completion status across training modules.

**Example:**

| Guide Name | Modules Assigned | Modules Completed | Status       |
|------------|------------------|-------------------|--------------|
| Ali        | 5                | 5                 | Completed    |
| Sarah      | 5                | 3                 | In Progress  |
| John       | 5                | 2                 | At Risk      |

**Insight:**  
Supports identification of guides who may be falling behind, enabling timely intervention based on administrator judgement.

---

### 5. Certification Completion Rate  
Measures how many guides have successfully completed training and received certification.

**Metric:**
- Certification completion rate: **68%**

**Insight:**  
Acts as a key indicator of overall program success and training efficiency.

---

## Scope and Data Focus

This dashboard is designed using **existing system data only**, without introducing additional system complexity.

**Included data:**
- Guide enrollment and activity status  
- Quiz-based pass and fail results  
- Module-level pass rates (based on grouped quiz attempts)  
- Certification completion records  

**Excluded:**
- Predictive modelling (e.g., machine learning)  
- Detailed per-content item tracking  

---

## Data Science Value (Descriptive Analytics)

This dashboard supports decision-making by:
- Transforming raw training data into clear summaries and trends  
- Highlighting performance patterns across guides and modules  
- Enabling administrators to make **predictive judgements based on observed trends**  
- Supporting continuous improvement through data-driven insights  