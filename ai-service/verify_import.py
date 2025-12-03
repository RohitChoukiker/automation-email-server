import sys
import os

# Add the current directory to sys.path to ensure imports work as expected
sys.path.append(os.getcwd())

try:
    from ai_client import analyze_email
    print("SUCCESS: analyze_email imported successfully.")
except ImportError as e:
    print(f"FAILURE: ImportError: {e}")
    sys.exit(1)
except Exception as e:
    print(f"FAILURE: Unexpected error: {e}")
    sys.exit(1)
