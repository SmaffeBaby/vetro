#!/usr/bin/env python3
"""Cold-copy MagnatProfessional volumes into empty Vetro volumes."""
import subprocess


def docker(*args):
    return subprocess.check_output(['docker', *args], text=True).strip()


for source, target in [
    ('magnat-professional_db-data', 'vetro_db-data'),
    ('magnat-professional_db-config', 'vetro_db-config'),
    ('magnat-professional_storage-data', 'vetro_storage-data'),
]:
    docker('volume', 'inspect', source)
    for volume in [source, target]:
        if docker('ps', '-q', '--filter', f'volume={volume}'):
            raise SystemExit(f'Stop all containers using {volume} before copying.')
    docker('volume', 'create', target)
    subprocess.run([
        'docker', 'run', '--rm',
        '--mount', f'type=volume,src={source},dst=/source,readonly',
        '--mount', f'type=volume,src={target},dst=/target',
        'alpine', 'sh', '-ec',
        '[ -z "$(ls -A /target)" ] || { echo "Target is not empty; refusing to overwrite"; exit 1; }; '
        'cp -a /source/. /target/; sync',
    ], check=True)
    print(f'Copied {source} -> {target}', flush=True)
