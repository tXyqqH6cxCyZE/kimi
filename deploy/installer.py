#!/bin/env python
#A python 2.X code

"""Read a config.yaml and
1. Download
2. extract
3. copy and create symlinks in the target directories

"""
import urllib2
import yaml
from subprocess import Popen, PIPE
import os
import shutil

def extract(tarball, target_dir):
    """Return a list of extracted files/folders"""

    if os.path.exists(target_dir):
        shutil.rmtree(target_dir)

    os.mkdir(target_dir)
    pipe = Popen("tar xzf %s -C %s" % (tarball, target_dir), shell=True, stdin=PIPE, stdout=PIPE, stderr=PIPE)
    print("Extract tarball output: "+pipe.communicate()[1])
    return map(lambda x: "%s/%s" % (target_dir, x), os.listdir(target_dir))


def download(url, rename):
    filename = 'foobar.tgz'
    if rename is None:
        #do not rename
        filename = os.path.split(url)[-1]
    else:
        filename = rename

    f = urllib2.urlopen(url)
    with open(filename, "wb") as code:
        code.write(f.read())

    return filename

def compile(file, args):
    pass

def install(target_dir, entries, symlinks=None):
    #copy the files from TMPDIR to the target folder
    #create a symlink
    for ent in entries:
        target = target_dir + '/' + os.path.split(ent)[-1]
        if os.path.exists(target):
            print("rm -r " + target)
            shutil.rmtree(target)
        print("copy %s to %s" % (ent, target))
        shutil.copytree(ent, target)

    os.chdir(target_dir)
    for (link, src) in symlinks:
        print("create sym link %s -> %s" % (link, src))
        if os.path.exists(link):
            os.unlink(link)
        os.symlink(src, link)


def main(argv):

    argv.append("config.yaml")
    config_file = argv[1]
    with open(config_file) as cf:
        config = yaml.load(cf)

    if os.environ.has_key("SCRIPT_DIR"):
        cwd = os.environ["SCRIPT_DIR"]
        os.chdir(cwd)

    filename = download(config['GIT_URL'], None)
    entries = extract(filename, config['TMPDIR'])
    #print("get files: " + str(entries))
    install(config['INSTALL_TO'], entries, symlinks=config['SYMLINKS'])


if __name__ == '__main__':
    import sys
    sys.exit(main(sys.argv))

