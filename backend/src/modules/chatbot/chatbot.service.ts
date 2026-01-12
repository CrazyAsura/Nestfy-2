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
        const baseUrl = this.configService.get<string>('OLLAMA_BASE_URL') || "http://localhost:11434";
        const model = this.configService.get<string>('OLLAMA_MODEL') || "llama3";
        
        this.llm = new ChatOllama({
          baseUrl,
          model,
          temperature: 0.7,
        });
        this.logger.log(`Ollama inicializado em ${baseUrl} com modelo ${model}`);
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
      this.logger.warn(`LLM indisponível: ${error.message}. Usando fallback.`);
      return this.getSmartFallbackResponse(message);
    }

    return this.getSmartFallbackResponse(message);
  }

  private getSmartFallbackResponse(message: string): string {
    const msg = message.toLowerCase();
    
    // Base de conhecimento expandida para simular uma IA real
    const knowledgeBase = [
      { keys: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'], response: "Olá! Seja bem-vindo à Nestfy. Como posso ajudar você hoje?" },
      { keys: ['entrega', 'prazo', 'chega', 'frete'], response: "Entregamos em todo o Brasil! O prazo médio é de 3 a 7 dias úteis. Frete grátis em compras acima de R$ 200." },
      { keys: ['pagamento', 'cartão', 'pix', 'boleto', 'parcela'], response: "Aceitamos PIX (5% de desconto), cartões de crédito em até 12x e boleto. No cartão, aceitamos todas as bandeiras." },
      { keys: ['troca', 'devolução', 'garantia', 'devolver'], response: "Você tem até 7 dias após o recebimento para solicitar a troca ou devolução gratuita, conforme o Código de Defesa do Consumidor." },
      { keys: ['contato', 'humano', 'telefone', 'whatsapp', 'ajuda'], response: "Você pode falar com nossa equipe pelo WhatsApp (11) 99999-9999 ou pelo e-mail suporte@nestfy.com.br." },
      { keys: ['produto', 'estoque', 'tem', 'vende'], response: "Temos uma grande variedade de eletrônicos, moda e acessórios. Você pode usar a barra de busca no topo do site para encontrar algo específico!" },
      { keys: ['promoção', 'desconto', 'cupom', 'oferta'], response: "Use o cupom BEMVINDO10 para ganhar 10% de desconto na sua primeira compra!" }
    ];

    for (const item of knowledgeBase) {
      if (item.keys.some(key => msg.includes(key))) {
        return item.response;
      }
    }

    return "Entendi sua dúvida. No momento meu módulo de IA avançada está offline, mas sou treinado para responder sobre entregas, pagamentos, trocas e produtos. Como posso te ajudar com esses temas?";
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
