export NODE_EXTRA_CA_CERTS="/tmp/mega.pem"

# If the mega.pem file does not exist, create it from the system keychain and /etc/secrets directory
if [ ! -f "$NODE_EXTRA_CA_CERTS" ]; then
    # Extract certificates from the system keychain
    security find-certificate -a -p /Library/Keychains/System.keychain > "$NODE_EXTRA_CA_CERTS"

    # Append any .pem files from /etc/secrets directory
    for pem_file in /etc/secrets/*.pem; do
        if [ -f "$pem_file" ]; then
            cat "$pem_file" >> "$NODE_EXTRA_CA_CERTS"
        fi
    done
fi