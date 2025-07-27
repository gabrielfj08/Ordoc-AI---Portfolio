import * as React from 'react';
import { Icon, TypographyV3 as Typography } from 'printer-ui';
import { useSession } from '../../../../../hooks';
import { privateCpfCnpj } from '../../../../../utils';
import { SharedRequestersProps } from './types';
import SharedStatusTag from './SharedStatusTag';
import RefuseJustificationNote from './JustificationNote';
import SharedRequesterEmpty from './Empty';

const SharedRequesters = ({
  sharedProcedures,
  handleClick,
}: SharedRequestersProps) => {
  const { themeColor } = useSession();

  return (
    <>
      <div className="pt-4">
        <Typography color={themeColor} variant="bodySm" family="jakartaBold">
          Usuários com acesso a este processo:
        </Typography>
      </div>
      <div className="w-full h-fit max-h-72 overflow-y-auto overflow-x-hidden">
        {sharedProcedures.length <= 0 ? (
          <SharedRequesterEmpty />
        ) : (
          sharedProcedures.map((sharedProcedure) => (
            <div
              key={sharedProcedure.id}
              className={`flex flex-col border-b-2 border-${themeColor} w-full items-center space-x-1 pt-2 pb-2`}
            >
              {sharedProcedure.status !== 'accepted' ? (
                <>
                  <div className="flex items-center w-full">
                    <div className="flex items-center space-x-1 w-full">
                      <Icon
                        alt="usuário"
                        name="user"
                        w={24}
                        h={24}
                        stroke
                        color={themeColor}
                        className="hidden sm:flex"
                      />
                      <div className="flex flex-col">
                        <Typography
                          variant="bodySm"
                          family="jakartaBold"
                          color="darkGray"
                        >
                          Nome:
                        </Typography>
                        <Typography
                          variant="bodySm"
                          family="jakarta"
                          color="darkGray"
                        >
                          {sharedProcedure.externalRequester.name}
                        </Typography>
                      </div>
                    </div>
                    <div className="w-8/12 flex space-x-1 justify-end">
                      <SharedStatusTag
                        color={themeColor}
                        status={sharedProcedure.status}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          handleClick(sharedProcedure.id);
                        }}
                      >
                        <Icon
                          name="circleClose"
                          alt="remover"
                          stroke
                          w={18}
                          h={18}
                          color={themeColor}
                        />
                      </button>
                    </div>
                  </div>
                  <div className="w-full pt-2">
                    {sharedProcedure.status === 'refused' && (
                      <RefuseJustificationNote
                        sharedProcedure={sharedProcedure}
                      />
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full flex items-center space-x-1">
                  <Icon
                    alt="usuário"
                    name="user"
                    w={24}
                    h={24}
                    stroke
                    color={themeColor}
                    className="hidden sm:flex"
                  />
                  <div className="items-center w-4/12 truncate">
                    <Typography
                      variant="bodySm"
                      family="jakartaBold"
                      color="darkGray"
                    >
                      Nome:
                    </Typography>
                    <Typography
                      variant="bodySm"
                      family="jakarta"
                      color="darkGray"
                      className="truncate"
                    >
                      {sharedProcedure.externalRequester.name}
                    </Typography>
                  </div>
                  <div className="hidden sm:block truncate w-4/12">
                    <Typography
                      variant="bodySm"
                      family="jakartaBold"
                      color="darkGray"
                    >
                      E-mail:
                    </Typography>
                    <Typography
                      variant="bodySm"
                      family="jakarta"
                      color="darkGray"
                      className="truncate"
                    >
                      {sharedProcedure.externalRequester.email}
                    </Typography>
                  </div>
                  <div className="truncate w-4/12">
                    <Typography
                      variant="bodySm"
                      family="jakartaBold"
                      color="darkGray"
                    >
                      CPF/CNPJ:
                    </Typography>
                    <Typography
                      variant="bodySm"
                      family="jakarta"
                      color="darkGray"
                      className="truncate"
                    >
                      {privateCpfCnpj(
                        sharedProcedure.externalRequester.cpfCnpj
                      )}
                    </Typography>
                  </div>
                  <div className="flex items-center w-4/12 justify-end space-x-0.5">
                    <div className="">
                      <SharedStatusTag
                        color={themeColor}
                        status={sharedProcedure.status}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        handleClick(sharedProcedure.id);
                      }}
                    >
                      <Icon
                        name="circleClose"
                        alt="remover"
                        stroke
                        w={18}
                        h={18}
                        color={themeColor}
                      />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
};

export default SharedRequesters;
