import { Icon, Typography } from 'printer-ui';
import * as React from 'react';

const AddressMap = () => {
  return (
    <div className="w-full px-4 sm:px-0 h-fit flex flex-col">
      <div className="flex items-center space-x-2 mb-4">
        <Icon alt="pin" name="mapPin" color="red" fill h={40} w={40} />
        <div className="space-y-2">
          <Typography variant="footnote1" family="robotoBold">
            Endereço
          </Typography>
          <Typography variant="footnote1">
            R. Desembargador Arthur Leme, 327 - Bacacheri - Curitiba - Paraná
          </Typography>
        </div>
      </div>
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3604.148840201336!2d-49.24553118455711!3d-25.399827937922804!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94dce79cbe21e133%3A0xcd1c5a0c8dcadd6a!2sPrinter%20do%20Brasil!5e0!3m2!1spt-BR!2sbr!4v1671817757178!5m2!1spt-BR!2sbr"
        width="full"
        height="450"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default AddressMap;
