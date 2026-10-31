export const openApiDocument = {
  openapi: '3.0.3',
  info: {
    title: 'Piada de Deploy API',
    version: '1.0.0',
    description: 'API própria para gerar piadas sobre situações de programação e manter um mural pessoal em PostgreSQL. A geração cria um rascunho; ele só é persistido quando a pessoa chama a operação de criação.',
    contact: { name: 'Projeto acadêmico — Piada de Deploy' },
  },
  servers: [{ url: '/', description: 'Servidor atual (local ou produção)' }],
  tags: [
    { name: 'Saúde', description: 'Verificação de disponibilidade da API.' },
    { name: 'Autenticação', description: 'Cadastro, login e consulta da conta atual.' },
    { name: 'Piadas', description: 'Geração de rascunhos e CRUD do mural pessoal.' },
  ],
  paths: {
    '/api/health': {
      get: { tags: ['Saúde'], summary: 'Verifica se a API está ativa', responses: { '200': { description: 'API disponível.', content: { 'application/json': { schema: { type: 'object', properties: { status: { type: 'string', example: 'ok' } } } } } } } },
    },
    '/api/auth/register': {
      post: { tags: ['Autenticação'], summary: 'Cria uma conta', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterInput' } } } }, responses: { '201': { description: 'Conta criada; retorna JWT e usuário.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '400': { $ref: '#/components/responses/ValidationError' }, '409': { description: 'E-mail já cadastrado.' } } },
    },
    '/api/auth/login': {
      post: { tags: ['Autenticação'], summary: 'Inicia uma sessão', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginInput' } } } }, responses: { '200': { description: 'Login concluído; retorna JWT e usuário.', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } }, '400': { $ref: '#/components/responses/ValidationError' }, '401': { description: 'E-mail ou senha incorretos.' } } },
    },
    '/api/auth/me': {
      get: { tags: ['Autenticação'], summary: 'Consulta a conta autenticada', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Dados públicos do usuário atual.', content: { 'application/json': { schema: { type: 'object', properties: { user: { $ref: '#/components/schemas/User' } } } } } }, '401': { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/api/jokes/generate': {
      post: { tags: ['Piadas'], summary: 'Gera uma piada sem salvar', description: 'Use a resposta como rascunho. A operação não grava no PostgreSQL.', requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/GenerateInput' }, example: { category: 'bug', tone: 'sarcastico', context: 'demo amanhã' } } } }, responses: { '200': { description: 'Piada gerada para revisão.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Joke' } } } }, '400': { $ref: '#/components/responses/ValidationError' } } },
    },
    '/api/jokes': {
      post: { tags: ['Piadas'], summary: 'Salva uma piada no mural', description: 'Persiste no PostgreSQL a piada, incluindo o texto que a pessoa revisou no front-end.', security: [{ bearerAuth: [] }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/SaveJokeInput' } } } }, responses: { '201': { description: 'Piada salva.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Joke' } } } }, '400': { $ref: '#/components/responses/ValidationError' }, '401': { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/api/jokes/history': {
      get: { tags: ['Piadas'], summary: 'Lista o mural da conta', description: 'Retorna até 20 piadas da conta autenticada, da mais recente para a mais antiga.', security: [{ bearerAuth: [] }], responses: { '200': { description: 'Lista de piadas.', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Joke' } } } } }, '401': { $ref: '#/components/responses/Unauthorized' } } },
    },
    '/api/jokes/{id}': {
      patch: { tags: ['Piadas'], summary: 'Edita uma piada do mural', description: 'Apenas a pessoa proprietária pode editar. Envie pelo menos um campo.', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da piada.' }], requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateJokeInput' } } } }, responses: { '200': { description: 'Piada atualizada.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Joke' } } } }, '400': { $ref: '#/components/responses/ValidationError' }, '401': { $ref: '#/components/responses/Unauthorized' }, '404': { description: 'Piada não encontrada no mural da conta.' } } },
      delete: { tags: ['Piadas'], summary: 'Exclui uma piada do mural', security: [{ bearerAuth: [] }], parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' }, description: 'ID da piada.' }], responses: { '204': { description: 'Piada excluída.' }, '401': { $ref: '#/components/responses/Unauthorized' }, '404': { description: 'Piada não encontrada no mural da conta.' } } },
    },
  },
  components: {
    securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT', description: 'Token JWT retornado pelo cadastro ou login. Validade: 7 dias.' } },
    schemas: {
      Error: { type: 'object', properties: { error: { type: 'string', example: 'Informe um e-mail válido.' } }, required: ['error'] },
      RegisterInput: { type: 'object', required: ['name', 'email', 'password'], properties: { name: { type: 'string', minLength: 2, maxLength: 60 }, email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 6, maxLength: 72, format: 'password' } } },
      LoginInput: { type: 'object', required: ['email', 'password'], properties: { email: { type: 'string', format: 'email' }, password: { type: 'string', minLength: 1, format: 'password' } } },
      GenerateInput: { type: 'object', properties: { category: { type: 'string', enum: ['atraso', 'bug', 'lentidao', 'qualidade'], default: 'atraso' }, tone: { type: 'string', enum: ['leve', 'sarcastico', 'corporativo', 'dramatico', 'tio'], default: 'leve' }, context: { type: 'string', maxLength: 80, default: '' } } },
      SaveJokeInput: { allOf: [{ $ref: '#/components/schemas/GenerateInput' }, { type: 'object', required: ['content'], properties: { content: { type: 'string', minLength: 1, maxLength: 500, description: 'Texto final salvo no mural.' } } }] },
      UpdateJokeInput: { type: 'object', minProperties: 1, properties: { category: { type: 'string', enum: ['atraso', 'bug', 'lentidao', 'qualidade'] }, tone: { type: 'string', enum: ['leve', 'sarcastico', 'corporativo', 'dramatico', 'tio'] }, context: { type: 'string', maxLength: 80 }, content: { type: 'string', minLength: 1, maxLength: 500 } } },
      Joke: { type: 'object', required: ['id', 'category', 'tone', 'context', 'joke', 'createdAt'], properties: { id: { type: 'string', example: 'cm123abc' }, category: { type: 'string', enum: ['atraso', 'bug', 'lentidao', 'qualidade'] }, tone: { type: 'string', enum: ['leve', 'sarcastico', 'corporativo', 'dramatico', 'tio'] }, context: { type: 'string' }, joke: { type: 'string', description: 'Conteúdo final da piada.' }, createdAt: { type: 'string', format: 'date-time' } } },
      AuthResponse: { type: 'object', required: ['token', 'user'], properties: { token: { type: 'string' }, user: { type: 'object', properties: { id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string', format: 'email' } } } } },
      User: { type: 'object', required: ['id', 'name', 'email'], properties: { id: { type: 'string' }, name: { type: 'string' }, email: { type: 'string', format: 'email' } } },
    },
    responses: {
      ValidationError: { description: 'Dados inválidos.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
      Unauthorized: { description: 'Token ausente, inválido ou expirado.', content: { 'application/json': { schema: { $ref: '#/components/schemas/Error' } } } },
    },
  },
} as const;
