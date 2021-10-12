#!/bin/sh

SESSION_NAME="dev"
STRAPI_WINDOW_NAME="strapi"
APP_WINDOW_NAME="app"

echo "Creating Session"
tmux new-session -A -s $SESSION_NAME -n $STRAPI_WINDOW_NAME -d
echo "Session created"
tmux send-keys -t $STRAPI_WINDOW_NAME "cd /home/dev/lively4/strapi/my-project" C-m
tmux send-keys -t $STRAPI_WINDOW_NAME "yarn develop" C-m

tmux new-window -n $APP_WINDOW_NAME
tmux send-keys -t $APP_WINDOW_NAME "cd /home/dev/projects/bp-gallery" C-m
tmux send-keys -t $APP_WINDOW_NAME "yarn start" C-m
