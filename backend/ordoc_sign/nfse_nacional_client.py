"""
Cliente para integração com o Sistema Nacional NFS-e
Baseado no Manual dos Contribuintes v1.0 (17/03/2025)

Implementa todas as APIs do Emissor Público Nacional:
- Parâmetros Municipais
- NFS-e (emissão e consulta)
- DPS (Declaração de Prestação de Serviço)
- Eventos
"""

import requests
from typing import Dict, List, Optional, Tuple, Any
from django.conf import settings
from django.core.cache import cache
import logging
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)


class NFSeNacionalClient:
    """
    Cliente para integração com Sistema Nacional NFS-e
    Ambiente de Produção Restrita: https://adn.producaorestrita.nfse.gov.br
    """
    
    # URLs base
    BASE_URL_PROD_RESTRITA = 'https://adn.producaorestrita.nfse.gov.br'
    BASE_URL_PROD = 'https://adn.nfse.gov.br'  # Produção (quando disponível)
    
    def __init__(self, ambiente: str = 'producao_restrita', certificado_path: str = None, chave_path: str = None):
        """
        Inicializa cliente NFS-e Nacional
        
        Args:
            ambiente: 'producao_restrita' ou 'producao'
            certificado_path: Caminho para certificado A1 (.pem)
            chave_path: Caminho para chave privada (.pem)
        """
        self.base_url = self.BASE_URL_PROD_RESTRITA if ambiente == 'producao_restrita' else self.BASE_URL_PROD
        self.certificado = certificado_path
        self.chave = chave_path
        
        # Configurar certificado para requisições
        if self.certificado and self.chave:
            self.cert = (self.certificado, self.chave)
        else:
            self.cert = None
    
    # ========== API Parâmetros Municipais ==========
    
    def get_parametros_convenio(self, codigo_municipio: str) -> Tuple[bool, Dict]:
        """
        GET /parametros_municipais/{codigoMunicipio}/convenio
        Consulta os parâmetros do convênio de um município
        
        Args:
            codigo_municipio: Código IBGE do município (7 dígitos)
            
        Returns:
            Tuple[bool, Dict]: (sucesso, dados_convenio)
        """
        try:
            # Verificar cache
            cache_key = f"nfse_convenio_{codigo_municipio}"
            cached = cache.get(cache_key)
            if cached:
                return True, cached
            
            url = f"{self.base_url}/parametros_municipais/{codigo_municipio}/convenio"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                # Cachear por 24 horas
                cache.set(cache_key, data, timeout=86400)
                return True, data
            else:
                logger.error(f"Erro ao consultar convênio: {response.status_code}")
                return False, {}
                
        except Exception as e:
            logger.error(f"Erro ao consultar parâmetros de convênio: {str(e)}")
            return False, {}
    
    def get_aliquotas_servico(self, codigo_municipio: str, codigo_servico: str) -> Tuple[bool, Dict]:
        """
        GET /parametros_municipais/{codigoMunicipio}/{codigoServico}
        Consulta alíquotas, regimes especiais e deduções por código de serviço
        
        Args:
            codigo_municipio: Código IBGE do município
            codigo_servico: Código do serviço (LC 116/2003)
            
        Returns:
            Tuple[bool, Dict]: (sucesso, parametros_servico)
        """
        try:
            cache_key = f"nfse_servico_{codigo_municipio}_{codigo_servico}"
            cached = cache.get(cache_key)
            if cached:
                return True, cached
            
            url = f"{self.base_url}/parametros_municipais/{codigo_municipio}/{codigo_servico}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                cache.set(cache_key, data, timeout=86400)
                return True, data
            else:
                return False, {}
                
        except Exception as e:
            logger.error(f"Erro ao consultar alíquotas de serviço: {str(e)}")
            return False, {}
    
    def get_retencoes_contribuinte(self, codigo_municipio: str, cpf_cnpj: str) -> Tuple[bool, Dict]:
        """
        GET /parametros_municipais/{codigoMunicipio}/{CPF/CNPJ}
        Consulta retenções que um contribuinte deve recolher
        
        Args:
            codigo_municipio: Código IBGE do município
            cpf_cnpj: CPF ou CNPJ do contribuinte
            
        Returns:
            Tuple[bool, Dict]: (sucesso, retencoes)
        """
        try:
            url = f"{self.base_url}/parametros_municipais/{codigo_municipio}/{cpf_cnpj}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, {}
                
        except Exception as e:
            logger.error(f"Erro ao consultar retenções: {str(e)}")
            return False, {}
    
    def get_beneficios_contribuinte(self, codigo_municipio: str, cpf_cnpj: str) -> Tuple[bool, Dict]:
        """
        GET /parametros_municipais/{codigoMunicipio}/{CPF/CNPJ}
        Consulta benefícios municipais de um contribuinte
        
        Args:
            codigo_municipio: Código IBGE do município
            cpf_cnpj: CPF ou CNPJ do contribuinte
            
        Returns:
            Tuple[bool, Dict]: (sucesso, beneficios)
        """
        try:
            url = f"{self.base_url}/parametros_municipais/{codigo_municipio}/{cpf_cnpj}/beneficios"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, {}
                
        except Exception as e:
            logger.error(f"Erro ao consultar benefícios: {str(e)}")
            return False, {}
    
    # ========== API NFS-e ==========
    
    def emitir_nfse(self, dps_xml: str) -> Tuple[bool, str]:
        """
        POST /nfse
        Geração síncrona de NFS-e a partir de DPS
        
        Args:
            dps_xml: XML da DPS (Declaração de Prestação de Serviço) assinado
            
        Returns:
            Tuple[bool, str]: (sucesso, nfse_xml ou mensagem_erro)
        """
        try:
            url = f"{self.base_url}/nfse"
            
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                url,
                data=dps_xml.encode('utf-8'),
                headers=headers,
                cert=self.cert,
                timeout=60
            )
            
            if response.status_code == 200:
                nfse_xml = response.text
                logger.info("NFS-e emitida com sucesso")
                return True, nfse_xml
            else:
                error_msg = response.text
                logger.error(f"Erro ao emitir NFS-e: {response.status_code} - {error_msg}")
                return False, error_msg
                
        except Exception as e:
            error_msg = f"Erro ao emitir NFS-e: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
    
    def consultar_nfse(self, chave_acesso: str) -> Tuple[bool, str]:
        """
        GET /nfse/{chaveAcesso}
        Consulta NFS-e pela chave de acesso
        
        Args:
            chave_acesso: Chave de acesso da NFS-e (50 caracteres)
            
        Returns:
            Tuple[bool, str]: (sucesso, nfse_xml ou mensagem_erro)
        """
        try:
            url = f"{self.base_url}/nfse/{chave_acesso}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.text
            elif response.status_code == 404:
                return False, "NFS-e não encontrada"
            else:
                return False, f"Erro {response.status_code}: {response.text}"
                
        except Exception as e:
            logger.error(f"Erro ao consultar NFS-e: {str(e)}")
            return False, str(e)
    
    # ========== API DPS ==========
    
    def consultar_chave_por_dps(self, id_dps: str) -> Tuple[bool, Optional[str]]:
        """
        GET /dps/{id}
        Recupera chave de acesso da NFS-e a partir do ID da DPS
        
        Args:
            id_dps: Identificador da DPS (formato: CodigoMunicipio(7) + TipoInscricao(1) + 
                    InscricaoFederal(14) + SerieDPS(5) + NumDPS(15))
            
        Returns:
            Tuple[bool, Optional[str]]: (sucesso, chave_acesso)
        """
        try:
            url = f"{self.base_url}/dps/{id_dps}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                chave_acesso = data.get('chaveAcesso')
                return True, chave_acesso
            else:
                return False, None
                
        except Exception as e:
            logger.error(f"Erro ao consultar DPS: {str(e)}")
            return False, None
    
    def verificar_dps_processada(self, id_dps: str) -> bool:
        """
        HEAD /dps/{id}
        Verifica se uma NFS-e foi gerada a partir da DPS
        
        Args:
            id_dps: Identificador da DPS
            
        Returns:
            bool: True se NFS-e foi gerada, False caso contrário
        """
        try:
            url = f"{self.base_url}/dps/{id_dps}"
            
            response = requests.head(
                url,
                cert=self.cert,
                timeout=30
            )
            
            return response.status_code == 200
                
        except Exception as e:
            logger.error(f"Erro ao verificar DPS: {str(e)}")
            return False
    
    # ========== API Eventos ==========
    
    def registrar_evento(self, chave_acesso: str, evento_xml: str) -> Tuple[bool, str]:
        """
        POST /nfse/{chaveAcesso}/eventos
        Registra evento vinculado a uma NFS-e
        
        Tipos de eventos:
        - Cancelamento
        - Substituição
        - Manifestação do Tomador (Confirmação/Desconhecimento/Operação não Realizada)
        - Etc.
        
        Args:
            chave_acesso: Chave de acesso da NFS-e
            evento_xml: XML do Pedido de Registro de Evento assinado
            
        Returns:
            Tuple[bool, str]: (sucesso, evento_xml_gerado ou mensagem_erro)
        """
        try:
            url = f"{self.base_url}/nfse/{chave_acesso}/eventos"
            
            headers = {
                'Content-Type': 'application/xml',
                'Accept': 'application/xml'
            }
            
            response = requests.post(
                url,
                data=evento_xml.encode('utf-8'),
                headers=headers,
                cert=self.cert,
                timeout=60
            )
            
            if response.status_code == 200:
                logger.info(f"Evento registrado com sucesso para NFS-e {chave_acesso}")
                return True, response.text
            else:
                error_msg = response.text
                logger.error(f"Erro ao registrar evento: {response.status_code} - {error_msg}")
                return False, error_msg
                
        except Exception as e:
            error_msg = f"Erro ao registrar evento: {str(e)}"
            logger.error(error_msg)
            return False, error_msg
    
    def consultar_eventos(self, chave_acesso: str) -> Tuple[bool, List[Dict]]:
        """
        GET /nfse/{chaveAcesso}/eventos
        Consulta todos os eventos vinculados a uma NFS-e
        
        Args:
            chave_acesso: Chave de acesso da NFS-e
            
        Returns:
            Tuple[bool, List[Dict]]: (sucesso, lista_eventos)
        """
        try:
            url = f"{self.base_url}/nfse/{chave_acesso}/eventos"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, []
                
        except Exception as e:
            logger.error(f"Erro ao consultar eventos: {str(e)}")
            return False, []
    
    def consultar_evento_por_tipo(self, chave_acesso: str, tipo_evento: str) -> Tuple[bool, List[Dict]]:
        """
        GET /nfse/{chaveAcesso}/eventos/{tipoEvento}
        Consulta eventos de um tipo específico
        
        Args:
            chave_acesso: Chave de acesso da NFS-e
            tipo_evento: Código do tipo de evento
            
        Returns:
            Tuple[bool, List[Dict]]: (sucesso, eventos_do_tipo)
        """
        try:
            url = f"{self.base_url}/nfse/{chave_acesso}/eventos/{tipo_evento}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, []
                
        except Exception as e:
            logger.error(f"Erro ao consultar eventos por tipo: {str(e)}")
            return False, []
    
    def consultar_evento_especifico(
        self, 
        chave_acesso: str, 
        tipo_evento: str, 
        num_seq_evento: int
    ) -> Tuple[bool, Optional[Dict]]:
        """
        GET /nfse/{chaveAcesso}/eventos/{tipoEvento}/{numSeqEvento}
        Consulta evento específico por tipo e sequencial
        
        Args:
            chave_acesso: Chave de acesso da NFS-e
            tipo_evento: Código do tipo de evento
            num_seq_evento: Número sequencial do evento
            
        Returns:
            Tuple[bool, Optional[Dict]]: (sucesso, evento)
        """
        try:
            url = f"{self.base_url}/nfse/{chave_acesso}/eventos/{tipo_evento}/{num_seq_evento}"
            
            response = requests.get(
                url,
                cert=self.cert,
                timeout=30
            )
            
            if response.status_code == 200:
                return True, response.json()
            else:
                return False, None
                
        except Exception as e:
            logger.error(f"Erro ao consultar evento específico: {str(e)}")
            return False, None
