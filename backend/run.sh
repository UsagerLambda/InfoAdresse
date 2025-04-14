#!/bin/bash
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload &
sleep 3 && find . -type d -name '__pycache__' -exec rm -r {} +
wait
find . -type d -name '__pycache__' -exec rm -r {} +
