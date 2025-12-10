import os
import uuid
import shutil
import time
import asyncio
from typing import List
from fastapi import UploadFile
from datetime import datetime, timedelta

TEMP_DIR = "temp"
UPLOAD_DIR = "uploads"
CLEANUP_AFTER_HOURS = 1  # Delete files after 1 hour

def ensure_directories():
    """Create necessary directories if they don't exist"""
    os.makedirs(TEMP_DIR, exist_ok=True)
    os.makedirs(UPLOAD_DIR, exist_ok=True)

def generate_unique_filename(original_filename: str) -> str:
    """Generate a unique filename"""
    ext = os.path.splitext(original_filename)[1]
    return f"{uuid.uuid4()}{ext}"

async def save_upload_file(upload_file: UploadFile, directory: str = UPLOAD_DIR) -> str:
    """Save uploaded file to disk"""
    ensure_directories()
    filename = generate_unique_filename(upload_file.filename)
    file_path = os.path.join(directory, filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(upload_file.file, buffer)
    
    return file_path

async def save_multiple_files(upload_files: List[UploadFile], directory: str = UPLOAD_DIR) -> List[str]:
    """Save multiple uploaded files"""
    file_paths = []
    for upload_file in upload_files:
        file_path = await save_upload_file(upload_file, directory)
        file_paths.append(file_path)
    return file_paths

def cleanup_files(file_paths: List[str]):
    """Delete files from disk"""
    for file_path in file_paths:
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        except Exception as e:
            print(f"Error deleting {file_path}: {e}")

def get_file_size(file_path: str) -> int:
    """Get file size in bytes"""
    return os.path.getsize(file_path)

def cleanup_old_files():
    """Delete files older than CLEANUP_AFTER_HOURS"""
    ensure_directories()
    current_time = time.time()
    cutoff_time = current_time - (CLEANUP_AFTER_HOURS * 3600)  # Convert hours to seconds
    
    deleted_count = 0
    
    # Clean up TEMP_DIR
    for filename in os.listdir(TEMP_DIR):
        file_path = os.path.join(TEMP_DIR, filename)
        try:
            if os.path.isfile(file_path):
                file_age = os.path.getmtime(file_path)
                if file_age < cutoff_time:
                    os.remove(file_path)
                    deleted_count += 1
                    print(f"Deleted old file: {file_path}")
            elif os.path.isdir(file_path):
                dir_age = os.path.getmtime(file_path)
                if dir_age < cutoff_time:
                    shutil.rmtree(file_path)
                    deleted_count += 1
                    print(f"Deleted old directory: {file_path}")
        except Exception as e:
            print(f"Error cleaning up {file_path}: {e}")
    
    # Clean up UPLOAD_DIR
    for filename in os.listdir(UPLOAD_DIR):
        file_path = os.path.join(UPLOAD_DIR, filename)
        try:
            if os.path.isfile(file_path):
                file_age = os.path.getmtime(file_path)
                if file_age < cutoff_time:
                    os.remove(file_path)
                    deleted_count += 1
                    print(f"Deleted old file: {file_path}")
        except Exception as e:
            print(f"Error cleaning up {file_path}: {e}")
    
    if deleted_count > 0:
        print(f"Cleanup complete: Deleted {deleted_count} old file(s)")
    
    return deleted_count

async def schedule_cleanup_task():
    """Background task to periodically clean up old files"""
    while True:
        try:
            cleanup_old_files()
        except Exception as e:
            print(f"Error in cleanup task: {e}")
        
        # Run cleanup every 30 minutes
        await asyncio.sleep(1800)
