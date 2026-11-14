# Cataclysme

Un jeu de destruction de planètes en pixel art : chaque planète est faite de milliers de pixels, et chaque pixel arraché devient un débris qui suit la gravité.

*English version: [README.en.md](README.en.md)*

## Commandes

- **À la souris ou au doigt** : appuie dans l'espace, tire en arrière comme un lance-pierre et lâche. Les pointillés montrent la trajectoire, courbée par la gravité. Un simple clic lance droit vers le centre.
- **1 à 4** ou **Tab** : changer d'arme (ou clique sur l'arme en bas de l'écran).
- **Au clavier** : les **flèches** déplacent le viseur, **A** et **E** tournent l'angle du tir, **Espace** maintenu règle la puissance et lâcher tire.
- **Manette** : stick gauche ou croix pour le viseur, stick droit ou **LB / RB** pour l'angle, **A** maintenu pour la puissance (relâché : tir), **X** pour l'arme suivante, **Start** pour la pause. Avant la partie, gauche / droite choisissent la planète.
- **P** ou **Échap** : pause. Une pause demandée reste ; si tu changes juste d'onglet, la partie reprend toute seule à ton retour.
- **PLEIN ÉCRAN** : le jeu prend tout l'écran.

## Comment ça marche

- La planète a des couches : **surface**, **roche**, **magma** et un **noyau** très dur. L'intérieur apparaît là où tu creuses.
- Chaque pixel arraché devient un **débris** : lent, il retombe et se recolle en gravats ; rapide, il part dans l'espace pour de bon.
- Plus la planète **maigrit**, moins elle attire : les derniers coups envoient les débris plus loin.
- Les armes sont en **quantité limitée** :
  - **Astéroïde** : un cratère, d'autant plus gros qu'il arrive vite ;
  - **Comète** : elle creuse un tunnel et peut traverser la planète de part en part ;
  - **Bombe** : elle se pose sur la surface puis explose au bout d'un moment, avec un énorme cratère ;
  - **Trou noir** : posé n'importe où, même dans la planète, il arrache et avale tout ce qui l'approche pendant quelques secondes, et dévie les tirs.
- La partie finit quand tout est lancé et que les débris sont retombés. Au-delà de **92 %**, la planète éclate d'un coup.

## Bac à sable

Le bouton **BAC À SABLE** donne toutes les armes **à volonté** (∞) sur **toutes les planètes**, même celles pas encore ouvertes. Rien n'y compte : ni étoiles, ni record. Pour s'amuser à tout casser.

## Le ralenti

Quand la planète éclate (au-delà de 92 %), le temps ralentit quelques secondes, avec deux bandes noires comme au cinéma, pour bien voir les morceaux partir.

## Les planètes

Sept planètes : **Rocaille**, **Givre** (glace), **Brasier** (veines de lave), **Ceinture** (des rochers en orbite arrêtent les tirs), **Ferrum** (métal très dur), **Azur** (océans et continents) et **Titan**. Chacune donne jusqu'à **trois étoiles** selon le pourcentage détruit (les seuils sont affichés avant de commencer) ; une étoile ouvre la suivante.

## Statistiques

Le panneau Records garde le **record** (meilleur pourcentage) et les **étoiles** de chaque planète, le nombre de **planètes détruites** et le total des étoiles.

## Données et synchronisation

Tes scores sont enregistrés par NeoDex, sauvegardés et synchronisés entre tes PC si la synchro est activée.

## Installer

Dans NeoDex : **NeoStore → À découvrir → Cataclysme → Installer**.

Développer un plugin : voir le [SDK NeoDex](https://github.com/NDesumeur/neodex-sdk).
