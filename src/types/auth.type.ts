type TokenType = {
    username: string;
    name: string;
    company: string; 
    rag: {
        id: string;
        embeddingModel: string;
        folderId: string;
        llmModel: string;
    }
}

type LoginType = {
    email: string;
    password: string;
}

export type { LoginType, TokenType }