import * as React from 'react';
import { Tab } from '@headlessui/react';
import { Button, List, Input, Icon, Skeleton } from 'printer-ui';

const TabSkeleton = () => {
  return (
    <Tab.Panel className="p-3">
      <div className="space-y-4 pt-4 w-full h-fit">
        <div className="flex justify-end">
          <Button type="button" label="Usuários" color="info">
            <Button.Icon
              alt="plus"
              name="plus"
              color="white"
              fill
              stroke
              w={20}
              h={20}
            />
          </Button>
        </div>
        <Input
          type="search"
          size="md"
          name="q"
          value={''}
          onChange={() => {}}
          float
          w="full"
        >
          <Icon
            name="search"
            alt="search"
            color="gray"
            fill
            stroke
            w={28}
            h={28}
          />
        </Input>
        <List className="overflow-hidden relative w-full" h={80}>
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 items-center ">
                <Skeleton w={9} h={9} rounded="full" />
                <div className="space-y-1 hidden sm:block">
                  <Skeleton w={32} h={4} />
                  <Skeleton w={56} h={3} />
                </div>
                <div className="space-y-1 flex flex-col sm:hidden">
                  <Skeleton w={20} h={4} />
                  <Skeleton w={28} h={3} />
                </div>
              </div>
              <div>
                <Skeleton w={24} h={9} rounded="md" />
              </div>
            </div>
          </List.Item>
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 items-center ">
                <Skeleton w={9} h={9} rounded="full" />
                <div className="space-y-1 hidden sm:block">
                  <Skeleton w={32} h={4} />
                  <Skeleton w={56} h={3} />
                </div>
                <div className="space-y-1 flex flex-col sm:hidden">
                  <Skeleton w={20} h={4} />
                  <Skeleton w={28} h={3} />
                </div>
              </div>
              <div>
                <Skeleton w={24} h={9} rounded="md" />
              </div>
            </div>
          </List.Item>
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 items-center ">
                <Skeleton w={9} h={9} rounded="full" />
                <div className="space-y-1 hidden sm:block">
                  <Skeleton w={32} h={4} />
                  <Skeleton w={56} h={3} />
                </div>
                <div className="space-y-1 flex flex-col sm:hidden">
                  <Skeleton w={20} h={4} />
                  <Skeleton w={28} h={3} />
                </div>
              </div>
              <div>
                <Skeleton w={24} h={9} rounded="md" />
              </div>
            </div>
          </List.Item>
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 items-center ">
                <Skeleton w={9} h={9} rounded="full" />
                <div className="space-y-1 hidden sm:block">
                  <Skeleton w={32} h={4} />
                  <Skeleton w={56} h={3} />
                </div>
                <div className="space-y-1 flex flex-col sm:hidden">
                  <Skeleton w={20} h={4} />
                  <Skeleton w={28} h={3} />
                </div>
              </div>
              <div>
                <Skeleton w={24} h={9} rounded="md" />
              </div>
            </div>
          </List.Item>
          <List.Item>
            <div className="flex items-center justify-between">
              <div className="flex space-x-3 items-center ">
                <Skeleton w={9} h={9} rounded="full" />
                <div className="space-y-1 hidden sm:block">
                  <Skeleton w={32} h={4} />
                  <Skeleton w={56} h={3} />
                </div>
                <div className="space-y-1 flex flex-col sm:hidden">
                  <Skeleton w={20} h={4} />
                  <Skeleton w={28} h={3} />
                </div>
              </div>
              <div>
                <Skeleton w={24} h={9} rounded="md" />
              </div>
            </div>
          </List.Item>
        </List>
      </div>
    </Tab.Panel>
  );
};

export default TabSkeleton;
