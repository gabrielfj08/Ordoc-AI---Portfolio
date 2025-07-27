import * as React from 'react';
import { Icon } from 'printer-ui';
import { getFileExtension } from '../../../../../../utils';
import { ExtensionsDocumentProps } from './types';

const ExtensionsDocument = ({ src }: ExtensionsDocumentProps) => {
  const ImgIcon = () => {
    return <Icon alt="imageV2" name="imageV2" w={30} h={30} fill />;
  };

  const CompressIcon = () => {
    return <Icon alt="zipFileV2" name="zipFileV2" w={30} h={30} fill stroke />;
  };

  const TextIcon = () => {
    return <Icon alt="zipFileV2" name="zipFileV2" w={30} h={30} fill />;
  };

  const AudioIcon = () => {
    return <Icon alt="audio" name="audio" w={30} h={30} fill />;
  };

  const VideosIcon = () => {
    return <Icon alt="video" name="videoV2" w={30} h={30} fill />;
  };

  switch (getFileExtension(src).toLowerCase()) {
    case 'pdf':
      return <Icon alt="pdfFile" name="pdfFileV2" w={30} h={30} fill />;
    case 'png':
      return <ImgIcon />;
    case 'svg':
      return <ImgIcon />;
    case 'jpg':
      return <ImgIcon />;
    case 'jpeg':
      return <ImgIcon />;
    case 'gif':
      return <ImgIcon />;
    case 'bmp':
      return <ImgIcon />;
    case 'doc':
      return <TextIcon />;
    case 'odt':
      return <TextIcon />;
    case 'txt':
      return <TextIcon />;
    case 'docx':
      return <TextIcon />;
    case 'word':
      return <TextIcon />;
    case 'ppt':
      return <TextIcon />;
    case 'xls':
      return <TextIcon />;
    case 'mp3':
      return <AudioIcon />;
    case 'aac':
      return <AudioIcon />;
    case 'mwa':
      return <AudioIcon />;
    case 'ac3':
      return <AudioIcon />;
    case 'wav':
      return <AudioIcon />;
    case 'ogg':
      return <AudioIcon />;
    case 'opus':
      return <AudioIcon />;
    case 'avi':
      return <VideosIcon />;
    case 'mov':
      return <VideosIcon />;
    case 'mpg':
      return <VideosIcon />;
    case 'wmv':
      return <VideosIcon />;
    case 'rm':
      return <VideosIcon />;
    case 'xvid':
      return <VideosIcon />;
    case 'zip':
      return <CompressIcon />;
    case 'rar':
      return <CompressIcon />;
    case '7z':
      return <CompressIcon />;
    default:
      return <Icon alt="zipFileV2" name="zipFileV2" w={30} h={30} fill />;
  }
};

export default ExtensionsDocument;
