import * as React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Typography, Icon } from 'printer-ui';
import { useSnackbar } from '../../../hooks';
import { CopyPrnProps } from './types';

const CopyPrn = ({ prn }: CopyPrnProps) => {
  const { showSnackbar } = useSnackbar();

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="w-full flex items-center pl-2">
          <Icon
            alt="copy"
            name="duplicateV2"
            w={25}
            h={25}
            fill
            color="black"
          />

          <div className="w-11/12">
            <Typography
              variant="footnote1"
              family="robotoMedium"
              className="pb-1 pl-2"
            >
              PRN:
            </Typography>

            <div
              id="documentPrn"
              data-tooltip-content={prn}
              className="bg-white border border-lightGray mx-2 rounded-md flex items-center"
            >
              <Typography variant="footnote1" className="pl-6 pr-8 truncate">
                {prn}
              </Typography>
              <ReactTooltip anchorId="documentPrn" />
              <CopyToClipboard
                text={prn}
                onCopy={() =>
                  showSnackbar(`Prn copiado com sucesso!`, 'success')
                }
              >
                <button
                  disabled={!prn}
                  type="button"
                  className="w-9 h-9 m-2 bg-info rounded-md flex justify-center items-center p-2 -ml-6"
                >
                  <Icon
                    alt="copy"
                    name="duplicateV2"
                    w={25}
                    h={25}
                    fill
                    color="white"
                  />
                </button>
              </CopyToClipboard>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CopyPrn;
