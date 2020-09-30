#!/bin/bash


#set -e
#set -x
#
#JOB_ENV=$1
#CLUSTER=`python ./deploy/find_cluster.py ${JOB_ENV}`
#
#rm -rf release/
#mkdir -p release
#
#source ./env.sh
#done=$( env_detect )
#if ! $done
#then
#    source ./install.sh
#fi
#
#npm config set registry http://registry.npm.taobao.org/
#npm install
#if [ ${CLUSTER} == "staging" ]
#then
#    npm run build
#elif [ ${CLUSTER} == "preview" ]
#then
#    npm run prod
#else
#    npm run prod
#fi
#
#cp -r dist/* deploy release/


# Use the following deployment scripts for temporary use. Once the xbox compiler works, try delete the following script and uncomment the scripts above
# set -x
# set -e

# JOB_ENV=$1
# CLUSTER=`python ./deploy/find_cluster.py ${JOB_ENV}`
# export SCRIPT_DIR=`cd $(dirname $0); pwd -P`
# cd ${SCRIPT_DIR}
# rm -rf release/

# export NVM_DIR="/root/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# npm i

# if [ ${CLUSTER} == "staging" ]
# then
#     npm run staging
# elif [ ${CLUSTER} == "dev" ]
# then
#     npm run dev
# elif [ ${CLUSTER} == "preview" ]
# then
#     npm run prod
# elif [ ${CLUSTER} == "preview-c4" ]
# then
#     npm run preview-c4
# else
#     npm run prod
# fi

# mkdir -p release

# cp -r dist/* deploy release/

#!/bin/bash


set -e
set -x

##### static
JOB_ENV=$1
CLUSTER=`python ./deploy/find_cluster.py ${JOB_ENV}`
export JOB_HOME_PWD=`pwd`

export NVM_DIR="/root/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

#cat /root/v.txt
##### static

rm -rf release/
mkdir release

#cp -r /root/node_moduleses/kingmi-ui/node_modules ./
npm i

if [ ${CLUSTER} == "staging" ]
then
    npm run staging
elif [ ${CLUSTER} == "dev" ]
then
    npm run dev
elif [ ${CLUSTER} == "preview" ]
then
    npm run prod
elif [ ${CLUSTER} == "preview-c4" ]
then
    npm run preview-c4
else
    npm run prod
fi

mkdir -p release
cp -r dist/* deploy release/
