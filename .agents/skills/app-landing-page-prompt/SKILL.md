---
name: app-landing-page-prompt
description: Transforma o briefing de um app em um prompt pronto para gerar sua landing page em ferramentas como Lovable, Aura.build ou v0. Use quando a pessoa quiser criar ou revisar esse prompt com base no briefing do produto.
---

# Prompt de Landing Page para Apps

Crie um prompt único, pronto para colar em um construtor de sites com IA, usando como fonte o briefing confirmado do app. O resultado orienta a criação de uma landing page pública de apresentação e conversão; só trate a página como parte do produto quando a pessoa pedir isso explicitamente.

## Consulte o briefing

- Use os documentos fornecidos pela pessoa. Se ela se referir ao briefing criado nesta etapa do projeto, procure em docs/briefings/<slug>/ e leia README.md, product-brief.md e open-questions.md quando existirem.
- O product-brief.md é a fonte principal para o produto; o README.md serve como resumo e open-questions.md indica o que segue indefinido. Considere também correções posteriores feitas pela pessoa.
- Se houver mais de um briefing e não for possível identificar o app com segurança, pergunte qual usar. Se o briefing estiver apenas na conversa atual, use o que foi confirmado nela.
- Preserve a diferença entre fatos, hipóteses e pendências. Não converta uma hipótese em promessa de marketing.
- Não invente funcionalidades, resultados, estatísticas, depoimentos, clientes, certificações, integrações, preços ou políticas. Omita conteúdo sem base no briefing; não use texto fictício para preencher seções.

## Defina a direção do prompt

Adapte a mensagem ao construtor indicado. Se a pessoa não escolher uma ferramenta, escreva em linguagem direta e compatível com Lovable, Aura.build e v0. Não gere versões repetidas para cada plataforma, nem suponha recursos ou requisitos técnicos específicos da ferramenta.

O prompt deve orientar o construtor a:

- Implementar a landing page completa no projeto, em vez de retornar apenas um plano, wireframe ou sugestões.
- Criar uma página de marketing do app, com a proposta de valor e o público do briefing em destaque.
- Escrever os textos na língua usada pela pessoa; use português do Brasil por padrão. Prefira conteúdo específico do produto a slogans vagos e texto de preenchimento.
- Organizar as seções segundo o objetivo e as informações confirmadas. Considere apresentar proposta de valor, benefício principal, funcionamento, capacidades prioritárias do MVP e chamada para ação. Inclua preço, prova social, FAQ ou outras seções somente quando o briefing oferecer conteúdo confiável e relevante.
- Definir uma hierarquia clara: mensagem principal, explicação breve, ação prioritária e conteúdo de apoio. Use uma chamada para ação coerente com o objetivo confirmado. Se o destino ou o fluxo ainda estiver pendente, deixe-o configurável e não simule uma inscrição, compra ou integração funcionando.
- Seguir a identidade visual já informada. Se não houver direção visual, propor uma direção coerente com o público e o contexto do produto, sem apresentá-la como uma decisão já tomada. Não fabrique logotipos, telas reais do produto ou marcas de clientes; use recursos visuais neutros se não houver assets.
- Produzir uma interface responsiva, acessível e visualmente consistente, com navegação e controles utilizáveis em telas pequenas e grandes. Evite interações decorativas que não tenham um comportamento definido.
- Respeitar as restrições técnicas explicitadas no briefing e as convenções padrão da ferramenta quando forem necessárias. Não inventar integrações, persistência de dados ou backend.

Escreva o prompt como instruções diretas ao construtor, com contexto do app, público, objetivo da página, conteúdo e ordem das seções, direção visual e requisitos de comportamento relevantes. Dê detalhe suficiente para produzir uma primeira versão concreta sem repetir o briefing inteiro. Quando uma pendência impedir uma decisão, marque-a no prompt como item configurável ou omitível, em vez de resolvê-la por conta própria.

## Entregue o resultado

- Salve o prompt em português em docs/briefings/<slug>/landing-page-prompt.md, junto ao briefing correspondente. Use o slug existente. Não altere os documentos-fonte do briefing.
- Se esse arquivo já existir, leia-o antes de atualizar e preserve anotações manuais que continuem válidas; não descarte uma escolha anterior conflitante sem sinalizar.
- Separe claramente o texto pronto para colar de eventuais pendências que a pessoa deve decidir. Mantenha as pendências curtas e só inclua as que afetam o uso do prompt.
- Ao concluir, informe o caminho do arquivo e resuma em uma frase o que o prompt contempla. Não diga que foi salvo sem confirmar a gravação.
