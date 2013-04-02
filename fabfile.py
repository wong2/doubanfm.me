from fabric.api import *
from os.path import expanduser

env.hosts = ['root@vps']

code_dir = expanduser('~') + '/codes/doubanfm.me'

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

def coffee():
    local('coffee -cw routes/index.coffee & coffee -cw jobs/stats.coffee')
