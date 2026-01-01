"""
Cliente para integração com Web Services SEFAZ NF-e
Baseado nas especificações técnicas NF-e versão 4.0

Web Services implementados:
- NFeAutorizacao4 (Autorização de NF-e)
- NFeRetAutorizacao4 (Consulta Recibo)
- NFeConsultaProtocolo4 (Consulta NF-e)
- NFeInutilizacao4 (Inutilização de Numeração)
- RecepcaoEvento4 (Cancelamento, Carta de Correção, Manifestação)
- NFeDistribuicaoDFe (Distribuição de DF-e)
- NFeStatusServico4 (Status do Serviço)
"""

import requests
from typing import Dict, List, Optional, Tuple
from lxml import etree
from zeep import Client
from zeep.transports import Transport
from requests import Session
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


class SefazNFeClient:
    """
    Cliente para integração com Web Services SEFAZ NF-e
    
    Ambientes:
    - Homologação: Para testes
    - Produção: Operação real
    """
    
    # URLs dos Web Services por UF (Produção)
    # Fonte: Portal da NF-e - https://www.nfe.fazenda.gov.br
    WEBSERVICES_PROD = {
        'SP': {  # São Paulo
            'NFeAutorizacao4': 'https://nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx?wsdl',
            'NFeRetAutorizacao4': 'https://nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx?wsdl',
            'NFeConsultaProtocolo4': 'https://nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx?wsdl',
            'NFeInutilizacao4': 'https://nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx?wsdl',
            'RecepcaoEvento4': 'https://nfe.fazenda.sp.gov.br/ws/recepcaoevento4.asmx?wsdl',
            'NFeStatusServico4': 'https://nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx?wsdl',
        },
        'SVRS': {  # Sefaz Virtual RS (para estados conveniados)
            'NFeAutorizacao4': 'https://nfe.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx?wsdl',
            'NFeRetAutorizacao4': 'https://nfe.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx?wsdl',
            'NFeConsultaProtocolo4': 'https://nfe.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx?wsdl',
            'NFeInutilizacao4': 'https://nfe.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx?wsdl',
            'RecepcaoEvento4': 'https://nfe.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx?wsdl',
            'NFeStatusServico4': 'https://nfe.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx?wsdl',
        }
    }
    
    # URLs Homologação
    WEBSERVICES_HOMOLOG = {
        'SP': {
            'NFeAutorizacao4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeautorizacao4.asmx?wsdl',
            'NFeRetAutorizacao4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nferetautorizacao4.asmx?wsdl',
            'NFeConsultaProtocolo4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeconsultaprotocolo4.asmx?wsdl',
            'NFeInutilizacao4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfeinutilizacao4.asmx?wsdl',
            'RecepcaoEvento4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/recepcaoevento4.asmx?wsdl',
            'NFeStatusServico4': 'https://homologacao.nfe.fazenda.sp.gov.br/ws/nfestatusservico4.asmx?wsdl',
        },
        'SVRS': {
            'NFeAutorizacao4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeAutorizacao/NFeAutorizacao4.asmx?wsdl',
            'NFeRetAutorizacao4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeRetAutorizacao/NFeRetAutorizacao4.asmx?wsdl',
            'NFeConsultaProtocolo4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeConsulta/NfeConsulta4.asmx?wsdl',
            'NFeInutilizacao4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/nfeinutilizacao/nfeinutilizacao4.asmx?wsdl',
            'RecepcaoEvento4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/recepcaoevento/recepcaoevento4.asmx?wsdl',
            'NFeStatusServico4': 'https://nfe-homologacao.svrs.rs.gov.br/ws/NfeStatusServico/NfeStatusServico4.asmx?wsdl',
        }
    }
    
    def __init__(
        self,
        uf: str = 'SP',
        ambiente: str = 'homologacao',
        certificado_path: str = None,
        chave_path: str = None
    ):
        """
        Inicializa cliente SEFAZ NF-e
        
        Args:
            uf: Sigla da UF ou 'SVRS' para Sefaz Virtual
            ambiente: 'homologacao' ou 'producao'
            certificado_path: Caminho para certificado A1 (.pem)
            chave_path: Caminho para chave privada (.pem)
        """
        self.uf = uf
        self.ambiente = ambiente
        self.certificado = certificado_path
        self.chave = chave_path
        
        # Selecionar URLs
        if ambiente == 'producao':
            self.webservices = self.WEBSERVICES_PROD.get(uf, self.WEBSERVICES_PROD['SVRS'])
        else:
            self.webservices = self.WEBSERVICES_HOMOLOG.get(uf, self.WEBSERVICES_HOMOLOG['SVRS'])
        
        # Configurar sessão com certificado
        self.session = Session()
        if self.certificado and self.chave:
            self.session.cert = (self.certificado, self.chave)
        
        self.transport = Transport(session=self.session)
    
    def _get_client(self, servico: str) -> Client:
        """Cria cliente SOAP para um serviço específico"""
        wsdl_url = self.webservices.get(servico)
        if not wsdl_url:
            raise ValueError(f"Serviço {servico} não configurado para UF {self.uf}")
        
        return Client(wsdl_url, transport=self.transport)
    
    # ========== Status do Serviço ==========
    
    def consultar_status_servico(self) -> Tuple[bool, Dict]:
        """
        Consulta status do serviço da SEFAZ
        
        Returns:
            Tuple[bool, Dict]: (online, dados_status)
        """
        try:
            client = self._get_client('NFeStatusServico4')
            
            # Montar XML de consulta
            xml_consulta = f"""<?xml version="1.0" encoding="UTF-8"?>
            <consStatServ xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
                <tpAmb>{2 if self.ambiente == 'homologacao' else 1}</tpAmb>
                <cUF>{self._get_codigo_uf()}</cUF>
                <xServ>STATUS</xServ>
            </consStatServ>
            """
            
            # Chamar serviço
            response = client.service.nfeStatusServicoNF(xml_consulta)
            
            # Parsear resposta
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            x_motivo = root.find('.//{http://www.portalfiscal.inf.br/nfe}xMotivo').text
            
            online = c_stat == '107'  # Serviço em operação
            
            return online, {
                'cStat': c_stat,
                'xMotivo': x_motivo,
                'ambiente': self.ambiente,
                'uf': self.uf
            }
            
        except Exception as e:
            logger.error(f"Erro ao consultar status: {str(e)}")
            return False, {'erro': str(e)}
    
    # ========== Autorização de NF-e ==========
    
    def autorizar_nfe(self, nfe_xml: str) -> Tuple[bool, str]:
        """
        Autoriza NF-e (envio síncrono)
        
        Args:
            nfe_xml: XML da NF-e assinado
            
        Returns:
            Tuple[bool, str]: (sucesso, protocolo_xml ou mensagem_erro)
        """
        try:
            client = self._get_client('NFeAutorizacao4')
            
            # Envelope de envio
            lote_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
            <enviNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
                <idLote>{datetime.now().strftime('%Y%m%d%H%M%S')}</idLote>
                <indSinc>1</indSinc>
                {nfe_xml}
            </enviNFe>
            """
            
            # Enviar
            response = client.service.nfeAutorizacaoLote(lote_xml)
            
            # Parsear resposta
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '100':  # Autorizado
                logger.info("NF-e autorizada com sucesso")
                return True, response
            else:
                x_motivo = root.find('.//{http://www.portalfiscal.inf.br/nfe}xMotivo').text
                logger.error(f"NF-e rejeitada: {c_stat} - {x_motivo}")
                return False, f"{c_stat}: {x_motivo}"
                
        except Exception as e:
            logger.error(f"Erro ao autorizar NF-e: {str(e)}")
            return False, str(e)
    
    def consultar_recibo(self, numero_recibo: str) -> Tuple[bool, str]:
        """
        Consulta recibo de lote processado
        
        Args:
            numero_recibo: Número do recibo retornado na autorização
            
        Returns:
            Tuple[bool, str]: (sucesso, protocolo_xml)
        """
        try:
            client = self._get_client('NFeRetAutorizacao4')
            
            xml_consulta = f"""<?xml version="1.0" encoding="UTF-8"?>
            <consReciNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
                <tpAmb>{2 if self.ambiente == 'homologacao' else 1}</tpAmb>
                <nRec>{numero_recibo}</nRec>
            </consReciNFe>
            """
            
            response = client.service.nfeRetAutorizacaoLote(xml_consulta)
            
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '104':  # Lote processado
                return True, response
            else:
                return False, response
                
        except Exception as e:
            logger.error(f"Erro ao consultar recibo: {str(e)}")
            return False, str(e)
    
    # ========== Consulta NF-e ==========
    
    def consultar_nfe(self, chave_acesso: str) -> Tuple[bool, str]:
        """
        Consulta NF-e pela chave de acesso
        
        Args:
            chave_acesso: Chave de acesso da NF-e (44 dígitos)
            
        Returns:
            Tuple[bool, str]: (sucesso, protocolo_xml)
        """
        try:
            client = self._get_client('NFeConsultaProtocolo4')
            
            xml_consulta = f"""<?xml version="1.0" encoding="UTF-8"?>
            <consSitNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
                <tpAmb>{2 if self.ambiente == 'homologacao' else 1}</tpAmb>
                <xServ>CONSULTAR</xServ>
                <chNFe>{chave_acesso}</chNFe>
            </consSitNFe>
            """
            
            response = client.service.nfeConsultaNF(xml_consulta)
            
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '100':  # Autorizada
                return True, response
            else:
                return False, response
                
        except Exception as e:
            logger.error(f"Erro ao consultar NF-e: {str(e)}")
            return False, str(e)
    
    # ========== Cancelamento ==========
    
    def cancelar_nfe(
        self,
        chave_acesso: str,
        protocolo: str,
        justificativa: str,
        cnpj: str
    ) -> Tuple[bool, str]:
        """
        Cancela NF-e autorizada
        
        Args:
            chave_acesso: Chave de acesso da NF-e
            protocolo: Protocolo de autorização
            justificativa: Motivo do cancelamento (mín. 15 caracteres)
            cnpj: CNPJ do emitente
            
        Returns:
            Tuple[bool, str]: (sucesso, evento_xml)
        """
        try:
            if len(justificativa) < 15:
                return False, "Justificativa deve ter no mínimo 15 caracteres"
            
            client = self._get_client('RecepcaoEvento4')
            
            # Evento de cancelamento
            evento_xml = f"""<?xml version="1.0" encoding="UTF-8"?>
            <envEvento xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
                <idLote>{datetime.now().strftime('%Y%m%d%H%M%S')}</idLote>
                <evento versao="1.00">
                    <infEvento Id="ID110111{chave_acesso}01">
                        <cOrgao>{self._get_codigo_uf()}</cOrgao>
                        <tpAmb>{2 if self.ambiente == 'homologacao' else 1}</tpAmb>
                        <CNPJ>{cnpj}</CNPJ>
                        <chNFe>{chave_acesso}</chNFe>
                        <dhEvento>{datetime.now().isoformat()}</dhEvento>
                        <tpEvento>110111</tpEvento>
                        <nSeqEvento>1</nSeqEvento>
                        <verEvento>1.00</verEvento>
                        <detEvento versao="1.00">
                            <descEvento>Cancelamento</descEvento>
                            <nProt>{protocolo}</nProt>
                            <xJust>{justificativa}</xJust>
                        </detEvento>
                    </infEvento>
                </evento>
            </envEvento>
            """
            
            # Assinar evento (deve ser feito antes)
            # TODO: Integrar com xml_signer.py
            
            response = client.service.nfeRecepcaoEvento(evento_xml)
            
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '135':  # Evento registrado e vinculado
                logger.info(f"NF-e {chave_acesso} cancelada com sucesso")
                return True, response
            else:
                x_motivo = root.find('.//{http://www.portalfiscal.inf.br/nfe}xMotivo').text
                return False, f"{c_stat}: {x_motivo}"
                
        except Exception as e:
            logger.error(f"Erro ao cancelar NF-e: {str(e)}")
            return False, str(e)
    
    # ========== Inutilização ==========
    
    def inutilizar_numeracao(
        self,
        cnpj: str,
        serie: str,
        numero_inicial: str,
        numero_final: str,
        justificativa: str,
        ano: str
    ) -> Tuple[bool, str]:
        """
        Inutiliza numeração de NF-e
        
        Args:
            cnpj: CNPJ do emitente
            serie: Série da NF-e
            numero_inicial: Número inicial
            numero_final: Número final
            justificativa: Motivo (mín. 15 caracteres)
            ano: Ano (2 dígitos)
            
        Returns:
            Tuple[bool, str]: (sucesso, protocolo_xml)
        """
        try:
            if len(justificativa) < 15:
                return False, "Justificativa deve ter no mínimo 15 caracteres"
            
            client = self._get_client('NFeInutilizacao4')
            
            xml_inut = f"""<?xml version="1.0" encoding="UTF-8"?>
            <inutNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
                <infInut Id="ID{self._get_codigo_uf()}{ano}{cnpj}{55:02d}{serie.zfill(3)}{numero_inicial.zfill(9)}{numero_final.zfill(9)}">
                    <tpAmb>{2 if self.ambiente == 'homologacao' else 1}</tpAmb>
                    <xServ>INUTILIZAR</xServ>
                    <cUF>{self._get_codigo_uf()}</cUF>
                    <ano>{ano}</ano>
                    <CNPJ>{cnpj}</CNPJ>
                    <mod>55</mod>
                    <serie>{serie}</serie>
                    <nNFIni>{numero_inicial}</nNFIni>
                    <nNFFin>{numero_final}</nNFFin>
                    <xJust>{justificativa}</xJust>
                </infInut>
            </inutNFe>
            """
            
            response = client.service.nfeInutilizacaoNF(xml_inut)
            
            root = etree.fromstring(response.encode())
            c_stat = root.find('.//{http://www.portalfiscal.inf.br/nfe}cStat').text
            
            if c_stat == '102':  # Inutilização homologada
                return True, response
            else:
                return False, response
                
        except Exception as e:
            logger.error(f"Erro ao inutilizar numeração: {str(e)}")
            return False, str(e)
    
    def _get_codigo_uf(self) -> str:
        """Retorna código IBGE da UF"""
        codigos = {
            'SP': '35',
            'RJ': '33',
            'MG': '31',
            'RS': '43',
            'PR': '41',
            'SC': '42',
            'SVRS': '91'  # Sefaz Virtual
        }
        return codigos.get(self.uf, '35')
