#!/bin/bash

# Validate arguments
if [ "$#" -ne 1 ]; then
    echo "Usage: $0 <NewModuleName>"
    exit 1
fi

# Function to recursively rename files and directories and their content
rename_files() {
    local src_path="$1"
    local dest_path="$2"
    local new_module="$3"

    for item in $(ls "$src_path"); do
        local old_path="$src_path/$item"

        # Replace 'user' and 'User' with new_module in file or folder name
        local new_item=$(echo "$item" | \
            sed -e "s/Templates/${new_module^}s/g" \
                -e "s/Template/${new_module^}/g" \
                -e "s/templates/${new_module}s/g" \
                -e "s/template/$new_module/g")

        local new_path="$dest_path/$new_item"

        # If directory, create new directory and recurse
        if [ -d "$old_path" ]; then
            mkdir -p "$new_path"
            rename_files "$old_path" "$new_path" "$new_module"
        else
            # If file, copy over and replace content
            sed -e "s/Templates/${new_module^}s/g" \
                -e "s/Template/${new_module^}/g" \
                -e "s/templates/${new_module}s/g" \
                -e "s/template/$new_module/g" "$old_path" > "$new_path"
        fi
    done
}

# Main script starts here
new_module="$1"
src_dir="./src/modules/templates"
dest_dir="./src/modules/${new_module}s"

# Create destination directory
mkdir -p "$dest_dir"

# Call function to rename files, directories, and content
rename_files "$src_dir" "$dest_dir" "$new_module"