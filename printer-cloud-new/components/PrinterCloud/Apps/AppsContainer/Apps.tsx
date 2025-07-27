import * as React from 'react';
import Link from 'next/link';
import { Typography, Icon } from 'printer-ui';
import { AppsProps } from './types';

const Apps = ({ apps, organizations }: AppsProps) => {
  const airClassName = `rounded-2xl w-72 h-36 flex justify-between items-center bg-red`;
  const flowClassName = `rounded-2xl w-72 h-36 flex justify-between items-center bg-yellow`;
  const cloudClassName = `rounded-2xl w-72 h-36 flex justify-between items-center bg-blue`;

  return (
    <>
      {apps
        .filter(
          (filterApps) =>
            filterApps.service !== 'printer_optical' &&
            filterApps.service !== 'printer_reports'
        )
        .map((app) => {
          return (
            <div key={app.service}>
              <div className="sm:hidden">
                <Link
                  href={
                    app.service === 'printer_air'
                      ? `/printer-air/my-air/organizations/${organizations[0].id}/directories/${organizations[0].rootDirectory.id}`
                      : app.service === 'printer_flow'
                      ? `/printer-flow/requesters`
                      : `/printer-cloud/home`
                  }
                >
                  <div
                    className={
                      app.service === 'printer_air'
                        ? airClassName
                        : app.service === 'printer_flow'
                        ? flowClassName
                        : cloudClassName
                    }
                  >
                    <div className="mx-2">
                      {app.service === 'printer_air' ? (
                        <Icon
                          alt="air"
                          name="air"
                          w={96}
                          h={96}
                          color="white"
                          stroke
                        />
                      ) : app.service === 'printer_flow' ? (
                        <Icon
                          alt="flow"
                          name="flow"
                          w={96}
                          h={96}
                          color="white"
                          stroke
                        />
                      ) : (
                        <Icon
                          alt="cloud"
                          name="cloud"
                          w={96}
                          h={96}
                          color="white"
                          stroke
                        />
                      )}
                    </div>
                    <div className="grid justify-items-center">
                      <Typography
                        color="white"
                        family="robotoBold"
                        variant="title1"
                        className="pb-2"
                      >
                        {app.name}
                      </Typography>
                      <Typography
                        color="white"
                        family="avenirLight"
                        variant="caption"
                        className="px-5"
                        align="center"
                      >
                        {app.description}
                      </Typography>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="hidden sm:flex sm:mt-14">
                <div className="sm:mr-32">
                  <div className="space-y-3 w-36">
                    <Link
                      href={
                        app.service === 'printer_air'
                          ? `/printer-air/my-air/organizations/${organizations[0].id}/directories/${organizations[0].rootDirectory.id}`
                          : app.service === 'printer_flow'
                          ? `/printer-flow/procedures`
                          : `/printer-cloud/home`
                      }
                    >
                      <div className="rounded-md cursor-pointer grid justify-center w-full">
                        {app.service === 'printer_air' ? (
                          <Icon
                            alt="air"
                            name="air"
                            w={96}
                            h={96}
                            color="white"
                            stroke
                            bgColor="red"
                            bgStyle="cornerRounded"
                            className="rounded-md"
                          />
                        ) : app.service === 'printer_flow' ? (
                          <Icon
                            alt="flow"
                            name="flow"
                            w={96}
                            h={96}
                            color="white"
                            stroke
                            bgColor="yellow"
                            bgStyle="cornerRounded"
                            className="rounded-md"
                          />
                        ) : (
                          <Icon
                            alt="cloud"
                            name="cloud"
                            w={96}
                            h={96}
                            color="white"
                            stroke
                            bgColor="blue"
                            bgStyle="cornerRounded"
                            className="rounded-md"
                          />
                        )}
                        <div className="flex justify-center pt-2">
                          <Typography
                            family="robotoBold"
                            variant="headline"
                            align="center"
                          >
                            {app.name}
                          </Typography>
                        </div>
                      </div>
                    </Link>
                    <Typography variant="caption" align="center" color="gray">
                      {app.description}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </>
  );
};

export default Apps;
