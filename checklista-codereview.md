# Checklista för code review 

## Kod kvalité och funtionalitet
- [ ] Gör koden det den ska göra?
- [ ] Hanteras edge cases? 
- [ ] Är koden lätt att läsa?
- [ ] Finns det onödig dupplicering? 

## Säkerhet och prestanda 

- [ ] Läcks känslig information (tex. lösenord, tokens, API nycklar)?
- [ ] Finns det risk för SQL-injections eller osäker data? 
- [ ] Hanteras input på ett korrekt och säkert sätt?
- [ ] Finns det onödiga loopar eller tunga operationer?
- [ ] Görs databasanrop i onödan? 

- [ ] test