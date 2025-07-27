import * as React from 'react';
import router from 'next/router';
import { Button, ButtonRounded, Icon, Skeleton, Typography } from 'printer-ui';
import Layout, { Header } from '../../../Layout';
import PoliciesTab from '../../../Tab/PoliciesTab/PoliciesTab';
import TabSkeleton from '../../../Skeleton/TabSkeleton';

const PolicyViewSkeleton = () => {
  return (
    <Layout>
      <Header className="pr-5 sm:px-5 py-5 justify-between truncate">
        <div className="flex space-x-5 px-2 w-full truncate items-center h-full">
          <div className="hidden w-0 sm:block sm:w-fit">
            <ButtonRounded
              onClick={() => {
                router.push(`/printer-cloud/policies`);
              }}
            >
              <Icon
                name="return"
                alt="voltar"
                color="gray"
                w={30}
                h={30}
                fill
                stroke
              />
            </ButtonRounded>
          </div>
          <Icon
            alt="done"
            name="done"
            w={40}
            h={40}
            color="lightGray"
            stroke
          ></Icon>
          <Skeleton w={112} h={8} />
          <div className="justify-end flex items-center sm:w-full">
            <Button color="info" label="Editar" />
          </div>
        </div>
      </Header>
      <main className="w-full h-full px-4 flex-col lg:flex-row flex">
        <div className="w-full h-fit my-5">
          <div className="sm:w-[28.925rem] px-4 sm:pl-0">
            <div>
              <div className="flex items-center">
                <Icon
                  className="mr-3"
                  alt="done"
                  name="done"
                  color="lightGray"
                  stroke
                  w={30}
                  h={30}
                />
                <Skeleton h={7} w={52} />
              </div>
              <div className="space-y-3 mt-6">
                <div className="flex items-center h-7">
                  <div className="w-20 sm:w-48">
                    <Skeleton h={4} w={16} />
                  </div>
                  <div className="flex w-full items-center justify-end sm:justify-start">
                    <div className="flex items-center justify-end space-x-1">
                      <div className="w-full items-end sm:items-start">
                        <Skeleton h={4} w={10} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex h-7 items-center">
                  <div className="w-20 sm:w-48">
                    <Skeleton h={4} w={14} />
                  </div>
                  <div className="flex w-full justify-end sm:justify-start">
                    <Skeleton h={4} w={10} />
                  </div>
                </div>
                <div className="flex h-7 items-center">
                  <div className="w-20 sm:w-48">
                    <Skeleton h={4} w={12} />
                  </div>
                  <Typography className="flex w-full justify-end sm:justify-start">
                    <Skeleton h={4} w={40} />
                  </Typography>
                </div>
                <div className="flex h-7 items-center">
                  <div className="w-20 sm:w-48">
                    <Skeleton h={4} w={20} />
                  </div>
                  <div className="flex w-full justify-end sm:justify-start">
                    <Skeleton h={4} w={40} />
                  </div>
                </div>
                <div className="pt-12 sm:pt-7 sm:w-[28.925rem] sm:pl-0">
                  <Skeleton h={4} w={72} />
                  <div className="h-9 w-full border border-lightGray rounded-lg mt-2 flex items-center px-3">
                    <Skeleton h={3} w={44} />
                  </div>
                  <div className="pt-7">
                    <Skeleton h={4} w={60} />
                    <div className="h-9 w-full border border-lightGray rounded-lg my-2 flex items-center px-3">
                      <Skeleton h={3} w={28} />
                    </div>
                  </div>
                  <div className="pt-7">
                    <Skeleton h={4} w={44} />
                    <div className="h-9 w-full border border-lightGray rounded-lg my-2 flex items-center px-3">
                      <Skeleton h={3} w={32} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full h-fit mt-5">
          <PoliciesTab>
            <TabSkeleton />
          </PoliciesTab>
        </div>
      </main>
    </Layout>
  );
};

export default PolicyViewSkeleton;
