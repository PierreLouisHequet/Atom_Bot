//************************* REGION VARIABLES GLOBALES *************************

var Discord = require('discord.js');
var auth = require('./auth.json');
var client = new Discord.Client();

// Modifier les ids en fonction du serveur
var IdChannelVoteCandidature = '615495564183863296';
var IdRoleMembre = '615871309938950147';

//************************* REGION EVENTS *************************************

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
    var message = msg.content;
    if (message.substring(0, 1) == '!') {
        var args = message.substring(1).split(' ');
        var cmd = args[0];
        var param = args[1];
        var message = args.toString();
        switch (cmd) {
            //!votecandid {@recrue}
            case 'votecandid':
                votecandid(param);
                break;

            //!candidaccept {@recrue}
            case 'candidaccept':
                candidaccept(param);
                break;

            //!candidrefuse {@recrue}
            case 'candidrefuse':
                candidrefuse(param);
                break;

            //!accept {@recrue}             = creation message dans le chanel #validation-période-d-essai avec sondage, 2vote :green_apple: :apple: + supresion rank @Candidats +ajout rank @Membre de Guilde  + evois un message de felicitation et toute la doc avec le lien du ds alli.
            case 'accept':

                break;

            //!refuse {@recrue}              = supresion rank @Candidats  + voir kik ? + evois un message de negatif au candidat *
            case 'refuse':

                break;

            //!essaiaccept {@recrue}   = supresion message #validation-période-d-essai
            case 'essaiaccept':

                break;

            //!essairefuse {@recrue}    = supresion message #validation-période-d-essai + supresion rank @Membre de Guilde + evois un message de negatif au candida * + voir kik ?
            case 'essairefuse':

                break;
            //!help
            case "help":
                msg.channel.send({
                    embed: {
                        color: 3447003,
                        title: "Liste des commandes:",
                        fields: [
                            { name: "Commandes", value: "!help\n!votecandid @recrue\n!candidaccept @recrue\n!candidrefuse @recrue\n!", inline: true },
                            //{ name: "Paramètres", value: "\n@recrue\n@recrue\n@recrue", inline: true },
                            { name: "Description", value: "Affiche les commandes disponibles\nAlsoLine1\nAlsoLine2\nAndLine3", inline: true }
                        ],
                        description: "Si cela t'a aidé, n'hésite pas à 👍. Sinon 👎",
                    }
                }).then(message => addReactionLoL(message));
                break;
            //!mp
            case 'mp':
                mp(param, message);
                break;
            //!clean
            case 'clean':
                cleanChan(param);
                break;
            //!stop 
            case 'stop':
                client.destroy();
                break;
        }
    }
});

//************************* REGION MAIN PROGRAM *******************************

client.login(auth.token);

//************************* REGION FONCTIONS **********************************

function addReactionLoL(message) {
    //message.react('🤣');
    message.react("👍");
    message.react("👎");
}

function votecandid(recrue) {
    //Génère un message pour démarer le vote, puis on vient mettre les reactions ensuite (async)
    client.channels.get(IdChannelVoteCandidature)
        .send('Lancement des votes pour la candidature de ' + recrue)
        .then(message => addReactionsVote(message));
    }

function addReactionsVote(message) {
    //Les reactions ne sont pas insérés dans le sens indiqués
    message.react('🍏');
    message.react('🍎');
    message.react('🏳');
}

function candidaccept(recrue) {
    var messageAccept = "Ta candidature, chez Atom, a été acceptée";
    var etatAccept = "Candidature acceptée";
    //Gestion de suivi de candidature
    CopieEtSupprimeCandid(recrue, etatAccept);
    //On Supprime le message du vote pour le candidat
    supprimerMessageVote(recrue); 
    //On envoi un message privé au candidat
    envoyerMessagePrive(recrue, messageAccept);
    //On change les roles du candidat
    
}

function candidrefuse(recrue) {
    var messageRefuse = "Ta candidature, chez Atom, a été refusée";
    var etatRefus = "Candidature refusée";
    //Gestion de suivi de candidature
    CopieEtSupprimeCandid(recrue, etatRefus);
    //Supprime le message du vote pour le candidat
    supprimerMessageVote(recrue); 
    //Envoi un message privé au candidat
    envoyerMessagePrive(recrue, messageRefuse);
    //Envoi un message privé aux meneurs pour kick le candidat du serveur

}

function CopieEtSupprimeCandid(recrue,etat) {
    //Copie le message de candidature vers le salon suivi-candidature (mentionne le candidat et indique l'état de la candidature)

    //Supprime le message de candidature du candidat

}

function supprimerMessageVote(recrue) {
    //Récupère les messages du channel (async)
    var textChan = client.channels.get(IdChannelVoteCandidature);
    textChan.fetchMessages().then(messages => SupprimerMessageAyantRecrue(messages, recrue));
}

function SupprimerMessageAyantRecrue(messagesListe, recrue) {
    //Supprime les messages contenant le nom du candidat
    var ListeMessages = messagesListe;
    for (var [clé, valeur] of ListeMessages) {
        if (valeur.content.includes(recrue)) {
            valeur.delete();
        }
    }
}


function envoyerMessagePrive(recrue, message) {
    //Enleve les <@ et > de fin de l'id
    var longueur = recrue.length;
    var candidat = recrue.substring(2, longueur - 1);
    //Recupère le candidat pour le MP ensuite (async)
    client.fetchUser(candidat).then((user) => {
        user.send(message);
    });
}

function accept(recrue) {

}

function refuse(recrue) {

}

function essaiaccept(recrue) {

}

function essairefuse(recrue) {

}

function mp(recrue,message) {
    //Enleve les <@ et > de fin de l'id
    var longueur = recrue.length;
    var candidat = recrue.substring(2, longueur - 1);
    //Recupère le candidat pour le MP ensuite (async)
    client.fetchUser(candidat).then((user) => {
        user.send(message);
    });

    //293460400324739078 -- ID de ZemZemus
}

function cleanChan(channel) {
    var longueur = channel.length;
    var chan = channel.substring(2, longueur - 1);
    var textChan = client.channels.get(chan);
    textChan.fetchMessages().then(messages => SupprimerMessages(messages));
}

function SupprimerMessages(messagesListe) {
    //Supprime les messages dans la limite que discord impose ("Charger les anciens messages")
    var ListeMessages = messagesListe;
    for (var [clé, valeur] of ListeMessages) {
            valeur.delete();
    }
}