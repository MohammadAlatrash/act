import os
import ftplib
import shutil
import subprocess
import sys

# --- CONFIGURATION (Athar Production Subfolder) ---
FTP_HOST = "194.55.132.231"
FTP_USER = "u990898762.mistyrose-sardine-562773.hostingersite.com"
FTP_PASS = "Yosr2026!"
FTP_REMOTE_ROOT = "/public_html/athar"

LOCAL_ROOT = os.path.dirname(os.path.abspath(__file__))
EXPORT_DIR = os.path.join(LOCAL_ROOT, 'out')

def run_command(command):
    print(f"Executing: {command}")
    process = subprocess.Popen(command, shell=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    stdout, stderr = process.communicate()
    if process.returncode != 0:
        print(f"❌ Error: {stderr.decode()}")
        return False
    print(stdout.decode())
    return True

def upload_file(ftp, local_path, remote_path):
    print(f"Uploading {local_path} to {remote_path}...", end=" ")
    try:
        with open(local_path, 'rb') as f:
            ftp.storbinary(f'STOR {remote_path}', f)
        print("DONE")
    except Exception as e:
        print(f"FAILED: {e}")

def upload_dir_recursive(ftp, local_dir, remote_dir):
    print(f"Syncing directory {local_dir} to {remote_dir}...")
    try:
        ftp.mkd(remote_dir)
    except:
        pass # Directory likely exists
    
    ftp.cwd(remote_dir)
    
    for item in os.listdir(local_dir):
        if item.startswith('.'):
            continue
        
        l_path = os.path.join(local_dir, item)
        if os.path.isfile(l_path):
            upload_file(ftp, l_path, item)
        elif os.path.isdir(l_path):
            upload_dir_recursive(ftp, l_path, item)
            ftp.cwd('..')

def main():
    print("==================================================")
    print("🚀 ATHAR | أثر - Sovereign Deployer v1.0")
    print("==================================================")
    
    # 1. Build & Export
    print("\n📦 Generating Sovereign Static Export...")
    if not run_command('npm run build'):
        print("❌ Build failed! Deployment aborted.")
        sys.exit(1)
    
    if not os.path.exists(EXPORT_DIR):
        print(f"❌ Error: Export directory '{EXPORT_DIR}' not found.")
        sys.exit(1)
    
    # 2. FTP Connection
    print(f"\n📡 Connecting to Athar Command Center ({FTP_HOST})...")
    try:
        ftp = ftplib.FTP()
        ftp.connect(FTP_HOST, 21, timeout=120)
        ftp.set_pasv(True)
        ftp.login(FTP_USER, FTP_PASS)
        
        try:
            ftp.cwd(FTP_REMOTE_ROOT)
        except:
            print(f"📁 Creating remote directory {FTP_REMOTE_ROOT}...")
            ftp.mkd(FTP_REMOTE_ROOT)
            ftp.cwd(FTP_REMOTE_ROOT)
        
        print("✅ Connection Established. Commencing sync...")
        
        # 3. Recursive Upload of 'out' directory content to remote root
        for item in os.listdir(EXPORT_DIR):
            l_path = os.path.join(EXPORT_DIR, item)
            if os.path.isfile(l_path):
                upload_file(ftp, l_path, item)
            elif os.path.isdir(l_path):
                upload_dir_recursive(ftp, l_path, item)
                ftp.cwd(FTP_REMOTE_ROOT)
        
        ftp.quit()
        print("\n🎉 MISSING COMPLETE! Athar is now live at the production terminal.")
        print("URL: https://mistyrose-sardine-562773.hostingersite.com/")
        
    except Exception as e:
        print(f"❌ FTP Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
