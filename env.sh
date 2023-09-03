#!/bin/bash

echo PORT=$PORT >> Eashire/.env
echo OAUTH_SCOPES=$OAUTH_SCOPES >> Eashire/.env
echo OAUTH_REDIRECT_URI=$OAUTH_REDIRECT_URI >> Eashire/.env
echo OAUTH_AUTHORITY=$OAUTH_AUTHORITY >> Eashire/.env
echo OAUTH_APP_SECRET=$OAUTH_APP_SECRET >> Eashire/.env
echo OAUTH_APP_ID=$OAUTH_APP_ID >> Eashire/.env
echo NODE_ENV=$NODE_ENV >> Eashire/.env
echo RESSOURCE_BASE_PATH=$RESSOURCE_BASE_PATH >> Eashire/.env
echo ADMIN_FILES_BASE_PATH=$DMIN_FILES_BASE_PATH >> Eashire/.env
echo SEQUELIZE_SYNC=TRUE >> Eashire/.env
#force
