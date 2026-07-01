Aqui está um prompt completo que podes usar no ChatGPT, Claude, Cursor, Lovable, Bolt.new ou qualquer gerador de aplicações:

---

# PROMPT

Cria uma aplicação web moderna e responsiva chamada **betNANDO**, focada em apostas entre amigos com créditos virtuais.

## Objetivo

Permitir que grupos de amigos façam apostas de futebol utilizando odds reais obtidas através de APIs gratuitas, sem dinheiro real envolvido.

Todos os utilizadores começam com **100 créditos virtuais** e competem num ranking geral.

---

## Tecnologias

* Frontend: React + TypeScript + Tailwind CSS
* Backend: Node.js + Express
* Base de dados: PostgreSQL
* Autenticação: JWT + Password Hashing (bcrypt)
* ORM: Prisma
* Deploy preparado para Vercel e Railway

---

## Segurança

Implementar:

* Login seguro
* Registo de utilizadores
* Passwords encriptadas com bcrypt
* JWT Authentication
* Proteção contra SQL Injection
* Proteção contra XSS
* Rate Limiting
* Validação de inputs
* Sessões seguras
* Controlo de permissões

---

## Sistema de Utilizadores

Cada utilizador possui:

* ID
* Nome
* Email
* Password Hash
* Data de criação
* Saldo virtual
* Número de apostas
* Número de apostas ganhas
* ROI
* Lucro
* Ranking

Saldo inicial:

```text
100 créditos
```

---

## Sistema de Grupos

Permitir:

* Criar grupo privado
* Código de convite
* Entrar num grupo
* Administrador do grupo
* Ranking por grupo
* Ranking global

---

## Dashboard

Mostrar:

* Saldo atual
* Lucro/prejuízo
* Últimas apostas
* Ranking
* Jogos disponíveis
* Jogos em direto
* Bilhetes ativos

---

## API de Futebol

Utilizar exclusivamente APIs gratuitas.

Prioridade:

1. TheSportsDB
2. Football-Data.org
3. API-Football Free Plan
4. ScoreBat

Criar uma camada de abstração para que seja fácil trocar de API.

---

## Mercados de Aposta

Implementar:

### Resultado Final

* Vitória Casa
* Empate
* Vitória Fora

### Dupla Hipótese

* 1X
* X2
* 12

### Total de Golos

* Over 0.5

* Over 1.5

* Over 2.5

* Over 3.5

* Under 0.5

* Under 1.5

* Under 2.5

* Under 3.5

### Ambas Marcam

* Sim
* Não

### Resultado ao Intervalo

* Casa
* Empate
* Fora

### Handicap

* Handicap Europeu
* Handicap Asiático simplificado

### Resultado Correto

* 0-0
* 1-0
* 2-0
* 2-1
* etc.

### Mercado de Cantos

* Over/Under Cantos

### Mercado de Cartões

* Over/Under Cartões

---

## Sistema de Odds

As odds devem:

* Ser importadas automaticamente das APIs quando disponíveis.
* Caso a API não forneça odds, gerar odds estimadas com base em:

  * Forma recente
  * Classificação
  * Golos marcados
  * Golos sofridos
  * Elo Rating

Atualizar odds periodicamente.

---

## Sistema de Bilhete

Permitir múltiplas seleções.

Exemplo:

```text
Benfica vence @1.80
Over 2.5 @1.90
Sporting vence @1.70
```

Odd combinada:

```text
1.80 × 1.90 × 1.70
```

Stake:

```text
10 créditos
```

Retorno:

```text
Stake × Odd Total
```

---

## Liquidação Automática

Criar um serviço automático que:

### A cada 5 minutos

1. Procura apostas pendentes.
2. Consulta resultados dos jogos.
3. Verifica cada mercado.
4. Determina se a seleção venceu ou perdeu.
5. Atualiza estado do bilhete.

Estados:

```text
Pendente
Ganha
Perdida
Cancelada
```

---

## Pagamento Automático

Quando uma aposta vence:

```text
Saldo += Stake × Odd Total
```

Atualizar:

* Histórico
* Ranking
* Estatísticas

Tudo automaticamente.

---

## Ranking

Mostrar:

### Ranking Global

* Nome
* Saldo
* Lucro
* ROI

### Ranking do Grupo

* Nome
* Saldo
* Lucro
* ROI

Ordenar por saldo.

---

## Histórico

Guardar:

* Data
* Bilhete
* Odds
* Stake
* Resultado
* Lucro

Filtros:

* Hoje
* Semana
* Mês
* Tudo

---

## Estatísticas

Mostrar:

* Taxa de acerto
* Lucro total
* ROI
* Melhor odd ganha
* Maior sequência de vitórias
* Maior sequência de derrotas

---

## Notificações

Enviar:

* Aposta criada
* Aposta ganha
* Aposta perdida
* Mudança de ranking

---

## Painel de Administração

Permitir:

* Bloquear utilizadores
* Editar saldo
* Reprocessar apostas
* Ver logs
* Gerir grupos

---

## Interface

Estilo semelhante a:

* Bet365
* Flashscore
* Sofascore

Com:

* Tema escuro
* Tema claro
* Design moderno
* Mobile First

---

## Regras Importantes

* Apenas créditos virtuais.
* Sem utilização de dinheiro real.
* Sem pagamentos reais.
* Sem depósitos.
* Sem levantamentos.
* Todo o sistema é apenas para competição entre amigos.

---

## Extra

Criar também:

* API REST completa
* Documentação Swagger
* Seed inicial da base de dados
* Testes automáticos
* Docker Compose
* Scripts de instalação
* README completo

Gerar o projeto completo com estrutura profissional de produção, código limpo, escalável e pronto para deploy.

---

**Nota importante:** o requisito "API grátis sem qualquer custo e sem máximos" não é realista. Praticamente todas as APIs de futebol têm limites de utilização, mesmo nos planos gratuitos. O ideal é usar fontes gratuitas como Football-Data.org e TheSportsDB, implementar cache local e atualizar resultados periodicamente para reduzir chamadas à API.
