# 🎸 Locations d'Instruments Entre Musiciens

## Nouvelle Fonctionnalité Ajoutée

Cette fonctionnalité permet de gérer les locations d'instruments **entre musiciens** lors d'un concert.

## 📋 Comment ça marche

### Principe
Si un **Musicien A** loue un instrument appartenant à un **Musicien B** :
- **Musicien B** (propriétaire) reçoit **+10€** (ou le montant configuré)
- **Musicien A** (loueur) paye **-10€** (déduit de son cachet final)

### Important
⚠️ Cette location se fait **entre les musiciens**, elle ne concerne pas le groupe. Le montant est transféré directement dans les cachets finaux.

## 🎯 Cas d'Usage

### Exemple 1 : Mahdi loue ses congas à Louis
```
Instrument : Congas
Loueur : Louis (paye -10€)
Propriétaire : Mahdi (reçoit +10€)
Montant : 10€
```

**Résultat** :
- Louis aura **-10€** sur son cachet final
- Mahdi aura **+10€** sur son cachet final

### Exemple 2 : Plusieurs locations
```
1. Pablo loue un djembé à Marine (10€)
2. Manu loue des bongos à Lucile (10€)
```

**Résultat** :
- Pablo : -10€ (location djembé)
- Marine : +10€ (location djembé)
- Manu : -10€ (location bongos)
- Lucile : +10€ (location bongos)

## 💻 Utilisation dans l'Interface

### 1. Section "Locations d'Instruments Entre Musiciens"

Une nouvelle carte a été ajoutée dans le formulaire avec :
- Bouton **"+ Ajouter une Location"**
- Liste des locations configurées

### 2. Ajouter une Location

Pour chaque location, spécifier :
1. **Instrument** : Nom de l'instrument (ex: Congas, Djembé, Bongos...)
2. **Loueur (qui paye)** : Musicien qui utilise l'instrument
3. **Propriétaire (qui reçoit)** : Musicien qui possède l'instrument
4. **Montant** : Prix de la location (par défaut 10€)

### 3. Affichage dans les Résultats

Dans les paiements individuels, chaque musicien voit :
- **Location d'Instrument (reçue)** : +X€ (en vert)
- **Location d'Instrument (payée)** : -X€ (en rouge)

## 🔧 Aspects Techniques

### Modèle de Données

```typescript
export interface InstrumentRental {
  renterName: string;      // Musicien qui loue (paye)
  ownerName: string;        // Musicien propriétaire (reçoit)
  amount: number;           // Montant (typiquement 10€)
  instrument: string;       // Description de l'instrument
}
```

### Calcul des Paiements

```typescript
// Pour chaque musicien:
// 1. Calculer revenus de location
const rentalIncome = instrumentRentals
  .filter(rental => rental.ownerName === musician.name)
  .reduce((sum, rental) => sum + rental.amount, 0);

// 2. Calculer dépenses de location
const rentalExpense = instrumentRentals
  .filter(rental => rental.renterName === musician.name)
  .reduce((sum, rental) => sum + rental.amount, 0);

// 3. Appliquer au total
payment.total = 
  payment.equalShare + 
  payment.seniorityBonus + 
  payment.finderCommission + 
  payment.carAllowance + 
  payment.personalBackline +
  payment.instrumentRentalIncome -   // +X€
  payment.instrumentRentalExpense;   // -X€
```

## 📊 Exemple Complet

### Configuration
- Concert : 1500€
- Musiciens : Mahdi, Lucile, Louis, Marine, Manu, Pablo
- Location : Louis loue les congas de Mahdi (10€)

### Sans location
```
Louis reçoit : 220€
Mahdi reçoit : 228€
```

### Avec location
```
Louis reçoit : 210€ (220€ - 10€ location)
Mahdi reçoit : 238€ (228€ + 10€ location)
```

## 🎨 Interface Utilisateur

### Design
- **Couleur rose/rouge** : Pour distinguer des autres sections
- **Grid layout** : Disposition claire des champs
- **Empty state** : Message quand aucune location
- **Validation** : Tous les champs requis sont validés

### Mobile
- **Responsive** : Layout adapté pour mobile
- **Touch-friendly** : Boutons facilement cliquables

## 🔄 Différence avec "Backline Personnel"

### Backline Personnel (existant)
- Déduit du **montant global**
- Un seul propriétaire
- Payé à l'**association** d'abord
- Ex: Congas utilisées pour le groupe

### Location Entre Musiciens (nouveau)
- Transfert **direct entre musiciens**
- Plusieurs locations possibles
- Montant **ajouté/déduit** des cachets individuels
- Ex: Louis loue personnellement à Mahdi

## ✅ Validation

### Règles de validation
- **Instrument** : Requis, texte libre
- **Loueur** : Requis, liste des musiciens
- **Propriétaire** : Requis, liste des musiciens
- **Montant** : Requis, nombre positif

### Recommandations
- Un musicien ne peut pas se louer à lui-même (à implémenter si nécessaire)
- Le montant par défaut est 10€ mais modifiable
- Plusieurs locations possibles pour le même concert

## 📝 Notes

### Montant Standard
Le montant par défaut est **10€** mais peut être modifié selon :
- Le type d'instrument
- La convention du groupe
- Les accords entre musiciens

### Multiples Locations
Un musicien peut :
- Louer plusieurs instruments à différentes personnes
- Louer à ET de plusieurs personnes simultanément
- Exemple : Mahdi loue ses congas à Louis (+10€) ET loue un djembé à Marine (-10€)

## 🚀 Déploiement

Cette fonctionnalité est **incluse dans le build** et prête pour la production.

Aucune configuration supplémentaire nécessaire !

---

**Feature développée le** : 17 octobre 2025
**Testée et validée** : ✅
**Prête pour production** : ✅

