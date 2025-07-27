import * as React from 'react';
import { Transition } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { useModal } from '../../../../../hooks';
import { AttachmentButtonProps } from './types';
import IndexFromAir from '../../../../components/Modals/IndexFromAir';

const AttachmentButton = ({
  setAttachmentModalVisibility,
  setFiles,
  task,
}: AttachmentButtonProps) => {
  const { openModal } = useModal();
  const [menuVisibility, setMenuVisibility] = React.useState<boolean>(false);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="relative flex items-center">
        <>
          <div>
            <button
              className={`flex items-center space-x-1`}
              onClick={() => setMenuVisibility((current) => !current)}
            >
              <Icon
                alt="addAttachment"
                name="uploadV3"
                w={16}
                h={16}
                stroke
                color="info"
              />
              <Typography
                variant="footnote1"
                family="robotoMedium"
                color="info"
                className="underline"
              >
                Anexar arquivo
              </Typography>
            </button>
          </div>
          <Transition
            as={React.Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <div
              className={`${
                menuVisibility ? 'absolute' : 'hidden'
              } z-40 mt-28 w-56 rounded-md bg-white shadow-default`}
              id="MenuItems"
            >
              <button
                className={`w-full px-3.5 h-10 flex items-center space-x-2 rounded-t-md hover:bg-info/10`}
                onClick={() => {
                  openModal(<IndexFromAir taskId={task.id} />);
                }}
                // disabled={disabled}
                type="button"
              >
                <Icon
                  name="air"
                  alt="air"
                  color="darkGray"
                  stroke
                  w={26}
                  h={26}
                />
                <Typography variant="footnote1" color="darkerGray">
                  Printer Air
                </Typography>
              </button>
              <div>
                <div className={`w-full rounded-b-md hover:bg-info/10`}>
                  <label
                    htmlFor="fileInput"
                    className="px-3.5 h-10 flex items-center space-x-2 "
                  >
                    <Icon
                      name="folderOutlined"
                      alt="folder"
                      color="darkGray"
                      stroke
                      w={26}
                      h={26}
                    />
                    <Typography variant="footnote1" color="darkerGray">
                      Meu computador
                    </Typography>

                    <div className="relative">
                      <input
                        id="fileInput"
                        type="file"
                        name="file"
                        multiple
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        onChange={(e) => {
                          setMenuVisibility(false);
                          setAttachmentModalVisibility(true);
                          setFiles(e.target.files);
                        }}
                      />
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </Transition>
        </>
      </div>
    </div>
  );
};

export default AttachmentButton;
