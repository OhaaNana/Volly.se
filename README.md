# Volly 

### Skapad av Zero Bug Heroes 

https://volly-staging.cc.k3s.chas-lab.dev/ 

Volly är en volontär app som kopplar ihop människor som behöver hjälp med vardagliga sysslor med människor som vill hjälpa till.
Man ska kunna skapa inlägg där man antingen ber om hjälp eller erbjuder sig hjälpa andra. Det kan va allt från vanliga vardags sysslor men även tekniska grejer.
När man fått kontakt med någon så kan man både chatta eller ha videosamtal med andra. 

## Skärmdump 

![Volly](Skärmavbild_2026-05-27_kl._14.14.45.png)

## Kom igång 

### Krav 

- Bun installerat 
- Docker installerat
- Node och npm installerat  


### Installation

Klona repot:
```bash 
git clone https://git.chas-lab.dev/chas-challenge-2026/grupp-15/zero-bug-heroes/zero-bug-heroes.git
cd zero-bug-heroes 
``` 

Installera dependencies: 
```bash 
bun install 
```

### Kör lokalt 

Starta databasen: 
```bash 
docker compose up -d 
```

Starta backend:
```bash 
bun run dev:backend 
```

Starta frontend (Vite):
```bash 
npm run dev 
```

### Pipeline 

CI/CD pipelinen kör följande steg: 

- **Install** - installerar 
- **Quality** - kör ESlint och Prettier 
- **Test** - kör smoke tests vid merge requests
- **Build** - bygger och pushar Docker-images 
- **Deploy** - driftsätter till staging eller produktion 


# Smoke tests 

Smoke tests verifierar att frontend och backend svarar: 

```bash
bun run frontend.smoketest.ts
bun run backend.smoketest.ts 
```







