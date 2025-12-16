# 🎭 Eternalys

**Jeu de rôle par Antoine Eymard**

## Description

Eternalys est un jeu de rôle immersif développé avec les technologies web modernes.

## Technologies

- ⚡ **Vite** - Build tool ultra-rapide
- ⚛️ **React 18** - Bibliothèque UI
- 📘 **TypeScript** - Typage statique
- 🎨 **CSS Modules** - Styles modulaires
- 🗄️ **Supabase** - Base de données (eternalys-db)
- 🤖 **OpenAI API** - Fonctionnalités IA
- 🌍 **DeepL API** - Traduction multilingue

## Installation

```bash
npm install
```

## Développement

```bash
npm run dev
```

## Build

```bash
npm run build
```

## Variables d'environnement

Le projet utilise les variables d'environnement suivantes (configurées sur Vercel) :

| Variable | Description |
|----------|-------------|
| `OPENAI_API_KEY` | Clé API OpenAI pour les fonctionnalités IA |
| `DEEPL_API_KEY` | Clé API DeepL pour la traduction |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_ANON_KEY` | Clé anonyme Supabase |

Pour le développement local, créez un fichier `.env.local` :
```
VITE_OPENAI_API_KEY=votre_clé_openai
VITE_DEEPL_API_KEY=votre_clé_deepl
VITE_SUPABASE_URL=votre_url_supabase
VITE_SUPABASE_ANON_KEY=votre_clé_supabase
```

## Déploiement

Exécutez le script de déploiement :
```bash
./deploy.bat
```
Ou directement en PowerShell :
```powershell
./deploy.ps1
```

## Auteur

**Antoine Eymard**

---

*Eternalys © 2024*

