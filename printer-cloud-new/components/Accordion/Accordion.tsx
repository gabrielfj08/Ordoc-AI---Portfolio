import * as React from 'react';
import { Disclosure } from '@headlessui/react';
import { Icon, Typography } from 'printer-ui';
import { AccordionProps, AccordionItem } from './types';

const Accordion = ({ items, defaultOpen }: AccordionProps) => {
  return (
    <div className="w-full h-full space-y-8">
      {items.map((item: AccordionItem) => {
        return (
          <Disclosure
            as="div"
            className="mt-2 w-full"
            key={item.label}
            defaultOpen={defaultOpen}
          >
            {({ open }) => (
              <React.Fragment key={item.label}>
                <Disclosure.Button
                  className="flex w-full border border-lightGray shadow-default rounded-lg
                 bg-white px-5 py-4 items-center justify-between"
                >
                  <Typography>{item.label}</Typography>

                  {open ? (
                    <Icon
                      alt="minus"
                      name="minus"
                      fill
                      color="lighterBlack"
                      h={28}
                      w={28}
                    />
                  ) : (
                    <Icon alt="plus" name="plus" stroke color="lighterBlack" />
                  )}
                </Disclosure.Button>
                <Disclosure.Panel>{item.content}</Disclosure.Panel>
              </React.Fragment>
            )}
          </Disclosure>
        );
      })}
    </div>
  );
};

export default Accordion;
