type TokenType = {
    username: string;
    name: string;
    company: string;
    rag: {
        id: number;
        folderId: number;
        llmModel: string;
        embeddingModel: string;
    };
}

type LoginType = {
    email: string;
    password: string;
}

export type { LoginType, TokenType }