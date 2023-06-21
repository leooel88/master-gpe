#!/bin/bash

# Récupérer les PIDs des processus 'node'
pids=$(ps -ef | grep '[n]ode' | awk '{print $2}')

# Si aucun PID n'est trouvé, informer l'utilisateur et terminer le script
if [ -z "$pids" ]; then
    echo "Aucun processus 'node' n'a été trouvé."
    exit 1
fi

# Parcourir chaque PID et tenter de le tuer
for pid in $pids
do
    echo "Processus 'node' trouvé avec le PID: $pid. Tentative de kill..."
    kill $pid
    if [ $? -eq 0 ]; then
        echo "Processus 'node' avec le PID $pid a été tué avec succès."
    else
        echo "Échec du kill du processus 'node' avec le PID $pid. Vous 
devrez peut-être essayer avec 'kill -9 $pid'."
    fi
done
