#!/usr/bin/env python3
"""Convert PDF to Markdown format, preserving tables and structure."""

import pdfplumber
import json

pdf_path = r"APC40_Communications_Protocol_rev_1.pdf_1db97c1fdba23bacf47df0f9bf64e913.pdf"
output_path = "APC40_Communications_Protocol.md"

with pdfplumber.open(pdf_path) as pdf:
    markdown_content = []
    
    for page_num, page in enumerate(pdf.pages, 1):
        markdown_content.append(f"## Page {page_num}\n")
        
        # Extract tables
        tables = page.extract_tables()
        if tables:
            for table in tables:
                # Convert table to markdown format
                if table:
                    markdown_content.append("")
                    # Header row
                    header = table[0]
                    markdown_content.append("| " + " | ".join(str(cell or "") for cell in header) + " |")
                    markdown_content.append("|" + "|".join(["---"] * len(header)) + "|")
                    
                    # Data rows
                    for row in table[1:]:
                        markdown_content.append("| " + " | ".join(str(cell or "") for cell in row) + " |")
                    markdown_content.append("")
        
        # Extract text
        text = page.extract_text()
        if text:
            markdown_content.append(text)
        
        markdown_content.append("\n---\n")

# Write to markdown file
with open(output_path, "w", encoding="utf-8") as f:
    f.write("\n".join(markdown_content))

print(f"✓ Converted PDF to Markdown: {output_path}")
