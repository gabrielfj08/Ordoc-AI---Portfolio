import * as React from 'react';
import router from 'next/router';
import Head from 'next/head';
import { NextPageWithLayout } from '../../_app';
import { Icon, Typography, Button, ButtonRounded, Skeleton } from 'printer-ui';
import { SessionGroupRequesterProvider } from '../../../hooks';
import { GroupInfo } from '../../../PrinterFlow/Groups/Show/types';
import Layout from '../../../PrinterFlow/components/Layout';
import ShowGroup from '../../../PrinterFlow/Groups/Show';
import EditGroup from '../../../PrinterFlow/Groups/Edit';
import Header from '../../../components/Layout/Header';

const ShowGroupPage: NextPageWithLayout = ({}) => {
  const [updateGroup, setUpdateGroup] = React.useState<boolean>(false);
  const [group, setGroup] = React.useState<GroupInfo>({
    name: '',
    status: 'inactive',
  });

  const handleSubmit = () => {
    setUpdateGroup((current) => !current);
  };

  const groupId = Number(router.query.groupId);

  if (!groupId) return null;

  return (
    <>
      <Head>
        <title> Printer Flow | Grupos</title>
      </Head>
      <Header className="pl-4 pr-10 flex items-center justify-between truncate mt-8 mb-1 md:m-0">
        {!updateGroup ? (
          <>
            <div className="flex items-center md:w-[650px] w-[200px] truncate">
              <div className="hidden w-0 sm:block sm:w-fit p-2">
                <ButtonRounded
                  className="mr-4"
                  onClick={() => {
                    router.back();
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
                alt="requesterGroup"
                name="groupRequesterV3"
                fill
                w={35}
                h={35}
                color="darkGray"
              />
              <>
                {!group ? (
                  <Skeleton w={48} h={8} rounded="default" />
                ) : (
                  <Typography
                    variant="title2"
                    family="robotoMedium"
                    color="darkGray"
                    className="truncate pl-2"
                  >
                    {group.name}
                  </Typography>
                )}
              </>
            </div>
            <Button
              label="Renomear"
              size="md"
              color="info"
              onClick={handleSubmit}
              disabled={group.status === 'inactive'}
            >
              <Button.Icon
                alt="write"
                name="write"
                color="white"
                fill
                stroke
                h={23}
                w={23}
              />
            </Button>
          </>
        ) : (
          <div className="w-full sm:mr-14 lg:mr-0">
            <EditGroup
              groupId={Number(router.query.groupId)}
              name={group.name}
              setUpdateGroup={setUpdateGroup}
            />
          </div>
        )}
      </Header>

      <div className="sm:mt-5">
        <div className="flex-none md:flex">
          <ShowGroup groupId={groupId} setGroup={setGroup} />
        </div>
      </div>
    </>
  );
};

ShowGroupPage.getLayout = (page: React.ReactElement) => {
  return (
    <SessionGroupRequesterProvider>
      <Layout>{page}</Layout>
    </SessionGroupRequesterProvider>
  );
};

export default ShowGroupPage;
