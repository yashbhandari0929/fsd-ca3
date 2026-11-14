import os
import sys
import subprocess

BASE_DIR = r"C:\Users\yashb\.gemini\antigravity\scratch\fsd-ca3"
REPORT_DIR = os.path.join(BASE_DIR, "practical-journal")
SOURCE_DIR = os.path.join(REPORT_DIR, "report-source")
HTML_FILE = os.path.join(SOURCE_DIR, "report.html")
PDF_OUTPUT = os.path.join(REPORT_DIR, "Yash_Prasanna_Bhandari_FSD_CA3_Report.pdf")

CHROME_PATH = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
EDGE_PATH = r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"
browser_exe = CHROME_PATH if os.path.exists(CHROME_PATH) else EDGE_PATH

print(f"Using browser for PDF generation: {browser_exe}")

# Read HTML and replace relative image sources with absolute file URIs
with open(HTML_FILE, "r", encoding="utf-8") as f:
    html = f.read()

# Replace image paths like ../../program-1-vanilla-js/screenshots/01_dashboard.png
def make_abs(rel_path):
    abs_p = os.path.normpath(os.path.join(SOURCE_DIR, rel_path)).replace("\\", "/")
    return f"file:///{abs_p}"

import re
def replacer(match):
    rel = match.group(1)
    abs_uri = make_abs(rel)
    return f'src="{abs_uri}"'

html_abs = re.sub(r'src="(\.\./\.\./[^"]+)"', replacer, html)

tmp_html = os.path.join(SOURCE_DIR, "report_rendered.html")
with open(tmp_html, "w", encoding="utf-8") as f:
    f.write(html_abs)

file_url = f"file:///{tmp_html.replace(os.sep, '/')}"

cmd = [
    browser_exe,
    "--headless",
    "--disable-gpu",
    "--no-sandbox",
    "--run-all-compositor-stages-before-draw",
    f"--print-to-pdf={PDF_OUTPUT}",
    "--print-to-pdf-no-header",
    file_url
]

print(f"Executing Chrome print-to-pdf...")
result = subprocess.run(cmd, capture_output=True, text=True)
if result.returncode == 0 and os.path.exists(PDF_OUTPUT):
    size_kb = os.path.getsize(PDF_OUTPUT) / 1024
    print(f"SUCCESS: Report PDF generated at: {PDF_OUTPUT} ({size_kb:.1f} KB)")
else:
    print(f"FAILED to generate PDF. Exit code: {result.returncode}")
    print(f"Stderr: {result.stderr}")
    sys.exit(1)
