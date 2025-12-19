"""
Utility functions para OrdocIntegrations

Funções auxiliares para validação e formatação
"""

import re
from typing import Optional


def clean_cpf(cpf: str) -> str:
    """
    Remove formatação de CPF

    Args:
        cpf: CPF formatado (000.000.000-00)

    Returns:
        CPF limpo (00000000000)

    Examples:
        >>> clean_cpf('123.456.789-00')
        '12345678900'
    """
    return re.sub(r'[^0-9]', '', cpf)


def format_cpf(cpf: str) -> str:
    """
    Formata CPF

    Args:
        cpf: CPF sem formatação (00000000000)

    Returns:
        CPF formatado (000.000.000-00)

    Examples:
        >>> format_cpf('12345678900')
        '123.456.789-00'
    """
    cpf = clean_cpf(cpf)
    if len(cpf) != 11:
        return cpf
    return f'{cpf[:3]}.{cpf[3:6]}.{cpf[6:9]}-{cpf[9:]}'


def validate_cpf(cpf: str) -> bool:
    """
    Valida CPF usando algoritmo de validação

    Args:
        cpf: CPF a validar

    Returns:
        True se válido, False caso contrário

    Examples:
        >>> validate_cpf('123.456.789-00')
        False
        >>> validate_cpf('000.000.000-00')
        False
    """
    cpf = clean_cpf(cpf)

    # Verificar se tem 11 dígitos
    if len(cpf) != 11:
        return False

    # Verificar se todos os dígitos são iguais
    if cpf == cpf[0] * 11:
        return False

    # Validar primeiro dígito verificador
    sum_1 = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digit_1 = (sum_1 * 10 % 11) % 10

    if int(cpf[9]) != digit_1:
        return False

    # Validar segundo dígito verificador
    sum_2 = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digit_2 = (sum_2 * 10 % 11) % 10

    if int(cpf[10]) != digit_2:
        return False

    return True


def clean_cnpj(cnpj: str) -> str:
    """
    Remove formatação de CNPJ

    Args:
        cnpj: CNPJ formatado (00.000.000/0000-00)

    Returns:
        CNPJ limpo (00000000000000)

    Examples:
        >>> clean_cnpj('12.345.678/0001-00')
        '12345678000100'
    """
    return re.sub(r'[^0-9]', '', cnpj)


def format_cnpj(cnpj: str) -> str:
    """
    Formata CNPJ

    Args:
        cnpj: CNPJ sem formatação (00000000000000)

    Returns:
        CNPJ formatado (00.000.000/0000-00)

    Examples:
        >>> format_cnpj('12345678000100')
        '12.345.678/0001-00'
    """
    cnpj = clean_cnpj(cnpj)
    if len(cnpj) != 14:
        return cnpj
    return f'{cnpj[:2]}.{cnpj[2:5]}.{cnpj[5:8]}/{cnpj[8:12]}-{cnpj[12:]}'


def validate_cnpj(cnpj: str) -> bool:
    """
    Valida CNPJ usando algoritmo de validação

    Args:
        cnpj: CNPJ a validar

    Returns:
        True se válido, False caso contrário

    Examples:
        >>> validate_cnpj('11.222.333/0001-81')
        True
        >>> validate_cnpj('00.000.000/0000-00')
        False
    """
    cnpj = clean_cnpj(cnpj)

    # Verificar se tem 14 dígitos
    if len(cnpj) != 14:
        return False

    # Verificar se todos os dígitos são iguais
    if cnpj == cnpj[0] * 14:
        return False

    # Validar primeiro dígito verificador
    weights_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum_1 = sum(int(cnpj[i]) * weights_1[i] for i in range(12))
    digit_1 = (sum_1 % 11)
    digit_1 = 0 if digit_1 < 2 else 11 - digit_1

    if int(cnpj[12]) != digit_1:
        return False

    # Validar segundo dígito verificador
    weights_2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    sum_2 = sum(int(cnpj[i]) * weights_2[i] for i in range(13))
    digit_2 = (sum_2 % 11)
    digit_2 = 0 if digit_2 < 2 else 11 - digit_2

    if int(cnpj[13]) != digit_2:
        return False

    return True


def mask_sensitive_data(data: str, visible_chars: int = 4) -> str:
    """
    Mascara dados sensíveis

    Args:
        data: Dado a mascarar
        visible_chars: Número de caracteres visíveis no final

    Returns:
        Dado mascarado

    Examples:
        >>> mask_sensitive_data('12345678900', 3)
        '********900'
    """
    if len(data) <= visible_chars:
        return '*' * len(data)

    masked_length = len(data) - visible_chars
    return '*' * masked_length + data[-visible_chars:]


def get_ip_from_request(request) -> Optional[str]:
    """
    Extrai IP do request (considerando proxies)

    Args:
        request: Django request object

    Returns:
        Endereço IP ou None
    """
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0].strip()
    else:
        ip = request.META.get('REMOTE_ADDR')

    return ip


def truncate_text(text: str, max_length: int = 100, suffix: str = '...') -> str:
    """
    Trunca texto adicionando sufixo

    Args:
        text: Texto a truncar
        max_length: Tamanho máximo
        suffix: Sufixo a adicionar

    Returns:
        Texto truncado

    Examples:
        >>> truncate_text('Lorem ipsum dolor sit amet', 10)
        'Lorem i...'
    """
    if len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix


def sanitize_identifier(identifier: str) -> str:
    """
    Sanitiza identificador removendo caracteres especiais

    Args:
        identifier: Identificador a sanitizar

    Returns:
        Identificador sanitizado

    Examples:
        >>> sanitize_identifier('123.456.789-00')
        '12345678900'
        >>> sanitize_identifier('AB-123/456')
        'AB123456'
    """
    return re.sub(r'[^a-zA-Z0-9]', '', identifier)
