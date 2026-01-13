import { Injectable, NotFoundException, OnModuleInit, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Chatbot, ChatbotDocument } from './schemas/chatbot.schema';
import { CreateChatbotDto } from './dto/create-chatbot.dto';
import { UpdateChatbotDto } from './dto/update-chatbot.dto';
import { ConfigService } from '@nestjs/config';
import { ChatOllama } from '@langchain/ollama';
import { ChatOpenAI } from '@langchain/openai';
import { 
  ChatPromptTemplate, 
  MessagesPlaceholder 
} from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
// BufferMemory is now in @langchain/classic
import { BufferMemory } from "@langchain/classic/memory";

@Injectable()
export class ChatbotService implements OnModuleInit {
  private llm: any = null;
  private readonly logger = new Logger(ChatbotService.name);
  private memories: Map<string, BufferMemory> = new Map();

  constructor(
    @InjectModel(Chatbot.name)
    private readonly chatbotModel: Model<ChatbotDocument>,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.initLLM();
  }

  private initLLM() {
    try {
      const provider = this.configService.get<string>('AI_PROVIDER') || 'ollama';
      
      if (provider === 'ollama') {
        let baseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || "http://localhost:11434";
        // Remove trailing slash if exists to avoid double slashes in langchain
        if (baseUrl.endsWith('/')) {
          baseUrl = baseUrl.slice(0, -1);
        }
        const model = this.configService.get<string>('OLLAMA_MODEL') || "llama3";
        
        this.llm = new ChatOllama({
          baseUrl,
          model,
          temperature: 0.7,
        });
        this.logger.log(`Ollama configurado em ${baseUrl} com modelo ${model}`);
      } else if (provider === 'localai') {
        const baseUrl = this.configService.get<string>('LOCALAI_BASE_URL') || "http://localhost:8080/v1";
        const model = this.configService.get<string>('LOCALAI_MODEL') || "mistral";
        
        this.llm = new ChatOpenAI({
          openAIApiKey: 'none',
          configuration: {
            baseURL: baseUrl,
          },
          modelName: model,
          temperature: 0.7,
        });
        this.logger.log(`LocalAI inicializado em ${baseUrl} com modelo ${model}`);
      } else if (provider === 'openai') {
        const apiKey = this.configService.get<string>('OPENAI_API_KEY');
        const model = this.configService.get<string>('OPENAI_MODEL') || "gpt-3.5-turbo";
        
        if (!apiKey) {
          throw new Error('OPENAI_API_KEY não configurada');
        }

        this.llm = new ChatOpenAI({
          openAIApiKey: apiKey,
          modelName: model,
          temperature: 0.7,
        });
        this.logger.log(`OpenAI inicializado com modelo ${model}`);
      } else if (provider === 'groq') {
        const apiKey = this.configService.get<string>('GROQ_API_KEY');
        const model = this.configService.get<string>('GROQ_MODEL') || "llama3-8b-8192";
        
        if (!apiKey) {
          throw new Error('GROQ_API_KEY não configurada');
        }

        this.llm = new ChatOpenAI({
          openAIApiKey: apiKey,
          configuration: {
            baseURL: "https://api.groq.com/openai/v1",
          },
          modelName: model,
          temperature: 0.7,
        });
        this.logger.log(`Groq AI inicializado com modelo ${model}`);
      }
    } catch (error) {
      this.logger.error('Erro ao inicializar LLM:', error.message);
    }
  }

  private getMemory(sessionId: string): BufferMemory {
    if (!this.memories.has(sessionId)) {
      this.memories.set(sessionId, new BufferMemory({
        returnMessages: true,
        memoryKey: "history",
      }));
    }
    return this.memories.get(sessionId)!;
  }

  async getResponse(message: string, userId?: string, sessionId: string = 'default'): Promise<string> {
    try {
      if (!this.llm) {
        this.initLLM();
      }

      if (this.llm) {
        this.logger.log(`Enviando mensagem para o LLM (${sessionId}): ${message}`);
        
        const memory = this.getMemory(sessionId);
        
        const prompt = ChatPromptTemplate.fromMessages([
          ["system", "Você é um assistente virtual prestativo da loja Nestfy, um e-commerce moderno de tecnologia e moda. Responda de forma curta, amigável e em Português Brasil. Se não souber algo, sugira falar com um atendente humano."],
          new MessagesPlaceholder("history"),
          ["human", "{input}"],
        ]);

        const chain = RunnableSequence.from([
          {
            input: (initialInput: any) => initialInput.input,
            history: async () => {
              const vars = await memory.loadMemoryVariables({});
              return vars.history || [];
            },
          },
          prompt,
          this.llm,
          new StringOutputParser(),
        ]);

        const content = await Promise.race([
          chain.invoke({ input: message }),
          new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout após 30 segundos')), 30000))
        ]) as string;
        
        // Salva a interação na memória
        await memory.saveContext({ input: message }, { response: content });
        
        this.logger.log(`Resposta do LLM recebida com sucesso`);
        return content;
      }
    } catch (error) {
      this.logger.error(`Erro ao processar mensagem com LLM: ${error.message}`);
      if (error.message.includes('ECONNREFUSED') || error.message.includes('fetch failed')) {
        this.logger.warn('DICA: O backend no Render não consegue acessar o Ollama no seu localhost. Use um túnel (Ngrok) ou mude o AI_PROVIDER para um serviço na nuvem.');
      }
      return this.getSmartFallbackResponse(message);
    }

    return this.getSmartFallbackResponse(message);
  }

  private getSmartFallbackResponse(message: string): string {
    const msg = message.toLowerCase();
    
    // Respostas para saudações e perguntas genéricas
    if (msg.includes('horas') || msg.includes('horário') || msg.includes('que horas')) {
      const now = new Date();
      return `Agora são exatamente ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}. Como posso ajudar você com suas compras?`;
    }

    if (msg.includes('dia') || msg.includes('tarde') || msg.includes('noite')) {
      return "Olá! Espero que seu dia esteja sendo excelente. Como a Nestfy pode te ajudar hoje?";
    }

    // Base de conhecimento expandida para simular uma IA real
    const knowledgeBase = [
      { keys: ['olá', 'oi', 'hello', 'saudações'], response: "Olá! Seja bem-vindo à Nestfy, seu e-commerce de luxo. Como posso tornar sua experiência única hoje?" },
      { keys: ['entrega', 'prazo', 'chega', 'frete', 'correio', 'rastreio'], response: "A Nestfy entrega em todo o território nacional. O prazo médio para capitais é de 3 a 5 dias úteis. Você pode rastrear seu pedido na seção 'Meus Pedidos'." },
      { keys: ['pagamento', 'cartão', 'pix', 'boleto', 'parcela', 'preço', 'valor'], response: "Oferecemos diversas formas de pagamento: PIX com 5% de desconto, cartões de crédito (até 12x sem juros) e boleto bancário." },
      { keys: ['troca', 'devolução', 'garantia', 'devolver', 'errado', 'defeito'], response: "Nossa política de trocas é simples: você tem 7 dias após o recebimento para solicitar a devolução total ou troca de qualquer item sem custo adicional." },
      { keys: ['contato', 'humano', 'telefone', 'whatsapp', 'ajuda', 'suporte', 'atendimento'], response: "Você pode falar com nossos consultores de luxo pelo WhatsApp (11) 99999-9999 ou e-mail suporte@nestfy.com.br. Atendemos das 09h às 18h." },
      { keys: ['produto', 'estoque', 'tem', 'vende', 'coleção', 'novidade'], response: "Nossas coleções são atualizadas semanalmente com o que há de mais moderno em tecnologia e moda. Explore nosso catálogo na página inicial!" },
      { keys: ['promoção', 'desconto', 'cupom', 'oferta', 'barato'], response: "Atualmente temos o cupom NESTFYLUXO para 15% de desconto em itens selecionados da nova coleção!" }
    ];

    for (const item of knowledgeBase) {
      if (item.keys.some(key => msg.includes(key))) {
        return item.response;
      }
    }

    // Se a IA estiver offline (Ollama não acessível no Render), tentamos dar uma resposta educada e útil
    return "Interessante sua pergunta! No momento estou operando em modo de assistência básica. Posso te ajudar com informações sobre nossos produtos de luxo, prazos de entrega, pagamentos ou trocas. O que você prefere saber?";
  }

  async create(createChatbotDto: any) {
    const chatbot = new this.chatbotModel(createChatbotDto);
    return await chatbot.save();
  }

  async findAll() {
    return await this.chatbotModel.find().exec();
  }

  async findOne(id: string) {
    const chatbot = await this.chatbotModel.findById(id).exec();
    if (!chatbot) {
      throw new NotFoundException(`Chatbot com ID ${id} não encontrado`);
    }
    return chatbot;
  }

  async update(id: string, updateChatbotDto: UpdateChatbotDto) {
    const chatbot = await this.chatbotModel
      .findByIdAndUpdate(id, updateChatbotDto, { new: true })
      .exec();
    if (!chatbot) {
      throw new NotFoundException(`Chatbot com ID ${id} não encontrado`);
    }
    return chatbot;
  }

  async remove(id: string) {
    const result = await this.chatbotModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Chatbot com ID ${id} não encontrado`);
    }
    return result;
  }
}
