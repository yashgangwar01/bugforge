# AI Usage Report

**Complete this report even if you did not use any AI tools. We encourage AI-assisted development. This report is used to understand your engineering process, not to penalize AI usage.**

---

# Candidate Information

**Name:** Yash Gangwar

**Date:** 14 July 2026

**Assignment Version:** BugForge Assessment

---

# 1. AI Tools Used

**Did you use AI during this assignment?**

☑ Yes

☐ No

| Tool           | Version / Model | Purpose                                                                                                       |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------------------- |
| Cursor         | Latest          | Code navigation, debugging suggestions, code completion, and reviewing fixes.                                 |
| ChatGPT        | GPT-5.5         | Discussed debugging approaches, best practices, security improvements, and reviewed implementation decisions. |
| GitHub Copilot | Not Used        | -                                                                                                             |
| Claude         | Not Used        | -                                                                                                             |
| Gemini         | Not Used        | -                                                                                                             |
| Other          | None            | -                                                                                                             |

---

# 2. AI Usage Timeline

| Problem                           | Prompt Given (verbatim)                                                                     | Tool's Response (verbatim)                                                             | Accepted? | How You Verified / What You Changed                                                                                |
| --------------------------------- | ------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | --------- | ------------------------------------------------------------------------------------------------------------------ |
| Environment variables not loading | "Help me identify why the API cannot read environment variables."                           | Suggested checking dotenv configuration and verifying the location of the `.env` file. | Partially | Verified by reproducing the issue, updating the configuration, and confirming the API started successfully.        |
| Login endpoint security           | "Review the authentication routes for security improvements."                               | Recommended adding rate limiting to the login endpoint.                                | Yes       | Implemented the limiter, manually tested repeated login attempts, and verified HTTP 429 responses.                 |
| CORS configuration                | "Review the CORS configuration for production readiness."                                   | Suggested validating the allowed origin through an environment variable.               | Yes       | Updated the configuration and confirmed requests from the configured frontend origin worked correctly.             |
| General code review               | "Review the project for potential security, performance, and maintainability improvements." | Highlighted possible improvements and best practices.                                  | Partially | Applied only the suggestions that were relevant after manually reviewing the codebase and testing the application. |

---

# 3. Validation & Verification

| Issue / Feature           | How did you verify the AI suggestion?                                                                             | Evidence that the fix worked                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Environment configuration | Started the application after updating the environment loading logic and verified required variables were loaded. | API started successfully and connected to MongoDB without configuration errors.                                                |
| Login rate limiting       | Sent multiple login requests using Postman/browser.                                                               | The endpoint returned HTTP 429 after exceeding the configured request limit.                                                   |
| CORS configuration        | Tested requests from the frontend application and checked browser console/network logs.                           | Requests from the configured origin succeeded while CORS behaved as expected.                                                  |
| General bug fixes         | Ran the project's automated tests, lint checks, build process, and manually tested major application workflows.   | All tests passed, lint completed successfully, the application built successfully, and primary functionality worked correctly. |

---

# 4. Incorrect or Misleading AI Suggestions

| Issue                     | AI Suggested                                         | Why it was Incorrect                                                  | Final Solution                                                                                                                 |
| ------------------------- | ---------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Environment configuration | Loading the `.env` file using a fixed relative path. | The approach was less portable and depended on the project structure. | Reviewed the implementation, adjusted it appropriately for the project, and verified it worked in the development environment. |

---

# 5. Significant Engineering Decisions

| Decision                      | Options Considered                                                        | Final Choice                                                  | Reasoning                                                                        |
| ----------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| Protecting the login endpoint | Leave the endpoint unchanged or implement rate limiting.                  | Added rate limiting only to the login route.                  | Reduced the risk of brute-force attacks without affecting normal API usage.      |
| Environment configuration     | Hardcode configuration values or load them through environment variables. | Continued using environment variables with validation.        | Keeps secrets out of source code and follows standard production practices.      |
| Applying AI suggestions       | Accept every recommendation or review each one individually.              | Reviewed and verified every suggestion before implementation. | Ensured only appropriate and tested changes were included in the final solution. |

---

# 6. Security & Privacy

Did you provide any of the following to an AI tool?

* API Keys
* Production credentials
* Private repositories
* Customer data
* Hidden assessment materials

☑ No

☐ Yes (Explain)

---

# 7. Estimated AI Contribution

☐ 0%

☐ 1–25%

☑ 26–50%

☐ 51–75%

☐ 76–100%

**Explanation:**

AI was primarily used for debugging guidance, reviewing implementation ideas, and suggesting best practices. The investigation, code review, implementation, testing, verification, and final engineering decisions were completed manually.

---

# 8. Reflection

AI was most helpful when investigating configuration issues and reviewing security improvements. It provided useful debugging ideas and highlighted best practices that helped reduce investigation time.

Some suggestions required modification before they were suitable for the project. I reviewed every recommendation against the existing codebase and only accepted changes that were appropriate and could be verified.

One debugging task I completed independently was reproducing application issues locally, reviewing logs, validating API responses, and confirming fixes by running the project, automated tests, and manual functional testing.

If I repeated this assignment, I would use AI earlier for brainstorming possible root causes while continuing to manually validate every recommendation before applying it.

---

# Candidate Declaration

I confirm that:

* This report accurately describes my AI usage.
* I understand every code change included in my submission.
* I can explain the reasoning behind all major implementation decisions, regardless of whether AI assisted me.

**Signature (Type Full Name):** Yash Gangwar

**Date:** 14 July 2026
