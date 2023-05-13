"""
not used
"""

import sys
import os

# db_url = "postgresql://postgres:t9D56xfRPPqGdKids7I68O64glP5dKH4yUS5H52L2bnFMgHaHq@localhost:7000/ai-art-collections"

if len(sys.argv) >= 2:
    db_url = sys.argv[1]

with open('alembic.ini', 'r') as f:
    file_content = f.read()

file_content = file_content.replace("{{{DATABASE_HOST_URL}}}", db_url)

with open('alembic.ini', 'w') as f:
    f.write(file_content)

# raise Exception(repr(db_url))