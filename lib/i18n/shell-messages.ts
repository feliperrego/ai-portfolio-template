import type { Locale } from "./locale";

/**
 * One locale's shell strings (X-01 design §4.4): the text of the header, composer, conversation,
 * banners, screen-reader status line and footer, then of the tool chips and the trace
 * (template spec §5.10). `{n}` and `{name}` mark where format() inserts a value. Shell components
 * read only these keys; project text reaches them through props, and a tool's label through the
 * project's toolLabel (lib/i18n/messages.ts).
 */
export type ShellMessages = {
  header: { mockBadge: string; newChat: string; language: string };
  composer: {
    label: string;
    placeholder: string;
    /** Replaces the placeholder once the conversation reaches its message cap. */
    capPlaceholder: string;
    send: string;
    stop: string;
  };
  list: {
    label: string;
    stopped: string;
    cutOff: string;
    regenerate: string;
    /** Ends with the middle dot; the component adds a space before Regenerate. */
    stoppedBefore: string;
  };
  chat: { jump: string; retry: string; rateNote: string };
  errors: { generic: string; limit: string };
  status: { complete: string; stopped: string; failed: string };
  footer: { builtBy: string; source: string };
  /**
   * A tool call's chip (template spec §5.10): the label of a tool the project names no label for,
   * the state of a call that has not simply finished, and the headings of its data.
   */
  toolCall: {
    called: string;
    running: string;
    awaitingApproval: string;
    failed: string;
    denied: string;
    input: string;
    output: string;
    error: string;
  };
  /** The trace of an answer (template spec §5.10): its tool calls, tokens, latency and checks. */
  trace: {
    toolCalls: string;
    noToolCalls: string;
    usage: string;
    inputTokens: string;
    outputTokens: string;
    totalTokens: string;
    latency: string;
    seconds: string;
    notReported: string;
    result: string;
    why: string;
    /** Read after a check's label by screen readers; the icon says it on screen. */
    checkHolds: string;
    checkFails: string;
    pass: string;
    fail: string;
  };
};

/**
 * The shell's approved text, in English and pt-BR (X-01 design §4.4). messages.test.ts pins it,
 * so a rewording is a deliberate change to the shell. Pure and client-safe.
 */
export const shellMessages: Record<Locale, ShellMessages> = {
  en: {
    header: { mockBadge: "Mock model", newChat: "New chat", language: "Language" },
    composer: {
      label: "Message",
      placeholder: "Send a message",
      capPlaceholder: "Conversation limit reached. Start a new chat.",
      send: "Send message",
      stop: "Stop generating",
    },
    list: {
      label: "Conversation",
      stopped: "Stopped",
      cutOff: "Cut at demo length limit",
      regenerate: "Regenerate",
      stoppedBefore: "Stopped before a response ·",
    },
    chat: {
      jump: "Jump to latest",
      retry: "Retry",
      rateNote: "{n} messages/hour per visitor; regenerations count",
    },
    errors: {
      generic: "Couldn't get a response. Check your connection and try again.",
      limit: "Demo limit reached: {n} messages per hour. Try again later.",
    },
    status: {
      complete: "Response complete",
      stopped: "Response stopped",
      failed: "Response failed",
    },
    footer: { builtBy: "Built by", source: "Source on GitHub" },
    toolCall: {
      called: "Called {name}",
      running: "Working",
      awaitingApproval: "Waiting for approval",
      failed: "The tool failed",
      denied: "Denied",
      input: "Input",
      output: "Output",
      error: "Error",
    },
    trace: {
      toolCalls: "Tool calls",
      noToolCalls: "No tool was called.",
      usage: "Tokens",
      inputTokens: "Input",
      outputTokens: "Output",
      totalTokens: "Total",
      latency: "Latency",
      seconds: "{n} s",
      notReported: "not reported",
      result: "Result",
      why: "Why",
      checkHolds: "(holds)",
      checkFails: "(does not hold)",
      pass: "Passed",
      fail: "Failed",
    },
  },
  "pt-BR": {
    header: { mockBadge: "Modelo simulado", newChat: "Nova conversa", language: "Idioma" },
    composer: {
      label: "Mensagem",
      placeholder: "Envie uma mensagem",
      capPlaceholder: "Limite da conversa atingido. Comece uma nova conversa.",
      send: "Enviar mensagem",
      stop: "Parar geração",
    },
    list: {
      label: "Conversa",
      stopped: "Interrompida",
      cutOff: "Cortada no limite de tamanho da demo",
      regenerate: "Gerar novamente",
      stoppedBefore: "Interrompida antes da resposta ·",
    },
    chat: {
      jump: "Ir para o fim",
      retry: "Tentar de novo",
      rateNote: "{n} mensagens/hora por visitante; regenerações contam",
    },
    errors: {
      generic: "Não foi possível obter uma resposta. Verifique sua conexão e tente de novo.",
      limit: "Limite da demo atingido: {n} mensagens por hora. Tente mais tarde.",
    },
    status: {
      complete: "Resposta concluída",
      stopped: "Resposta interrompida",
      failed: "Falha na resposta",
    },
    footer: { builtBy: "Feito por", source: "Código no GitHub" },
    toolCall: {
      called: "Chamou {name}",
      running: "Em andamento",
      awaitingApproval: "Aguardando aprovação",
      failed: "A ferramenta falhou",
      denied: "Negada",
      input: "Entrada",
      output: "Saída",
      error: "Erro",
    },
    trace: {
      toolCalls: "Chamadas de ferramenta",
      noToolCalls: "Nenhuma ferramenta foi chamada.",
      usage: "Tokens",
      inputTokens: "Entrada",
      outputTokens: "Saída",
      totalTokens: "Total",
      latency: "Latência",
      seconds: "{n} s",
      notReported: "não informado",
      result: "Resultado",
      why: "Por quê",
      checkHolds: "(atendida)",
      checkFails: "(não atendida)",
      pass: "Passou",
      fail: "Falhou",
    },
  },
};
