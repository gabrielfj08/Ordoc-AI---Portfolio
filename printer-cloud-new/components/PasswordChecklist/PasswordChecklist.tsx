import * as React from 'react';
import { TypographyV3 as Typography } from 'printer-ui';

interface PasswordChecklistProps {
  password: string;
  font?: any;
}

interface ChecklistItemProps {
  children: React.ReactNode;
  item: boolean;
}

const PasswordChecklist = ({
  password,
  font = 'roboto',
}: PasswordChecklistProps) => {
  const [validationChecklist, setValidationChecklist] = React.useState({
    length: false,
    specialCharacter: false,
    number: false,
    capitalLetter: false,
  });

  React.useEffect(() => {
    const checkLength = () => {
      setValidationChecklist((prevState) => {
        return { ...prevState, length: password.length >= 8 ? true : false };
      });
    };

    const checkSpecialCharacter = () => {
      setValidationChecklist((prevState) => {
        return {
          ...prevState,
          specialCharacter: password.match(/.*\W+/) ? true : false,
        };
      });
    };

    const checkNumber = () => {
      setValidationChecklist((prevState) => {
        return { ...prevState, number: password.match(/.*\d/) ? true : false };
      });
    };

    const checkCapitalLetter = () => {
      setValidationChecklist((prevState) => {
        return {
          ...prevState,
          capitalLetter: password.match(/^(?=.*[a-z])(?=.*[A-Z])/)
            ? true
            : false,
        };
      });
    };

    checkLength();
    checkSpecialCharacter();
    checkNumber();
    checkCapitalLetter();
  }, [password]);

  const ChecklistItem = ({ children, item }: ChecklistItemProps) => {
    return (
      <Typography
        family={font || 'roboto'}
        color={password ? (item ? 'success' : 'error') : 'gray'}
        className=""
        variant="bodySm"
      >
        {children}
      </Typography>
    );
  };

  return (
    <div className="grid flex-col items-center space-y-1 justify-left">
      <ChecklistItem item={validationChecklist.length}>
        * A senha deve conter no mínimo 8 caracteres;
      </ChecklistItem>
      <ChecklistItem item={validationChecklist.specialCharacter}>
        * A senha deve conter símbolos; (ex: !@#$?)
      </ChecklistItem>
      <ChecklistItem item={validationChecklist.number}>
        * A senha deve conter dígitos; (de 0 a 9)
      </ChecklistItem>
      <ChecklistItem item={validationChecklist.capitalLetter}>
        * A senha deve conter letras maiúsculas e minúsculas.
      </ChecklistItem>
    </div>
  );
};

export default PasswordChecklist;
