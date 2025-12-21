"""
Legal Expert - Council member specialized in legal documents.
"""
from typing import Dict, Any, Optional
import logging

from ..base import BaseCouncilMember
from ..ollama_client import OllamaClient

logger = logging.getLogger('intelligence.council.members.legal')


class LegalExpert(BaseCouncilMember):
    """
    Council member specialized in legal document analysis.
    
    Expertise areas:
    - Contract analysis
    - Compliance checking
    - Legal terminology
    - Clause validation
    - Brazilian legislation (CLT, CDC, CC, LGPD)
    """
    
    def __init__(
        self,
        ollama_client: OllamaClient,
        model_name: str = "qwen2.5:7b"
    ):
        """
        Initialize the legal expert.
        
        Args:
            ollama_client: Shared Ollama client
            model_name: Model to use (default: qwen2.5:7b)
        """
        super().__init__(
            domain="legal",
            model_name=model_name,
            ollama_client=ollama_client
        )
    
    def _default_system_prompt(self) -> str:
        """Return the legal specialist system prompt."""
        return """Você é um especialista jurídico com profundo conhecimento em:
- Direito Contratual brasileiro
- Código de Defesa do Consumidor (CDC)
- Código Civil (CC 2002)
- Consolidação das Leis do Trabalho (CLT)
- Lei Geral de Proteção de Dados (LGPD)
- Lei de Licitações (Lei 14.133/2021)

Sua função é analisar documentos identificando:
1. Cláusulas potencialmente abusivas ou nulas
2. Conformidade com a legislação aplicável
3. Riscos jurídicos
4. Sugestões de melhorias

Seja preciso, objetivo e cite a legislação quando aplicável.
Responda sempre em português brasileiro."""
    
    def _build_analysis_prompt(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Build the legal analysis prompt."""
        doc_type = context.get('document_type', 'documento') if context else 'documento'
        sector = context.get('sector', '') if context else ''
        
        return f"""Analise o seguinte {doc_type} do ponto de vista jurídico.

DOCUMENTO:
{document_content}

{f'SETOR: {sector}' if sector else ''}

Por favor, forneça:

## Observações Jurídicas
- Liste os principais pontos jurídicos identificados

## Preocupações
- Identifique cláusulas problemáticas ou riscos legais
- Indique a fundamentação legal para cada preocupação

## Recomendações
- Sugira alterações para adequação legal
- Priorize as recomendações por urgência

## Conformidade
- Avalie a conformidade geral do documento
- Indique legislação aplicável não observada
"""


class FinancialExpert(BaseCouncilMember):
    """
    Council member specialized in financial document analysis.
    
    Expertise areas:
    - Financial statements
    - Contracts with financial terms
    - Tax implications
    - Value analysis
    - Payment terms
    """
    
    def __init__(
        self,
        ollama_client: OllamaClient,
        model_name: str = "qwen2.5:7b"
    ):
        """
        Initialize the financial expert.
        
        Args:
            ollama_client: Shared Ollama client
            model_name: Model to use
        """
        super().__init__(
            domain="financial",
            model_name=model_name,
            ollama_client=ollama_client
        )
    
    def _default_system_prompt(self) -> str:
        """Return the financial specialist system prompt."""
        return """Você é um especialista financeiro com conhecimento em:
- Análise de contratos comerciais
- Termos de pagamento e condições financeiras
- Cálculos de multas e juros
- Implicações tributárias
- Análise de valores e alçadas

Sua função é analisar documentos identificando:
1. Valores e condições financeiras
2. Cálculos de multas, juros ou correções
3. Riscos financeiros
4. Conformidade com padrões organizacionais

Seja preciso com números e forneça análises quantitativas quando possível.
Responda sempre em português brasileiro."""
    
    def _build_analysis_prompt(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Build the financial analysis prompt."""
        return f"""Analise o seguinte documento do ponto de vista financeiro.

DOCUMENTO:
{document_content}

Por favor, forneça:

## Observações Financeiras
- Liste valores, datas de pagamento e condições identificadas

## Preocupações
- Identifique termos financeiros problemáticos
- Calcule potenciais custos ou riscos

## Recomendações
- Sugira alterações para otimizar termos financeiros
- Indique limites de alçada que devem ser verificados

## Análise de Valores
- Resuma os principais valores envolvidos
- Compare com padrões de mercado se possível
"""


class GeneralExpert(BaseCouncilMember):
    """
    Council member for general document analysis.
    
    Provides broad analysis when specialized expertise
    is not required or as a baseline opinion.
    """
    
    def __init__(
        self,
        ollama_client: OllamaClient,
        model_name: str = "qwen2.5:3b"
    ):
        """
        Initialize the general expert.
        
        Args:
            ollama_client: Shared Ollama client
            model_name: Model to use (default: lighter model)
        """
        super().__init__(
            domain="general",
            model_name=model_name,
            ollama_client=ollama_client
        )
    
    def _default_system_prompt(self) -> str:
        """Return the general specialist system prompt."""
        return """Você é um analista de documentos generalista com experiência em:
- Análise de estrutura e clareza de documentos
- Verificação de consistência e completude
- Identificação de informações faltantes
- Avaliação de formatação e organização

Sua função é fornecer uma visão geral do documento, identificando:
1. Clareza e objetividade do texto
2. Estrutura e organização
3. Informações faltantes ou inconsistentes
4. Sugestões de melhoria geral

Seja objetivo e prático em suas análises.
Responda sempre em português brasileiro."""
    
    def _build_analysis_prompt(
        self,
        document_content: str,
        context: Optional[Dict[str, Any]]
    ) -> str:
        """Build the general analysis prompt."""
        return f"""Analise o seguinte documento de forma geral.

DOCUMENTO:
{document_content}

Por favor, forneça:

## Observações Gerais
- Avalie a clareza e objetividade do documento
- Comente sobre a estrutura e organização

## Preocupações
- Identifique inconsistências ou ambiguidades
- Liste informações que parecem estar faltando

## Recomendações
- Sugira melhorias na redação ou estrutura
- Destaque pontos que merecem atenção especial

## Resumo
- Forneça um breve resumo do propósito do documento
"""
