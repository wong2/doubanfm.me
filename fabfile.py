from fabric.api import *

env.hosts = ['root@vps']

code_dir = '/root/codes/doubanfm.me'

def push():
    local('git push')

# remote pull
def rpull():
    with cd(code_dir):
        run('git pull')

def restart():
    run('forever restart app.js')

def deploy():
    rpull()
    restart()

def all():
    push()
    deploy()
