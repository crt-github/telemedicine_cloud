# 🌐 Connectivity Setup: NotebookLM & MCP

To integrate your TeleMed Cloud pseudonymized data with **NotebookLM**, you must activate the **Model Context Protocol (MCP)** skill in Antigravity.

## 🚀 Activation Steps

1.  **Install the Skill**:
    Open the Antigravity command bar and type:
    `install skill notebooklm-mcp-connector`

2.  **Configure Cloud Sync**:
    Set your "Shadow Copy" destination folder in your `.env`:
    `CLOUD_SYNC_DIR=gs://telemed-private-shadow-copies/`

3.  **VPC Service Controls**:
    Ensure your Google Cloud Project has VPC-SC enabled to restrict the bucket access exclusively to your TeleMed server IP.

## 🛡️ Security Workflow
1.  Doctor requests analysis for **Patient 1**.
2.  Server calls `/api/patient/1/ai-preview`.
3.  **Sanitizer** creates a pseudonymized PDF/JSON in the `CLOUD_SYNC_DIR`.
4.  **NotebookLM MCP Skill** detects the new file and updates the patient's Notebook context.
5.  Doctor uses the **Knowledge Bot** widget to ask clinical questions based on the synced data.

> [!IMPORTANT]
> Always verify that the "Shadow Copy" does not contain un-redacted clinical notes before finalizing a sync.
