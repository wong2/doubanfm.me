from fabric.api import *

env.hosts = ['root@vps']

code_dir = '/root/codes/doubanfm.me'

def push():
    local('git push')

# remote pull
def rpull():
    with cd(code_dir):
        run('git pull')

def lstart():
    local('forever start app.js')

def restart():
    run('forever restart app.js')
    run('supervisorctl restart all')

def deploy():
    rpull()
    restart()

def all():
    push()
    deploy()

def coffee():
    local('coffee -cw routes/index.coffee & coffee -cw jobs/stats.coffee')

def job():
    local('node jobs/index.js')
