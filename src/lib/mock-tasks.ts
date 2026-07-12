import type { Shift } from "@/lib/shift";

export interface PopData {
  id: string;
  title: string;
  /** Passo a passo já quebrado em linhas — na Task o `content` real vem em Markdown. */
  steps: string[];
}

export interface TaskData {
  id: string;
  title: string;
  isRequired: boolean;
  checklistTitle: string;
  shiftSlug: Shift["slug"];
  pop: PopData;
}

/**
 * Tarefas mock, uma por checklist/turno, cobrindo os três turnos
 * operacionais. Cada uma referencia um POP com passo a passo — no
 * modelo real (Prisma), isso equivale a `Task.pop.content` em Markdown,
 * aqui já representado como lista de passos para renderização direta.
 */
export const MOCK_TASKS: TaskData[] = [
  {
    id: "task_pre_01",
    title: "Ligar equipamentos e conferir gás",
    isRequired: true,
    checklistTitle: "Abertura — Cozinha",
    shiftSlug: "pre-operacao",
    pop: {
      id: "pop_pre_01",
      title: "Ligar equipamentos e conferir gás",
      steps: [
        "Vista o EPI (avental, touca e luvas) antes de iniciar.",
        "Abra o registro geral de gás e verifique se não há cheiro de vazamento.",
        "Ligue a chapa e o fritador, aguardando o pré-aquecimento indicado no painel.",
        "Confira se a coifa está ligada e sem obstrução.",
        "Registre no app qualquer equipamento que não ligar corretamente.",
      ],
    },
  },
  {
    id: "task_pre_02",
    title: "Conferir validade dos insumos na geladeira",
    isRequired: true,
    checklistTitle: "Abertura — Cozinha",
    shiftSlug: "pre-operacao",
    pop: {
      id: "pop_pre_02",
      title: "Conferir validade dos insumos",
      steps: [
        "Abra cada geladeira e freezer da linha de produção.",
        "Verifique a etiqueta de validade de todos os itens abertos.",
        "Descarte imediatamente qualquer item vencido, registrando no app de estoque.",
        "Reorganize por regra PVPS (Primeiro que Vence, Primeiro que Sai).",
      ],
    },
  },
  {
    id: "task_almoco_01",
    title: "Repor insumos da linha de montagem",
    isRequired: true,
    checklistTitle: "Rotina — Cozinha",
    shiftSlug: "almoco",
    pop: {
      id: "pop_almoco_01",
      title: "Reposição da linha de montagem",
      steps: [
        "Verifique o nível de pães, queijos e molhos na linha.",
        "Reponha até a marcação de nível máximo do recipiente.",
        "Não misture lote novo com lote antigo — sempre por baixo.",
        "Sinalize ao estoquista qualquer item abaixo de 20%.",
      ],
    },
  },
  {
    id: "task_almoco_02",
    title: "Conferir sangria do caixa",
    isRequired: true,
    checklistTitle: "Rotina — Caixa",
    shiftSlug: "almoco",
    pop: {
      id: "pop_almoco_02",
      title: "Sangria do caixa",
      steps: [
        "Some o valor em espécie acima de R$ 200 no caixa.",
        "Retire o excedente e lacre no envelope de sangria.",
        "Registre o valor retirado no sistema, com o horário.",
        "Guarde o envelope no cofre e informe o gerente do turno.",
      ],
    },
  },
  {
    id: "task_noite_01",
    title: "Limpeza e desligamento da chapa",
    isRequired: true,
    checklistTitle: "Fechamento — Cozinha",
    shiftSlug: "noite",
    pop: {
      id: "pop_noite_01",
      title: "Limpeza e desligamento da chapa",
      steps: [
        "Raspe os resíduos da chapa ainda morna, nunca fria.",
        "Aplique o desengordurante e deixe agir por 2 minutos.",
        "Remova com a espátula e pano úmido, sem água em excesso.",
        "Desligue o registro de gás geral após confirmar todas as bocas apagadas.",
      ],
    },
  },
  {
    id: "task_noite_02",
    title: "Fechamento de caixa e conferência do dia",
    isRequired: true,
    checklistTitle: "Fechamento — Caixa",
    shiftSlug: "noite",
    pop: {
      id: "pop_noite_02",
      title: "Fechamento de caixa",
      steps: [
        "Emita o relatório de vendas do dia no sistema.",
        "Confira o valor em espécie contra o relatório.",
        "Registre qualquer divergência com justificativa.",
        "Envie o fechamento para o gerente antes de sair.",
      ],
    },
  },
];
