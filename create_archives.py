import os
import zipfile

def make_zip(source_dirs, output_filename, base_dir="."):
    print(f"Creating {output_filename}...")
    with zipfile.ZipFile(output_filename, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for item in source_dirs:
            item_path = os.path.join(base_dir, item)
            if os.path.isfile(item_path):
                zipf.write(item_path, arcname=item)
            elif os.path.isdir(item_path):
                for root, dirs, files in os.walk(item_path):
                    # Filter out node_modules and dist
                    dirs[:] = [d for d in dirs if d not in ('node_modules', 'dist', '.git', '__pycache__')]
                    for file in files:
                        if file.endswith('.zip'):
                            continue
                        file_path = os.path.join(root, file)
                        rel_path = os.path.relpath(file_path, base_dir)
                        zipf.write(file_path, arcname=rel_path)
    print(f"Done: {output_filename} ({os.path.getsize(output_filename)} bytes)")

os.makedirs("public", exist_ok=True)

# 1. Fullstack zip
make_zip(["backend", "frontend", "README.md", "schema.sql"], "public/campuskart-fullstack.zip")
make_zip(["backend", "frontend", "README.md", "schema.sql"], "campuskart-fullstack.zip")

# 2. Backend zip
make_zip(["backend"], "public/campuskart-backend.zip")
make_zip(["backend"], "campuskart-backend.zip")

# 3. Frontend zip
make_zip(["frontend"], "public/campuskart-frontend.zip")
make_zip(["frontend"], "campuskart-frontend.zip")

print("All archives generated successfully.")
