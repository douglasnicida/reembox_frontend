export const translateStatus = (status: string) => {
    
    let translatedStatus = ''
    
    switch(status) {
        case 'OPEN':
            translatedStatus = 'ABERTO'
            break;
        
        case 'SUBMITTED':
            translatedStatus = 'SUBMETIDO'
            break;
        
        case 'REJECTED':
            translatedStatus = 'REJEITADO'
            break;
        
        case 'APPROVED':
            translatedStatus = 'APROVADO'
            break;
        
        case 'PENDING_PROCESSING':
            translatedStatus = 'PROCESSAMENTO PENDENTE'
            break;
        
        case 'PROCESSING_ERROR':
            translatedStatus = 'ERRO NO PROCESSAMENTO'
            break;
        
        case 'PROCESSING_PAYMENT':
            translatedStatus = 'PROCESSANDO PAGAMENTO'
            break;
    }

    return translatedStatus;
}