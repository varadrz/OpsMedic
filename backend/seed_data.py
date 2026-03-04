BASELINE_LOGS = [
    # Dependency Errors
    {"content": "npm ERR! code ERESOLVE\nnpm ERR! ERESOLVE could not resolve dependency peer react@\"^18.0.0\"", "label": "Dependency Error"},
    {"content": "pip install -r requirements.txt\nERROR: No matching distribution found for flask==9.9.9", "label": "Dependency Error"},
    {"content": "ModuleNotFoundError: No module named 'pandas'", "label": "Dependency Error"},
    {"content": "java.lang.ClassNotFoundException: com.mysql.cj.jdbc.Driver", "label": "Dependency Error"},
    
    # Infrastructure / Timeout
    {"content": "Connection timed out after 30000ms\nFATAL: Database cluster is not responding", "label": "Infrastructure Timeout"},
    {"content": "ERROR: Runner lost communication with the server. System is shutting down.", "label": "Infrastructure Timeout"},
    {"content": "Operation timed out. Retrying (3/3)... Failure.", "label": "Infrastructure Timeout"},
    {"content": "ETIMEDOUT: connection attempt to 10.0.0.1 failed", "label": "Infrastructure Timeout"},

    # App Logic / Assertion
    {"content": "AssertionError: 404 != 200 in test_api_response", "label": "Application Logic Error"},
    {"content": "Traceback (most recent call last):\n  File \"app.py\", line 10, in <module>\n    assert result == True", "label": "Application Logic Error"},
    {"content": "junit.framework.AssertionFailedError: expected:<10> but was:<5>", "label": "Application Logic Error"},
    {"content": "self.assertEqual(val, expected)\nAssertionError: 'A' != 'B'", "label": "Application Logic Error"},

    # Syntax / Build Errors
    {"content": "SyntaxError: invalid syntax (line 45, col 10)\n    if x = 5:", "label": "Syntax/Build Error"},
    {"content": "error: expected ';' before '}' token", "label": "Syntax/Build Error"},
    {"content": "Unexpected token < in JSON at position 0", "label": "Syntax/Build Error"},
    {"content": "IndentationError: expected an indented block", "label": "Syntax/Build Error"}
]
