"""
Password Security Validator for Ordoc-AI
Implements strong password validation rules following security best practices
"""
import re
from typing import Dict, List, Tuple


class PasswordValidator:
    """
    Validates password strength according to security best practices
    """
    
    # Password requirements
    MIN_LENGTH = 12
    MAX_LENGTH = 128
    
    # Required character types
    REQUIRED_UPPERCASE = 1
    REQUIRED_LOWERCASE = 1
    REQUIRED_DIGITS = 1
    REQUIRED_SPECIAL = 2
    
    # Special characters allowed
    SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?"
    
    # Common weak patterns to avoid
    WEAK_PATTERNS = [
        r'(.)\1{2,}',  # 3+ consecutive identical characters
        r'(012|123|234|345|456|567|678|789|890)',  # Sequential numbers
        r'(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)',  # Sequential letters
        r'(qwerty|asdfgh|zxcvbn)',  # Keyboard patterns
    ]
    
    # Common weak passwords
    COMMON_PASSWORDS = [
        'password', '123456', '123456789', 'qwerty', 'abc123',
        'password123', 'admin', 'letmein', 'welcome', 'monkey',
        'dragon', 'master', 'shadow', 'superman', 'michael',
        'football', 'baseball', 'liverpool', 'jordan', 'harley',
        'robert', 'matthew', 'daniel', 'andrew', 'joshua',
        'anthony', 'william', 'david', 'charles', 'thomas',
        'christopher', 'joseph', 'jessica', 'ashley', 'brittany',
        'amanda', 'samantha', 'sarah', 'stephanie', 'jennifer'
    ]
    
    @classmethod
    def validate_password(cls, password: str, user_info: Dict = None) -> Tuple[bool, List[str]]:
        """
        Validates password strength and returns validation result
        
        Args:
            password: Password to validate
            user_info: Optional user information (name, email) to check against
            
        Returns:
            Tuple of (is_valid, list_of_errors)
        """
        errors = []
        
        if not password:
            errors.append("Senha é obrigatória")
            return False, errors
        
        # Check length
        if len(password) < cls.MIN_LENGTH:
            errors.append(f"Senha deve ter pelo menos {cls.MIN_LENGTH} caracteres")
        
        if len(password) > cls.MAX_LENGTH:
            errors.append(f"Senha deve ter no máximo {cls.MAX_LENGTH} caracteres")
        
        # Check character types
        uppercase_count = len(re.findall(r'[A-Z]', password))
        lowercase_count = len(re.findall(r'[a-z]', password))
        digit_count = len(re.findall(r'[0-9]', password))
        special_count = len(re.findall(f'[{re.escape(cls.SPECIAL_CHARS)}]', password))
        
        if uppercase_count < cls.REQUIRED_UPPERCASE:
            errors.append(f"Senha deve conter pelo menos {cls.REQUIRED_UPPERCASE} letra maiúscula")
        
        if lowercase_count < cls.REQUIRED_LOWERCASE:
            errors.append(f"Senha deve conter pelo menos {cls.REQUIRED_LOWERCASE} letra minúscula")
        
        if digit_count < cls.REQUIRED_DIGITS:
            errors.append(f"Senha deve conter pelo menos {cls.REQUIRED_DIGITS} número")
        
        if special_count < cls.REQUIRED_SPECIAL:
            errors.append(f"Senha deve conter pelo menos {cls.REQUIRED_SPECIAL} caracteres especiais ({cls.SPECIAL_CHARS})")
        
        # Check for weak patterns
        password_lower = password.lower()
        for pattern in cls.WEAK_PATTERNS:
            if re.search(pattern, password_lower):
                errors.append("Senha não deve conter sequências ou padrões repetitivos")
                break
        
        # Check against common passwords
        if password_lower in [pwd.lower() for pwd in cls.COMMON_PASSWORDS]:
            errors.append("Senha muito comum, escolha uma senha mais segura")
        
        # Check against user information
        if user_info:
            user_data = []
            if user_info.get('name'):
                user_data.extend(user_info['name'].lower().split())
            if user_info.get('email'):
                user_data.append(user_info['email'].lower().split('@')[0])
            
            for data in user_data:
                if len(data) > 2 and data in password_lower:
                    errors.append("Senha não deve conter informações pessoais (nome, email)")
                    break
        
        # Check for invalid characters
        valid_chars = re.compile(f'^[a-zA-Z0-9{re.escape(cls.SPECIAL_CHARS)}]+$')
        if not valid_chars.match(password):
            errors.append(f"Senha contém caracteres inválidos. Use apenas letras, números e: {cls.SPECIAL_CHARS}")
        
        return len(errors) == 0, errors
    
    @classmethod
    def get_password_strength(cls, password: str) -> Dict:
        """
        Returns password strength analysis
        
        Args:
            password: Password to analyze
            
        Returns:
            Dictionary with strength analysis
        """
        if not password:
            return {
                'score': 0,
                'level': 'Muito Fraca',
                'feedback': ['Senha é obrigatória']
            }
        
        score = 0
        feedback = []
        
        # Length scoring
        if len(password) >= cls.MIN_LENGTH:
            score += 25
        else:
            feedback.append(f"Aumente para pelo menos {cls.MIN_LENGTH} caracteres")
        
        # Character variety scoring
        has_upper = bool(re.search(r'[A-Z]', password))
        has_lower = bool(re.search(r'[a-z]', password))
        has_digit = bool(re.search(r'[0-9]', password))
        has_special = bool(re.search(f'[{re.escape(cls.SPECIAL_CHARS)}]', password))
        
        char_types = sum([has_upper, has_lower, has_digit, has_special])
        score += char_types * 15
        
        if not has_upper:
            feedback.append("Adicione letras maiúsculas")
        if not has_lower:
            feedback.append("Adicione letras minúsculas")
        if not has_digit:
            feedback.append("Adicione números")
        if not has_special:
            feedback.append(f"Adicione caracteres especiais ({cls.SPECIAL_CHARS})")
        
        # Bonus for length
        if len(password) > cls.MIN_LENGTH:
            score += min(10, len(password) - cls.MIN_LENGTH)
        
        # Penalty for weak patterns
        password_lower = password.lower()
        for pattern in cls.WEAK_PATTERNS:
            if re.search(pattern, password_lower):
                score -= 15
                feedback.append("Evite sequências e padrões repetitivos")
                break
        
        # Penalty for common passwords
        if password_lower in [pwd.lower() for pwd in cls.COMMON_PASSWORDS]:
            score -= 30
            feedback.append("Senha muito comum, escolha algo mais único")
        
        # Determine strength level
        if score >= 80:
            level = 'Muito Forte'
        elif score >= 60:
            level = 'Forte'
        elif score >= 40:
            level = 'Média'
        elif score >= 20:
            level = 'Fraca'
        else:
            level = 'Muito Fraca'
        
        return {
            'score': max(0, min(100, score)),
            'level': level,
            'feedback': feedback
        }
    
    @classmethod
    def generate_password_requirements(cls) -> Dict:
        """
        Returns password requirements for frontend display
        """
        return {
            'min_length': cls.MIN_LENGTH,
            'max_length': cls.MAX_LENGTH,
            'required_uppercase': cls.REQUIRED_UPPERCASE,
            'required_lowercase': cls.REQUIRED_LOWERCASE,
            'required_digits': cls.REQUIRED_DIGITS,
            'required_special': cls.REQUIRED_SPECIAL,
            'special_chars': cls.SPECIAL_CHARS,
            'rules': [
                f"Pelo menos {cls.MIN_LENGTH} caracteres",
                f"Pelo menos {cls.REQUIRED_UPPERCASE} letra maiúscula",
                f"Pelo menos {cls.REQUIRED_LOWERCASE} letra minúscula",
                f"Pelo menos {cls.REQUIRED_DIGITS} número",
                f"Pelo menos {cls.REQUIRED_SPECIAL} caracteres especiais",
                "Não deve conter sequências ou padrões repetitivos",
                "Não deve conter informações pessoais",
                "Não deve ser uma senha comum"
            ]
        }
