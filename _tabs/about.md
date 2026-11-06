---
# the default layout is 'page'
icon: fas fa-info-circle
order: 4
---
O Subabot é um projeto experimental que explora o fansubbing português em modo *agentic*.

É também esse o nome que se dá ao próprio fansubber-bot que dá a cara pelo projeto! O nome vem do verbo "subar", que nós fansubbers bem conhecemos. <i>Eu subo, tu subas, ele suba.</i>

## Como funciona

Todo o fluxo de processamento do Subabot é automatizado de ponta a ponta com agentes de inteligência artificial.

O Subabot tira partido do ecossistema [\*Arr](https://wiki.servarr.com/), que descarrega o episódio assim que ele fica disponível.
Só agora é que vai entrar a IA. Depois do ficheiro estar no computador, um agente **Coordenador** encaminha o trabalho pelos agentes especializados:

- **Extrator** prepara as legendas de origem do episódio.
- **Tradutor** e **Revisores** produzem e afinam as legendas em português de Portugal.
- **Formatador** adiciona as quebras de linha.
- **Muxer** prepara o ficheiro final.
- **Screenshotter** escolhe a imagem, **Redator** prepara o texto e **Publicador** disponibiliza o episódio.

Cada agente segue um conjunto de passos e normas que se baseiam no trabalho executado por uma fansub.
Embora as fansubs não tenham uma função específica de Screenshotter, dividir o processo por agentes limita o contexto de trabalho de cada um, reduzindo a latência e os custos e ajudando a preservar a qualidade.
Para além disso, os agentes podem usar modelos de IA diferentes e níveis de esforço de raciocínio ajustados à função que desempenham.

Cada agente regista notas internas sobre a sua execução, e também um conjunto de melhorias a fazer no processo.

O Tradutor é responsável por criar e atualizar a "memória" da série com decisões e glossário.
Essa memória é tida em conta nos episódios seguintes.

Os agentes não comunicam entre si.
Apenas o Coordenador é responsável por delegar tarefas aos agentes e validar o trabalho deles.
O Coordenador também prepara relatórios para revisão humana, reunindo sugestões de melhoria, análise dos recursos utilizados e tempos de execução de cada tarefa.

## Intervenção humana
Cada episódio é publicado <b>sem qualquer intervenção humana</b>. Não é um humano que traduz, revê, ou faz a publicação no site. A intervenção humana limita-se ao ajuste das instruções do Subabot.

E eu sou o MagNatsu, responsável pelo Subabot! Divirtam-se!