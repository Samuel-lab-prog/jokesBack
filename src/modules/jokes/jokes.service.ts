import { prisma } from '../../config/database.js';

const library = {
  atraso: [['O prazo não foi perdido.','Ele só entrou em modo assíncrono e ainda não resolveu.'],['Meu código está atrasado por um motivo técnico:','o calendário compilou com dependências desatualizadas.'],['A entrega chega hoje!','Só não pergunte em qual fuso horário.'],['Não procrastinei; fiz um deploy estratégico.','A estratégia era esperar o último minuto para aumentar a adrenalina.']],
  bug: [['Encontrei um bug tão antigo','que ele já tem preferência no repositório.'],['O bug não é um erro.','É uma funcionalidade surpresa que ainda não recebeu o briefing.'],['Corrigi um bug e apareceram três.','Meu código está praticando reprodução assistida.'],['Está funcionando na minha máquina.','Ela só não gosta muito de visitas.']],
  lentidao: [['O programa não está lento.','Está dando tempo para o usuário refletir sobre cada clique.'],['Otimizei a aplicação:','agora ela demora menos para começar a demorar.'],['O loading não travou.','Está carregando suspense.'],['A consulta ao banco é tão cuidadosa','que confere cada registro duas vezes.']],
  qualidade: [['Meu código não está bagunçado.','É uma arquitetura baseada em caça ao tesouro.'],['Refatorei a função.','Agora o problema está distribuído em cinco arquivos.'],['O nome da variável é temporário.','Ela só está assim há seis meses.'],['Não é código duplicado.','É redundância para alta disponibilidade.']],
} as const;
const endings: Record<string,string> = { sarcastico:' (dito com a confiança de quem não leu o log)',corporativo:' — seguimos alinhando as expectativas com a realidade.',dramatico:' E então, contra todas as probabilidades, o terminal ficou em silêncio.',tio:' É igual café sem açúcar: até funciona, mas ninguém fica feliz.' };
type Input = {category:'atraso'|'bug'|'lentidao'|'qualidade';tone:'leve'|'sarcastico'|'corporativo'|'dramatico'|'tio';context:string};
export async function generate(input: Input, userId?: string) {
  const options = library[input.category]; const [setup,punchline] = options[Math.floor(Math.random()*options.length)];
  const content = `${setup} ${punchline}${input.context ? ` No caso, o incidente envolve ${input.context}.` : ''}${endings[input.tone] ?? ''}`;
  const joke = await prisma.joke.create({ data: { category: input.category, tone: input.tone, context: input.context, content, userId } });
  return { id: joke.id, category: joke.category, tone: joke.tone, context: joke.context, joke: joke.content, createdAt: joke.createdAt };
}
export async function history(userId: string) {
  const rows = await prisma.joke.findMany({ where: { userId }, orderBy: { createdAt:'desc' }, take:20 });
  return rows.map(row=>({id:row.id,category:row.category,tone:row.tone,context:row.context,joke:row.content,createdAt:row.createdAt}));
}
