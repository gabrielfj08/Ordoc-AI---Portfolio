import * as React from 'react';
import { Icon, Skeleton, Typography } from 'printer-ui';
import TabSkeleton from '../../../Skeleton/TabSkeleton';
import PoliciesTab from '../../../Tab/PoliciesTab/PoliciesTab';

const EditPolicySkeleton = () => {
  return (
    <>
      <main className="w-full h-full px-4 flex-col lg:flex-row flex">
        <div className="w-full h-fit my-5">
          <div className="sm:w-[28.925rem] px-4 sm:pl-0">
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
      </main>
    </>
  );
};

export default EditPolicySkeleton;
