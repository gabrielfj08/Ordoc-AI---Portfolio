import * as React from 'react';
import Image from 'next/image';

const ListLoading = () => {
  return (
    <div className="mt-2 flex items-center justify-center">
      <Image
        src="/assets/cloud.svg"
        width={30}
        height={30}
        className="animate-spin"
        priority
      />
    </div>
  );
};

export default ListLoading;
