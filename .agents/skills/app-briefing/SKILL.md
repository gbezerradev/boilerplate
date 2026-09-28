---
name: app-briefing
description: Conduz discovery de produto para novos apps e gera briefings de produto e MVP em Markdown, organizados no projeto.
---

# Briefing de Apps

Use esta skill quando alguém estiver começando um app ou precisar transformar uma ideia de produto em um briefing claro para iniciar o projeto. O resultado deve ajudar produto, design e engenharia a entender qual problema resolver e qual é o primeiro escopo a construir.

Conduza a conversa e escreva os documentos em português, a menos que a pessoa peça outro idioma. Faça uma pergunta por vez. Não transforme a conversa em um formulário: use as respostas para escolher a próxima pergunta, evitar repetições e esclarecer contradições. Seja breve, concreto e acolhedor.

## Conduza o discovery

Explore os temas abaixo na ordem que melhor se encaixar na conversa; aprofunde somente o que for importante para entender o app:

1. **Problema e contexto:** o que está acontecendo hoje, com quem, em que situação e por que isso importa agora. Peça um exemplo recente quando ajudar a distinguir um problema real de uma ideia de solução.
2. **Pessoas usuárias:** quem sente o problema, quem usará o app e, quando forem pessoas diferentes, quem decide ou paga. Entenda necessidades e contexto de uso sem inventar personas.
3. **Alternativas e resultado desejado:** como as pessoas resolvem isso hoje e o que mudaria para elas se o problema fosse resolvido.
4. **Proposta e MVP:** qual solução a pessoa imagina, quais tarefas essenciais o app precisa permitir e o que pode ficar para depois. Diferencie necessidades confirmadas de funcionalidades sugeridas.
5. **Fluxos e regras relevantes:** percorra os principais passos da experiência, papéis ou permissões, conteúdo/dados necessários e regras que mudem o comportamento do produto.
6. **Sucesso e restrições:** como reconhecer valor no MVP e quais limites importam, como plataforma, integrações, prazo, orçamento, privacidade, acessibilidade ou requisitos regulatórios.

Pergunte o nome do app e qualquer informação necessária para distinguir público, papéis ou fluxo somente quando ainda não puder inferi-la com segurança. Não force respostas para tópicos irrelevantes. Se uma resposta for vaga ou contraditória, faça uma pergunta de esclarecimento focada antes de registrá-la como fato.

Não afirme que uma hipótese foi validada por usuários, pesquisa ou dados sem evidência fornecida ou efetivamente consultada. Marque como hipótese o que for uma crença ainda não verificada. Registre informação ausente como pendência, sem preenchê-la com invenções. Mantenha o escopo no produto e no MVP; não amplie para pesquisa de mercado, análise de concorrentes ou arquitetura detalhada, a menos que a pessoa solicite.

## Feche e confirme o entendimento

Quando houver contexto suficiente para um briefing útil, apresente uma síntese curta com problema, público, resultado desejado, proposta de MVP e principais dúvidas. Peça à pessoa que corrija ou confirme essa síntese antes de gravar os arquivos. Incógnitas não impedem a conclusão: depois que a pessoa confirmar que o resumo representa o entendimento atual, registre-as como pendências e gere o pacote. Se a pessoa pedir explicitamente para finalizar sem nova rodada, faça a melhor síntese possível e sinalize claramente o que permaneceu incerto.

## Gere os documentos

Salve o pacote na raiz do projeto atual, em `docs/briefings/<slug>/`. Derive `<slug>` do nome do app em minúsculas, usando hífens e sem acentos. Se o nome do app ainda não for conhecido, pergunte antes de criar os arquivos.

Antes de escrever, confira se a pasta de destino e os arquivos já existem. Para um briefing existente, leia o conteúdo e atualize-o preservando informações confirmadas e anotações manuais que continuem válidas. Não apague conteúdo sem relação com a conversa nem sobrescreva silenciosamente divergências: exponha-as na revisão da síntese e resolva-as com a pessoa. Crie a pasta quando necessário.

Gere estes três arquivos em português:

- **`README.md` — visão rápida:** nome e resumo do app, problema, público, resultado pretendido, recorte do MVP, métrica principal e links relativos para os outros dois documentos. Deve permitir que alguém entenda o projeto rapidamente.
- **`product-brief.md` — briefing de produto:** contexto e problema; evidências relatadas e hipóteses separadas; públicos e papéis relevantes; alternativas atuais; objetivo e proposta de valor; escopo do MVP com capacidades prioritárias e fluxos principais; itens explicitamente fora do MVP; critérios ou sinais de sucesso; e restrições conhecidas que afetam o produto. Inclua histórias de usuário ou critérios de aceitação somente quando esclarecem um comportamento importante.
- **`open-questions.md` — pendências:** perguntas ainda sem resposta, suposições que precisam ser validadas, decisões em aberto e próximos passos de descoberta. Inclua contexto suficiente para cada item e marque como resolvido aquilo que a conversa esclareceu; remova itens resolvidos que não precisem permanecer como histórico.

Use títulos claros, listas e tabelas apenas quando facilitarem a leitura. Prefira linguagem simples e específica. Não duplique blocos longos entre arquivos: mantenha a visão geral no README, o entendimento do produto no briefing e as incertezas na lista de pendências. Deixe explícito quando uma seção ainda não tem informação confirmada.

Depois de gravar, informe o caminho da pasta e liste brevemente os documentos criados ou atualizados. Não diga que um arquivo foi salvo sem confirmar que a operação foi concluída.
