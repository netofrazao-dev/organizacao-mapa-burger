-- =====================================================================
-- Mapa Burger — Script de criação do banco (Supabase / PostgreSQL)
-- =====================================================================
-- Como usar:
-- 1. No painel do Supabase, vá em "SQL Editor" → "New query".
-- 2. Cole este arquivo inteiro e clique em "Run".
-- 3. Depois, no projeto Next.js, configure a variável DATABASE_URL
--    (arquivo .env, baseado no .env.example) com a "Connection string"
--    do Supabase (Project Settings → Database → Connection string →
--    modo "Transaction" ou "Session", ambos funcionam com Prisma).
-- 4. Rode `npx prisma generate` para o Prisma Client reconhecer o
--    schema. Você NÃO precisa rodar `prisma migrate` nem `db push`
--    depois disso — as tabelas já existem, criadas por este script.
--
-- Este script é a tradução manual e completa do `prisma/schema.prisma`
-- para SQL puro. Foi escrito para ser executado uma única vez, do
-- zero, em um banco vazio.
-- =====================================================================

-- ---------------------------------------------------------------------
-- Extensão usada para gerar IDs automaticamente em inserts feitos
-- direto via SQL (fora do Prisma Client). O Prisma, quando usado pela
-- aplicação, gera seus próprios IDs (cuid) e ignora este default.
-- ---------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Função utilitária: mantém a coluna "updatedAt" sempre atualizada
-- em qualquer UPDATE feito na linha (equivalente ao @updatedAt do Prisma
-- quando os dados são alterados via SQL direto, não só via Prisma Client).
-- ---------------------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new."updatedAt" = now();
  return new;
end;
$$ language plpgsql;

-- =====================================================================
-- ENUMS
-- =====================================================================

create type "ProductionStatus" as enum ('COMPLETED', 'PARTIAL', 'CANCELLED');
create type "StockMovementType" as enum ('IN', 'OUT');
create type "PurchaseUrgency" as enum ('LOW', 'NORMAL', 'HIGH');
create type "PurchaseRequestStatus" as enum ('PENDING', 'APPROVED', 'REJECTED');
create type "OccurrenceSeverity" as enum ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');
create type "OccurrenceStatus" as enum ('OPEN', 'IN_REVIEW', 'RESOLVED');

-- =====================================================================
-- ETAPA 2 — Identidade, Cargos, Setores e Turnos
-- =====================================================================

create table roles (
  id         text primary key default gen_random_uuid()::text,
  name       text not null unique,
  slug       text not null unique,
  level      integer not null default 0,
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create table sectors (
  id         text primary key default gen_random_uuid()::text,
  name       text not null unique,
  slug       text not null unique,
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create table shifts (
  id          text primary key default gen_random_uuid()::text,
  name        text not null unique,
  slug        text not null unique,
  "startTime" text not null,
  "endTime"   text not null,
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create table users (
  id             text primary key default gen_random_uuid()::text,
  name           text not null,
  email          text not null unique,
  "passwordHash" text not null,
  pin            text unique,
  "avatarUrl"    text,
  "isActive"     boolean not null default true,
  "roleId"       text not null references roles(id),
  "sectorId"     text references sectors(id),
  "createdAt"    timestamp(3) not null default now(),
  "updatedAt"    timestamp(3) not null default now()
);

create index "users_roleId_idx" on users ("roleId");
create index "users_sectorId_idx" on users ("sectorId");

create table user_shifts (
  id         text primary key default gen_random_uuid()::text,
  "userId"   text not null references users(id) on delete cascade,
  "shiftId"  text not null references shifts(id) on delete cascade,
  "createdAt" timestamp(3) not null default now(),
  unique ("userId", "shiftId")
);

-- =====================================================================
-- ETAPA 4 — Procedimentos Operacionais Padrão (POPs)
-- =====================================================================

create table pops (
  id         text primary key default gen_random_uuid()::text,
  title      text not null,
  content    text not null,
  version    integer not null default 1,
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create table checklists (
  id           text primary key default gen_random_uuid()::text,
  title        text not null,
  description  text,
  "shiftId"    text not null references shifts(id),
  "sectorId"   text references sectors(id),
  "createdAt"  timestamp(3) not null default now(),
  "updatedAt"  timestamp(3) not null default now()
);

create index "checklists_shiftId_idx" on checklists ("shiftId");
create index "checklists_sectorId_idx" on checklists ("sectorId");

create table tasks (
  id            text primary key default gen_random_uuid()::text,
  title         text not null,
  "order"       integer not null default 0,
  "isRequired"  boolean not null default true,
  "checklistId" text not null references checklists(id) on delete cascade,
  "popId"       text unique references pops(id),
  "createdAt"   timestamp(3) not null default now(),
  "updatedAt"   timestamp(3) not null default now()
);

create index "tasks_checklistId_idx" on tasks ("checklistId");

create table task_executions (
  id            text primary key default gen_random_uuid()::text,
  "taskId"      text not null references tasks(id) on delete cascade,
  "userId"      text not null references users(id),
  "completedAt" timestamp(3) not null default now(),
  notes         text
);

create index "task_executions_taskId_idx" on task_executions ("taskId");
create index "task_executions_userId_idx" on task_executions ("userId");

-- =====================================================================
-- ETAPA 5 — Produção da Pré-Operação
-- =====================================================================

create table products (
  id            text primary key default gen_random_uuid()::text,
  name          text not null unique,
  category      text not null,
  unit          text not null,
  "dailyTarget" double precision not null,
  "isActive"    boolean not null default true,
  "createdAt"   timestamp(3) not null default now(),
  "updatedAt"   timestamp(3) not null default now()
);

create table production_logs (
  id                 text primary key default gen_random_uuid()::text,
  "productId"        text not null references products(id),
  "userId"           text not null references users(id),
  "quantityProduced" double precision not null,
  "quantityLost"     double precision not null default 0,
  "lossReason"       text,
  notes              text,
  status             "ProductionStatus" not null default 'COMPLETED',
  "producedAt"       timestamp(3) not null default now(),
  "createdAt"        timestamp(3) not null default now(),
  "updatedAt"        timestamp(3) not null default now()
);

create index "production_logs_productId_idx" on production_logs ("productId");
create index "production_logs_userId_idx" on production_logs ("userId");

-- =====================================================================
-- ETAPA 6 — Estoque de matérias-primas e embalagens
-- =====================================================================

create table inventory_items (
  id          text primary key default gen_random_uuid()::text,
  name        text not null unique,
  category    text not null,
  unit        text not null,
  "currentQty" double precision not null default 0,
  "minQty"    double precision not null,
  "maxQty"    double precision not null,
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create index "inventory_items_category_idx" on inventory_items (category);

create table stock_movements (
  id                text primary key default gen_random_uuid()::text,
  "inventoryItemId" text not null references inventory_items(id) on delete cascade,
  type              "StockMovementType" not null,
  quantity          double precision not null,
  reason            text,
  "userId"          text not null references users(id),
  "createdAt"       timestamp(3) not null default now()
);

create index "stock_movements_inventoryItemId_idx" on stock_movements ("inventoryItemId");
create index "stock_movements_userId_idx" on stock_movements ("userId");

create table purchase_requests (
  id                  text primary key default gen_random_uuid()::text,
  "inventoryItemId"   text not null references inventory_items(id),
  "requestedById"     text not null references users(id),
  "quantityRequested" double precision not null,
  urgency             "PurchaseUrgency" not null default 'NORMAL',
  notes               text,
  status              "PurchaseRequestStatus" not null default 'PENDING',
  "approvedById"      text references users(id),
  "createdAt"         timestamp(3) not null default now(),
  "updatedAt"         timestamp(3) not null default now()
);

create index "purchase_requests_inventoryItemId_idx" on purchase_requests ("inventoryItemId");
create index "purchase_requests_requestedById_idx" on purchase_requests ("requestedById");

-- =====================================================================
-- ETAPA 7 — Comunicação entre turnos e ocorrências
-- =====================================================================

create table occurrences (
  id             text primary key default gen_random_uuid()::text,
  title          text not null,
  description    text not null,
  severity       "OccurrenceSeverity" not null default 'MEDIUM',
  status         "OccurrenceStatus" not null default 'OPEN',
  "sectorId"     text references sectors(id),
  "reportedById" text not null references users(id),
  "resolvedById" text references users(id),
  "resolvedAt"   timestamp(3),
  "createdAt"    timestamp(3) not null default now(),
  "updatedAt"    timestamp(3) not null default now()
);

create index "occurrences_sectorId_idx" on occurrences ("sectorId");
create index "occurrences_reportedById_idx" on occurrences ("reportedById");
create index "occurrences_status_idx" on occurrences (status);

create table notices (
  id          text primary key default gen_random_uuid()::text,
  title       text not null,
  content     text not null,
  "authorId"  text not null references users(id),
  pinned      boolean not null default false,
  "expiresAt" timestamp(3),
  "createdAt" timestamp(3) not null default now(),
  "updatedAt" timestamp(3) not null default now()
);

create index "notices_authorId_idx" on notices ("authorId");

-- =====================================================================
-- TRIGGERS — mantém "updatedAt" em dia em updates feitos via SQL direto
-- =====================================================================

create trigger set_updated_at before update on roles for each row execute function set_updated_at();
create trigger set_updated_at before update on sectors for each row execute function set_updated_at();
create trigger set_updated_at before update on shifts for each row execute function set_updated_at();
create trigger set_updated_at before update on users for each row execute function set_updated_at();
create trigger set_updated_at before update on pops for each row execute function set_updated_at();
create trigger set_updated_at before update on checklists for each row execute function set_updated_at();
create trigger set_updated_at before update on tasks for each row execute function set_updated_at();
create trigger set_updated_at before update on products for each row execute function set_updated_at();
create trigger set_updated_at before update on production_logs for each row execute function set_updated_at();
create trigger set_updated_at before update on inventory_items for each row execute function set_updated_at();
create trigger set_updated_at before update on purchase_requests for each row execute function set_updated_at();
create trigger set_updated_at before update on occurrences for each row execute function set_updated_at();
create trigger set_updated_at before update on notices for each row execute function set_updated_at();

-- =====================================================================
-- SEED — dados iniciais mínimos para o login e a navegação funcionarem
-- de primeira (os mesmos 4 cargos/usuários de teste usados no mock
-- do front-end: gerente, caixa, cozinheira, estoquista).
-- Senha de todos: "123456" (troque isso antes de ir para produção —
-- este hash é só um placeholder de exemplo).
-- =====================================================================

insert into roles (name, slug, level) values
  ('Gerente', 'gerente', 100),
  ('Caixa', 'caixa', 20),
  ('Cozinheira', 'cozinheira', 20),
  ('Estoquista', 'estoquista', 30);

insert into sectors (name, slug) values
  ('Administrativo', 'administrativo'),
  ('Caixa', 'caixa'),
  ('Cozinha', 'cozinha'),
  ('Estoque', 'estoque');

insert into shifts (name, slug, "startTime", "endTime") values
  ('Pré-Operação', 'pre-operacao', '06:00', '11:00'),
  ('Almoço', 'almoco', '11:00', '16:00'),
  ('Noite', 'noite', '16:00', '23:59');

-- Observação: a coluna "passwordHash" abaixo NÃO é uma senha real
-- utilizável — substitua por um hash bcrypt/argon2 gerado pela sua
-- futura rota de autenticação antes de usar em produção.
insert into users (name, email, "passwordHash", "roleId", "sectorId")
select 'Fernanda Alencar', 'gerente@mapaburger.com', 'TROCAR_POR_HASH_REAL',
       (select id from roles where slug = 'gerente'),
       (select id from sectors where slug = 'administrativo');

insert into users (name, email, "passwordHash", "roleId", "sectorId")
select 'Rodrigo Nunes', 'caixa@mapaburger.com', 'TROCAR_POR_HASH_REAL',
       (select id from roles where slug = 'caixa'),
       (select id from sectors where slug = 'caixa');

insert into users (name, email, "passwordHash", "roleId", "sectorId")
select 'Patrícia Souza', 'cozinha@mapaburger.com', 'TROCAR_POR_HASH_REAL',
       (select id from roles where slug = 'cozinheira'),
       (select id from sectors where slug = 'cozinha');

insert into users (name, email, "passwordHash", "roleId", "sectorId")
select 'Bruno Lima', 'estoque@mapaburger.com', 'TROCAR_POR_HASH_REAL',
       (select id from roles where slug = 'estoquista'),
       (select id from sectors where slug = 'estoque');

-- =====================================================================
-- Fim do script. Confira em "Table Editor" no Supabase se as 16
-- tabelas foram criadas: roles, sectors, shifts, users, user_shifts,
-- checklists, tasks, pops, task_executions, products, production_logs,
-- inventory_items, stock_movements, purchase_requests, occurrences,
-- notices.
-- =====================================================================
