from markitdown import MarkItDown
import sys
import json

try:
    input_file = sys.argv[1]
    md = MarkItDown()
    result = md.convert(input_file)
    print(json.dumps({"markdown": result.text_content}))
except Exception as e:
    print(json.dumps({"error": str(e)}), file=sys.stderr)
    sys.exit(1)
