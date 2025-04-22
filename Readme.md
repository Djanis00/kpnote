# KeepNote

KeepNote est une application mobile de prise de notes et de gestion de tâches, inspirée de Google Keep.  
Développée avec React Native, Expo et expo-router, l'application permet aux utilisateurs de :

- Créer, modifier, supprimer des notes
- Gérer des tâches avec sous-tâches
- Organiser leurs contenus avec des catégories colorées
- Utiliser un mode clair/sombre
- Et profiter d'une interface simple et moderne

## Technologies utilisées

- Expo
- React Native
- expo-router
- SecureStore (Expo)
- TypeScript
- Jest + Testing Library

## Sécurité

- Authentification via API externe (jeton JWT)
- Jeton sécurisé avec `expo-secure-store`
- Chiffrement possible avec `expo-crypto`
- Validation des champs côté client

## Tests unitaires

Tests réalisés avec :

- jest
- @testing-library/react-native

Voir le dossier `__tests__` :
- `auth.test.tsx` : test de l'écran de connexion
- `notes.test.tsx` : test du rendu des notes
- `secure.test.tsx` : test du stockage sécurisé
